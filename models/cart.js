const mongoose = require("mongoose");

const Cart = new mongoose.Schema(
  {
    user_id: {
      type: String,
      maxlength: 100,
    },
    product_id: {
      type: String,
      maxlength: 100,
    },
    amount: {
      type: String,
      maxlength: 100,
    },
    sum_price: {
      type: String,
      maxlength: 100,
    },
    status: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", Cart);
