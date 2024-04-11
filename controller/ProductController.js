const Product = require("../models/product");
const Classify = require("../models/classify");
const CartController = require("./CartController");
const Bill = require("../models/bill");
class ProductController {
	//update product
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
			// if exites
			if (Boolean(data)) {
				return false;
			}
			return true;
		});
	}

	// lấy ra tất cả sản phẩm của thương hiệu bất kỳ
	async getProductByClassify(classify, check1 = false) {
		const check = await this.checkClassify(classify);
		console.log('check', check);
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

	// get all dl home
	async getHome() {
		// get all category inside db
		const arr = await Classify.find();
		const classifyName = arr.map((item) => item.name);

		// get all product by classifyName
		const promises = classifyName.map((item) =>
			this.getProductByClassify(item)
		);
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
			});
		}
	}

	// DeleteProduct
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
	async handleSearchProduct() {
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

	async statisticsProduct(req, res) {
		try {
			const products = await Product.find({});
			const bills = await Bill.find({}).count();
			let sum = 0;
			let value = 0;
			products.forEach((element) => {
				sum += parseInt(element.amount);
				value += parseInt(element.amount) * parseInt(element.price);
			});
			return res.json({
				countProducts: sum, // tổng số lượng trong kho
				valueProducts: value, // tổng giá trị trong kho
				countBills: bills, // tổng bill đã pán
			});
		} catch (error) {
			return res.json({
				error: true,
				mess: "Có lỗi trong quá trình thực hiện",
			});
		}
	}
}

module.exports = new ProductController();
