import React from 'react'
import '../LoginSignup/LoginSignup.css'
import { useState } from 'react'

function LoginSignup() {

  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
    
  })
  const  handlerChange = (e) => {
    setFormData({...formData, [e.target.name] : e.target.value})
  }

  const Login = async () => {
    console.log("Login executed",formData)

     try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    console.log("Register response:", data);

    if (data.success) {
      localStorage.setItem("auth-token", data.token);
      window.location.replace("/");
    } else {
      alert(data.message || "Registration failed");
    }
  } catch (err) {
    console.error("Register error:", err);
    alert("Something went wrong during registration");
  }
  }

 const Register = async () => {
  console.log("Register executed", formData);

  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });


    const data = await res.json();
    console.log("Register response:", data);

    if (data.success) {
      localStorage.setItem("auth-token", data.token);
      window.location.replace("/");
    } else {
      alert(data.message || "Registration failed");
    }
  } catch (err) {
    console.error("Register error:", err);
    alert("Something went wrong during registration");
  }
};

  return (
    <div className='loginSignup'>
      <div className='loginSignup-container'>
        <h1>{state}</h1>
        <div className="loginSignup-fields">
          {state === "Sign Up" ? <input name='name' value={formData.name} onChange={handlerChange} type="text" placeholder='Your Name'/> : <></>}
          <input name='email' value={formData.email} onChange={handlerChange} type="email" placeholder='E-mail Address' />
          <input name='password' value={formData.password} onChange={handlerChange} type="password" placeholder='Password' />
        </div>
        <button onClick={() => {state === "Login" ? Login() : Register()}}>Continue</button>
        {state === "Sign Up" ? <p className='loginSignup-login'>Already have an Account? <span onClick={() =>{setState("Login")}}>Login here</span></p>
         : <p className='loginSignup-login'>Create an Account? <span onClick={() =>{setState("Sign Up")}}>Click here</span></p> }
        <div className="loginSignup-agree">
          <input type="checkbox" name='' id='' />
          By continueing, i agree to the terms of use & privacy policy.
        </div>
      </div>
    </div>
  )
}

export default LoginSignup
