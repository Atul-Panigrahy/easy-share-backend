const router = require("express").Router();
const { uploadFile } = require("../controllers/uploadFile.js");
const { showFile } = require("../controllers/showFile.js");
const { downloadFile } = require("../controllers/downloadFile");

router.post("/api/files", uploadFile);
router.get("/files/:uuid", showFile);
router.get("/files/download/:uuid", downloadFile);

module.exports = router;
