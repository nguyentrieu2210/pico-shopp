const ProductModel = require("../models/product");
const UserModel = require("../models/user");
const CommentModel = require("../models/comment");
const OrderModel = require("../models/order");
const index = async (req, res) => {
    const products = await ProductModel.find().countDocuments();
    const users = await UserModel.find().countDocuments();
    const comments = await CommentModel.find().countDocuments();
    const orders = await OrderModel.find().countDocuments();
    res.render("../views/admin/admin", {products, users, comments, orders});
}
module.exports = {
    index,
}