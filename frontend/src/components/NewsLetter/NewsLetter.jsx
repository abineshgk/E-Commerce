import React from 'react'
import '../NewsLetter/NewsLetter.css'

function NewsLetter() {
  return (
    <div className='newsLetter'>
      <h1>Get Exclusive Offers On Your E-mail</h1>
      <p>Subscribe To Our NewsLetter and Stay Updated</p>
      <div>
        <input type="email" placeholder='Your Email id' />
        <button>SUBSCRIBE</button>
      </div>
    </div>
  )
}

export default NewsLetter
