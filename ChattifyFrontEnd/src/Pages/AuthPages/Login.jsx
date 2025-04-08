import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { LoginUser } from "../../Slices/AuthSlice";


import AuthLeftSide from "../../Components/AuthLeftSIde";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
export const Login = () => {
  
    const [user, setUser] = useState({email:'',password:''})
    const navigate=useNavigate()
      // const {SelectedChat}=useSelector(state=>state.Chat)
      //   const ChatId=SelectedChat
      //   console.log("hello ",ChatId);
   
    const onchange=(e)=>{
        const {name,value}=e.target;
        setUser({...user,[name]:value})

    }
    const {loading,error,User,JwtToken}=useSelector((state)=>state.Auth)
    const dispatch=useDispatch()

  
  const onsubmit=(e)=>{
    e.preventDefault()
  dispatch(LoginUser(user))
  .unwrap()
  .then((data)=>{
    console.log(data);
    if(data.SuccessMessage){
      toast.success(data.SuccessMessage)
      navigate('/Chat')
    }
    if(data.FailureMessage){
      toast.error(data.FailureMessage)
    }
    
  })
  .catch((error)=>{
    toast.error(error.FailureMessage)
    
  })
   
  }
    
  return (
    <>
  
    <div className="flex min-h-screen bg-gray-900">
       
      {/* Left Side - Background Section */}
     
    <AuthLeftSide/>
   
      {/* Right Side - Form Section */}
      <div className="flex items-center justify-center w-full lg:w-1/2 bg-gray-900 p-6">
        <div className="bg-transparent p-8 rounded-lg  w-full max-w-md">
          <h2 className="text-3xl font-bold  text-red-600 mb-3">Hello Again</h2>
          <h4 className="text-xl   text-red-800 mb-6">Welcome back</h4>
          
          <form onSubmit={onsubmit} className="space-y-6">
            <div>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 text-white rounded-[30px] shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your email"
                required
                value={user.email}
               onChange={onchange}
              />
            </div>

            <div>
              <input
                type="password"
                id="password"
                name="password"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-[30px] shadow-sm focus:outline-none text-white  focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your password"
                required
                value={user.password}
                onChange={onchange}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <NavLink to="/forget-password" className="text-sm text-red-600 hover:text-indigo-500">Forgot Password?</NavLink>
            </div>

            <button
              type="submit"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-[30px] shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading?<ClipLoader size={25} loading={loading} color="gray"/>:"  Sign In"}
            
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <NavLink to="/register" className="text-red-600 hover:text-indigo-500 font-medium">
              Sign Up
            </NavLink>
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;
