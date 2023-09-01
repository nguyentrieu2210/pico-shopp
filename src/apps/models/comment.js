const mongoose = require("../../common/database")();

const commentShema = new mongoose.Schema({
    body: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        default: null,
    },
    is_confirm: {
        type: Boolean,
        default: false,
    },
    star: {
        type: String,
        default: "5",
    },
    prd_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Product",
    }
}, {
    timestamps: true,
})
const CommentModel = mongoose.model("Comment", commentShema, "comments");
module.exports = CommentModel;