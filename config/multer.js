// const multer = require("multer");
// const { v1: uuidv1 } = require("uuid");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/images/uploads");
//   },
//   filename: function (req, file, cb) {
//     const uniqueFilename = uuidv1();
//     cb(null, uniqueFilename + path.extname(file.originalname)); //bas extesion nikaal ke originalfile se new mae me jod diya
//   },
//   //   filename: function (req, file, cb) {
//   //     const uniqueFilename = uuidv1();
//   //     cb(null, uniqueFilename+file.originalname);
//   //   },
// });

// const upload = multer({ storage: storage });
// module.exports = upload;

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Pinterest",
    allowedFormats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });
module.exports = upload;
