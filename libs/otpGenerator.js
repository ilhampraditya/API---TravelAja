const { randomInt } = require('crypto');

// Function to generate OTP
const generateOTP = () => {
  return randomInt(100000, 999999);
};

module.exports = { generateOTP };
