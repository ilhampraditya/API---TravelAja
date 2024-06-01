const express = require("express");
const { restrict } = require("../../middlewares/auth.middleware");
const { getAll, createBooking } = require("../../controllers/booking.controllers");
const router = express.Router();

router.get("/booking", getAll);
router.post("/booking", restrict, createBooking);

module.exports = router;
