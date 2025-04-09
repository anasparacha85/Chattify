const User=require('../Modal/UserModal')
require('dotenv').config()
const jwt=require('jsonwebtoken')
const passport=require('passport')
const transporter=require('../Middleware/transporter')
const bcrypt=require('bcrypt')
const UserRegister=async (req,res)=>{
    try{
    const {name,email,password,ConfirmPassword}=req.body;
    console.log(password,ConfirmPassword);
    
    const finduser=await User.findOne({email});
    // console.log(finduser);
    
    if(finduser){
        return res.status(401).json({FailureMessage:'User Already Exists'})
    }
    if(password!=ConfirmPassword){
        return res.status(401).json({FailureMessage:'Please ReWrite the Confrim password'})
    }
    const data=await User.create({name,email,password,ConfirmPassword})
    res.status(200).json({SuccessMessage:'User Registered Syccessfully',token:await data.generateToken()})  
    }
    catch(error){
        console.log('internal server error',error);
        
res.status(500).json({FailureMessage:'Internal server error'})
    }
}
const AdminRegister=async (req,res)=>{
    try {
        const {name,email,password,ConfirmPassword,AdminKey}=req.body;
        console.log(process.env.ADMIN_SECRET_KEY);
        const user=await User.findOne({email:email})
        
        if(user){
            return res.status(401).json({FailureMessage:'User Already Registered!'})
        }
        if(password!=ConfirmPassword){
            return res.status(401).json({FailureMessage:'Please Rewrite The Same Password!'})
        }
       if(AdminKey!=process.env.ADMIN_SECRET_KEY){
        return res.status(403).json({FailureMessage:"Not Applicable Admin Key..You Can't Register as an Admin!"})
       }
       const resgiter=await User.create({name,email,password,ConfirmPassword,role:'Admin'})
       res.status(200).json({SuccessMessage:'You have Registered as an Admin Successfully!',token:await resgiter.generateToken()})
        
    } catch (error) {
        res.status(500).json({FailureMessage:'Internal Server error from AdminSignup '})
        console.log("Admin sign up error",error);
        
        
    }
}

const Login=async (req,res)=>{
    try {
        const {email,password}=req.body;
        const user=await User.findOne({email:email})
        if(!user){
            return res.status(401).json({FailureMessage:"User not Exists"})
        }
        const comparepassword=await user.comparePassword(password)
        if(!comparepassword){
            return res.status(401).json({FailureMessage:"Invalid Credentials"})
        }
        res.status(201).json({SuccessMessage:"Login SuccessFull",token:await user.generateToken()})
    } catch (error) {
        res.status(500).json({FailureMessage:'Internal Server error  '})
        console.log(" error",error);
        
        
    }

      
    }

  



const ForgetPassword=async(req,res)=>{
    try {
        const otp = Math.floor(10000 + Math.random() * 90000); // Generate OTP
        console.log('Generated OTP:', otp);

       console.log(req.body.email);
       const {email}=req.body;
       const user=await User.findOne({email})
       if(!user){
        return res.status(400).json({FailureMessage:"Email not Registered"})
       }
       const token=jwt.sign({id:user._id,email:user.email,otp:user.otp},process.env.OTP_TOKEN,{expiresIn:'15m'})
       const info = await transporter.sendMail({
        from: '"AnasInternee.pk" <amiranas761@gmail.com>', // Sender info
        to: email,                                    // Recipient email
        subject: 'Password Reset Code',
        text: `Your OTP is: ${otp}`,
        html: `<p>Hi ${user.name},</p><p>Your OTP for password reset is: <strong>${otp}</strong></p>`,
    });

    console.log('Email sent:', info.messageId);
    if(info.messageId){
        const updatedUser = await User.findOneAndUpdate(
            { email: user.email },
            { $set: { otp: otp } },
            { new: true }
        );
        let findupd=await User.findOne({email:user.email})
        // console.log(findupd);
        
        res.status(200).json({SuccessMessage:"Password Reset Email sent",token})
    }
       
    } catch (error) {
        console.log(error);
        
        res.status(500).json({FailureMessage:"Internal server error"})
        
    }
}

const VerifyOtp=async(req,res)=>{
    try {
        const { otp } = req.body;
        console.log(otp);
        
        const decodedtoken = req.token;
        // console.log(decodedtoken.email);
        
        console.log();
        
        const user=await User.findOne({ email: decodedtoken.email ,otp:parseInt(otp)});
      console.log(user);
      
        
        if (!user) {
            return res.status(404).json({ FailureMessage: "Invalid OTP" });
        }
        //  Clear OTP after successful verification
         await User.updateOne({ email: decodedtoken.email }, { $unset: { otp: "" } });
         let upd=await User.findOne({ email: user.email });
         console.log(upd);
         
         
        
          res.status(200).json({ SuccessMessage: "otp Matched" });
        
          
     } 
    catch (error) {
        console.log(error);
        
        res.status(500).json({FailureMessage:"Internal Server Error"})
        
    }
}


const UpdatePassword = async (req, res) => {
    try {
        const { newPassword, confirmNewPassword } = req.body;

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ FailureMessage: "Passwords not matched" });
        }

        const decodedtoken = req.token;
        const user = await User.findOne({ email: decodedtoken.email });

        if (!user || (user.otp && user.otp !== "")) {
            return res.status(401).json({ FailureMessage: "Invalid user or OTP!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const updatedUser = await User.updateOne(
            { email: decodedtoken.email },
            { $set: { password: hashedPassword } }
        );

        if (updatedUser.modifiedCount === 0) {
            return res.status(400).json({ FailureMessage: "Password not changed" });
        }

        res.status(200).json({ SuccessMessage: "Password Updated Successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ FailureMessage: "Internal Server Error" });
    }
};

const AllUsers=async(req,res)=>{
    try {
        const query=req.query;
        const keyword=query.search?{
            $or:
            [
            {
                email:{$regex:query.search,$options:"i"}
            },
            {
                name:{$regex:query.search,$options:"i"}
            }
        ]
        }:{};
        const users=await User.find(keyword);
        if(!users){
            return res.status(400).json({FailureMessage:"No Users Found"})
        }
        res.status(200).json(users)

    } catch (error) {
        res.status(500).json({FailureMessage:"Internal server error"})
        
    }

}

const getUserbyId=async(req,res)=>{
    try {
        const user=req.user;
        const Userdata=await User.findOne({email:user.email},{password:0})
        if(!Userdata){
            return res.status(400).json({FailureMessage:"User not found"})
        }
        res.status(200).json(Userdata)
    } catch (error) {
        res.status(500).json({FailureMessage:"Internal server error"})
        
    }

}






module.exports={UserRegister,AdminRegister,Login,ForgetPassword,VerifyOtp,UpdatePassword,AllUsers,getUserbyId}
