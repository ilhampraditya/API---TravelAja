const express = require("express");
const router = express.Router();
const {
  getAllFlights,
  getFlightById,
  createFlight,
} = require("../../controllers/flights.controller");

router.get("/flights", getAllFlights);
router.get("/flights/:id", getFlightById);
router.post("/flights", createFlight);

module.exports = router;
