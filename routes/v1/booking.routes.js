const express = require("express");
const { restrict } = require("../../middlewares/auth.middleware");
const {
  getAllBooking,
  createBooking,
  getByToken,
} = require("../../controllers/booking.controllers");
const router = express.Router();

router.get("/booking", getAllBooking);
router.get("/mybooking", restrict, getByToken);
router.post("/booking", restrict, createBooking);

module.exports = router;
