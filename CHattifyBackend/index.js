const express = require('express');
const http = require('http'); // <-- important
const cors = require('cors');
const bodyparser = require('body-parser');
const connectdb = require('./Utils/db');
const Authrouter = require('./Router/AuthRouter');
const ChatRouter = require('./Router/ChatRouter');
const MessageRouter = require('./Router/MessageRouter');

const app = express();
const server = http.createServer(app); // <-- use http server

// Middlewares
app.use(cors());
app.use(bodyparser.json());

// Routes
app.use('/api/auth', Authrouter);
app.use('/api/chat', ChatRouter);
app.use('/api/message', MessageRouter);

// Socket.IO setup
const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// DB connection + Start Server
const port = 9000;
connectdb().then(() => {
  server.listen(port, () => {
    console.log("Server started on port", port);
  });
});

// Handle socket connection
io.on("connection", (socket) => {
  console.log("Socket connected:", );
  socket.on("setup",(userdata)=>{
    console.log("userdata id",userdata._id);
    
    socket.join(userdata._id);
    socket.emit("connected")
  })
  socket.on("join chat",(room)=>{
    socket.join(room)
    console.log("nw user joind the chat",room);
    
  })

  socket.on("new message",(NewMessageReceived)=>{
    console.log(NewMessageReceived);
    
    var chat=NewMessageReceived.chat;
    console.log(chat);
    
    if(!chat.users){
        return console.log("chat.users are not defined")
    }
    chat.users.forEach((user)=>{
        console.log(user);
        
        if(user._id==NewMessageReceived.Sender._id) return;
       
        socket.in(user._id).emit("message received",NewMessageReceived)
        console.log(`Sended message to user: ${user._id}`);
    })
  })

  socket.on('typing',(room)=>socket.in(room).emit('typing'))
  socket.on('stop typing',(room)=>socket.in(room).emit('stop typing'))
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});

