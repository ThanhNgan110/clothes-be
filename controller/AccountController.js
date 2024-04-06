const bcrypt = require("bcrypt");
const saltRounds = 10;

const Account = require("../models/account");

class AccountController {
	async updateAccountById(id, Obj) {
		try {
			const result = await Account.updateOne({ _id: id }, { ...Obj });
			console.log(result, "result");
			return result;
		} catch (error) {
			console.log(error, "error");
		}
	}

	// chức năng đăng nhập(user)
	async handle_login(req, res) {
		try {
			const account = await Account.findOne({
				username: req.body.username,
				role: req.body.role,
			});
			if (Boolean(account)) {
				const compare = await bcrypt.compare(
					req.body.password,
					account.password
				);
				if (compare) {
					return res.json({
						err: false,
						account,
						mess: "Login successfully !!",
					});
				}
				return res.json({
					err: true,
					account,
					mess: "Password Incorrect !!",
				});
			}
			return res.json({
				err: true,
				mess: "Username or Password Incorrect !!",
				account: {},
			});
		} catch (error) {
			console.log(error);
			return res.json({
				err: true,
				mess: "There was an error during the check !!",
				account: {},
			});
		}
	}

	// chức năng đăng ký
	async handle_register(req, res) {
		try {
			const query = await Account.findOne({ username: req.body.username });
			if (Boolean(query)) {
				return res.json({
					err: true,
					mess: "Account already exists !!!",
					account: {},
				});
			} else {
				const new_password = await bcrypt.hash(req.body.password, saltRounds);
				const account = new Account({
					...req.body,
					password: new_password,
					role: "USER_ROLE",
				});
				account.save();
				return res.json({
					err: false,
					mess: "Register success !!!",
					account,
				});
			}
		} catch (error) {
			console.log(error);
			return res.json({
				err: true,
				mess: "There was an error during the check !!!",
				account: {},
			});
		}
	}

	// lấy ra thông tin tất cả tài khoản
	getAllAccount() {
		return Account.find();
	}

	// lấy ra thông tin của người dùng theo id
	getAccountById(id) {
		return Account.findById(id);
	}

	// delete account by id
	async deleteAccount(req, res) {
		try {
			const id = req.body;
			console.log(id);
			await Account.deleteOne({ id });
			return res.json({
				err: false,
				mess: "Xóa thành công",
			});
		} catch (error) {
			return res.json({
				err: true,
				mess: "Có lỗi trong quá trình thực hiện",
			});
		}
	}
}

module.exports = new AccountController();
