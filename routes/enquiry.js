const express = require('express');
const router = express.Router();
const enquiryController = require('../controller/enquiryController');

//Write enquires api's here
router.route('/')
    .post(enquiryController.creatEnquiry)
    .get(enquiryController.viewEnquiry);

router.route('/:id')

    .post(enquiryController.updateEnquiry)
    .delete(enquiryController.deleteEnquiry)
    .get(enquiryController.singleEnquiry);

module.exports = router;

