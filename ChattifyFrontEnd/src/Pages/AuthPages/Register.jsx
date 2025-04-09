import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import AuthLeftSide from "../../Components/AuthLeftSIde";
import { useDispatch, useSelector } from "react-redux"
import { RegisterUser,LoginUser } from "../../Slices/AuthSlice";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { setLoading } from "../../Slices/AuthSlice";



const REEGISTER = () => {
    const [register, setregister] = useState({name:'',email:'',password:'',ConfirmPassword:''})
    const navigate=useNavigate()
 const Authstate=useSelector((state)=>state.Auth)
 const dispatch=useDispatch()
 const {user,loading,JwtToken,error}=Authstate;
 console.log(user);
 
//  console.log(Authstate);
 
   const onchange=(e)=>{
    const {name,value}=e.target;
    setregister({...register,[name]:value})

    }
    const onsubmit=(e)=>{
        e.preventDefault();
       dispatch(RegisterUser(register))
       .unwrap()
       .then((data)=>{
        console.log(data);
        if(data.SuccessMessage){
          toast.success(data.SuccessMessage)
          navigate('/')
        }
        if(data.FailureMessage){
          toast.error(data.FailureMessage)
        }
        
       }).catch((error)=>{
        console.log(error);
        
       }).finally(()=>{
        dispatch(setLoading(false))
       })
    }
  return (
   
    <div className="flex min-h-screen bg-gray-900">
      {/* Left Side - Background Section */}
      <AuthLeftSide/>

      {/* Right Side - Form Section */}
      <div className="flex items-center justify-center w-full lg:w-1/2 bg-gray-900 p-6">
        <div className=" p-8 rounded-lg  w-full max-w-md">
        <h2 className="text-3xl font-bold  text-red-600 mb-3">Hello </h2>
        <h4 className="text-xl   text-red-800 mb-6">Signup to get started </h4>
          
          <form onSubmit={onsubmit} className="space-y-6">
            <div>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 text-white rounded-[30px]  shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your full name"
                required
                value={register.name}
                onChange={onchange}
              />
            </div>

            <div>
              <input
                type="email"
                id="email"
                name="email"
                value={register.email}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-[30px] text-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your email"
                required
                onChange={onchange}
              />
            </div>

            <div>
              <input
                type="password"
                id="password"
                name="password"
                value={register.password}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-[30px] text-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder=" password"
                required
                onChange={onchange}
              />
            </div>

            <div>
              <input
                type="password"
                id="ConfirmPassword"
                name="ConfirmPassword"
                value={register.ConfirmPassword}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-[30px] text-white  shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Confirm your password"
                required
                onChange={onchange}
                
              />
            </div>

            <button
              type="submit"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-[30px]  shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading?<ClipLoader size={25} loading={loading} color="gray"/>:"  Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <NavLink to="/" className="text-red-600 hover:text-indigo-500 font-medium">
              Login
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default REEGISTER;
