const express = require("express");
const router = express.Router();
const User = require("../v1/user.routes");
const Airport = require("../v1/airport.routes");
const Airlines = require("../v1/airlines.routes");
const Flight = require("../v1/flights.routes");
const Promotion = require("../v1/promotion.routes");
const Seatclass = require("../v1/seatclass.routes");

const swaggerUI = require("swagger-ui-express");
const YAML = require("yaml");
const fs = require("fs");
const path = require("path");

const swagger_path = path.resolve(__dirname, "../../docs/openapi.yaml");
const file = fs.readFileSync(swagger_path, "utf-8");

// API Docs
const swaggerDocument = YAML.parse(file);
router.use(
  "/api/v1/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocument)
);

router.use("/api/v1", User, Airport, Airlines, Flight, Promotion, Seatclass);

module.exports = router;
