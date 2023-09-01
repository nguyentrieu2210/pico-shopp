const mongoose = require("../../common/database")();

const productSchema = new mongoose.Schema({
    img_group: {
        type:Array,
        default: [],
    },
    description: {
        type: String,
        default:null,
    },
    new_price: {
        type: Number,
        default:0,
    },
    old_price: {
        type: Number,
        default:0,
    },
    cat_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref:"Category",
    },
    featured: {
        type: Array,
        default:[],
    },
    is_mypromotion: {
        type: Boolean,
        default:false,
    },
    is_special: {
        type: Boolean,
        default:false,
    },
    promotion: {
        type: Array,
        default:[],
    },
    is_hot: {
        type: Boolean,
        default:false,
    },
    is_stock: {
        type: Boolean,
        default:false,
    },
    name: {
        type: String,
        required: true,
        text:true,
    },
    slug: {
        type: String,
        required:true,
    },
    trademark: {
        type: String,
        default:null,
    },

}, {
    timestamps: true,
})

const ProductModel = mongoose.model("Product", productSchema, "products");
module.exports = ProductModel;