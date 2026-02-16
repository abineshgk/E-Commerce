import React, { useContext, useState } from 'react'
import '../Navbar/Navbar.css'
import logo from '/src/assets/logo.png'
import cart_icon from '/src/assets/cart_icon.png'
import nav_profile from '/src/assets/nav-profile.png'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../context/ShopContext'

function Navbar() {

    const [menu, setMenu] = useState("shop");
    const {getTotalCartItems} = useContext(ShopContext);
  return (
    <div className='navbar'>
      <div className='nav-logo'>
        <img src={logo} alt="Logo" />
        <p>GKA Shoppyy</p>
      </div>
      <ul className='nav-menu'>
        <li onClick={() =>{setMenu("shop")}}><Link style={{textDecoration:"none"}} to="/">Shop</Link>{menu==="shop" ? <hr/> : <></>}</li>
        <li onClick={() =>{setMenu("mens")}}><Link style={{textDecoration:"none"}} to="/mens">Men</Link>{menu==="mens" ? <hr/> : <></>}</li>
        <li onClick={() =>{setMenu("womens")}}><Link style={{textDecoration:"none"}} to="/womens">Women</Link>{menu==="womens" ? <hr/> : <></>}</li>
        <li onClick={() =>{setMenu("kids")}}><Link style={{textDecoration:"none"}} to="kids">Kids</Link>{menu==="kids" ? <hr/> : <></>}</li>
      </ul>
      <div className='nav-login-cart'>
        {localStorage.getItem('auth-token' )
        ? <button onClick={() => {localStorage.removeItem('auth-token'); window.location.replace("/")}}>Logout</button>
        : <Link to="/login"><button>Login</button></Link>}
        <Link to="/cart"><img src={cart_icon} alt="cart" /></Link>
        <div className='nav-cart-count'>{getTotalCartItems()}</div>
        <Link><img src={nav_profile} alt="" className='nav-profile' /></Link>
      </div>
    </div>
  )
}

export default Navbar
