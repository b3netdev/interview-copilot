const mongoose = require("mongoose");

const db_connection = async (URL) => {
    try{
        await mongoose.connect(URL)
        console.log("Database connected successfully")
    }
    catch(err){
        console.error(err.message)
    }
};

module.exports = db_connection
