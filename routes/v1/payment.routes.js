const express = require("express");
const { createPaymentEwallet, createPaymentBank } = require("../../controllers/payment.controller");
const router = express.Router();

router.post("/payment_wallet", createPaymentEwallet);
router.post("/payment_bank", createPaymentBank);

module.exports = router;
