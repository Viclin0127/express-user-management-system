require("express-async-errors");

module.exports = function(){
    // TODO: using winston's functions to handle below uncaught error...
    // Uncaught Exception , BUT not for uncaught Promise rejection
    process.on("uncaughtException", (ex) => {
        console.log("error", ex.message, ex);
    });
    // Uncaught Promise Rejection
    process.on("unhandledRejection", (ex)=>{
        console.log("error", ex.message, ex);
    })

    // using winston to store logs
    // winston.add(new winston.transports.File({filename: "logfile.log"}));
    // TODO: winston-mongodb@^5.0.7 -> store logs to Mongodb...
    
    // Also, it's useful on other people's dev environment if we print out our logs
    // winston.add(new winston.transports.Console());
}