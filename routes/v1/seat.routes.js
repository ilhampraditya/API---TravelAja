const express = require("express");
const {
  createSeat,
  getEmptySeatBySeatClassId,
  getAllseat
} = require("../../controllers/seat.controller");
const router = express.Router();

router.get("/seat/:id", getEmptySeatBySeatClassId);
router.post("/seat", createSeat);
router.get("/seat", getAllseat);

module.exports = router;
