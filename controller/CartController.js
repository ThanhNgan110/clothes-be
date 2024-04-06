const Cart = require("../models/cart");
const Product = require("../models/product");

const ProductController = require("./ProductController");

class CartController {
  //update lai một trường dữ liệu trong giỏ hàng
  updateCart(id, Obj) {
    return Cart.updateOne({ _id: id }, { ...Obj });
  }

  // kiểm tra xem sản phẩm đã có trong giỏ hay chưa
  checkCart(product_id, user_id) {
    return Cart.findOne({ product_id, user_id, status: 0 }).then((data) => {
      if (Boolean(data)) {
        return {
          err: false,
          id: data._id,
          current_amount: data.amount,
        };
      }
      return {
        err: true,
        id: "",
        current_amount: "0",
      };
    });
  }

  // chuyển đổi tiền từ số sang chuỗi
  convert_money(money, amount) {
    let parser_price_cur = money.replaceAll(".", "");
    parser_price_cur = money.replaceAll(",", "");
    parser_price_cur = +parser_price_cur;

    const new_price = amount * parser_price_cur;
    const prev_convert = `${new_price}`;
    let temp = "";
    let new_convert = "";
    let count = 0;
    for (let i = prev_convert.length; i >= 0; i--) {
      temp += prev_convert.charAt(i);
      if (count == 3) {
        temp += ".";
        count = 0;
      }
      count++;
    }

    for (let i = temp.length; i >= 0; i--) {
      new_convert += temp.charAt(i);
    }
    return new_convert.charAt(0) === "."
      ? new_convert.substring(1)
      : new_convert;
  }

  // Thêm vào giỏ hàng
  async add_to_cart(req) {
    try {
      const check = await this.checkCart(req.body.product_id, req.body.user_id);
      const product = await Product.findOne({ _id: req.body.product_id });

      /* 
        - số lượng sản phẩm của sản phẩm đã tồn tại trong giỏ = 
            số lượng sản phẩm trong giỏ của sản phẩm đó + số lượng mua thêm
          * Lưu ý *
            - nếu sản chưa có trong giỏ thì số lượng trong giỏ mặc định = 0
          *      *
      */
      const new_amountCart = +check.current_amount + +req.body.amount;
      /* 
        tính lại số sản phẩm còn trong kho = 
          số lượng còn  - số lượng mua
      */
      const new_amountProduct = +product.amount - +req.body.amount;

      const result = this.convert_money(req.body.one_pr_price, new_amountCart);

      // cập nhật lại số lượng sản phẩm trong kho
      const update = await Product.updateOne(
        { _id: req.body.product_id },
        {
          amount: new_amountProduct,
        }
      );

      /*
        - nếu sản phẩm đó chưa có trong giỏ thì thêm vào,
        - nếu tồn tại thì cập nhật lại số lượng
      */
      if (check.err == true) {
        const cart = new Cart({
          product_id: req.body.product_id,
          user_id: req.body.user_id,
          amount: new_amountCart,
          sum_price: result,
          status: 0,
        });

        cart.save();
        /* 
          status = 0 => thêm mới
          status = 1 => cập nhật giá tiền và số lượng
          */
        return { err: false, status: 0 };
      } else {
        const update_cart = await this.updateCart(check.id, {
          amount: new_amountCart,
          sum_price: result,
        });
        return { err: false, status: 1 };
      }
    } catch (error) {
      console.log(error);
      return {
        err: true,
      };
    }
  }

  // lấy ra những sản phẩm chưa thanh toán của user
  getAllCartByUserId(user_id) {
    return Cart.find({ user_id, status: 0 });
  }

  // xóa sản phẩm ra khỏi giỏ hàng
  deleteProductFromCart(_id) {
    try {
      return Cart.deleteOne({ _id }).then((data) => {
        return {
          err: false,
          mess: "Xóa thành công",
        };
      });
    } catch (error) {
      return {
        err: true,
        mess: "Có lỗi xảy ra",
      };
    }
  }
}

module.exports = new CartController();
