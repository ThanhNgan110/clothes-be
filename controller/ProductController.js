const Product = require("../models/product");
const Classify = require("../models/classify");
const CartController = require("./CartController");

class ProductController {
	//update lai một trường dữ liệu trong sản phẩm
	async updateProduct(id, Obj) {
		return await Product.updateOne({ _id: id }, { ...Obj });
	}

	//lấy ra sản phẩm theo id
	async getProductById(id) {
		return await Product.findById(id);
	}

	// kiểm tra thương hiệu đó có tồn tại không
	checkClassify(classify) {
		return Classify.findOne({ name: classify }).then((data) => {
			if (Boolean(data)) {
				return false;
			}
			return true;
		});
	}

	// lấy ra tất cả sản phẩm của thương hiệu bất kỳ
	async getProductByClassify(classify, check1 = false) {
		const check = await this.checkClassify(classify);
		if (!check) {
			const data = !check1
				? await Product.find({ classify }).limit(3)
				: await Product.find({ classify });
			return {
				err: false,
				data,
			};
		}
		return {
			err: true,
			data: [],
		};
	}

	// lấy dữ liệu trang home
	async getHome(limit_product) {
		// lấy ra tất những thương có trong database
		const arr = await Classify.find();
		const classifys = arr.map((item) => item.name);

		// thực hiện gọi hàm để lấy ra những sản phẩm theo
		// thương hiệu
		const promises = classifys.map((item) => this.getProductByClassify(item));
		return Promise.all(promises);
	}

	// lấy tất cả sản phẩm trong giỏ được sắp xếp theo thương hiệu
	getAllProduct() {
		return Product.find({}).sort({ classify: -1 });
	}

	// thêm sản phẩm tại trang admin
	async addProductByAdmin(req, res) {
		try {
			const value = await Product.findOne({ name: req.body.name });
			if (Boolean(value)) {
				return res.json({
					err: true,
					mess: "Sản phẩm đã tồn tại....",
				});
			} else {
				const data = {
					...req.body,
				};
				const newPorduct = new Product(data);
				newPorduct.save();
				console.log(data);
				return res.json({
					err: false,
					mess: "Thêm thành công....",
				});
			}
		} catch (error) {
			return res.json({
				err: false,
				// mess:""
			});
		}
	}

	// xóa sản phẩm
	async handleDeleteProduct(req, res) {
		try {
			const _id = req.body._id;
			const data = await Product.deleteOne({ _id });
			CartController.deleteProductFromCart(_id);
			return res.json({
				err: false,
				mess: "Xóa thành công..",
			});
		} catch (error) {
			return res.json({
				err: true,
				mess: "Có lỗi trong quá trình thực hiện..",
			});
		}
	}

	// Search Product
	async handleSearchProduct(req, res) {
		try {
			const keyword = req.body.name;
			console.log("param", keyword);
			const resultSearch = await Product.find({
				name: { $regex: new RegExp(keyword, "i") },
			});
			console.log("data result search", resultSearch);
			if (resultSearch.length === 0) {
				return res.json({
					err: true,
					mess: "Không tìm thấy kết quả tìm kiếm",
				});
			}
			return res.json(resultSearch);
		} catch (error) {
			return res.json({
				error: true,
				mess: "Có lỗi trong quá trình thực hiện",
			});
		}
	}
}

module.exports = new ProductController();
