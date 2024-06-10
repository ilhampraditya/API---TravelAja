const express = require("express");
const {
  createSeat,
  getEmptySeatBySeatClassId,
} = require("../../controllers/seat.controller");
const router = express.Router();

router.get("/seat/:id", getEmptySeatBySeatClassId);
router.post("/seat", createSeat);

module.exports = router;
