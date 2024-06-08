const express = require('express');
const router = express.Router();
const userenquiryController = require('../controller/userenquiryController');

//Write enquires api's here
router.route('/')
    .post(userenquiryController.creatEnquiry)
    .get(userenquiryController.viewEnquiry);

router.route('/:id')

    .post(userenquiryController.updateEnquiry)
    .delete(userenquiryController.deleteEnquiry)
    .get(userenquiryController.singleEnquiry);

module.exports = router;

