const mongoose = require("../../common/database")();

const accountSchema = mongoose.Schema({
    full_name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
})

const AccountModel = mongoose.model("Account", accountSchema, "accounts");
module.exports = AccountModel;