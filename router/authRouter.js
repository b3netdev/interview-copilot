const express = require("express");
const router = express.Router();

const {registerUser,signinuser, verifyuser, forgotPassword, resetPassword} = require ("../controller/authcontroller")
const {verifytoken} = require("../middleware/verifytoken")


router.post("/register", registerUser);
router.post("/login", signinuser);
router.post("/getuser",verifytoken,verifyuser)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
