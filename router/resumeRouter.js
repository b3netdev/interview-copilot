const express = require("express");
const router = express.Router();

const {
	addResumeData,
	getResumeDetails,
	updateResumeData,
	uploadResumeProfilePhoto,
} = require("../controller/resumeController");
const { verifytoken } = require("../middleware/verifytoken");
const uploadResumePhoto = require("../middleware/resumePhotoUpload");

router.post(
  "/upload-profile-photo",
  verifytoken,
  uploadResumePhoto.single("profilePhoto"),
  uploadResumeProfilePhoto
);
router.post("/", verifytoken, addResumeData);
router.get("/:id", verifytoken, getResumeDetails);
router.patch("/:id", verifytoken, updateResumeData);


module.exports = router;
