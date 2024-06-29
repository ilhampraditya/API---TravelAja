const express = require("express");
const {
  getPayment,
  createPaymentMidtrans,
  webhookNotification,
} = require("../../controllers/payment.controller");
const { restrict } = require("../../middlewares/auth.middleware");
const router = express.Router();

router.get("/payment", getPayment);
router.post("/payment", createPaymentMidtrans);
router.post("/payment/webhook", webhookNotification);

module.exports = router;
