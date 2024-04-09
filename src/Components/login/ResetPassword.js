import React, { useState } from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import axios from 'axios'; // Import Axios for making HTTP requests
import { USER_API_ENDPOINT } from '../../utils/Constant';
import toast from 'react-hot-toast'
export default function ResetPassword() {
          const [password, setPassword] = useState('');
  
          const [loading, setLoading] = useState(false);
          const navigate= useNavigate();
        
          const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);
        
            try {
              const response = await axios.post(`${USER_API_ENDPOINT}/reset-password`, {
                password,
              
              });
        
              // Handle success response
              console.log(response.data);
              toast.success(response.data.message)
            
              setPassword('');
              setLoading(false);
              navigate("/login")
            } catch (error) {
              // Handle error response
              console.error('Error:', error);
              toast.error(error.message); // Extracting the error message
              setLoading(false);
            }
          };
  return (
    <div>
       <div>
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-2" />
          <div className="col-lg-6 col-md-8 login-box">
            <div className="col-lg-12 login-key">
              <img src="https://pbs.twimg.com/profile_images/1683498543967879173/EHRSRyrp_400x400.jpg" width={'20%'} alt="" srcset="" />
            </div>
            <div className="col-lg-12 login-title">TWEETER</div>
            <div className="col-lg-12 login-form">
              <h2 className="mx-3">Reset Password</h2>
              <div className="col-lg-12 login-form">
                <form className='px-3' onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-control-label">Password</label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Enter Password' className="form-control" />
                  </div>
                 
                  <div className="col-lg-12 loginbttm">
                    
                    <div className="col-lg-12 login-btm login-button text-right">
                      <button type="submit" className="btn btn-outline-primary" disabled={loading}>
                        {loading ? 'Loading...' : 'SUBMIT'}
                      </button>
                      <div className='pt-3'>
                     
                        <h5><Link to='/login'>go to login...</Link></h5>
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
    </div>
  )
}
