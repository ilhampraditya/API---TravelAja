const router = require("express").Router();
const airportController = require('../../controllers/airports.controllers');

router.get('/airport', airportController.getAllAirports);
router.get('/airport/:id', airportController.getAirportById);
router.post('/airport', airportController.createAirport);

module.exports = router;
