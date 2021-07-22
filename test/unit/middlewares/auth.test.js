const {User} = require("../../../models/user");
const mongoose = require("mongoose");
const auth = require("../../../middlewares/auth");

describe("auth middleware", ()=>{

    it("should populate req.user with the payload of a valid JWT ", ()=>{
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: false
        }
        const token = new User(payload).generateAuthToken();

        // in order to test auth(req,res,next), we need to to generate mock elements
        const req = {
            header: jest.fn().mockReturnValue(token)
        }
        const res = {}
        const next = jest.fn();

        auth(req,res,next);

        expect(req.user).toMatchObject(payload);
    });
})