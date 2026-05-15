    const express = require("express");
    const router = express.Router();
    const {verifytoken} = require("../middleware/verifytoken")
    const {getQuestionsByExam,getUserExams,getUserAnalytics,checkLongAnswers, getLongQuestions, getMcqQuestionAnswer,uploadQustions,uploadAllAnswers,getSubmittedAnswer, updateExamDetails,uploadExamDetails} = require("../controller/examcontroller")

    router.post("/getmcqquestions",verifytoken,getMcqQuestionAnswer)
    router.post("/uploadquestions",verifytoken,uploadQustions)
    router.post("/uploadanswers",verifytoken,uploadAllAnswers)
    router.post("/uploadexamdetails",verifytoken,uploadExamDetails)
    router.patch("/updateexamdetails/:examId", verifytoken,updateExamDetails)
    router.get("/getanswersbyexam/:examId", verifytoken,getSubmittedAnswer)
    router.get("/getuserexams", verifytoken,getUserExams)
    router.get("/getquestionsbyexam/:examId", verifytoken,getQuestionsByExam)
    router.get("/getuseranalytics", verifytoken,getUserAnalytics)
    router.post("/getlongquestion", verifytoken,getLongQuestions)
    router.post("/checkLongAnswers", verifytoken,checkLongAnswers)

    module.exports = router;