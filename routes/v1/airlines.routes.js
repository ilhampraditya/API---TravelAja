const router = require("express").Router();
const airlinesController = require('../../controllers/airlines.controllers');

router.get('/airlines', airlinesController.getAllAirlines);
router.get('/airlines/:id', airlinesController.getAirlineById);
router.post('/airlines', airlinesController.createAirline);

module.exports = router;
