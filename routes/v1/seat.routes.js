const express = require("express");
const {
  getAllSeatBySeatClassId,
  createSeat,
} = require("../../controllers/seat.controller");
const router = express.Router();

router.get("/seat/:id", getAllSeatBySeatClassId);
router.post("/seat", createSeat);

module.exports = router;
