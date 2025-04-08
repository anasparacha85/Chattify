import React, { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import AuthLeftSide from "../../Components/AuthLeftSIde";

export const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const inputRefs = useRef([]);
  
  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;
    
    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    console.log("OTP Entered:", otpCode);
    
    fetch('http://localhost:5000/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ otp: otpCode }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => res.json())
      .then((data) => {
        console.log(data);
        alert(data.msg || "OTP verification successful.");
      })
      .catch((error) => {
        console.log('Error verifying OTP');
      });
  };

  return (
    <>
      <div className="flex min-h-screen bg-gray-900">
        {/* Left Side - Background Section */}
        <AuthLeftSide />
        
        {/* Right Side - Form Section */}
        <div className="flex items-center justify-center w-full lg:w-1/2 bg-gray-900 p-6">
          <div className="bg-transparent p-8 rounded-lg w-full max-w-md">
            <h2 className="text-3xl font-bold text-red-600 mb-3">OTP Verification</h2>
            <h4 className="text-xl text-red-800 mb-6">Enter the 5-digit OTP sent to your email</h4>
            
            <form onSubmit={handleSubmit} className="space-y-6 text-center">
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    className="w-12 h-12 text-center text-lg font-medium border border-gray-300 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={digit}
                    onChange={(e) => handleChange(index, e)}
                    ref={(el) => (inputRefs.current[index] = el)}
                  />
                ))}
              </div>
              
              <button
                type="submit"
                className="mt-4 block w-full px-4 py-3 border border-gray-300 rounded-[30px] shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Verify OTP
              </button>
            </form>
            
            <p className="mt-6 text-center text-sm text-gray-600">
              Didn't receive the OTP? {" "}
              <button className="text-red-600 hover:text-indigo-500 font-medium">
                Resend OTP
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OTPVerification;
