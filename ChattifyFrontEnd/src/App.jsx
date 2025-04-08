import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter,Route ,Routes} from 'react-router-dom'
import Login from './Pages/AuthPages/Login'
import REEGISTER from './Pages/AuthPages/Register'
import ForgotPassword from './Pages/AuthPages/ForgetPassword'
import OTPVerification from './Pages/AuthPages/OtpVerificationpage'
import UpdatePassword from './Pages/AuthPages/UpdatePassword'
import ChatPage from './Pages/Chats/ChatPage'
import ChatArea from './Pages/Chats/ChatArea'
import { Provider, useDispatch, useSelector } from 'react-redux'
import store from './Store/Store'
import AuthRoute from './Route/AuthRoute'
import { GetLoggedInUser } from './Slices/AuthSlice'
import Header from './Components/Header'
import Logout from './Pages/AuthPages/Logout'
import { ToastContainer } from 'react-toastify'
function App() {
  const [count, setCount] = useState(0)
  const dispatch = useDispatch();
  const jwtToken = useSelector((state) => state.Auth.JwtToken);

  useEffect(() => {
    if (jwtToken) {
      dispatch(GetLoggedInUser(jwtToken));
    }
  }, [jwtToken, dispatch]);

  return (
    <>
     <ToastContainer 
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
     
    />
    <Routes>
      <Route element={<AuthRoute/>}>
      <Route path='/' element={<Login/>}/>
      </Route>
    
    <Route path='/register' element={<REEGISTER/>}/>
    <Route path='/forget-password' element={<ForgotPassword/>}/>
    <Route path='/Otp-Verification' element={<OTPVerification/>}/>
    <Route path='/update-password' element={<UpdatePassword/>}/>
    <Route path='/Logout' element={<Logout/>}/>
    <Route path='/Chat' element={<ChatPage/>}/>
    <Route path='/Chat/:id' element={<ChatArea/>}/>

     </Routes>
  
  
    </>
  )
}

export default App
