const Classify = require("../models/classify.js");

class ClassifyController {
	async getAllClassify() {
		try {
			return await Classify.find({});
		} catch (error) {
			throw error;
		}
	}

	// add classify
	async addClassify(req, res) {
		try {
			const name = req.body.name
			console.log(req.body.name, "name");
			const query = await Classify.findOne({ name: name });
			if (Boolean(query)) {
				console.log("query", query);
				return res.json({
					err: true,
					mess: "Classify already exists !!!",
					classify: {},
				});
			} else {
				const classify = new Classify({
					...req.body,
				});
				classify.save();
				return res.json({
					err: false,
					mess: "Add classify success",
					data: classify,
				});
			}
		} catch (error) {
			console.error(error);
		}
	}

	//delete classify
	async deleteClassify(req, res) {
		try {
			const id = req.body._id;
			await Classify.deleteOne({ _id: id });
			return res.json({
				err: false,
				mess: "Xóa thành công",
			});
		} catch (error) {
			return res.json({
				err: true,
				mess: "Có lỗi trong quá trình thực hiện..",
			});
		}
	}

	//update classify
	async updateClassify(id, Obj) {
		return await Classify.updateOne({ _id: id }, { ...Obj });
	}
}

module.exports = new ClassifyController();
