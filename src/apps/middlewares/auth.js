
const checkLogin = (req, res, next) => {
    if(req.session.email && req.session.password) {
        res.redirect("/admin/dashboard");
    }
    next();
}
const checkAdmin = (req, res, next) => {
    if(!req.session.email || !req.session.password) {
        res.redirect("/admin/login");
    }
    next();
}
const checkLoginAcc = (req, res, next) => {
    if(req.session.emailAcc && req.session.passwordAcc) {
        res.redirect("/account-infor");
    }
    next();
}
const checkAcc = (req, res, next) => {
    if(!req.session.passwordAcc || !req.session.emailAcc) {
        res.redirect("/login");
    }
    next();
}
const alertLogin = (req, res, next) => {
    if(req.session.passwordAcc && req.session.emailAcc) {
        res.render("../views/site/login", {data:{}});
        alert("Bạn đã đăng nhập thành công!");
    }
    next();
}
module.exports = {
    checkLogin, 
    checkAdmin,
    checkAcc,
    checkLoginAcc,
    alertLogin,
}