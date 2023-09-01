const CategoryModel = require("../models/category");
const paginate = require("../../common/paginate");
const slug = require("slug");
const UserModel = require("../models/user");
const index = async (req, res) => {
    const limit = 5;
    const page = parseInt(req.query.page)||1;
    const total = await CategoryModel.find().countDocuments();
    const totalPage = Math.ceil(total/limit);
    const skip = limit*(page-1);
    const pages = await paginate(totalPage, page);
    const categories = await CategoryModel.find().limit(limit).skip(skip).sort({_id:-1});
    res.render("../views/admin/categories/category", {categories, pages, page, totalPage});
}
const create = (req, res) => {
    res.render("../views/admin/categories/add_category", {data:{}});
}
const store = async (req, res) => {
    let error = null;
    const title = req.body.title;
    const categories = await CategoryModel.find({title:title});
    if(categories.length>0) {
        error = "Danh mục đã tồn tại!";
        res.render("../views/admin/categories/add_category", {data:{error}});
    }
    else{
        const category = {
            title: title,
            slug: slug(title),
        }
        new CategoryModel(category).save();
        res.redirect("/admin/categories");
    }
}
const edit = async (req, res) => {
    const id = req.params.id;
    const category = await CategoryModel.findById(id);
    res.render("../views/admin/categories/edit_category", {category, data:{}});
}
const update = async (req, res) => {
    const id = req.params.id;
    let error = null;
    const title= req.body.title;
    const category = await CategoryModel.findById(id);
    const cate = await CategoryModel.find({title:title});
    if(cate.length > 0) {
        console.log("hihi");
        error = "Danh mục đã tồn tại!";
        res.render("../views/admin/categories/edit_category", {category,data:{error}});
    }else {
        const categor = {
            title: title,
            slug: slug(title),
        }
        await CategoryModel.updateOne({_id:id}, {$set:categor});
        res.redirect("/admin/categories");
    }
}
const del = async (req, res) => {
    const id = req.params.id;
    await CategoryModel.deleteOne({_id:id});
    res.redirect("/admin/categories");
}

module.exports = {
    index, 
    create, 
    store,
    edit,
    update,
    del,
}
