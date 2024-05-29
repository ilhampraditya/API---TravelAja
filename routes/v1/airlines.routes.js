const router = require("express").Router();
const airlinesController = require("../../controllers/airlines.controllers");

router.get("/airlines", airlinesController.getAllAirlines);
router.post("/airlines", airlinesController.createAirline);

module.exports = router;
