import React, { useState } from 'react';
import './CSS/Loginsignup.css';

const LoginSignup = () => {
  const [state, setstate] = useState("Login");
  const [formData, setformData] = useState({
    username: "",
    password: "",
    email: ""
  });

  const changeHandler = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    console.log("Login function executed", formData);
    let responseData;

    await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => (responseData = data));

    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace("/");
    } else {
      alert("Signup failed: " + (responseData.errors || "Unknown error"));
    }
    // Example login API call (you can implement later)
    // let response = await fetch('http://localhost:4000/login', { ... })
  };

  const signup = async () => {
    console.log("Signup function executed", formData);
    let responseData;

    await fetch('http://localhost:4000/signup', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => (responseData = data));

    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace("/");
    } else {
      alert("Signup failed: " + (responseData.errors || "Unknown error"));
    }
  };

  const submitHandler = () => {
    if (state === "Login") {
      login();
    } else {
      signup();
    }
  };

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign up" && (
            <input
              name='username'
              type='text'
              placeholder='Your Name'
              value={formData.username}
              onChange={changeHandler}
            />
          )}
          <input
            name='email'
            value={formData.email}
            onChange={changeHandler}
            type='email'
            placeholder='Email Address'
          />
          <input
            name='password'
            value={formData.password}
            onChange={changeHandler}
            type='password'
            placeholder='Password'
          />
        </div>

        <button onClick={submitHandler}>Continue</button>

        {state === "Sign up" ? (
          <p className="loginsignup-login">
            Already have an account?{" "}
            <span onClick={() => setstate("Login")}>Login here</span>
          </p>
        ) : (
          <p className="loginsignup-login">
            Create an account?{" "}
            <span onClick={() => setstate("Sign up")}>Click here</span>
          </p>
        )}

        <div className="loginsignup-agree">
          <input type='checkbox' id='agree' />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
