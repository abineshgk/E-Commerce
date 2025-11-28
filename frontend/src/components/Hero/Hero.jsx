import React from 'react'
import '../Hero/Hero.css'
import hand_icon from '../../assets/hand_icon.png'
import arrow_icon from '../../assets/arrow.png'
import hero_image from '../../assets/hero_image.png'

function Hero() {
  return (
    <div className='hero'>
      <div className="hero-left">
        <h2>NEW ARRIVALS ONLY!</h2>
        <div>
        <div className="hero-hand-icon">
            <p>New</p>
            <img src={hand_icon} alt="" />
        </div>
        <p>collections</p>
        <p>for everyone</p>
      </div>
      <div className="hero-latest-button">
        <div>Latest Collections</div>
        <img src={arrow_icon} alt="" />
    </div>
    </div>
    <div className='hero-right'>
        <img src={hero_image} alt="" />
    </div>
    </div>
     
  )
}

export default Hero
