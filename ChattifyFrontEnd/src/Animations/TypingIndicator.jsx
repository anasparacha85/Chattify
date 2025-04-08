import React from 'react'
import Lottie from 'lottie-react'
import typingAnimation from '../assets/typing.json'
const TypingIndicator = () => {
  return (
    <div className="w-16 h-10">
    <Lottie animationData={typingAnimation} loop={true} />
  </div>
  )
}

export default TypingIndicator

