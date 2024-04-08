import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Link, useNavigate} from 'react-router-dom'
import { getMyProfile, getOtherUsers, getToken, getUser } from '../../redux/userSlice';
import {toast} from 'react-hot-toast'
import { TWEET_API_ENDPOINT } from '../../utils/Constant';
import { getAllTweets } from '../../redux/tweetSlice';
import axios from 'axios'
import { CiBookmark } from 'react-icons/ci';
import { FaBookmark } from 'react-icons/fa';
export default function Sidebar() {
  const {user}=useSelector(store=>store.user)
  const dispatch = useDispatch();
 const navigate=useNavigate();
 
  const logout = () => {

    dispatch(getUser(null)); // Reset user to null
    dispatch(getToken(null)); // Reset token to null
dispatch(getOtherUsers(null)); 
dispatch(getMyProfile(null));
   toast.success("Logged Out Successfully")
    navigate('/login');
  };
  const tokens = useSelector(getToken); // Retrieve the token from Redux state
  const token =(tokens.payload.user.token)
  const handleHomeClick = async () => {
    try {
      const res = await axios.get(`${TWEET_API_ENDPOINT}/getalltweets/${user?._id}`, {
        //  authentication
        headers: {
          Authorization: `Bearer ${token}` // Set the Authorization header with the token
        }
      });
      
      // Sort tweets based on timestamp in descending order (latest first)
      const sortedTweets = res.data.tweets.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      dispatch(getAllTweets(sortedTweets));
      dispatch(getMyProfile(res.data.profile));
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <div className="sidebar_container col-auto col-md-4 col-lg-3 min-vh-100 d-flex flex-column justify-content-between  p-0">
      <div className="  sidebar-padding">
        <a href="#" className="d-flex text-decoration-none mt-1 align-items-center text-white">
          <span className=" d-none d-sm-inline">
            <img width={'30%'} src="https://toppng.com/uploads/preview/twitter-x-new-logo-icon-png-11692480121koxvq54was.webp" alt="" />
          </span>
        </a>
      
       <ul className="nav nav-pills flex-column mt-4 ">
         
         <li className="nav-item py-2 py-sm-0 "onClick={handleHomeClick}>
           <Link to="/" className="nav-link text-white">
           <i class="fa-solid fa-house"></i>
             <span className="fs-6 d-none d-sm-inline ms-2 ">Home</span>
           </Link>
         </li>
         <li className="nav-item">
           <Link to={`/profile/${user?._id} `}className="nav-link text-white">
           <i class="fa-regular fa-user"></i>
             <span className="fs-6 d-none d-sm-inline ms-2">Profile</span>
           </Link>
         </li>
         <li className="nav-item">
           <Link to={`/bookmark/${user?._id} `}className="nav-link text-white">
           <FaBookmark />
             <span className="fs-6 d-none d-sm-inline ms-2"onClick={handleHomeClick}>Bookmark</span>
           </Link>
         </li>
         <li className="nav-item py-2 py-sm-0" onClick={logout}>
           <a href="#" className="nav-link text-white">
           <i class="fa-solid fa-right-from-bracket"></i>
             <span className="fs-6  d-none d-sm-inline ms-2">Logout</span>
           </a>
         </li>
       </ul>
       </div>
      </div>
  
  );
}