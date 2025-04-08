import { useNavigate } from "react-router-dom";
import ChatArea from "./ChatArea";
import UserList from "./UserList";
import { useRef, useState } from "react";
import CreateGroupModal from "./CreateGroupModal";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedChat } from "../../Slices/ChatSlice";
import Header from "../../Components/Header";


const users = [
  { id: 1, name: "John Doe", avatar: "https://via.placeholder.com/50" },
  { id: 2, name: "Jane Smith", avatar: "https://via.placeholder.com/50" },
  { id: 3, name: "Alex Johnson", avatar: "https://via.placeholder.com/50" },
  { id: 4, name: "Emily White", avatar: "https://via.placeholder.com/50" },
  { id: 5, name: "Michael Brown", avatar: "https://via.placeholder.com/50" },
];


export const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const navigate = useNavigate();
  const {SelectedChat}=useSelector((state)=>state.Chat)
  const dispatch=useDispatch()
  const userlistref=useRef(null)
const chatarearef=useRef(null)

  const openChat = (Chats) => {
    // const user = users.find((u) => u.id === userId);
    // setSelectedUser(user);
    // setIsGroupChat(false);
    userlistref.current.classList.add('hidden')
    chatarearef.current.classList.remove('hidden')
    dispatch(setSelectedChat(Chats))
    // navigate(`/Chat/${userId}`)
  };

  const createGroupChat = () => {
    setShowGroupModal(true); // Show group creation modal
  };
  const onBack=()=>{
    chatarearef.current.classList.add('hidden')
    userlistref.current.classList.remove('hidden')
  }

  return (
    <>
   
    <div className="flex h-screen text-white w-full">
   
      {!selectedUser && !isGroupChat && (
        <div ref={userlistref} className=" md:block w-full md:w-1/3">

        <UserList users={users} onSelectChat={openChat} onCreateGroup={createGroupChat} />
        </div>
      )}
      {isGroupChat ? (
        <div className="flex-1 flex items-center hidden md:block justify-center text-gray-400  ">
          Group Chat Feature Coming Soon...
        </div>
      ) : (
        <div ref={chatarearef} className="hidden md:block w-full  md:w-2/3">
           <ChatArea selectedUser={selectedUser} onBack={onBack} />
        </div>

       
      )}

      {/* Group Chat Modal */}
      {showGroupModal && <CreateGroupModal users={users} onClose={() => setShowGroupModal(false)} />}
    </div>
    </>
  );
};

export default ChatPage;
