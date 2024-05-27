const router = require("express").Router();
const{createAirport, getAllAirports, editAirportById, deleteAirport} = require('../../controllers/airport.controller')


router.post('/airport', createAirport)
router.get('/airport', getAllAirports)
router.put('/airport/:airportId', editAirportById);
router.delete('/airport/:airportId', deleteAirport);


module.exports = router