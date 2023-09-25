const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const Bookmark = require("../models/bookmark");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "User"},
    text: {type: String, required: true, maxLength: 500},
    createdAt: {type: Date, default: Date.now},
})

PostSchema.virtual("createdAt_formatted").get(function () {
    return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATETIME_SHORT);
})

module.exports = mongoose.model("Post", PostSchema);