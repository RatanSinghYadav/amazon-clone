const jwt = require("jsonwebtoken");
const USER  = require('../models/userSchema')

const secretKey = "abcdefghijklmnopqrstuvwxyzabcdef";

const authenticate = async(req,res,next)=>{
    try {
        
        const token = req.cookies.AmazonWeb;
        const verifyToken = await jwt.verify(token,secretKey); 
        console.log(verifyToken);

        const rootUser = await USER.findOne({_id:verifyToken._id,'tokens.token':token});
        console.log(rootUser);

        if(!rootUser){
            throw new Error("user not found");
        }
        req.token = token
        req.rootUser = rootUser
        req.userID = rootUser._id

        next();

    } catch (error) {
        res.status(401).send("Unauthorized: No token provided")
        console.log(error);
    }
};

module.exports = authenticate;
