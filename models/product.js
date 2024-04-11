const mongoose = require("mongoose");

const Product = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: 255,
    },
    price: {
      type: String,
      maxlength: 100,
    },
    desc: {
      type: String,
      maxlength: 255,
    },
    discount: {
      type: String,
      maxlength: 20,
    },
    amount: {
      type: String,
      maxlength: 20,
    },
    origin: {
      type: String,
      maxlength: 255,
    },
    image: {
      type: String,
    },
    classify: {
      type: String,
      maxlength: 200,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", Product);
