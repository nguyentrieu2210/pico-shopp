const ProductModel = require("../models/product");
const CategoryModel = require("../models/category");
const paginate = require("../../common/paginate");
const path = require("path");
const fs = require("fs");
const slug = require("slug");
const index = async (req, res) => {
    const limit = 5;
    const page = parseInt(req.query.page)||1;
    const skip = limit*(page-1);
    const total = await ProductModel.find().countDocuments();
    const totalPage = Math.ceil(total/limit);
    const pages = await paginate(totalPage, page);
    const products = await ProductModel.find()
        .populate({path:"cat_id"})
        .sort({_id:-1})
        .skip(skip)
        .limit(limit);
    res.render("../views/admin/products/product", {products, pages, page, totalPage});
}
const create = async (req, res) => {
    const categories = await CategoryModel.find();
    res.render("../views/admin/products/add_product", {categories});
}
const store = (req, res) => {
    const {body, files} = req;
    const product = {
        description: body.description,
        new_price : body.new_price,
        old_price: body.old_price,
        cat_id: body.cat_id,
        is_mypromotion: body.is_mypromotion,
        is_special: body.is_special,
        promotion: body.promotion,
        is_hot: body.is_hot,
        is_stock: body.is_stock,
        name: body.name,
        slug: slug(body.name),
        trademark: body.trademark,
        featured: body.featured,
    }
    const img_group = [];
    if(files) {
        for(let file of files) {
            const img = "products/" + file.originalname;
            fs.renameSync(file.path, path.resolve("src/public/images/" + img));
            img_group.push(img);
        }
        // console.log(img_group);
        product["img_group"] = img_group;
        new ProductModel(product).save();
        res.redirect("/admin/products");
    }
}
const edit = async (req, res) => {
    const id  = req.params.id;
    const product = await ProductModel.findById(id);
    const categories = await CategoryModel.find();
    res.render("../views/admin/products/edit_product", {product, categories});
}
const update = async (req, res) => {
    const id = req.params.id;
    const {body, files} = req;
    const product = {
        description: body.description,
        new_price : body.new_price,
        old_price: body.old_price,
        cat_id: body.cat_id,
        is_mypromotion: body.is_mypromotion=="on",
        is_special: body.is_special=="on",
        promotion: body.promotion,
        is_hot: body.is_hot=="on",
        is_stock: body.is_stock,
        name: body.name,
        slug: slug(body.name),
        trademark: body.trademark,
        featured: body.featured,
    }
    if(files) {
        const img_group = [];
        for(let file of files) {
            const img = "products/" + file.originalname;
            fs.renameSync(file.path, path.resolve("src/public/images/" + img));
            img_group.push(img);
            product["img_group"] = img_group;
        }
    }
    await ProductModel.updateOne({_id:id}, {$set:product});
    res.redirect("/admin/products");
}
const del = async (req, res) => {
    const id = req.params.id;
    await ProductModel.deleteOne({_id:id});
    res.redirect("/admin/products");
}
module.exports = {
    index,
    create,
    store,
    edit,
    del,
    update,
}