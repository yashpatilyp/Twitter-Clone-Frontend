import React, { useState } from 'react'
import './login.css'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios';
import {USER_API_ENDPOINT} from '../../utils/Constant'
import toast from 'react-hot-toast'
import { useDispatch  } from 'react-redux';
import { getToken, getUser } from '../../redux/userSlice';


export default function Login() {
  
const [username , setUsername]= useState('');
const [password, setPassword]= useState('');

const navigate = useNavigate();
const dispatch = useDispatch();
const login = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post(`${USER_API_ENDPOINT}/login`, {
      username,
      password,
    });

    if (res.status === 200) {
      const { token, user } = res.data.result;
      dispatch(getUser(user));
      dispatch(getToken(token));
      
      toast.success("Login Successfully");
      setUsername('');
      setPassword('');
      navigate('/');
    }
  } catch (error) {
    if (error.response) {
      const errorMessage = error.response.data.message;
      toast.error(errorMessage);
    } else {
      toast.error("An error occurred while logging in");
    }
    console.log(error);
  }
};
  return (
    <div >
     <div className="container ">
  <div className="row">
    <div className="col-lg-3 col-md-2" />
    <div className="col-lg-6 col-md-8 login-box">
      <div className="col-lg-12 login-key">
        <img src="https://pbs.twimg.com/profile_images/1683498543967879173/EHRSRyrp_400x400.jpg" width={'20%'} alt="" srcset="" />
      </div>
      <div className="col-lg-12 login-title">TWEETER</div>
      <div className="col-lg-12 login-form">
      <h5 className="mx-3">Login</h5>
        <div className="col-lg-12 login-form">
          <form className='px-3' onSubmit={login}>
            <div className="form-group">
              <label className="form-control-label">Username</label>
              <input value={username} onChange={(e)=>setUsername(e.target.value)} type="text" placeholder='Enter Username' className="form-control" />
            </div>
            <div className="form-group">
              <label className="form-control-label">Password</label>
              <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password"placeholder='Enter Password' className="form-control" i="" />
            </div>
            <div className="col-lg-12 loginbttm">
              <div className="col-lg-6 login-btm login-text">
                {/* Error Message */}
              </div>
              <div className="col-lg-12 login-btm login-button text-right">
              
                <button type="submit" className="btn btn-outline-primary ">
                  LOGIN
                </button>
                <div className='pt-3'>
                <p>Do not have an account? <Link to="/register">Signup</Link></p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="col-lg-3 col-md-2" />
    </div>
  </div>
</div>


    </div>
  )
}