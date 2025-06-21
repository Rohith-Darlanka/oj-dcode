const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()

const Dbconnection = async()=>{
   const MONGO_URI = process.env.MONGO_URI;
    try {
        await mongoose.connect(MONGO_URI );
        console.log("DB connection extablished");
    } catch(error){
        console.log("Error While Connecting to MongoDb",error);
    }
};

module.exports = {Dbconnection}