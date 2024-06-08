const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

//Write Login api's here
router.route('/')
    .post(userController.userLogin);


router.route('/:id')
    .post(userController.userDelete);    

module.exports = router;

