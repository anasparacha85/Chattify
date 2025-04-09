const Chat = require("../Modal/ChatModal");
const User = require("../Modal/UserModal");


const AccessChat = async (req, res) => {
    try {
        const UserId = req.params.id;
        // console.log("🔹 Received User ID:", UserId);
        // console.log("🔹 Requesting User ID:", req.user._id);

        if (!UserId) {
            return res.status(400).json({ FailureMessage: "User Id not sent in params" });
        }

        let Chats = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: UserId } } },
                { users: { $elemMatch: { $eq: req.user._id } } }
            ]
        }).populate('users', '-password');

        // console.log("🔹 Found Chats:", Chats);

        if (!Chats.length) {
            console.log("🔹 No existing chat found. Creating new chat...");

            Chats = await Chat.create({
                ChatName: 'Sender',
                isGroupChat: false,
                users: [UserId, req.user._id],
            });

            console.log("🔹 Created Chat: ", Chats);

            // Populate the newly created chat
            Chats = await Chat.find({_id:Chats._id}).populate('users', '-password');
            console.log("🔹 Populated Chat: ", Chats);
        }

        res.status(200).json({ SuccessMessage: "Chat Created Successfully", Chats });

    } catch (error) {
        console.log("❌ Error:", error);
        res.status(500).json({ FailureMessage: "Internal Server Error" });
    }
};

const fetchAllChats=async(req,res)=>{
    try {
        const chats=await Chat.find({
           
            users:{$elemMatch:{$eq:req.user._id}}
        }).populate("users","-password")
        // console.log("found chats",chats);
        res.status(200).json(chats)
        
    } catch (error) {
        console.log(error);
        
        res.status(500).json({FailureMessage:"Internal Server Error"})
        
    }

}

const createGroup=async(req,res)=>{
    try {
        const {GroupName,users}=req.body;
        // console.log(users);
        // console.log(GroupName);
        if(users.length<2){
            return res.status(400).json({FailureMessage:"Please Select Atleast two Users"})
        }
        const userid=req.user._id;
        users.push(userid)
        const makeAdmin=await User.findOneAndUpdate({_id:req.user._id},{$set:{isAdmin:true}})
        const SaveGroupChat=await Chat.create({
            isGroupChat:true,
            ChatName:GroupName,
            users:users,
            groupAdmin:makeAdmin._id

        })
      

        const findgroupchat=await Chat.find({_id:SaveGroupChat._id}).populate('users','-password').populate('groupAdmin','-password')
        
        res.status(200).json({SuccessMessage:"group created",GroupUsers:findgroupchat})
        
        
    } catch (error) {
        res.status(500).json({FailureMessage:"Internal Server error"})
        
    }
}

const fetchGroupChats=async(req,res)=>{
    try {
        const id=req.params.id;
        const findChat=await Chat.find({_id:id}).populate('users','-passwords')
        res.status(200).json(findChat)
    } catch (error) {
        console.log(error);
        
        res.status(500).json({FailureMessage:"Internal server error"})
        
    }
}

const AddMembertoGroup=async(req,res)=>{
    try {
       const {UserId,ChatId}=req.params;
    //    console.log(ChatId);
       
       const findchat=await Chat.findOne({_id:ChatId}).populate('users','-password').populate('groupAdmin','-password')
       if(!findchat){
        return res.status(400).json({FailureMessage:"Chats not Available"})
       } 
       const finduser=await User.findOne({_id:UserId})
       
       if(!finduser){
        return res.status(400).json({FailureMessage:"User not Available"})
       } 
      if(findchat.users.some(user=>user._id.toString()===UserId)){
        return res.status(400).json({FailureMessage:"User already added in group"})
      }
      const updategroup=await Chat.updateOne({_id:findchat._id},{$push:{users:finduser._id}})
    const updatedchat=await Chat.findOne({_id:ChatId}).populate('users','-password').populate('groupAdmin','-password')
 console.log(updatedchat);

      res.status(200).json({SuccessMessage:"User SuccessFully Added to the group",updatedchat})
      
       
    } catch (error) {
        console.log("addgroup error",error);
        
        res.status(500).json({FailureMessage:"Internal Server error"})
        
    }
}

const removeFromGroup=async(req,res)=>{
    try {
        const {UserId,ChatId}=req.params;
         console.log(ChatId);
        
        const findchat=await Chat.findOne({_id:ChatId}).populate('users','-password').populate('groupAdmin','-password')
        if(!findchat){
         return res.status(400).json({FailureMessage:"Chats not Available"})
        } 
        const finduser=await User.findOne({_id:UserId})
        
        if(!finduser){
         return res.status(400).json({FailureMessage:"User not Available"})
        } 
       if(!findchat.users.some(user=>user._id.toString()===UserId)){
         return res.status(400).json({FailureMessage:"User already removed ifrom the group"})
       }
       const updategroup=await Chat.updateOne({_id:findchat._id},{$pull:{users:finduser._id}})
     const updatedchat=await Chat.findOne({_id:ChatId}).populate('users','-password').populate('groupAdmin','-password')
  console.log(updatedchat);
 
       res.status(200).json({SuccessMessage:"User SuccessFully removed from the group",updatedchat})
       
        
     } catch (error) {
         console.log("removegroup error",error);
         
         res.status(500).json({FailureMessage:"Internal Server error"})
         
     }
 }
 


module.exports={AccessChat,fetchAllChats,createGroup,fetchGroupChats,AddMembertoGroup,removeFromGroup}