const asyncHandler = require("express-async-handler");
var passport = require('passport');
const User = require("../models/user");
const bcrypt = require('bcryptjs');
const { body, validationResult } = require("express-validator");


exports.sign_up_get = (req, res, next) => {
    res.render("sign_up_form", {title: "Sign Up"});
};

exports.sign_up_post = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .custom(async value => {
            const user = await User.findOne({username: value}).exec();
            if (user) {
                throw new Error('Username already in use.');
            }
        }),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({min: 8})
        .withMessage("Password must have at least 8 characters")
        .matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).+$/)
        .withMessage("Password must have at least one letter, digit and special character"),
    body("passwordConfirm")
        .trim()
        .notEmpty()
        .withMessage("Confirm password")
        .custom((value, {req}) => {
            return value === req.body.password;
        })
        .withMessage("Passwords don't match"),
    
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const user = new User({
            username: req.body.username,
        });

        if (!errors.isEmpty()) {
            res.render("sign_up_form", {title: "Sign Up", user: user, errors: errors.array()});
        } else {
            bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
                if (err) {
                    throw err;
                }
                user.password = hashedPassword;
                const result = await user.save();
                res.redirect("/log-in");
            });
        }
            
    })

]



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