const router = require("express").Router();
const { uploadFile } = require("../controllers/uploadFile.js");

router.post("/api/files", uploadFile);

module.exports = router;
