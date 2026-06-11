const express = require("express");
const router = express.Router();

const {registerUser,signinuser,verifyregistration,gooleSignIn, verifyuser, forgotPassword, resetPassword, verifySignIn} = require ("../controller/authcontroller")
const {verifytoken} = require("../middleware/verifytoken")


router.post("/register", registerUser);
router.post("/verify-registration", verifyregistration);
router.post("/verify-signin", verifySignIn);
router.post("/google-signin", gooleSignIn);
router.post("/login", signinuser);
router.post("/getuser",verifytoken,verifyuser)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
