const express = require("express");
const { restrict } = require("../../middlewares/auth.middleware");
const {
  getAllBooking,
  createBooking,
  getByToken,
  getById,
  BookingProcess,
} = require("../../controllers/booking.controllers");
const router = express.Router();

router.get("/booking", getAllBooking);
router.get("/booking/:id", restrict, getById)
router.get("/mybooking", restrict, getByToken);
router.post("/booking", restrict, createBooking);
router.post("/bookingprocess", restrict, BookingProcess);

module.exports = router;
