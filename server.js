const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const db_connection = require("./db/db")
const { notFound, errorHandler } = require("./middleware/errorHandler");
const AuthRouter = require("./router/authRouter")
const UserRouter = require("./router/userRouter")
const ExamRouter = require("./router/examRouter")
const app = express();
const path = require("path");
const {getQuestionAnswer} = require("./controller/examcontroller")

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
db_connection(process.env.DBURL)





app.use(morgan("dev"));


app.use(
  cors({
    origin: "*", methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/terms", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "terms.html"));
});
app.get("/privacypolicy", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "privacypolicy.html"));
});
app.get("/reset-password.html", (req, res) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.sendFile(path.join(__dirname, "public", "reset-password.html"));
});



app.use('/api/v1/auth',AuthRouter)
app.use('/api/v1/user',UserRouter)
app.use('/api/v1/exam',ExamRouter)


app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT,  () => {
  //console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV}`);
});
