const asyncHandler = require("express-async-handler");
const Post = require("../models/post");

exports.get_most_recent = asyncHandler(async (req, res, next) => {
    const recentPosts = await Post.find({}).sort({createdAt: -1}).populate("user").exec();
    res.render("index", {title: "Clubhouse", posts: recentPosts});
})