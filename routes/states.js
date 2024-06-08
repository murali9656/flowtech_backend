const express = require('express');
const router = express.Router();
const statesController = require('../controller/statesController');

//Write signup api's here
router.route('/')
     .get(statesController.getRecord);

router.route('/:state')
     .get(statesController.getCity)
module.exports = router;