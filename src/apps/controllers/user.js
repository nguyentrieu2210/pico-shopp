const UserModel = require("../models/user");
const paginate = require("../../common/paginate");
const index = async (req, res) => {
    const limit = 3;
    const page = parseInt(req.query.page)||1;
    const total = await UserModel.find().countDocuments();
    const totalPage = Math.ceil(total/limit);
    const pages = await paginate(totalPage, page);
    const skip = limit*(page-1);
    const users = await UserModel.find().limit(limit).skip(skip);
    res.render("../views/admin/users/user", {users,page, pages, totalPage});
}
const create = (req, res) => {
    res.render("../views/admin/users/add_user", {data:{}});
}
const store = async (req, res) => {
    const {body} = req;
    let error = null;
    const users = await UserModel.find({email:body.email});
    if(users.length>0) {
        error = "Email đã tồn tại!";
        res.render("../views/admin/users/add_user", {data:{error}});
    }else if(body.password != body.re_password) {
        error = "Vui lòng nhập lại mật khẩu!";
        res.render("../views/admin/users/add_user", {data:{error}});
    }
    else {
        const user = {
            email:body.email,
            password:body.password,
            role: body.role,
            full_name: body.full_name,
        }
        new UserModel(user).save();
        res.redirect("/admin/users");
    }
}
const edit = async (req, res) => {
    const id = req.params.id;
    const user = await UserModel.findById({_id:id});
    res.render("../views/admin/users/edit_user", {user, data:{}});
}
const update = async (req, res) => {
    const body = req.body;
    const id = req.params.id;
    let error = null;
    const users = await UserModel.find({email:body.email});
    const user = await UserModel.findById({_id:id});
    if(body.password != body.re_password) {
        error = "Mật khẩu không khớp !";
        res.render("../views/admin/users/edit_user", {user, data:{error}});
    }else if(users.length>0) {
        error = "Email đã tồn tại !";
        res.render("../views/admin/users/edit_user", {user, data:{error}});
    }else{
        const user = {
            email:body.email,
            password:body.password,
            role: body.role,
            full_name: body.full_name,
        }
        await UserModel.updateOne({_id:id}, {$set:user});
        res.redirect("/admin/users");
    }
}
const del = async (req, res) => {
    const id = req.params.id;
    await UserModel.deleteOne({_id:id});
    res.redirect("/admin/users");
}

module.exports = {
    index, 
    create, 
    store,
    edit,
    update,
    del,
}
