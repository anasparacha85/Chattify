const express=require('express');
const router=express.Router()
const AuthController=require('../Controller/AuthControler');
const ProtectedUser = require('../Middleware/ProtectedUser');

router.route("/register").post(AuthController.UserRegister)
router.route("/login").post(AuthController.Login)
router.route('/ForgetPassword').post(AuthController.ForgetPassword)
router.route('/VerifyOtp').post(AuthController.VerifyOtp)
router.route('/UpdatePassword').patch(AuthController.UpdatePassword)
router.route('/AllUsers').get(ProtectedUser,AuthController.AllUsers)
router.route('/GetLoggedInUser').get(ProtectedUser,AuthController.getUserbyId)
module.exports=router