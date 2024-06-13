const express = require("express");
const router = express.Router();
const {
  getAllPromo,
  createPromotion,
} = require("../../controllers/promotions.controllers");
const { restrict } = require("../../middlewares/auth.middleware");

router.get("/promotion", getAllPromo);
router.post("/promotion", restrict, createPromotion);

module.exports = router;
