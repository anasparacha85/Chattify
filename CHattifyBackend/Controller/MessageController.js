const { json } = require("body-parser");
const Message = require("../Modal/MessageModal");
const ChatModal = require("../Modal/ChatModal");
const User = require("../Modal/UserModal");

const sendMessage=async(req,res)=>{
    try {
        const user=req.user;
        const {content,ChatId}=req.body;
        // console.log(content," ",ChatId);
       
        
        
        if(ChatId=="" || content==""){
            return res.status.json({FailureMessage:"invalid Chat or did'nt  Message not delivered"})
        }

        const findchat=await ChatModal.findOne({_id:ChatId})
        var message=await Message.create({Sender:user._id,content:content,chat:ChatId})
        // console.log(message);
        
        message=await message.populate('Sender',"name profilePicture");
        message=await message.populate('chat')
        message=await User.populate(message,{
            path:'chat.users',
            select:"name email profilePicture"
        })
        const updatechat=await ChatModal.updateOne({_id:ChatId},{$set:{latestMessage:message}})
    res.status(200).json({SuccessMessage:"Message Delivered Successfully",message})
        
    } catch (error) {
        console.log(error);
        
        res.status(500).json({FailureMessage:"internal server error"})
        
    }

}
const getMessagebyChatID=async(req,res)=>{
    try {
        const ChatId=req.params.ChatId;
        var messages=await Message.find({chat:ChatId}).populate('Sender','name profilePicture email').populate('chat')
        res.status(200).json(messages)
    } catch (error) {
        console.log(error);
        
        res.status(500).json({FailureMessage:"internal server error"})
        
    }

}



module.exports={sendMessage,getMessagebyChatID}