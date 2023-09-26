const asyncHandler = require("express-async-handler");
const Post = require("../models/post");
const { body, validationResult } = require("express-validator");

exports.post_create_get = (req, res, next) => {
    if (req.user) {
        res.render("post_form", {title: "Create Post"});
    } else {
        res.redirect("/log-in");
    }
}

exports.post_create_post = [
    body("text")
        .trim()
        .notEmpty()
        .withMessage("Text is required")
        .isLength({max: 500})
        .withMessage("Cannot exceed 500 characters")
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const post = new Post({
            text: req.body.text,
            user: req.body.userid,
        })

        if (!errors.isEmpty()) {
            res.render("post_form", {
                title: "Create Post",
                post: post,
                errors: errors.array(),
            })
        } else {
            await post.save();
            res.redirect("/");
        }
    })
]

exports.post_delete = asyncHandler(async (req, res, next) => {
    if (req.user) {
        const post = await Post.findById(req.body.postid).exec();
        if (req.user._id == post.user) {
            await Post.findByIdAndDelete(req.body.postid);
            res.redirect("/");
        } else {
            res.redirect("/");
        }
    } else {
        res.redirect("/log-in");
    }
})

exports.post_update_get = asyncHandler(async (req, res, next) => {
    if (req.user) {
        const post = await Post.findById(req.params.id).exec();

        if (post === null) {
            const err = new Error("Post not found");
            err.status = 404;
            return next(err);
        }

        if (req.user._id == post.user) {
            res.render("post_form", {
                title: "Update Post",
                post: post,
            })
        } else {
            res.redirect("/");
        }
    } else {
        res.redirect("/log-in");
    }
})

exports.post_update_post = [
    body("text")
        .trim()
        .notEmpty()
        .withMessage("Text is required")
        .isLength({max: 500})
        .withMessage("Cannot exceed 500 characters")
        .escape(),
    
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const oldPost = await Post.findOne({_id: req.params.id}, "createdAt").exec();

        const post = new Post({
            text: req.body.text,
            user: req.body.userid,
            createdAt: oldPost.createdAt,
            _id: req.params.id,
        })

        if (!errors.isEmpty()) {

            res.render("post_form", {
                title: "Update Post",
                post: post,
                errors: errors.array(),
            })
        } else {
            await Post.findByIdAndUpdate(req.params.id, post, {});
            res.redirect("/");
        }
    })
]