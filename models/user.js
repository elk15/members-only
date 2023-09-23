const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {type: String, required: true, maxLength: 50},
    password: {type: String, required: true, minLength: 8},
    isAdmin: {type: Boolean, default: false},
})

UserSchema.virtual("posts_url").get(function() {
    return `user/${this._id}/posts`;
})

UserSchema.virtual("bookmarks_url").get(function() {
    return `user/${this._id}/bookmarks`;
})

module.exports = mongoose.model("User", UserSchema);