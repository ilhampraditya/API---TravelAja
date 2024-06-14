const express = require("express");
const {
  createSeat,
  getAllSeats,
} = require("../../controllers/seat.controller");
const { restrict } = require("../../middlewares/auth.middleware");
const router = express.Router();

router.get("/seat/:id", getAllSeats);
router.post("/seat", restrict, createSeat);

module.exports = router;
