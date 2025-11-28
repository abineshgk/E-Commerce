import React from 'react'
import instagram_icon from '../../assets/instagram_icon.png'
import pinterest_icon from '../../assets/pintester_icon.png'
import whatsapp_icon from '../../assets/whatsapp_icon.png'
import '../Footer/Footer.css'

function Footer() {
  return (
    <div className='footer'>
        <ul className='footer-links'>
            <li>Company</li>
            <li>Products</li>
            <li>Offices</li>
            <li>About</li>
            <li>Contact</li>
        </ul>
        <div className="footer-social-icon">
            <div className="footer-icons-container">
                <img src={instagram_icon} alt="" />
            </div>
            <div className="footer-icons-container">
                <img src={pinterest_icon} alt="" />
            </div>
            <div className="footer-icons-container">
                <img src={whatsapp_icon} alt="" />
            </div>
            </div>
             <div className='footer-copyright'>
                <hr />
                <p>&copy; {new Date().getFullYear()} GKA Shoppyy. All Rights Reserved.</p>
            </div>
    </div>
  )
}

export default Footer
