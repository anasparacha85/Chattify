import React from 'react'


 const AuthLeftSide = () => {
  return (
    <div>
            {/* Left Side - Background Section */}
            <div className="hidden lg:flex w-1/2 lg:w-full h-screen bg-gradient-to-br from-blue-500 to-blue-900 items-center justify-center text-white p-10" style={{background:`url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHiSfolWWAIGITnQjmanQURHGBaITa7Ab3Rw&s")`}}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Chattify</h1>
          <p className="text-lg">Log in to continue  Chatting with Your Loved Ones and enjoy the Chat .</p>
          <button className='py-2 px-4 bg-red-600 text-white rounded-[50px] mt-4 '> Read More</button>
        </div>
        <div className='self-end -translate-x-[580px] translate-y-[160px]'>
      
        </div>
        
      </div>
     
    </div>
  )
}

export default AuthLeftSide
