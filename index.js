const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const config = require("config");
const users = require("./routes/users");
const auth = require("./routes/auth");
const error = require("./middlewares/error");
const express = require("express");
const mongoose = require("mongoose");

const app = express();

// TODO: handle uncaught exception

// use middleware and routes
app.use(express.json());    // to read json format
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use(error);

// connect to DB
//Assign MongoDB connection string to Uri and declare options settings
const uri = "mongodb+srv://yuanhungl:claire0509@freecluster.hvrip.mongodb.net/userSystem?retryWrites=true&w=majority";

// Declare a variable named option and assign optional settings
const  options = {
    useNewUrlParser:  true,
    useUnifiedTopology:  true,
    useFindAndModify: false
};
// Connect MongoDB Atlas using mongoose connect method
mongoose.connect(uri, options)
    .then(() => console.log("Database connection established..."))
    .catch(err => console.log("Error connecting...", err));

// check our private key
if(!config.get("jwtPrivateKey")){
    console.error("FATAL ERROR: jwtPrivateKey is not defined...");
    process.exit(1);
    
    // TODO: store in our logs
    // throw new Error("FATAL ERROR: jwtPrivateKey is not defined...");
}

// TODO: production level security stuffs


// PORT
const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`Listen on port ${port}...`)
});