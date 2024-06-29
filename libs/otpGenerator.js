const { randomInt } = require("crypto");

const generateOTP = () => {
  return randomInt(100000, 999999);
};

module.exports = { generateOTP };
