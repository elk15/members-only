const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/:id/posts", userController.user_get_posts);

router.get("/:id/delete", userController.user_delete_get);

router.post("/:id/delete", userController.user_delete_post);

module.exports = router;