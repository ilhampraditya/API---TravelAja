const express = require("express");
const {
  createPaymentEwallet,
  createPaymentBank,
  getPayment,
} = require("../../controllers/payment.controller");
const { restrict } = require("../../middlewares/auth.middleware");
const router = express.Router();

router.post("/payment_wallet", restrict, createPaymentEwallet);
router.post("/payment_bank", restrict, createPaymentBank);
router.get("/payment", getPayment);

module.exports = router;
