 const mongoose=require('mongoose')
 const chatschema=new mongoose.Schema({
    ChatName:{
        type:String
    },
    isGroupChat:{
        type:Boolean,
        default:false
    },
    users:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    latestMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Message'
    },
    groupAdmin:{
        type:mongoose.Schema.Types.ObjectId,ref:'User'
    }
 })

 const ChatModal=new mongoose.model('Chat',chatschema)
 module.exports=ChatModal