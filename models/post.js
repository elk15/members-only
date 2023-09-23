const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    likes: {type: Number, default: 0},
    user: {type: Schema.Types.ObjectId, ref: "User"},
    text: {type: String, required: true, maxLength: 500},
    createdAt: {type: Date, default: Date.now},
    isAnonymous: {type: Boolean, default: true},
})

module.exports = mongoose.model("Post", PostSchema);