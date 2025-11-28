import React from 'react'
import '../LoginSignup/LoginSignup.css'

function LoginSignup() {
  return (
    <div className='loginSignup'>
      <div className='loginSignup-container'>
        <h1>Sign Up</h1>
        <div className="loginSignup-fields">
          <input type="text" placeholder='Your Name' />
          <input type="email" placeholder='E-mail Address' />
          <input type="password" placeholder='Password' />
        </div>
        <button>Continue</button>
        <p className='loginSignup-login'>Already have an Account? <span>Login here</span></p>
        <div className="loginSignup-agree">
          <input type="checkbox" name='' id='' />
          By continueing, i agree to the terms of use & privacy policy.
        </div>
      </div>
    </div>
  )
}

export default LoginSignup
