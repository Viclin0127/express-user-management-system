// TODO: use winston to store errors in logs

module.exports = function (err,req,res,next){
    // Log the exception on the server
    // level: error/warn/info/verbose/debug/silly
    console.log("error: ", err.message, err);

    res.status(500).send("Something failed...");
}