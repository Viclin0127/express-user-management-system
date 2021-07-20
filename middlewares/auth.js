const jwt = require("jsonwebtoken");
const config = require("config");

// Authorization middleware
const auth = (req,res,next) => {
    // first check if there is an x-auth-token header
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).send("Access denied, no token provided...");

    try{
        // verify json web token is valid or not
        const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
        req.user = decoded; // decoded = {_id: user._id, isAdmin: user.isAdmin}

        next(); // call next process
    }
    catch(ex){
        res.status(400).send("Invalid token...");
    };
};

module.exports = auth;