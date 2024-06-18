const express = require("express");
const { restrict } = require("../../middlewares/auth.middleware");
const {
  getAllBooking,
  createBooking,
  getBookingById,
  BookingProcess,
  bookingHistory,
} = require("../../controllers/booking.controllers");
const router = express.Router();

router.get("/booking", getAllBooking);
router.get("/booking/id/:id", restrict, getBookingById)
router.get("/booking/history", restrict, bookingHistory);
router.post("/booking", restrict, createBooking);
router.post("/booking/process", restrict, BookingProcess);

module.exports = router;
