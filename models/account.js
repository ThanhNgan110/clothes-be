const mongoose = require("mongoose");

const Account = new mongoose.Schema(
  {
    username: {
      type: String,
      maxlength: 100,
    },
    password: {
      type: String,
      maxlength: 255,
    },

    email: {
      type: String,
      maxlength: 105,
    },

    phone: {
      type: String,
      maxlength: 15,
    },

    address: {
      type: String,
      maxlength: 255,
    },
    role: {
      type: String,
      maxlength: 20,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("account", Account);
