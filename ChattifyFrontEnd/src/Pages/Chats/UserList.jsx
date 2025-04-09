import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAllUsers, setUser } from "../../Slices/AuthSlice";
import { setUsers } from "../../Slices/AuthSlice";
import { setChats } from "../../Slices/AuthSlice";
import { FetchAllUsers } from "../../Slices/AuthSlice";
import { Bell, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { setSelectedChat } from "../../Slices/ChatSlice";
import { setNotifications } from "../../Slices/ChatSlice";
import { setNotifyCount } from "../../Slices/ChatSlice";

const UserList = ({ onSelectChat, onCreateGroup }) => {
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [users, setusers] = useState([])
  const {JwtToken,Users,User,Groups,AllUsers}=useSelector((state)=>state.Auth)
  const [notificationmodalopen, setnotificationmodalopen] = useState(false)
  const {notifications,SelectedChat, NotifyCount}=useSelector((state)=>state.Chat)


  
  
  const dispatch=useDispatch()
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/chat/FetchAllChats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${JwtToken}`,
      }
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log("Fetched Chats:", data);
        dispatch(setUsers(data)); // This will now handle both users and groups
      })
      .catch((err) => console.error("Error fetching chats:", err));
  }, [User]);
  const handleSearch = (e) => {
    const query = e.target.value;;
    setSearch(query);
    dispatch(FetchAllUsers({jwttoken:JwtToken,query:query}))
   
    // fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/AllUsers?search=${query}`,{
    //   method:'GET',
    //   headers:{
    //     'Authorization':`Bearer ${JwtToken}`,
    //     'Content-Type':'application/json'
    //   }
    // }).then((res)=>{
    //   return res.json()
    // }).then((data)=>{
    //   //  console.log("baby",data);
    //   dispatch(setAllUsers(data))
    //   console.log(users,"kak");
      
     
    
 
      
    // })

  };
  useEffect(()=>{
    if(search.length>0){
      setShowOverlay(true);
   
      setFilteredUsers(AllUsers.filter((user) => user.name));
    
    } else {
      setShowOverlay(false);
    }
  },[AllUsers])
  

  const onclick=(id) => {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/chat/AccessChat/${id}`,{
      method:'POST',
      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${JwtToken}`
      }
    }).then((res)=>{
      return res.json()
    }).then((data)=>{
       console.log("selected chat data",data);
      if(data.SuccessMessage){
        // console.log(data.Chats[0]._id);
        // console.log(data.Chats[0].users);
        // console.log("jajaj",data);
        
    //  
      
        onSelectChat(data.Chats);
        
        dispatch(setChats(data.Chats))
        

     setShowOverlay(false);
      }             
        })
         
     
   
  }
  
Groups.map((value)=>{
  // console.log(value._id);
  
})

  const onfetchgroupchat=(id)=>{
    fetch(`${import.meta.env.VITE_BASE_URL}/api/chat/FetchGroupChat/${id}`,{
      method:'GET',
      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${JwtToken}`
      }
    }).then((res)=>{
      return res.json()
    }).then((data)=>{
       console.log("grppp",data);
       onSelectChat(data);
      dispatch(setChats(data))
      
    })
  }

  const ongroupnotificationclick=(value)=>{
    const data=[value.chat]
    console.log(data);
    onSelectChat(data)
    
    

  }
 
  
  useEffect(() => {
    console.log("i am a notify",notifications);
  if(notifications?.length){
    dispatch(setNotifyCount(notifications?.length))
  }
  else{
    dispatch(setNotifyCount(0))
  }

  }, [notifications])
  

  
  return (
    <div className=" w-full  border-r border-gray-700 p-4 overflow-y-auto bg-black h-screen">
      {/* Top bar with title and notification */}
<div className="flex items-center justify-between px-4 mb-4">
  <h2 className="text-xl font-bold">Messages</h2>
  <button className="relative" onClick={()=>{
    setnotificationmodalopen(!notificationmodalopen)
    if (!notificationmodalopen) {
      // Reset notifications only when opening
      dispatch(setNotifyCount(0))
      
    }
  }
} >
    <Bell className="text-white hover:text-indigo-400 transition" size={22} />
    {/* Example red dot */}
    <span className="absolute top-3 -right-3  w-5 h-5 flex items-center justify-center bg-red-400  text-white rounded-full">{NotifyCount}</span>
  </button>
</div>
{notificationmodalopen&&<div className=" top-32 left-0 w-full bg-gray-900 p-4 rounded-lg shadow-lg">
  {!notifications.length?"No Notification to show":
notifications.map((value)=>(
  
value.chat.isGroupChat? <div onClick={()=>ongroupnotificationclick(value)
} className="py-2 px-3 bg-blue-700 my-2 rounded-[15px]">New Message in group {value.chat.ChatName}</div>:<div onClick={()=>onSelectChat([value.chat])}  className="py-2 px-3 bg-gray-700 my-2 rounded-[15px]">New Message from {value.Sender.name}</div>))
}</div>}
     
      
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search users..."
        className="w-full p-2 rounded-md bg-gray-800 text-white mb-3 focus:outline-none"
        value={search}
        onChange={handleSearch}
      />

      {/* Overlay for Search Results */}
      {showOverlay && (
        <div className="absolute top-32 left-0 w-full bg-gray-900 p-4 rounded-lg shadow-lg">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user._id} className="flex items-center p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition">
                <img src={user.profilePicture} alt={user.name} className="w-10 h-10 rounded-full" />
                <span className="ml-4 text-lg">{user.name}</span>
                <button
                 onClick={()=>onclick(user._id)}
                  className="ml-auto px-4 py-2 bg-indigo-500 text-white rounded-md"
                >
                  Create Chat
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No users found</p>
          )}
        </div>
      )}

     {/* User List */}
<div className="space-y-4">
<div className="space-y-4">
  <h2 className="text-lg font-semibold text-gray-300">Private Chats</h2>
  {Users?.map((user) => (
    <div 
      key={user._id} 
      className="flex items-center p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition" 
      onClick={() => onclick(user._id)}
    >
      <img src={user.profilePicture} alt={user.name} className="w-12 h-12 rounded-full" />
      <span className="ml-4 text-lg">{user.name}</span>
    </div>
  ))}
</div>

{/* ✅ Show Groups */}
<div className="space-y-4 mt-6">
  <h2 className="text-lg font-semibold text-gray-300">Group Chats</h2>
  {Groups?.map((group) => (
    <div 
      key={group._id} 
      className="flex items-center p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition bg-gray-400 mb-4 " 
      onClick={() => onfetchgroupchat(group._id)}
    >
      <span className="text-lg font-bold text-gray-100 ">{group.ChatName}</span>
    </div>
  ))}
</div>

</div>
<button
        onClick={onCreateGroup}
        
      
        className="ml-auto px-4 py-2 bg-indigo-500 text-white rounded-md"
      >
        Create Group Chat
      </button>
      <div className="mt-10 border-t border-gray-700 pt-4">
  <Link to='/Logout' >
  <button
   
    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition"
  >
    <LogOut size={18} />
    Logout
  </button></Link>
  
</div>
</div>
  );
};

export default UserList;
