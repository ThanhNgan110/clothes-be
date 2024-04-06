const Bill = require("../models/bill");
const Cart = require("../models/cart");
const CartController = require("./CartController");

class BillController {
  // thanh toán
  payment(Obj) {
    try {
      const bill = new Bill({
        ...Obj,
        order_list: JSON.stringify(Obj.order_list),
      });
      bill.save();
      const updates = Obj.order_list.map((item) => {
        return CartController.updateCart(item, { status: 1 });
      });
      Promise.all(updates);
      return {
        err: false,
        message: "Success !!!",
      };
    } catch (error) {
      return {
        err: true,
        message: "there was an error during execution !!!",
      };
    }
  }

  // lấy ra những đơn hàng đã thanh toán
  getBillById(user_id) {
    return Bill.find({ user_id });
  }
}

module.exports = new BillController();
