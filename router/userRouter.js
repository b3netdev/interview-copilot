const express = require("express");
const router = express.Router();
const {updateuser,resumeUpload,deleteResume,deleteuserAccount} = require("../controller/usercontroller")
const {verifytoken} = require("../middleware/verifytoken")
const uploadResume = require("../middleware/uploadResume")

router.patch("/update",verifytoken,updateuser)
router.patch("/uploadresume",verifytoken, uploadResume, resumeUpload)
router.delete("/deleteresume",verifytoken,deleteResume)
router.patch("/deleteuser",verifytoken,deleteuserAccount)



module.exports = router;