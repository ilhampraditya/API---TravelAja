const express = require("express");
const router = express.Router();
const {
  getAllFlights,
  getFlightById,
  createFlight,
  searchFlight,
} = require("../../controllers/flights.controller");


router.get("/flights", getAllFlights);
router.get("/flights/:id", getFlightById);
router.post("/flights", createFlight);
router.post("/search", searchFlight)

module.exports = router;
