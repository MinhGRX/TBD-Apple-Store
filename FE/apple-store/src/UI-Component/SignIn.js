import '../CSS/SignIn.css';
import React from 'react';
import avatar from '../Asset/iphone.jpg';
import { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Checkbox from '@mui/material/Checkbox';

function SignIn() {
  const usernameRef = useRef();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handle submit");
  };
  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  const label = { inputProps: { 'aria-label': 'Remember Me' } };

  const navigate = useNavigate();

  const GotoHome = () => {
    navigate('/homepage');
  }
  return(
    <div class="background">
        <div class="outerbox">
            <div class="innerbox">
                <div class="loginbox">
                    <div class="form-container">                        
                        <div class="form-field">

                            <h1> Sign In </h1>
                                <form onSubmit={handleSubmit} className="form__container">
                                  <div className="form__controls">
                                    <label htmlFor="username">Username</label>
                                    <input
                                      ref={usernameRef}
                                      type="text"
                                      id="username"
                                      value={username}
                                      onChange={(e) => setUsername(e.target.value)}
                                    />
                                  </div>

                                  <div className="form__controls">
                                    <label htmlFor="password">Password</label>
                                    <input
                                      id="password"
                                      type="password"
                                      value={password}
                                      onChange={(e) => setPassword(e.target.value)}
                                    />
                                  </div>

                                  <div>
                                    <Checkbox {...label} defaultChecked/>
                                  </div>

                                  <div className="form__controls">
                                    <button className="button" onClick={GotoHome}>Login</button>
                                  </div>
                                </form>
                        </div>

                        <figure><img class="image" src={avatar} alt="Image"/></figure> 
                        
                    </div>                    
                </div>
            </div>
        </div>
    </div>
  );
}

export default SignIn;