import React, { useState } from 'react';
import { useEffect } from 'react';
import { FiSend, FiUserPlus, FiUserMinus, FiUsers } from 'react-icons/fi'; // ✅ Added icons
import { IoMdArrowBack } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { setFilterUser } from '../../Slices/AuthSlice';
import RemoveFromGroupModal from '../../Components/Modals/RemoveFromGroupModal';
import io from 'socket.io-client'
import { FetchAllUsers } from '../../Slices/AuthSlice';
import { setSelectedChat } from '../../Slices/ChatSlice';
import TypingIndicator from '../../Animations/TypingIndicator';
import { setNotifications } from '../../Slices/ChatSlice';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
const ENDPOINT="http://localhost:9000";
var socket,selectedchatcompare;

const ChatArea = ({ selectedUser,onBack }) => {
  
    const [message, setMessage] = useState("");
    const [SocketConnected, setSocketConnected] = useState(false)
    const [NewMessage, setNewMessage] = useState("")
    const [messages, setMessages] = useState([]);
    const [sendMessageLoading, setsendMessageLoading] = useState(false)
    const [messageloading, setmessageloading] = useState(false)
    const [addgrouploading, setaddgrouploading] = useState(false)
   
    // console.log("startmessage",messages);
    const { SelectedChat, notifications = [] } = useSelector((state) => state.Chat);
    console.log(notifications,'.......');

   
    const [typing, settyping] = useState(false)
    const [isTyping, setisTyping] = useState(false)
    // console.log("selectedcaht",SelectedChat);
  
    const ChatId=SelectedChat?SelectedChat[0]?._id:1
    // console.log("hello ",ChatId);
    
    // useEffect(()=>{
    //   dispatch(setSelectedChat([]))
    // },[])
    const dispatch = useDispatch();
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showRemovePopup, setShowRemovePopup] = useState(false);
    const [showMembersPopup, setShowMembersPopup] = useState(false);
    const params=useParams()

    const [user, setUser] = useState({});
    const { User, Chats, filteruser,AllUsers,JwtToken } = useSelector((state) => state.Auth);
   
    // console.log("bhaoo",Chats);
   
    useEffect(() => {
        SelectedChat.map((value) => {
            if (value.isGroupChat) {
                dispatch(setFilterUser(value));
            } else {
                dispatch(setFilterUser(null));
                value.users.map((user) => {
                    if (user._id !== User._id) {
                        setUser(user);
                    }
                });
            }
        });
    }, [SelectedChat]);
    // console.log(" my name is",filteruser);
   
    useEffect(() => {
      socket = io(ENDPOINT);
      socket.emit("setup", User);
    
      socket.on("connected", () => {
        setSocketConnected(true);
        console.log("✅ Socket connected");
      });
    socket.on('typing',()=>setisTyping(true))
    
    socket.on('stop typing',()=>setisTyping(false))
      socket.on("connect_error", (err) => {
        console.error("❌ Connection Error:", err);
      });
    }, []);
  useEffect(()=>{
    dispatch(FetchAllUsers({jwttoken:JwtToken,query:""}))

  },[User,Chats])

  useEffect(()=>{
    if(SelectedChat.length<=0) return;
    setmessageloading(true)
    fetch(`${import.meta.env.VITE_BASE_URL}/api/message/AllMessages/${ChatId}`,{
      method:'GET',
      headers:{
       
        "Authorization":`Bearer ${JwtToken}`
      }
      }).then((res)=>{
        // console.log(res);
        
        return res.json()
      }).then((data)=>{
        // console.log(data);
        if(data.FailureMessage){
          setMessages([])
        }
        else{
        setMessages(data)
        socket.emit('join chat',SelectedChat[0]?._id)
        }
        
      }).catch((error)=>{
        console.log(error);
        
      }).finally(()=>{
        setmessageloading(false)
      })
      selectedchatcompare=SelectedChat;
      console.log("ma comp",selectedchatcompare);

  },[SelectedChat])

  
 console.log("all messages",messages);
 
    const navigate = useNavigate();
    const onMessageChange=(e)=>{
      setMessage(e.target.value)
      if(!SocketConnected) return ;
      if(!typing){
        settyping(true)
        socket.emit('typing',SelectedChat[0]?._id)
      }
      let lasttyping=new Date().getTime()
      var timerlenght=3000
      setTimeout(() => {
        var presenttypingtime=new Date().getTime();
        console.log("prese",presenttypingtime);
        console.log("lasttyp",lasttyping);
        
        
        let timediff=presenttypingtime - lasttyping
        if(timediff>=timerlenght && typing){
          socket.emit('stop typing',SelectedChat[0]?._id)
          settyping(false)
        }
      }, timerlenght);
    }
    const sendMessage = () => {
      if(!message){
        return alert('please write a message')
      }
      setsendMessageLoading(true)
      fetch(`${import.meta.env.VITE_BASE_URL}/api/message/SendMessage`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          "Authorization":`Bearer ${JwtToken}`
        },
        body:JSON.stringify({content:message,ChatId:ChatId})
      }).then((res)=>{
        // console.log(res);
        
        return res.json()
      }).then((data)=>{
        console.log(data.message);
         socket.emit('new message',data.message)
        setMessages([...messages,data.message])
        
      }).catch((error)=>{
        console.log(error);
        
      }).finally(()=>{
        setsendMessageLoading(false)
      })
        // if (message.trim() !== "") {
        //     setMessages([...messages, { text: message, sender: "me" }]);
        //     setMessage("");

        //     setTimeout(() => {
        //         setMessages((prev) => [...prev, { text: "This is a reply!", sender: "other" }]);
        //     }, 1000);
        // }

    };

   
    useEffect(()=>{
      console.log(selectedchatcompare,"hon mai");
      
      socket.on('message received',(NewMessageReceived)=>{
       
        console.log("connect hogaya hain");
        
        if(selectedchatcompare.length<=0 || selectedchatcompare[0]._id !==NewMessageReceived.chat._id){
          if(!notifications?.includes(NewMessageReceived) ){
            dispatch(setNotifications([NewMessageReceived,...notifications]))
          }
  
        }
        else{
          console.log(NewMessageReceived);
          
          setMessages([...messages,NewMessageReceived])
        }
      })
     
    })
    

    const Addtogroup=(UserID)=>{
      setaddgrouploading(true)
      fetch(`${import.meta.env.VITE_BASE_URL}/api/chat/AddMembertoGroup/${UserID}/${ChatId}`,{
        method:'PATCH',
        headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${JwtToken}`
        }

          
        
      }).then((res)=>{
        return res.json()
      }).then((data)=>{
         console.log("addgrp",data);
        if(data.SuccessMessage){
          toast.success(data.SuccessMessage)
          dispatch(setFilterUser(data.updatedchat))
        }
        if(data.FailureMessage){
          toast.error(data.FailureMessage)
        }
        
      }).catch((error)=>{
        toast.error(error.FailureMessage)
        
      }).finally(()=>{
        setaddgrouploading(false)
      })

    }
    const handlekeydown=(event)=>{
      if(event.key=="Enter"){
        e.preventDefault()
        sendMessage()
      }
    }
   
// messages.map((value)=>{
//   console.log(value.Sender._id);
//   console.log(value.content);
  
  
// })


    return (
      SelectedChat.length<=0 ?  
 
<div className='w-full   flex justify-center items-center  h-screen bg-black '> select a chat</div>:
        <div className="w-full flex flex-col h-screen bg-black">
            { filteruser? (
                <>
                    {/* 🏷️ Header with Group Chat Info & Icons */}
                    <div className="flex items-center p-4 border-b border-gray-700 bg-gray-800 justify-between ">
                        <div className="flex items-center">
                            <IoMdArrowBack className="text-xl cursor-pointer" onClick={onBack} />
                            <img
                                src={"" || "/default-avatar.png"}
                                alt={filteruser?.ChatName || "User"}
                                className="w-10 h-10 rounded-full ml-2"
                            />
                            <h2 className="text-lg font-bold ml-4">{filteruser?.ChatName || "Unknown User"}</h2>
                        </div>
                        {/* Group Chat Icons */}
                        <div className="flex space-x-4 text-gray-400">
                            <FiUsers className="text-xl cursor-pointer hover:text-white" onClick={() => setShowMembersPopup(true)} />
                            <FiUserPlus className="text-xl cursor-pointer hover:text-white" onClick={() => setShowAddPopup(true)} />
                            <FiUserMinus className="text-xl cursor-pointer hover:text-white" onClick={() => setShowRemovePopup(true)} />
                        </div>
                    </div>

                    {/* 💬 Chat Messages */}
                    <div className="flex-1 p-4 overflow-y-auto">
                        {messages.map((value, index) => (
                          <div >
                            <div className={`flex my-2 gap-1 ${value.Sender?._id === User._id ? "hidden":"block"} `}>
                            <img
                                src={value.Sender?.profilePicture || "/default-avatar.png"}
                                alt={value.Sender?.profilePicture || "User"}
                                className="md:w-10 md:h-10 w-5 h-5 rounded-full ml-2"
                            />
                            <span className='text-green-500'>{value.Sender?.name}</span>
                           
                            </div>
              
                            <div
                                key={index}
                                className={`p-2 my-2 rounded-lg max-w-xs ${value.Sender?._id === User._id ? "bg-indigo-600 ml-auto" : "bg-gray-700"}`}
                            >
                                {value?.content}
                            </div>
                            </div>
                        ))}
                      {isTyping && <TypingIndicator />}
                    </div>
                 

                    {/* ✏️ Input Field */}
                    <div className="p-4 border-t border-gray-700 bg-gray-800 flex items-center">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="flex-1 p-3 rounded-lg bg-gray-700 text-white focus:outline-none"
                            value={message}
                            onChange={onMessageChange}
                            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <button onClick={sendMessage}  className="ml-3 text-indigo-400 hover:text-indigo-500">
                            <FiSend size={24} />
                        </button>
                    </div>

                    {/* 📌 Popups */}
                    {/* Show Members Popup */}
                    {showMembersPopup && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                            <div className="bg-gray-800 p-6 rounded-lg w-96">
                                <h2 className="text-lg font-bold text-white mb-4">Group Members</h2>
                                <ul>
                                    {filteruser?.users.map((member) => (
                                        <li key={member._id} className="text-white py-2 border-b border-gray-600">
                                            {member.name}
                                        </li>
                                    ))}
                                </ul>
                                <button className="mt-4 bg-red-500 px-4 py-2 text-white rounded-md w-full" onClick={() => setShowMembersPopup(false)}>Close</button>
                            </div>
                        </div>
                    )}

                    {/* Add Member Popup */}
                    {showAddPopup && (
                         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                            <div className="bg-gray-800 p-6 rounded-lg w-96">
                                <h2 className="text-lg font-bold text-white mb-4">Add Member</h2>
                                {addgrouploading?<div className='w-full h-full flex justify-center items-center'><ClipLoader color='gray' size={25} loading={addgrouploading} /></div>:
                                 <ul>
                                 {AllUsers.filter(members=>!filteruser.users.some(user=>user._id===members._id)).map((member) => (
                                     <li key={member._id} className="flex justify-between items-center py-2 border-b border-gray-600">
                                         <span className="text-white">{member.name}</span>
                                         <button onClick={()=>Addtogroup(member._id)} className="bg-green-500 px-2 py-1 text-white rounded-md">Add</button>
                                     </li>
                                 ))}
                             </ul>
                                }
                               
                                <button className="mt-4 bg-red-500 px-4 py-2 text-white rounded-md w-full" onClick={() => setShowAddPopup(false)}>Close</button>
                            </div>
                        </div>
                    )}

                    {/* Remove Member Popup */}
                    {showRemovePopup && (
                      <RemoveFromGroupModal onremove={()=>setShowRemovePopup(false)} chatId={ChatId}/>
                        // <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        //     <div className="bg-gray-800 p-6 rounded-lg w-96">
                        //         <h2 className="text-lg font-bold text-white mb-4">Remove Member</h2>
                        //         <ul>
                        //             {filteruser?.users.map((member) => (
                        //                 <li key={member._id} className="flex justify-between items-center py-2 border-b border-gray-600">
                        //                     <span className="text-white">{member.name}</span>
                        //                     <button className="bg-red-500 px-2 py-1 text-white rounded-md">Remove</button>
                        //                 </li>
                        //             ))}
                        //         </ul>
                        //         <button className="mt-4 bg-red-500 px-4 py-2 text-white rounded-md w-full" onClick={() => setShowRemovePopup(false)}>Close</button>
                        //     </div>
                        // </div>
                    )}
                </>)
   :Chats && user&& <>
   <div className="flex items-center p-4 border-b border-gray-700 bg-gray-800">
     <IoMdArrowBack
       className="text-xl cursor-pointer "
       onClick={onBack}
     />
  <img
src={user?.profilePicture || "/default-avatar.png"} // Provide a fallback image
alt={user?.name || "User"}
className="w-10 h-10 rounded-full ml-2"/>
<h2 className="text-lg font-bold ml-4">{user?.name || "Unknown User"}</h2>

   </div>
   <div className="flex-1 p-4 overflow-y-auto">
   {messages.map((value, index) => (
                            <div
                                key={index}
                                className={`p-2 my-2 rounded-lg max-w-xs ${value.Sender._id === User._id ? "bg-indigo-600 ml-auto" : "bg-gray-700"}`}
                            >
                                {value.content}
                            </div>
                        ))}
                        {isTyping && <TypingIndicator />}
   </div>
   
                   
   <div className="p-4 border-t border-gray-700 bg-gray-800 flex items-center">
     <input
       type="text"
       placeholder="Type a message..."
       className="flex-1 p-3 rounded-lg bg-gray-700 text-white focus:outline-none"
       value={message}
       onChange={onMessageChange}
       onKeyPress={(e) => e.key === "Enter" && sendMessage()}
      
       
     />
     <button onClick={sendMessage}  onKeyDown={handlekeydown}  className="ml-3 text-indigo-400 hover:text-indigo-500">
       <FiSend size={24} />
     </button>
   </div>
 </>}
    
   
         
      </div>
    )
  };
  


export default ChatArea
