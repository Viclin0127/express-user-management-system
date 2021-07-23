const {User, validateUser, validateUserWithoutPassword} = require("../models/user");
const bcrypt = require("bcrypt");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const validateObjectId = require("../middlewares/validateObjectId");
const express = require("express");
const router = express.Router();

// API METHODS

// GET
// a logged-in user can get all users
router.get("/", auth, async (req,res) => {
    const users = await User.find().select("-password").sort("name");
    res.send(users);
});

// POST
// register a user
router.post("/", async (req,res)=>{
    // validate input
    const {error} = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check if the user exists (email)
    var user = await User.findOne({email: req.body.email});
    if (user) return res.status(400).send("This email has been used...try again");

    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    // hash user password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    // provide json web token for security
    const token = user.generateAuthToken();
    res.header("x-auth-token", token).send({name: user.name, email: user.email});
});

// PUT
// update user name/email (only admin)
router.put("/:id", [auth, admin, validateObjectId], async (req,res)=>{
    // check if the user exists
    var user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).send("User not found...");

    // validate the input
    const {error} = validateUserWithoutPassword(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // update user
    user.set({
        name: req.body.name,
        email: req.body.email
    });
    await user.save(user);

    res.send(user);
});

// PUT
// update myself
router.put("/update/myself", auth, async (req,res)=>{
    // use x-auth-token to find the user
    var user = await User.findById(req.user._id).select("-password");

    // validate the input
    const {error} = validateUserWithoutPassword(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // update user
    user.set({
        name: req.body.name,
        email: req.body.email
    });
    await user.save(user);

    res.send(user);
});

// DELETE
// only admin user can delete an user
router.delete("/:id", [auth, admin, validateObjectId], async (req,res) =>{
    // Look for the user and remove it
    const user = await User.findByIdAndRemove(req.params.id);
    if(!user) return res.status(404).send("User not found...");

    res.send(user);
})

module.exports = router;