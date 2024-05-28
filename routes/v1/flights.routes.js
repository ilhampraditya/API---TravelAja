const express = require('express');
const router = express.Router();
const flightController = require('../../controllers/flights.controller');

router.get('/flights', flightController.getAllFlights);
router.get('/flights/:id', flightController.getFlightById);
router.post('/flights', flightController.createFlight);

module.exports = router;
