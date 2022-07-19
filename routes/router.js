const router = require("express").Router();
const { uploadFile } = require("../controllers/uploadFile.js");
const { showFile } = require("../controllers/showFile.js");

router.post("/api/files", uploadFile);
router.get("/files/:uuid", showFile);

module.exports = router;
