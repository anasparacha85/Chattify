import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

const CreateGroupModal = ({ users, onClose }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [loading, setloading] = useState(false)

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };
  const {Users,JwtToken}=useSelector((state)=>state.Auth)
  console.log("group",Users);
  
console.log(selectedUsers);

  const handleCreateGroup = () => {
    
    if (!groupName || selectedUsers.length < 2) {
      alert("Please enter a group name and select at least two users.",);
      return;
    }
    setloading(true)
    fetch(`${import.meta.env.VITE_BASE_URL}/api/chat/CreateGroup`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        "Authorization":`Bearer ${JwtToken}`
      },
      body:JSON.stringify({GroupName:groupName,users:selectedUsers})
    }).then((response)=>{
      return response.json()

    }).then((data)=>{
      if(data.SuccessMessage){
        toast.success(data.SuccessMessage)
      }
      if(data.FailureMessage){
        toast.error(data.FailureMessage)
      }
      
    }).catch((error)=>{
      toast.error(error.FailureMessage)
      
    }).finally(()=>{
      setloading(false)
    })

    // const newGroup = {
    //   id: Date.now(),
    //   name: groupName,
    //   members: selectedUsers,
    // };

    // console.log("Group Created:", newGroup);
    // onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/5 flex items-center justify-center">
      <div className="bg-gray-900 p-6 rounded-lg w-96 text-white">
        <h2 className="text-xl font-bold mb-4">Create Group Chat</h2>

        {/* Group Name Input */}
        <input
          type="text"
          placeholder="Enter Group Name"
          className="w-full p-2 rounded-md bg-gray-800 text-white mb-3 focus:outline-none"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        {/* User List for Selection */}
        <div className="max-h-60 overflow-y-auto space-y-2">
          {Users.map((user) => (
            <label key={user.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-800 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedUsers.includes(user._id)}
                onChange={() => toggleUserSelection(user._id)}
                className="form-checkbox text-indigo-500"
              />
              <img src={user.profilePicture} alt={user.name} className="w-8 h-8 rounded-full" />
              <span>{user.name}</span>
            </label>
          ))}
        </div>

        {/* Buttons */}
        <div className="mt-4 flex justify-between">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-md">
            Cancel
          </button>
          <button onClick={handleCreateGroup} className="px-4 py-2 bg-indigo-500 text-white rounded-md">
            {loading?<ClipLoader loading={loading} size={25} color="white"/>:" Create Group"}
           
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
