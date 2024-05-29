const express = require("express");
const router = express.Router();
const {
  getAllPromo,
  createPromotion,
} = require("../../controllers/promotions.controllers");

router.get("/promotion", getAllPromo);
router.post("/promotion", createPromotion);

module.exports = router;
