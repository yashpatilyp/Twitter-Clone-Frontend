import React,{useState} from 'react'
import {Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import {USER_API_ENDPOINT} from '../../utils/Constant'
import toast from 'react-hot-toast'

export default function Register() {

  const [name, setName]= useState('');
  const [username , setUsername]= useState('');
  const [email, setEmail]= useState('');
  const [password, setPassword]= useState('');

  const navigate = useNavigate();

  const register =async(e)=>{
    e.preventDefault();
    try {
      
      const res = await axios.post(`${USER_API_ENDPOINT}/register`,{
        name,email,username,password
      })
     if(res.data.success){
      toast.success(res.data.message);
      setName('');
      setEmail('');
      setUsername('');
      setPassword('');
     }
     navigate("/login")
       
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }

  }
  return (
          <div>
          <div className="container ">
       <div className="row">
         <div className="col-lg-3 col-md-2" />
         <div className="col-lg-6 col-md-8 login-box">
           <div className="col-lg-12 login-key">
             <img src="https://pbs.twimg.com/profile_images/1683498543967879173/EHRSRyrp_400x400.jpg" width={'20%'} alt="" srcset="" />
           </div>
           <div className="col-lg-12 login-title">TWEETER</div>
           <div className="col-lg-12 login-form">
             <div className="col-lg-12 login-form">
              <h5 className="mx-3">Register</h5>
               <form className='px-3' onSubmit={register} >
               <div className="form-group">
                   <label className="form-control-label">Full Name</label>
                   <input value={name} onChange={(e)=>setName(e.target.value)} placeholder='Enter Full Name' type="text" className="form-control" />
                 </div>
                 <div className="form-group">
                   <label className="form-control-label">Email</label>
                   <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Enter Email Adddress' type="email" className="form-control" />
                 </div>
                 <div className="form-group">
                   <label className="form-control-label">Username</label>
                   <input value={username} onChange={(e)=>setUsername(e.target.value)} type="text" placeholder='Enter Username' className="form-control" />
                 </div>
                 <div className="form-group">
                   <label className="form-control-label">Password</label>
                   <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder='Enter Password' className="form-control" i="" />
                 </div>
                 <div className="col-lg-12 loginbttm">
                   <div className="col-lg-6 login-btm login-text">
                     {/* Error Message */}
                   </div>
                   <div className="col-lg-12 login-btm login-button text-right">
                     <button type="submit" className="btn btn-outline-primary ">
                       SUBMIT
                     </button>
                     <div className='pt-3'>
                <p>Already have an account? <Link to="/login">Login</Link></p>
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
