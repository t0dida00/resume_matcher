const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { pdfGuard } = require("../middleware/pdf-guard");
const { reviewCV } = require("../controllers/review.controller");

// POST /api/review  (field "file")
// optional: ?keywords=javascript,node,react
router.post("/review", upload.single("file"), pdfGuard, reviewCV);

module.exports = router;
