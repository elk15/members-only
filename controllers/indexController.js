const asyncHandler = require("express-async-handler");
const Post = require("../models/post");

exports.get_most_recent = asyncHandler((req, res, next) => {
    const recentPosts = Post.find().sort({createdAt: -1}).populate("user").exec();
    res.render("index", {title: "Clubhouse", user: req.user, posts: recentPosts});
})