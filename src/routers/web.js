const express = require("express");
const router = express.Router();
const AuthController = require("../apps/controllers/auth");
const AdminController = require("../apps/controllers/admin");
const ProductController = require("../apps/controllers/product");
const CategoryController = require("../apps/controllers/category");
const UserController = require("../apps/controllers/user");
const CommentController = require("../apps/controllers/comment");
const OrderController = require("../apps/controllers/order");
const SiteController = require("../apps/controllers/site");
const AuthMiddleware = require("../apps/middlewares/auth");
const UploadMiddleware = require("../apps/middlewares/upload");
// router.get("/", (req, res)=>{
//     res.send("<h1>Welcome NodeJs</h1>")
// })
//
router.get("/admin/login", AuthMiddleware.checkLogin,  AuthController.getLogin);
router.post("/admin/login", AuthController.postLogin);
router.get("/admin/logout",AuthMiddleware.checkAdmin, AuthController.logout);
router.get("/admin/dashboard",AuthMiddleware.checkAdmin, AdminController.index);
//Product
router.get("/admin/products",AuthMiddleware.checkAdmin, ProductController.index);
router.get("/admin/products/create",AuthMiddleware.checkAdmin, ProductController.create);
router.post("/admin/products/store",AuthMiddleware.checkAdmin, UploadMiddleware.array('img_group', 12), ProductController.store);
router.get("/admin/products/edit:id",AuthMiddleware.checkAdmin, ProductController.edit);
router.post("/admin/products/update:id",AuthMiddleware.checkAdmin, UploadMiddleware.array('img_group', 12), ProductController.update);
router.get("/admin/products/delete:id",AuthMiddleware.checkAdmin, ProductController.del);
//Category
router.get("/admin/categories",AuthMiddleware.checkAdmin, CategoryController.index);
router.get("/admin/categories/create",AuthMiddleware.checkAdmin, CategoryController.create);
router.post("/admin/categories/store",AuthMiddleware.checkAdmin, CategoryController.store);
router.get("/admin/categories/edit:id",AuthMiddleware.checkAdmin, CategoryController.edit);
router.get("/admin/categories/delete:id",AuthMiddleware.checkAdmin, CategoryController.del);
router.post("/admin/categories/update:id",AuthMiddleware.checkAdmin, CategoryController.update);
//User
router.get("/admin/users",AuthMiddleware.checkAdmin, UserController.index);
router.get("/admin/users/create",AuthMiddleware.checkAdmin, UserController.create);
router.post("/admin/users/store",AuthMiddleware.checkAdmin, UserController.store);
router.get("/admin/users/edit:id",AuthMiddleware.checkAdmin, UserController.edit);
router.get("/admin/users/delete:id",AuthMiddleware.checkAdmin, UserController.del);
router.post("/admin/users/update:id",AuthMiddleware.checkAdmin, UserController.update);
//Comment
router.get("/admin/comments",AuthMiddleware.checkAdmin, CommentController.index);
router.get("/admin/comments/all",AuthMiddleware.checkAdmin, CommentController.showAll);
router.get("/admin/comments/update:id",AuthMiddleware.checkAdmin, CommentController.update);
router.get("/admin/comments/delete:id",AuthMiddleware.checkAdmin, CommentController.del);
//Order
router.get("/admin/orders",AuthMiddleware.checkAdmin, OrderController.index);
router.get("/admin/orders/all",AuthMiddleware.checkAdmin, OrderController.showAll);
router.get("/admin/orders/update:id",AuthMiddleware.checkAdmin, OrderController.update);
router.get("/admin/orders/delete:id",AuthMiddleware.checkAdmin, OrderController.del);
//Site
router.get("/", SiteController.home);
router.get("/cart", SiteController.cart);
router.post("/cart", SiteController.buy);
router.post("/add-to-cart", SiteController.addToCart);
router.get("/delete-cart.:id", SiteController.deleteCart);
router.get("/more-item-cart.:id", SiteController.moreItemCart);
router.get("/less-item-cart.:id", SiteController.lessItemCart);
router.get("/category-:slug.:id", SiteController.category);
router.get("/login", AuthMiddleware.checkLoginAcc, SiteController.getLogin);
router.post("/login", SiteController.postLogin);
router.get("/logout", SiteController.logout);
router.get("/register", SiteController.getRegister);
router.post("/register", SiteController.postRegister);
router.get("/product-:slug.:id", SiteController.product);
router.post("/product-:slug.:id", UploadMiddleware.single("thumbnail"), SiteController.comment);
router.get("/success", SiteController.success);
router.get("/search", SiteController.search);
router.get("/search-filter", SiteController.searchProduct);
router.get("/search-filter-:slug.:id", SiteController.searchFilter);
router.get("/account-infor", AuthMiddleware.checkAcc, SiteController.accountInfor);
router.post("/account-infor", SiteController.updateInfor);
router.get("/account-order",  AuthMiddleware.checkAcc,SiteController.accountOrder);
router.get("/account-password",  AuthMiddleware.checkAcc,SiteController.accountPassword);
router.post("/account-password",  SiteController.updatePassword);
router.post("/order-email", SiteController.order);

module.exports = router;