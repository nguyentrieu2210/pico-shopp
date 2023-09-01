const AccountModel = require("../models/account");
module.exports = async (req, res, next) => {
    if(!req.session.emailAcc) {
        res.locals.account = [];
        res.locals.full_name=null;
    }else{
        const account = await AccountModel.find({email:req.session.emailAcc, password:req.session.passwordAcc});
        res.locals.account = account;
        res.locals.full_name = account[0].full_name;
    }
    next();
}