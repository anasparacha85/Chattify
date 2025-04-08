import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <div>
      <div className='w-scree h-20 bg-gray-500 text-white'>
        <Link to='/Logout' >Logout</Link>
      </div>
    </div>
  )
}

export default Header
