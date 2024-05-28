const express = require('express');
const router = express.Router();
const promotionsControllers = require('../../controllers/promotions.controllers');

router.get('/promotion', promotionsControllers.getAllPromo)
router.post('/promotion', promotionsControllers.createPromotion);

module.exports = router;
