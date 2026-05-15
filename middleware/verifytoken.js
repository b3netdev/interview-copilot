const jwt = require("jsonwebtoken");
const AppError = require("../utils/Apperror");

exports.verifytoken = (req, res, next)=>{
    if (
     req.headers.authorization &&
     req.headers.authorization.startsWith("Bearer")
   ) {
     token = req.headers.authorization.split(" ")[1];
   }
 
   if (!token) {
     return next(new AppError("not authenticated", 401));
   }
 
   try {
     const decoded = jwt.verify(token, process.env.JWT_SECRET);
     req.userId = decoded.id;
     next()
   } catch (err) {
     return next(new AppError("Invalid or expired token.", 401));
   }
 }