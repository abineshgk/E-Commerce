import React, { useState } from 'react'
import './Navbar.css'
import nav_logo from '../../assets/logo.png'
import nav_profile from '../../assets/nav-profile.png'

function Navbar() {

  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div className='navbar'>

      <div className='nav-logo'>
        <img src={nav_logo} alt="" />
        <div className="nav-logo-text">
          <p className="main-title">GKA Shoppyy</p>
          <p className="sub-title">Admin Panel</p>
        </div>
      </div>

      <div className="profile-wrapper">
        <img 
          src={nav_profile} 
          alt="" 
          className='nav-profile'
          onClick={() => setOpenMenu(!openMenu)}
        />

        {openMenu && (
          <div className="profile-dropdown">
            <p>👤 My Account</p>
            <p>⚙️ Settings</p>
            <p className="logout">🚪 Logout</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar;
