const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BookmarkSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "User", required: true},
    post: {type: Schema.Types.ObjectId, ref: "Post", required: true},
})

module.exports = mongoose.model("Bookmark", BookmarkSchema);