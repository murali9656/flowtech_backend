const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');

//Write Login api's here
router.route('/')
    // .post(productController.createRecord)
    .get(productController.getRecord)
    

module.exports = router;

