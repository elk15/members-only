const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const Post = require("../models/post");
const Bookmark = require("../models/bookmark");


exports.user_get_posts = asyncHandler(async (req, res, next) => {
    const [user, userPosts] = await Promise.all([
        User.find({_id: req.params.id}, "username").exec(),
        Post.find({user: req.params.id}).sort({createdAt: -1}).exec(),
    ]) 
    res.render("user_page_posts", {title: user.username, posts: userPosts, user: user});
})

exports.user_get_bookmarks = asyncHandler(async (req, res, next) => {
    const [user, userBookmarks] = await Promise.all([
        User.find({_id: req.params.id}, "username").exec(),
        Bookmark.find({user: req.params.id}).populate("user").exec(),
    ]) 
    res.render("user_page_bookmarks", {title: user.username, bookmarks: userBookmarks, user: user});
})

exports.user_delete_get = (req, res, next) => {
    res.render("user_delete");
}

exports.user_delete_post = asyncHandler(async (req, res, next) => {
    await Promise.all([
        Bookmark.deleteMany({user: req.body.userid}),
        Post.deleteMany({user: req.body.userid}),
        User.findByIdAndRemove(req.body.userid),
     ]) 
    res.redirect("/");
})

