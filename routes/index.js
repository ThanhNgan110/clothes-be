const AccountController = require("../controller/AccountController");
const ProductController = require("../controller/ProductController");
const CartController = require("../controller/CartController");
const BillController = require("../controller/BillController");

const Account = require("../models/account");

function routes(app) {
	// render home
	app.get("/", async (req, res) => {
		const qr = await ProductController.getHome();
		return res.json(qr);
	});

	// chức năng đăng nhập(user)
	app.post("/login", (req, res) => {
		try {
			AccountController.handle_login(req, res);
		} catch (error) {}
	});

	// chức năng đăng ký
	app.post("/register", (req, res) => {
		try {
			AccountController.handle_register(req, res);
		} catch (error) {}
	});

	// Lấy ra sản phẩm theo id
	app.get("/product-by-id/:slug", async (req, res) => {
		try {
			const id = req.params.slug;
			const data = await ProductController.getProductById(id);
			return res.json({ err: false, mess: "Success!!", data });
		} catch (error) {
			return res.json({
				err: true,
				mess: "Co loi trong quan trinh lay du lieu",
				data: [],
			});
		}
	});

	// render chi tiet sản phẩm theo từng thương hiệu
	app.get("/san-pham/:slug", async (req, res) => {
		const classify = req.params.slug;
		const data = await ProductController.getProductByClassify(classify, true);
		return res.json(data);
	});

	// thêm sản phẩm và giỏ
	app.post(
		"/add-to-cart",
		(req, res, next) => {
			console.log(req.headers);
			if (req.headers.isLogin !== "") {
				return next();
			} else {
				console.log("Chua login");
				return res.json({
					err: true,
					mess: "Vui lòng đăng nhập !!!",
				});
			}
		},
		async (req, res) => {
			const data = await CartController.add_to_cart(req);
			console.log(data);
			return res.json(data);
		}
	);

	// lấy ra những sản phẩm chưa thanh toán trong giỏ
	app.get("/user/carts/:slug", async (req, res) => {
		try {
			// lấy ra id ở trên đường dẫn
			const user_id = req.params.slug;
			const data = await CartController.getAllCartByUserId(user_id);
			return res.json({
				err: false,
				size: data.length,
				data,
			});
		} catch (error) {
			return res.json({ err: true, size: 0, data: [] });
		}
	});

	// chức năng thanh toán
	app.post("/user/payment", async (req, res) => {
		const order_list = JSON.parse(req.body.cart_list);
		const user_id = req.headers.islogin;
		return res.json(
			await BillController.payment({
				user_id,
				order_list,
			})
		);
	});

	app.post("/cart/detete", async (req, res) => {
		const value = await CartController.deleteProductFromCart(req.body._id);
		return res.json(value);
	});

	// lấy ra thông tin của người dùng
	app.get("/user/profile", async (req, res) => {
		try {
			const account = await AccountController.getAccountById(
				req.headers.islogin
			);
			// console.log(account);
			return res.json({
				err: false,
				data: account,
			});
		} catch (error) {
			return res.json({
				err: true,
				data: {},
			});
		}
	});

	// lấy ra những đơn hàng đã thanh toán của user
	app.get("/bill", async (req, res) => {
		const data = await BillController.getBillById(req.body.user_id);
		return res.json(data);
	});

	// lấy ra tất cả profile user (quyền admin)
	app.get(
		"/admin/all-user",
		(req, res, next) => {
			const role = req.body.role;
			if (role === "USER_ROLE") {
				return res.json({
					err: true,
					mess: "You are not admin !!!",
				});
			}
			return next();
		},
		async (req, res) => {
			try {
				const accounts = await AccountController.getAllAccount();
				return res.json({
					err: false,
					mess: "Success !!",
					data: accounts,
				});
			} catch (error) {
				return {
					err: false,
					mess: "Falid !!!",
					data: [],
				};
			}
		}
	);

	// thêm sản phẩm (chưa xong -> chỉ mới thêm được ảnh)
	app.post("/add-product", ProductController.addProductByAdmin);

	// lấy ra tất cả sản phẩm trong admin
	app.get("/admin/all-product", async (req, res) => {
		try {
			const data = await ProductController.getAllProduct();
			return res.json({
				err: false,
				data,
				mess: "Success !!!",
			});
		} catch (error) {
			return res.json({
				err: true,
				data: [],
				mess: "Hiện tại chưa thể xử lý !!!",
			});
		}
	});

	// cập nhật thông tin của sản phẩm theo id
	app.post("/admin/update-product", async (req, res) => {
		try {
			let Obj = req.body;
			const { _id, ...temp } = Obj;
			await ProductController.updateProduct(_id, temp);
			return res.json({
				err: false,
				mess: "Cập nhật thành công...",
			});
		} catch (error) {
			return res.json({
				err: true,
				mess: "Có lỗi trong quá trình cập nhật",
			});
		}
	});

	// cập nhật thông tin user theo id
	app.post("/admin/update-user", async (req, res) => {
		try {
			let account = req.body;
			console.log(account, 'account is')
			const { _id, ...temp } = account;
			await AccountController.updateAccountById(_id, temp);
			return res.json({
				err: false,
				mess: "Cập nhật thành công...",
			});
		} catch (error) {
			return res.json({
				err: true,
				mess: "Có lỗi trong quá trình cập nhật",
			});
		}
	});

	// delete account by id
	app.post("/admin/delete-account", AccountController.deleteAccount)

	// xóa sản phẩm trong admin
	app.post("/admin/delete-product", ProductController.handleDeleteProduct);

	// search product
	app.post("/search-product", ProductController.handleSearchProduct);
}

module.exports = routes;
