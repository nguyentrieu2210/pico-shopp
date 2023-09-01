const ProductModel = require("../models/product");
const CategoryModel = require("../models/category");
const AccountModel = require("../models/account");
const CommentModel = require("../models/comment");
const OrderModel = require("../models/order");
const path = require("path");
const moment = require("moment");
const fs = require("fs");
const transporter = require("../../common/transporter");
const config = require("config");
const ejs = require("ejs");

const session = require("express-session");
const e = require("express");
const home = async (req, res) => {
    const product_hot = await ProductModel.find({is_hot:1, is_stock:1}).sort({_id:-1});
    const my_promotions = await ProductModel.find({is_mypromotion:1, is_stock:1}).sort({_id:-1});
    const products = await ProductModel.find();
    const televisions = await ProductModel.find({cat_id:"64b749ab5c7bc8bff6395187", is_stock:1}).sort({_id:-1}).limit(10);
    const fridges = await ProductModel.find({cat_id:"64b749ab5c7bc8bff639518a", is_stock:1}).sort({_id:-1}).limit(10);
    const categories = await CategoryModel.find();
    const special_products = await ProductModel.find({is_special:1, is_stock:1}).sort({_id:-1});
    const special_pages = Math.floor(special_products.length/3);
    res.render("../views/site/index", {product_hot, my_promotions, products, categories, televisions, fridges, special_products, special_pages});
}
const cart = (req, res) => {
    const cart = req.session.cart;
    res.render("../views/site/cart", {cart, data:{}});
}
const buy = async (req, res) => {
    const id = req.body.id;
    let check = false;
    const cart = req.session.cart;
    cart.map((item)=> {
        if(item.id===id) {
            check=true;
            item.qty+=1;
        }
        return item;
    });
    if(check === false) {
        const product = await ProductModel.findById(id);
        const cartItem = {
            name:product.name,
            image: product.img_group[0],
            id: id,
            new_price: product.new_price,
            qty: 1,
            promotion: product.promotion,
        }
        cart.push(cartItem);
    }
    req.session.cart = cart;
    res.redirect(req.path);
}
const addToCart = async (req, res) => {
    const id = req.body.id;
    let check = false;
    const cart = req.session.cart;
    cart.map((item)=> {
        if(item.id===id) {
            check=true;
            item.qty+=1;
        }
        return item;
    });
    if(check === false) {
        const product = await ProductModel.findById(id);
        const cartItem = {
            name:product.name,
            image: product.img_group[0],
            id: id,
            new_price: product.new_price,
            qty: 1,
            promotion: product.promotion,
        }
        cart.push(cartItem);
    }
    req.session.cart = cart;
    res.redirect("/");
}
const deleteCart =  (req, res) => {
    const id = req.params.id;
    req.session.cart =  req.session.cart.filter((item)=>item.id!=id);
    res.redirect("/cart");
}
const moreItemCart = (req, res) => {
    const id = req.params.id;
    const cart = req.session.cart;
    req.session.cart = cart.map((item) => {
        if(item.id === id ) {
            item.qty+=1;
        }
        return item;
    });
    res.redirect("/cart");
}
const lessItemCart = (req, res) => {
    const id = req.params.id;
    const cart = req.session.cart;
    req.session.cart = cart.map((item) => {
        // if(item.qty)
        if(item.id === id && parseInt(item.qty)>1) {
            item.qty-=1;
        }
        return item;
    });
    res.redirect("/cart");
}
const order = async (req, res) => {
    const cart = req.session.cart;
    const {name, phone, email, address} = req.body;
    const html = await ejs.renderFile(path.join(req.app.get("views"), "site/order_email.ejs"), 
    {
        name,
        phone,
        address,
        email,
        cart,
    });
    await transporter.sendMail({
        to:email,
        from:"Pico Shop",
        subject: "Xác nhận đơn hàng từ Pico Shop",
        html,
    });
    const accounts = await AccountModel.find({email: email});
    var new_cart=[];
    new_cart = cart.map((item)=> {
        const new_item = {};
        new_item["name"] = item.name;
        new_item["new_price"] = item.new_price;
        new_item["qty"] = item.qty;
        return new_item;

    });
    const new_order = {
        cart: new_cart,
        acc_email: email,
    }
    await OrderModel(new_order).save();
    req.session.cart=[];
    res.redirect("/success");
}
//Category
const category = async (req, res) => {
    const limit = 4;
    const show = req.query.number||limit;
    const id = req.params.id;
    const total_product = await ProductModel.find({cat_id:id}).countDocuments();
    const category = await CategoryModel.findById(id);
    const product_hot = await ProductModel.find({is_hot:1, is_stock:1}).sort({_id:-1});
    const products = await ProductModel.find({cat_id:id}).sort({_id:-1}).limit(show);
    res.render("../views/site/category", {products, product_hot, category, limit, total_product});
}
const getLogin = (req, res) => {
    res.render("../views/site/login", {errors:[], data:{}});
}
const postLogin = async (req, res) => {
    const {email, password} = req.body;
    const errors = [];
    const account = await AccountModel.find({email:email, password: password});
    if(account.length>0) {
        //Bạn đã đăng nhập thành công!
        // const alert = "Bạn đã đăng nhập thành công!";
        req.session.emailAcc = email;
        req.session.passwordAcc = password;
        res.redirect("/account-infor"); 
    }else{
        const error = "Tài khoản không hợp lệ!";
        errors.push(error);
        res.render("site/login", {errors, data: {email, password}});
    }
}
const logout = (req, res) => {
    req.session.destroy();
    res.redirect("/login");
}
const getRegister = (req, res) => {
    res.render("../views/site/register", {errors:[], data: {}});
}
const postRegister = async (req, res) => {
    const body = req.body;
    const errors = [];
    let error = null;
    const {full_name, email, phone, password, address, re_password} = body;
    const accounts = await AccountModel.find({email: body.email});
    if(body.password != body.re_password) {
        error = "Mật khẩu nhập lại không trùng khớp !";
        errors.push(error);
        res.render("site/register", {errors, data:{full_name, email, phone, password, address, re_password}});
    }else if(accounts.length>0){
        error = "Email đã tồn tại!";
        errors.push(error);
        res.render("site/register", {errors, data:{full_name, email, phone, password, address, re_password}});
    }else{
        const account = {
            full_name: body.full_name,
            phone: body.phone,
            email: body.email,
            address: body.address,
            password: body.password,
        }
        await new AccountModel(account).save();
        res.redirect("/login");
    }
}
const product = async (req, res) => {
    const id = req.params.id;
    const product = await ProductModel.findById(id);
    const comments = await CommentModel.find({prd_id:id, is_confirm:true}).sort({_id:-1}).limit(10);
    res.render("../views/site/product", {product, comments, moment});
}
const comment = async (req, res) => {
    const id = req.params.id;
    const {file, body} =  req;
    const addcomment = {
        body:body.body,
        name:body.full_name,
        email:body.email,
        star:body.star||"5",
        prd_id: id,
    }
    if(file) {
        const thumbnail = "products/" + file.originalname;
        fs.renameSync(file.path, path.resolve("src/public/images/" + thumbnail));
        addcomment["thumbnail"] = thumbnail;
    }
    new CommentModel(addcomment).save();
    res.redirect(req.path);
}
const search = async (req, res) => {
    const limit = 4;
    const show = req.query.number||limit;
    const total_product = await ProductModel.find({$text:{$search: req.query.keyword}}).countDocuments();
    const products = await ProductModel.find({$text:{$search: req.query.keyword}}).sort({_id:-1}).limit(show);
    res.render("../views/site/search/search", {products, keyword:req.query.keyword, limit, total_product});
}
const searchProduct = async (req, res) => {
    const limit = 4;
    const show = req.query.number||limit;
    const product_filter = await ProductModel.find({$text:{$search: req.query.keyword}}).sort({_id:-1});
    const price = req.query.price;
    const keyword = req.query.keyword;
    const category = {};
    if(price=='<1') {
        const total_product = await product_filter.filter((item)=>item.new_price<1000000).length;
        let products = await product_filter.filter((item)=>item.new_price<1000000);
        const text = "Dưới 1 triệu";
        res.render("../views/site/search/search_filter", { products, text, keyword, limit, total_product, price, category});
    }else if(price=='10-20') {
        const total_product = await product_filter.filter((item)=>{
            return item.new_price>=10000000 && item.new_price<=20000000;
        }).length;
        let products = await product_filter.filter((item)=>{
            return item.new_price>=10000000 && item.new_price<=20000000;
        }).slice(0, show);
        const text = "10 triệu - 20 triệu";
        res.render("../views/site/search/search_filter", { products, text, keyword, limit, total_product, price, category});
    }else if(price=='>40') {        
        let products = await product_filter.filter((item)=>{
            return item.new_price > 40000000;
        });
        products = products.slice(0, show);
        const total_product = await product_filter.filter((item)=>{
            return item.new_price > 40000000;
        }).length;
        const text = "Trên 40 triệu"; 
        res.render("../views/site/search/search_filter", { products, text, keyword, limit, total_product, price, category});
    }else if(price=='1-10') {
        let products = await product_filter.filter((item)=>{
            return item.new_price>=1000000 && item.new_price<=10000000;
        });
        products = products.slice(0, show);
        const total_product = await product_filter.filter((item)=>{
            return item.new_price>=1000000 && item.new_price<=10000000;
        }).length;
        const text = "1 triệu - 10 triệu";
        res.render("../views/site/search/search_filter", { products, text, keyword, limit, total_product, price, category});
    }else{
        let products = await product_filter.filter((item)=>{
            return item.new_price>=20000000 && item.new_price<=40000000;
        });
        products = products.slice(0, show);
        const total_product = await product_filter.filter((item)=>{
            return item.new_price>=20000000 && item.new_price<=40000000;
        }).length;
        const text = "20 triệu - 40 triệu";
        res.render("../views/site/search/search_filter", { products, text, keyword, limit, total_product, price, category});
    }

}
const searchFilter = async (req, res) => {
    const limit = 4;
    const show = req.query.number||limit;
    const price = req.query.price;
    const id = req.params.id;
    const keyword = null;
    const category = await CategoryModel.findById(id);
    if(price=='<1') {
        const products = await ProductModel.find({cat_id: id, new_price: {$lt:1000000}}).sort({_id:-1}).limit(show);
        const total_product = await ProductModel.find({cat_id: id, new_price: {$lt:1000000}}).length;
        const text = "Dưới 1 triệu";
        res.render("../views/site/search/search_filter", {category, products, text, keyword, total_product, limit, price});
    }else if(price=='10-20') {
        const products = await ProductModel.find({cat_id: id, new_price: {$lte:20000000, $gte:10000000}}).sort({_id:-1}).limit(show);
        const total_product = (await ProductModel.find({cat_id: id, new_price: {$lte:20000000, $gte:10000000}})).length;
        const text = "10 triệu - 20 triệu";
        res.render("../views/site/search/search_filter", {category, products, text, keyword, total_product, limit, price});
    }else if(price=='>40') {
        const products = await ProductModel.find({cat_id: id, new_price: {$gt:40000000}}).sort({_id:-1}).limit(show);
        const total_product = (await ProductModel.find({cat_id: id, new_price: {$gt:40000000}})).length;
        const text = "Trên 40 triệu"; 
        res.render("../views/site/search/search_filter", {category, products, text, keyword, total_product, limit, price});
    }else if(price=='1-10') {
        const products = await ProductModel.find({cat_id: id, new_price: {$lte:10000000, $gte:1000000}}).sort({_id:-1}).limit(show);
        const total_product = (await ProductModel.find({cat_id: id, new_price: {$lte:10000000, $gte:1000000}})).length;
        const text = "1 triệu - 10 triệu";
        res.render("../views/site/search/search_filter", {category, products, text, keyword, total_product, limit, price});
    }else{
        const products = await ProductModel.find({cat_id: id, new_price: {$lte:40000000, $gte:20000000}}).sort({_id:-1}).limit(show);
        const total_product = (await ProductModel.find({cat_id: id, new_price: {$lte:40000000, $gte:20000000}})).length;
        const text = "20 triệu - 40 triệu";
        res.render("../views/site/search/search_filter", {category, products, text, keyword, total_product, limit, price});
    }
}
const success = (req, res) => {
    res.render("../views/site/success");
}
const accountInfor = async (req, res) => {
    res.render("../views/site/account/account_infor", { data:{}});
}
const updateInfor = async (req, res) => {
    const email = req.session.emailAcc;
    const password = req.session.passwordAcc;
    const {body} = req;
    const accounts = await AccountModel.find({email: req.body.email});
    let error = null;
    if(accounts.length == 0 || accounts[0].email == email) {
        const new_account = {
            email: body.email,
            password: password,
            phone: body.phone,
            address: body.address,
            full_name: body.full_name,
        }
        req.session.emailAcc = body.email;
        await AccountModel.updateOne({email:email, password:password},{$set:new_account});
        res.redirect("/account-infor");
    }
    else{
        error = "Email đã tồn tại!";
        res.render("../views/site/account/account_infor", {data:{error}});
    }
}
const accountOrder = async (req, res) => {
    const email = req.session.emailAcc;
    const orders = await OrderModel.find({acc_email:email}).sort({_id:-1});
    res.render("../views/site/account/account_order", {orders, moment});
}
const accountPassword = async (req, res) => {
    res.render("../views/site/account/account_re_password", {data:{}});
}
const updatePassword = async (req, res) => {
    let error = null;
    const password = req.session.passwordAcc;
    const body = req.body;
    if(password != body.password) {
        error = "Mật khẩu không đúng !";
        res.render("../views/site/account/account_re_password", {data:{error}});
    }else if(body.new_password != body.re_password){
        error = "Mật khẩu nhập lại không khớp !";
        res.render("../views/site/account/account_re_password", {data:{error}});
    }
    else{
        const old_account = await AccountModel.find({email:req.session.emailAcc});
        const new_account = {
            email: old_account[0].email,
            password: body.new_password,
            phone: old_account[0].phone,
            full_name: old_account[0].full_name,
            address: old_account[0].address,
        }
        await AccountModel.updateOne({email:req.session.emailAcc}, {$set:new_account});
        req.session.passwordAcc = body.new_password;
        res.redirect("/account-password");
    }
}

module.exports = {
    home,
    cart,
    buy,
    addToCart,
    deleteCart,
    moreItemCart,
    lessItemCart,
    category,
    getLogin,
    postLogin, 
    getRegister,
    postRegister,
    logout,
    product,
    comment,
    search,
    searchProduct,
    searchFilter,
    success,
    accountInfor,
    updateInfor,
    accountOrder,
    accountPassword,
    updatePassword,
    order,
}


