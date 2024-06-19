const express = require("express");
const router = express.Router();
const {
  getAllFlights,
  getPromotion,
  getFlightById,
  createFlight,
  searchFlight,
} = require("../../controllers/flights.controller");
const { restrict } = require("../../middlewares/auth.middleware");


router.get("/flights", getAllFlights);
router.get("/flights/promotion", getPromotion);
router.get("/flights/:id", getFlightById);
router.get("/flights/id/:id", getFlightById);
router.post("/flights", restrict, createFlight);
router.get("/flights/search", searchFlight)

module.exports = router;
