const CategoryModel = require("../models/category");
module.exports = async (req, res, next) => {
    const categories = await CategoryModel.find();
    res.locals.categories = categories;
    next();
}