const express = require("express");
const {
  // createPaymentEwallet,
  // createPaymentBank,
  getPayment,
  createPaymentMidtrans,
  webhookNotification
} = require("../../controllers/payment.controller");
const { restrict } = require("../../middlewares/auth.middleware");
const router = express.Router();

// router.post("/payment_wallet", restrict, createPaymentEwallet);
// router.post("/payment_bank", restrict, createPaymentBank);
router.get("/payment", getPayment);
router.post("/payment", createPaymentMidtrans)
router.post("/payment/webhook", webhookNotification)

module.exports = router;
