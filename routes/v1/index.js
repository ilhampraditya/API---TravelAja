const express = require("express");
const router = express.Router();
const User = require("../v1/user.route")
const Airport = require("../v1/airport.route")
const swaggerUI = require("swagger-ui-express");
const YAML = require("yaml");
const fs = require("fs");
const path = require("path");

const swagger_path = path.resolve(__dirname, "../../docs/openapi.yaml");
const file = fs.readFileSync(swagger_path, "utf-8");

// API Docs
const swaggerDocument = YAML.parse(file);
router.use("/api/v1/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

router.use("/api/v1", User);
router.use("/api/v1", Airport);


module.exports = router