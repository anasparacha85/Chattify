import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFilterUser } from '../../Slices/AuthSlice'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'

const RemoveFromGroupModal = ({chatId,onremove}) => {
  const {JwtToken,filteruser}=useSelector((state)=>state.Auth)
  const [loading, setloading] = useState(false)
  const dispatch=useDispatch()
   const removegroup=(UserID)=>{
    setloading(true)
    console.log("chatid hon mai",chatId);
    
        fetch(`${import.meta.env.VITE_BASE_URL}/api/chat/RemoveMemberFromGroup/${UserID}/${chatId}`,{
          method:'PATCH',
          headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${JwtToken}`
          }
  
            
          
        }).then((res)=>{
          return res.json()
        }).then((data)=>{
          console.log("removegrp data",data);
          if(data.SuccessMessage){
             toast.success(data.SuccessMessage)
            
             dispatch(setFilterUser(data.updatedchat))
             console.log(filteruser);
            
            
          }
          if(data.FailureMessage){
            toast.error(data.FailureMessage)
            dispatch(setFilterUser([]))
          }
          
          
        }).catch((error)=>{
        toast.error(error.FailureMessage)
          
        }).finally(()=>{
          setloading(false)
        })
  
      }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-gray-800 p-6 rounded-lg w-96">
        <h2 className="text-lg font-bold text-white mb-4">Remove Member</h2>
        {loading?<div className='w-full h-full flex justify-center items-center'><ClipLoader size={25 } color='gray' loading={loading}/></div>:
        <ul>
        {filteruser?.users.map((member) => (
            <li key={member._id} className="flex justify-between items-center py-2 border-b border-gray-600">
                <span className="text-white">{member.name}</span>
                <button onClick={()=>removegroup(member._id)} className="bg-red-500 px-2 py-1 text-white rounded-md">Remove</button>
            </li>
        ))}
    </ul>}
        
        <button className="mt-4 bg-red-500 px-4 py-2 text-white rounded-md w-full" onClick={onremove}>close</button>
    </div>
</div>
  )
}

export default RemoveFromGroupModal
