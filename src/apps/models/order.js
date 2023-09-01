const mongoose = require("../../common/database")();

const orderSchema = mongoose.Schema({
    is_confirm: {
        type: Boolean,
        default: false,
    },
    cart: {
        type: Array,
        required: true,
    },
    acc_email: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});
const OrderModel = mongoose.model("Order", orderSchema, "orders");
module.exports = OrderModel;