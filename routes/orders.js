const express = require('express');
const router = express.Router();
const orderController = require('../controller/orderController');

//Write enquires api's here
router.route('/')
    .post(orderController.createOrder)
    .get(orderController.viewOrder);

// router.route('/:id')

//     .post(enquiryController.updateOrder)
//     .delete(enquiryController.deleteOrder)
//     .get(enquiryController.singleOrder);

module.exports = router;

