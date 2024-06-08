const express = require('express');
const router = express.Router();
const reportController = require('../controller/reportController');

//Write Login api's here
router.route('/')
    .get(reportController.reportsView);


// router.route('/:id')
//     .post(userController.userDelete);    

module.exports = router;

