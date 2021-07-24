// if the jwt token doesn't have isAdmin
const admin = (req,res,next)=>{
    if(!req.user.isAdmin){
        if(req.user._id !== req.params.id) return res.status(403).send("Access denied...");
    };
    next();
}

module.exports = admin;