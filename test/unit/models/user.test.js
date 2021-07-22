const mongoose = require("mongoose");
const {User} = require("../../../models/user");
const jwt = require("jsonwebtoken");
const config = require("config");

describe("user.generateAuthToken", ()=>{
    it("should return a valid JSON Web Token", ()=>{
        // jwt convert ObjectId to HexString
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: false
        };
        const user = new User(payload);
        const token = user.generateAuthToken();

        const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
        
        expect(decoded).toMatchObject(payload);
    });
});