const express = require("express");
const router = express.Router();

const {
	addResumeData,
	getResumeDetails,
	updateResumeData,
} = require("../controller/resumeController");
const { verifytoken } = require("../middleware/verifytoken");

router.post("/", verifytoken, addResumeData);
router.get("/:id", verifytoken, getResumeDetails);
router.patch("/:id", verifytoken, updateResumeData);

module.exports = router;
