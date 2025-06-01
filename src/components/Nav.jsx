import React from 'react'
import navIcon from '../assets/img/navIcon.png';


const Nav = () => {
  return (
    <div className='flex items-center gap-2.5 py-3.5'>
          <img className="h-8 w-8.4" src={navIcon} alt="Logo" />
          <span className="text-2xl font-bold text-[#108587] leading-[36px]">Stockease</span>      
    </div>
  )
}

export default Nav