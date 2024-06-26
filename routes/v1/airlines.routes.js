const router = require("express").Router();
const { image } = require("../../libs/multer");
const {
  getAllAirlines,
  createAirline,
  updateAirline,
} = require("../../controllers/airlines.controllers");
const { restrict } = require("../../middlewares/auth.middleware");

router.get("/airlines", getAllAirlines);
router.post("/airlines", restrict, image.single("file"), createAirline);
router.put("/airlines/:airline_id", restrict, image.single("file"), updateAirline)

module.exports = router;
