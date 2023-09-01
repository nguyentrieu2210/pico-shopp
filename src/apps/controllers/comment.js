const CommentModel = require("../models/comment");
const paginate = require("../../common/paginate");
const index = async (req, res) => {
    const limit = 5;
    const page = req.query.page||1;
    const total = await CommentModel.find({is_confirm: false}).countDocuments();
    const totalPage = Math.ceil(total/limit);
    const skip = limit*(page-1);
    const pages = await paginate(totalPage, page);

    const comments = await CommentModel.find({is_confirm: false}).sort({_id:-1}).limit(limit).skip(skip);
    res.render("../views/admin/comments/new_comment", {comments, page, totalPage, pages});
}
const showAll = async (req, res) => {
    const limit = 5;
    const page = req.query.page||1;
    const total = await CommentModel.find().countDocuments();
    const totalPage = Math.ceil(total/limit);
    const skip = limit*(page-1);
    const pages = await paginate(totalPage, page);
    const comments = await CommentModel.find().sort({_id:-1}).limit(limit).skip(skip);
    res.render("../views/admin/comments/list_comment", {comments, page, totalPage, pages});
}
const update = async (req, res) => {
    const id = req.params.id;
    const comment = await CommentModel.findById(id);
    const new_comment = {
        body: comment.body,
        name: comment.name,
        email: comment.email,
        thumbnail: comment.thumbnail,
        is_confirm: true,
        star: comment.star,
        prd_id: comment.prd_id,
    }
    await CommentModel.updateOne({_id:id}, {$set:new_comment});
    res.redirect("/admin/comments");
}
const del = async (req, res) => {
    const id = req.params.id;
    await CommentModel.deleteOne({_id:id});
    res.redirect("/admin/comments");
}

module.exports = {
    index,
    showAll,
    update,
    del,
}