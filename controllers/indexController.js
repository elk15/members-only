const asyncHandler = require("express-async-handler");
const Post = require("../models/post");

exports.get_most_recent = asyncHandler((req, res, next) => {
    const recentPosts = Post.find().sort({createdAt: -1}).exec();
    res.render("index", {title: "Most Recent", posts: recentPosts});
})

exports.get_most_popular = asyncHandler((req, res, next) => {
    const popularPosts = Post.find().sort({liked: -1}).exec();
    res.render("index", {title: "Most Popular", posts: popularPosts});
})