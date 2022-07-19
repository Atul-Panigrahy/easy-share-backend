const multer = require("multer");
const path = require("path");
const File = require("../models/file");
const { v4: uuid4 } = require("uuid");

let storage = multer.diskStorage({
  destination: (req, file, callback) => {
    return callback(null, "uploads/");
  },
  filename: (req, file, callback) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    return callback(null, uniqueName);
  },
});

let upload = multer({
  storage: storage,
  limits: {
    fileSize: 1e6 * 100,
  },
}).single("myfile");

module.exports.uploadFile = (req, res) => {
  // store File

  upload(req, res, async (error) => {
    // Validate request
    if (!req.file) {
      return res.status(404).json({
        error: "Please Upload a File!",
      });
    }

    if (error) {
      return res.status(500).json({ error });
    }

    //store into Database
    const file = new File({
      filename: req.file.filename,
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size,
    });

    const response = await file.save();

    //Response->Link
    return res.status(200).json({
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
    });
  });
};
