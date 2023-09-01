module.exports = (req, res, next) => {
    if(!req.session.cart) {
        req.session.cart = [];
    }
    res.locals.totalItemCart = req.session.cart.reduce((total, item)=>total+=item.qty, 0);
    next();
}