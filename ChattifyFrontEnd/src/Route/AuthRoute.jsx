import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'

export const AuthRoute = () => {
 const navigate=useNavigate()
 const {JwtToken}=useSelector((state)=>state.Auth);
 useEffect(()=>{
    if(JwtToken){
        navigate('/Chat')
    }
    else{
        navigate('/')
    }
 },[JwtToken,navigate])
 return <Outlet/>
    
 
}

export default AuthRoute
