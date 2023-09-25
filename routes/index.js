const express = require('express');
const router = express.Router();
const indexController = require("../controllers/indexController");
const authenticationController = require("../controllers/authenticationController");


/* GET home page. */
router.get('/', indexController.get_most_recent);

router.get('/sign-up', authenticationController.sign_up_get);

router.post('/sign-up', authenticationController.sign_up_post);

router.get('/log-in', authenticationController.log_in_get);

router.post('/log-in', authenticationController.log_in_post);

router.get('/log-out', authenticationController.log_out_get);

module.exports = router;
