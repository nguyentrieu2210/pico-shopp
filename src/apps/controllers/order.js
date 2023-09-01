const OrderModel = require("../models/order");
const paginate = require("../../common/paginate");
const index = async (req, res) => {
    const limit = 5;
    const page = req.query.page||1;
    const total = await OrderModel.find({is_confirm:false}).countDocuments();
    const totalPage = Math.ceil(total/limit);
    const skip = limit*(page-1);
    const pages = await paginate(totalPage, page);
    const orders = await OrderModel.find({is_confirm: false}).sort({_id:-1}).limit(limit).skip(skip);
    res.render("../views/admin/orders/new_order", {orders, page, totalPage, pages});
}
const showAll = async (req, res) => {
    const limit = 5;
    const page = req.query.page||1;
    const total = await OrderModel.find().countDocuments();
    const totalPage = Math.ceil(total/limit);
    const skip = limit*(page-1);
    const pages = await paginate(totalPage, page);
    const orders = await OrderModel.find().sort({_id:-1}).limit(limit).skip(skip);
    res.render("../views/admin/orders/list_order", {orders, page, pages, totalPage});
}
const update = async (req, res) => {
    const id = req.params.id;
    const order = await OrderModel.findById(id);
    const new_order = {
        body: order.body,
        name: order.name,
        email: order.email,
        thumbnail: order.thumbnail,
        is_confirm: true,
        star: order.star,
        prd_id: order.prd_id,
    }
    await OrderModel.updateOne({_id:id}, {$set:new_order});
    res.redirect("/admin/orders");
}
const del = async (req, res) => {
    const id = req.params.id;
    await OrderModel.deleteOne({_id:id});
    res.redirect("/admin/orders");
}

module.exports = {
    index,
    showAll,
    update,
    del,
}