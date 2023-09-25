const asyncHandler = require("express-async-handler");
const Post = require("../models/post");
const Bookmark = require("../models/bookmark");
const { body, validationResult } = require("express-validator");

exports.post_create_get = (req, res, next) => {
    res.render("post_form", {title: "Create Post"});
}

exports.post_create_post = [
    body("text")
        .trim()
        .notEmpty()
        .withMessage("Text is required")
        .isLength({max: 500})
        .withMessage("Cannot exceed 500 characters")
        .escape(),
    body("anonymous.*")
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const post = new Post({
            text: req.body.text,
            isAnonymous: req.body.anonymous[0],
        })

        if (req.body.userid) {
            post.user = req.body.userid;
        }

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
    await Post.findByIdAndDelete(req.body.postid);
    await Bookmark.deleteMany({post: req.body.postid});
    res.redirect("..");
})

exports.post_update_get = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id).exec();

    if (post === null) {
        const err = new Error("Post not found");
        err.status = 404;
        return next(err);
    }

    res.render("post_form", {
        title: "Update Post",
        post: post,
    })
})

exports.post_update_post = [
    body("text")
        .trim()
        .notEmpty()
        .withMessage("Text is required")
        .isLength({max: 500})
        .withMessage("Cannot exceed 500 characters")
        .escape(),
    body("anonymous.*")
        .escape(),
    
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const oldPost = Post.find({_id: req.params.id}, "createdAt");

        const post = new Post({
            text: req.body.text,
            isAnonymous: req.body.anonymous[0],
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