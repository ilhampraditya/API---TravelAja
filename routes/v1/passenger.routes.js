const express = require("express");
const {
  createPassenger,
  getAllPassenger,
  getByBookingId,
} = require("../../controllers/passenger.controllers");
const { restrict } = require("../../middlewares/auth.middleware");
const router = express.Router();

router.post("/passenger", restrict, createPassenger);
router.get("/passenger", getAllPassenger);
router.get("/passenger/:booking_id", restrict, getByBookingId);

module.exports = router;
