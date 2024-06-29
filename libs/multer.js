const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const generateFileFilter = (mimetypes) => {
  return (req, file, callback) => {
    if (mimetypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      let err = new Error(`Only ${mimetypes} are allowed to upload!`);
      callback(err, false);
    }
  };
};

module.exports = {
  image: multer({
    fileFilter: generateFileFilter(["image/png", "image/jpg", "image/jpeg"]),
    onError: (err, next) => {
      next(err);
    },
  }),
};
