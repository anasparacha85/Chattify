import React, { useEffect } from 'react'
import { LogoutTrue } from '../../Slices/AuthSlice'
import { useDispatch } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { setSelectedChat } from '../../Slices/ChatSlice'
const Logout = () => {
const dispatch=useDispatch()



useEffect(()=>{
    dispatch(LogoutTrue())
    dispatch(setSelectedChat([]))
},[LogoutTrue])
return <Navigate to='/'/>

  
}

export default Logout
