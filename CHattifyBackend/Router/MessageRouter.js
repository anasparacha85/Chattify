const express=require('express')
const router=express.Router()

const MessageController=require('../Controller/MessageController')
const ProtectedUser = require('../Middleware/ProtectedUser')
router.route('/SendMessage').post(ProtectedUser,MessageController.sendMessage)
router.route('/AllMessages/:ChatId').get(ProtectedUser,MessageController.getMessagebyChatID)
module.exports=router