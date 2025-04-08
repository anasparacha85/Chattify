import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import AuthLeftSide from "../../Components/AuthLeftSIde";


export const UpdatePassword = () => {
  const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    fetch('http://localhost:5000/api/auth/update-password', {
      method: 'POST',
      body: JSON.stringify({ password: passwords.newPassword }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => res.json())
      .then((data) => {
        console.log(data);
        alert(data.msg || "Password updated successfully.");
      })
      .catch((error) => {
        console.log('Error updating password');
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
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Update Password</h2>
            <h4 className="text-xl text-gray-600 mb-6">Enter your new password</h4>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="password"
                  name="newPassword"
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 text-white rounded-[30px] shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="New Password"
                  required
                  value={passwords.newPassword}
                  onChange={handleChange}
                />
              </div>

              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 text-white rounded-[30px] shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Confirm Password"
                  required
                  value={passwords.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              
              <button
                type="submit"
                className="mt-4 block w-full px-4 py-3 border border-gray-300 rounded-[30px] shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdatePassword;