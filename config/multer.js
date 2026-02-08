const multer = require("multer");
const path = require("path");
const { v1: uuidv1 } = require("uuid");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueFilename = uuidv1();
    cb(null, uniqueFilename + path.extname(file.originalname)); //bas extesion nikaal ke originalfile se new mae me jod diya
  },
});

const upload = multer({ storage });
module.exports = upload
