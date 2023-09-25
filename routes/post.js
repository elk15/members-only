const express = require('express');
const router = express.Router();
const postController = require("../controllers/postController");

router.get('/create', postController.post_create_get);

router.post('/create', postController.post_create_post);

router.post('/:id/delete', postController.post_delete);

router.get('/:id/update', postController.post_update_get);

router.post('/:id/update', postController.post_update_post);

module.exports = router;