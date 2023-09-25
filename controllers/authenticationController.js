const asyncHandler = require("express-async-handler");
var passport = require('passport');
const User = require("../models/user");
const bcrypt = require('bcryptjs');

exports.sign_up_get = (req, res, next) => {
    res.render("sign_up_form", {title: "Sign Up"});
};

exports.sign_up_post = asyncHandler(async (req, res, next) => {
    const user = new User({
        username: req.body.username,
    });
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
            throw err;
        }
        user.password = hashedPassword;
        const result = await user.save();
        res.redirect("/log-in");
    });
})

exports.log_in_get = asyncHandler(async (req, res, next) => {
    res.render("log_in_form", {title: "Log In"});
})

exports.log_in_post = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
    failureFlash: true,
});

exports.log_out_get = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    })
}