const User = require("../Modal/UserModal")
const jwt=require('jsonwebtoken')
require('dotenv').config()
const ProtectedUser=async(req,res,next)=>{
    const token=req.header('Authorization');
    // console.log(token);
    
    const JwtToken=token.replace("Bearer ","").trim();
    if(!JwtToken){
        return res.status(401).json({FailureMessage:"UnAuthorized Access!Token not Provided"})
    }
    try {
        const verification=jwt.verify(JwtToken,process.env.JWT_SECRET_KEY)

        const data=await User.findOne({email:verification.email},{password:0})
    req.user=data;
    req.token=JwtToken;
    req.userId=data._id
    next()
    } catch (error) {
        next(error)
    }

}
module.exports=ProtectedUser