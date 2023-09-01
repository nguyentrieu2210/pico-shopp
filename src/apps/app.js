const express = require("express");
const app = express();
const config = require("config");
const session = require("express-session");
//Seesion
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: config.get('app.session_key'),
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
//data
app.use("/static", express.static(config.get("app.static_folder")));
//Form
app.use(express.urlencoded({extended:true}));
app.use(express.json());
//View
app.set("views", config.get("app.view_folder"));
app.set("view engine", config.get("app.view_engine"));
//Account
app.use(require("./middlewares/account"));
//Category
app.use(require("./middlewares/share"));
//Cart 
app.use(require("./middlewares/cart"));
//Router
app.use(require(config.get("app.router")));
module.exports = app;
