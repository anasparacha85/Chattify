import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AuthLeftSide from "../../Components/AuthLeftSIde";
import { useDispatch } from "react-redux";
import { ForgetPassword } from "../../Slices/AuthSlice";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate=useNavigate()
  
  const handleChange = (e) => {
    setEmail(e.target.value);
  };
  const dispatch=useDispatch()
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Forgot Password Request:", email);
  dispatch(ForgetPassword(email))
  .unwrap()
  .then((data)=>{
    console.log(data);
    if(data.SuccessMessage){
    alert(data.SuccessMessage)
    navigate('/Otp-Verification')
      
    }
    
  }).catch((error)=>{
console.log(error);

  })
    
   
  };

  return (
    <>
      <div className="flex min-h-screen bg-gray-900">
        {/* Left Side - Background Section */}
        <AuthLeftSide />
        
        {/* Right Side - Form Section */}
        <div className="flex items-center justify-center w-full lg:w-1/2 bg-gray-900 p-6">
          <div className="bg-transparent p-8 rounded-lg w-full max-w-md">
            <h2 className="text-3xl font-bold text-red-600 mb-3">Forgot Password</h2>
            <h4 className="text-xl text-red-800 mb-6">Enter your email to reset your password</h4>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full px-4 py-3 border text-white border-gray-300 rounded-[30px] shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={handleChange}
                />
              </div>
              
              <button
                type="submit"
                className="mt-1 block w-full px-4 py-3 border   border-gray-300 rounded-[30px] shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Reset Password
              </button>
            </form>
            
            <p className="mt-6 text-center text-sm text-gray-600">
              Remember your password? {" "}
              <NavLink to="/" className="text-red-600 hover:text-indigo-500 font-medium">
                Sign In
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
