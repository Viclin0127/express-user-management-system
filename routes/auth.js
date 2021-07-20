const {User} = require("../models/user");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

// Authentication (Login function)
// check if username and password are correct, also provide auth-token (Logout usually implement in frontend)

// POST
router.post("/", async (req,res)=>{
    // validate input
    const {error} = validateAuth(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check if the user exists or not
    var user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send("Invalid email or password...");

    // check password
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) return res.status(404).send("Invalid email or password...");

    // All correct, send back auth-token to the user
    const token = user.generateAuthToken();

    res.send(token);
});

// new validation function for auth
const validateAuth = (reqBody)=>{
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    })
    return schema.validate(reqBody);
};

module.exports = router;