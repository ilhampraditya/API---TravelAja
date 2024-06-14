const express = require("express");
const {
  createSeat,
  getAllSeats,
} = require("../../controllers/seat.controller");
const router = express.Router();

router.get("/seat/:id", getAllSeats);
router.post("/seat", createSeat);

module.exports = router;
