const mongoose = require("mongoose");

const Classify = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: 35,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Classify", Classify);
