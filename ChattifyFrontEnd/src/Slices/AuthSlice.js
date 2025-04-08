import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import { act } from "react";
const url = import.meta.env.VITE_BASE_URL;
import { setSelectedChat } from "./ChatSlice";
import { useDispatch } from "react-redux";

export const RegisterUser=createAsyncThunk(
    "auth/register",
    async (credentials,{rejectWithValue})=>{
        try {
            const response =await fetch(`${url}/api/auth/register`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(credentials)
            })
            const data=await response.json()
            return data;
        } catch (error) {
            return rejectWithValue(error.FailureMessage)
        }
    }
)
export const LoginUser=createAsyncThunk(
    "auth/login",
    async (credentials,{rejectWithValue})=>{
        try {
            const response =await fetch(`${url}/api/auth/login`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(credentials)
            })
            const data=await response.json()
            return data
        } catch (error) {
            return rejectWithValue(error.FailureMessage)
        }
    }
)

export const ForgetPassword=createAsyncThunk(
    "auth/ForgetPassword",
    async (email,{rejectWithValue})=>{
        try {
            const response =await fetch(`${url}/api/auth/ForgetPassword`, {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: {
        'Content-Type': 'application/json'
      }})
            const data=await response.json()
            return data
        } catch (error) {
            return rejectWithValue(error.FailureMessage)
        }
    }
)

export const GetLoggedInUser=createAsyncThunk(
    "auth/GetLoggedInUser",
    async (jwttoken,{rejectWithValue})=>{
        try {
            const response=await fetch(`${url}/api/auth/GetLoggedInUser`,{
                method:'GET',
                headers:{
                    "Authorization":`Bearer ${jwttoken}`
                }

                
            })
            const data=await response.json();
            return data
        } catch (error) {
            return rejectWithValue(error.FailureMessage)
            
        }
    }
)

export const FetchAllUsers=createAsyncThunk(
    "auth/FetchAllUsers",
    async ({jwttoken,query},{rejectWithValue})=>{
        try {
            const response=await   fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/AllUsers?search=${query}`,{
                method:'GET',
                headers:{
                  'Authorization':`Bearer ${jwttoken}`,
                  'Content-Type':'application/json'
                }
              })
              const data=await response.json();
              return data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

const Authslice =createSlice(
    {
        name:'auth',
        initialState:{
            User:{},
            Users:[],
            Groups:[],
            filteruser:[],
            Chats:[],
            JwtToken:localStorage.getItem('Jwt Token') || null,
            loading:false,
            error:null,
            OtpToken:localStorage.getItem('Otp Token')|| null,
            AllUsers:[],
        }
        ,reducers:{
            LogoutTrue:(state)=>{
                localStorage.removeItem('Jwt Token')
                state.JwtToken=null
            },
            setUser:(state,action)=>{
                state.user=action.payload;
            },
            setUsers:(state,action)=>{
                const chats=action.payload;
                state.Users=[];
                state.Groups=[];
                chats.forEach((chat)=>{
                    if(chat.isGroupChat){
                        state.Groups.push(chat)
                    }
                    else{
                        chat.users.forEach((user)=>{
                            if (user._id !== state.User._id) { // Avoid listing self
                                state.Users.push(user);
                            }
                        })
                    }
                })
                state.Users = [...new Map(state.Users.map(user => [user._id, user])).values()];
            },
            setAllUsers:(state,action)=>{
                state.AllUsers=action.payload;
            },
            
            setFilterUser:(state,action)=>{
                state.filteruser=action.payload
            },
            setChats:(state,action)=>{
                state.Chats=action.payload
            }
        },
        extraReducers:(builder)=>{
            builder
            .addCase(RegisterUser.pending,(state)=>{
                state.loading=true;
                state.error=null
            })
            .addCase(RegisterUser.fulfilled,(state,action)=>{
                state.loading=false;
                state.JwtToken=action.payload;
                // localStorage.setItem('Jwt Token',action.payload)
            })
            .addCase(RegisterUser.rejected,(state,action)=>{
                state.loading=false;
                state.error=action.payload.FailureMessage
            })
            .addCase(LoginUser.pending,(state)=>{
                state.loading=true;
                state.error=null
            })
            .addCase(LoginUser.fulfilled,(state,action)=>{
                state.loading=false;
                state.JwtToken=action.payload.token;
             localStorage.setItem('Jwt Token',action.payload.token)
            
            })
            .addCase(LoginUser.rejected,(state,action)=>{
                state.loading=false;
                state.error=action.payload.FailureMessage
            })
            .addCase(ForgetPassword.pending,(state)=>{
                state.loading=true;
                state.error=null
            })
            .addCase(ForgetPassword.fulfilled,(state,action)=>{
                state.loading=false;
                state.OtpToken=action.payload;
             localStorage.setItem('Otp Token',action.payload.token)
            })
            .addCase(ForgetPassword.rejected,(state,action)=>{
                state.loading=false;
                state.error=action.payload.FailureMessage
            })
            .addCase(GetLoggedInUser.pending,(state)=>{
                state.loading=true;
                state.error=null;
            })
            .addCase(GetLoggedInUser.fulfilled,(state,action)=>{
                state.loading=false;
              state.User=action.payload
             
            })
            .addCase(GetLoggedInUser.rejected,(state,action)=>{
                state.loading=false;
                state.error=action.payload.FailureMessage
            })
            .addCase(FetchAllUsers.pending,(state,action)=>{
                state.loading=true;
                state.error=null
            })
            .addCase(FetchAllUsers.fulfilled,(state,action)=>{
                state.loading=false;
                // console.log("au",action.payload);
                
                 state.AllUsers=action.payload
            })
            .addCase(FetchAllUsers.rejected,(state,action)=>{
                state.loading=false;
                state.error=action.payload.FailureMessage
            })
        }
    }
)

export const {LogoutTrue,setUser,setUsers,setFilterUser,setChats,setAllUsers}=Authslice.actions
export default Authslice.reducer;

