const express = require('express');
const router = express.Router();
const signupController = require('../controller/signupController');

//Write signup api's here
router.route('/')
     .post(signupController.createRecord);
module.exports = router;

