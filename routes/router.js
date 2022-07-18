const router = require("express").Router();
const handler = require("../controllers/controller.js");

router.post("/", handler.uploadFile);

module.exports = router;
