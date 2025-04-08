import { createSlice } from "@reduxjs/toolkit";

const ChatSlice=createSlice({
    name:'chat',
    initialState:{
        SelectedChat:[],
        notifications:[],
        NotifyCount:0
        
    },
    reducers:{
        setSelectedChat:(state,action)=>{state.SelectedChat=action.payload},
        setNotifications:(state,action)=>{state.notifications=action.payload},
        setNotifyCount:(state,action)=>{state.NotifyCount=action.payload}
    }
})

export const {setSelectedChat,setNotifications,setNotifyCount}=ChatSlice.actions;
export default ChatSlice.reducer;