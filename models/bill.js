const mongoose = require("mongoose");

const Bill = new mongoose.Schema(
  {
    //Lưu id_của đơn hàng theo từng user
    order_list: {
      type: String,
      maxlength: 300,
    },
    user_id: {
      type: String,
      maxlength: 255,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bill", Bill);
