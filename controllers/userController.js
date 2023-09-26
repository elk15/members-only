const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const Post = require("../models/post");
const { body, validationResult } = require("express-validator");

exports.user_get_posts = asyncHandler(async (req, res, next) => {
    if (req.user) {
        const [user, userPosts] = await Promise.all([
            User.findOne({_id: req.params.id}, "username").exec(),
            Post.find({user: req.params.id}).sort({createdAt: -1}).populate("user").exec(),
        ]) 
        res.render("user_page", {title: user.username, posts: userPosts, user: user});
    } else {
        res.redirect("/log-in");
    }
})

exports.user_delete_get = (req, res, next) => {
    if (req.user) {
        if (req.params.id == req.user._id.toString()) {
            res.render("user_delete", {title: "Delete Account", userid: req.user._id});
        } else {
            res.redirect("/");
        }
    } else {
        res.redirect("/log-in");
    }
}

exports.user_delete_post = [
    body("delete", "Type DELETE to confirm")
        .trim()
        .equals("DELETE"),
    
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render("user_delete", {title: "Delete Account", userid: req.user._id, errors: errors.array()});
        } else {
            await Promise.all([
                Post.deleteMany({user: req.body.userid}),
                User.findByIdAndRemove(req.body.userid),
            ]) 
            res.redirect("/");
        }
    })
    
]



