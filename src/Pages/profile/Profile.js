import React, { useEffect, useState } from 'react'
import Avatar from 'react-avatar';
import { IoMdArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { CiBookmark, CiLocationOn } from "react-icons/ci";
import { IoMdBookmark } from "react-icons/io";
import useGetProfile from '../../hooks/useGetProfile';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { TWEET_API_ENDPOINT, USER_API_ENDPOINT, timeSince } from '../../utils/Constant';
import { followingUpdate, getMyProfile, getProfileTweets, getRefreshForUser, getToken, getUser } from '../../redux/userSlice';
import { getAllTweets, getRefresh} from '../../redux/tweetSlice'
import {toast} from 'react-hot-toast'
import WhoToFollow from '../../Components/home/WhoToFollow/WhoToFollow.js'
import { FaHeart, FaMapMarkerAlt, FaRegComment, FaRegHeart, FaRetweet } from 'react-icons/fa';
import { AiTwotonePicture } from 'react-icons/ai';

export default function Profile() {

  const {profile,user,tweets} = useSelector(store=>store.user)
  
  
  const {id}=useParams();
  // custom hooks
  useGetProfile(id);
  const dispatch = useDispatch();
  const tokens = useSelector(getToken); // Retrieve the token from Redux state
const token =(tokens.payload.user.token)
  //................................................................................

  const followAndUnfollow =async()=>{
    if(user.following.includes(id)){
      //unfollow
      try {
        const res= await axios.post(`${USER_API_ENDPOINT}/unfollow/${id}`,{id:user?._id},
        {
          headers: {
            Authorization: `Bearer ${token}` // Set the Authorization header with the token
          }
        }
        )
        console.log(res);
        dispatch(followingUpdate(id));
        dispatch(getRefresh())
        dispatch(getRefreshForUser())
        toast.success(res.data.message)

        
      } catch (error) {
        toast.error(error.response.data.message)
        console.log(error)
      }
    }else{
      //follow

      try {
        const res= await axios.post(`${USER_API_ENDPOINT}/follow/${id}`,{id:user?._id},
        {
          headers: {
            Authorization: `Bearer ${token}` // Set the Authorization header with the token
          }
        }
        )
        console.log(res);
        dispatch(followingUpdate(id));
        dispatch(getRefresh())
        dispatch(getRefreshForUser())
        toast.success(res.data.message)

        
      } catch (error) {
        toast.error(error.response.data.message)
        console.log(error)
      }
    }
  }
  const [selectedImage, setSelectedImage] = useState(user?.profilepicture);
  const [name, setName] = useState(user?.name);
  const [location, setLocation] = useState(user?.location);
  const [dob, setDob] = useState(user?.dob);
  const [bio,setBio] = useState(user?.bio);
  const [email,setEmail] = useState(user?.email);
  const [profilepic, setProfilepic] = useState(user?.profilepicture);
  const [cloudinaryUrl, setCloudinaryUrl] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Function to handle profile picture upload
 const handleProfilePicUpload = (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onloadend = () => {
    const image = new Image();
    image.src = reader.result;
    image.onload = () => {
      const width = image.width;
      const height = image.height;
      if (width === height) {
        // Proceed with setting the selected image state or any other actions
        setSelectedImage(reader.result);
      } else {
      
        alert("Profile picture must be square in shape");
        // Optionally, clear the selected image state
        setSelectedImage(null);
        // Optionally, clear the file input value
        e.target.value = null;
      }
    };
  };

  if (file) {
    reader.readAsDataURL(file);
  }
};


  const uploadToCloudinary = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default'); // Replace 'your_upload_preset' with your Cloudinary upload preset

      const response = await axios.post('https://api.cloudinary.com/v1_1/dfm5wkzjq/image/upload', formData);

      return response.data.secure_url; // Return the secure URL of the uploaded image
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = profilepic;

      // Check if a new profile picture is selected
      if (cloudinaryUrl) {
        // Upload the new profile picture to Cloudinary
        imageUrl = await uploadToCloudinary(profilepic);
      }

      const updatedProfile = {
        name: name,
        location: location,
        dob: dob,
        email:email,
        bio:bio,
        profilepicture: imageUrl, // Use the Cloudinary URL
      };
console.log(updatedProfile)
      // Make a request to update the user's profile
      const response = await axios.put(`${USER_API_ENDPOINT}/update-profile/${id}`, updatedProfile, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
     dispatch(getUser(response.data.user));
     dispatch(getMyProfile(response.data.user));
     
        toast.success('Profile updated successfully!');
        toggleModal(); 
       
      
    } catch (error) {
      toast.error('Error updating profile:', error);
    }
  };
//  console.log(tweets)

const profileId = profile?._id;

// Check if tweets is defined before filtering
const userTweetsCount = tweets ? tweets.filter(tweet => tweet.userDetails._id === profileId).length : 0;

console.log('Number of tweets for the user:', userTweetsCount);
console.log(profile);



 //......................................................................
useEffect(()=>{
  const fetchUserTweets = async () => {
    try {
      const res = await axios.get(`${TWEET_API_ENDPOINT}/getUserTweet/${user?._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
     
      dispatch(getProfileTweets(res.data.tweets));
    } catch (error) {
      console.log(error);
    }
  };
  fetchUserTweets()
},[])

//.........................................................................................

const [loading, setLoading] = useState(true);
  useEffect(() =>{
    setLoading(false);
  })
  return (
   <div>
    {loading ? (
        // Show spinner while loading
       <>
        <div class="spinner">
        <div class="react1"></div>
        <div class="react2"></div>
        <div class="react3"></div>
        <div class="react4"></div>
        <div class="react5"></div>
    </div></>
      ) : (
   <div className='profile ' >
   <div >
   <div className='d-flex justify-content-between'>
  <div className='d-flex items-center'>
    <div className='py-2 px-1'>
      <IoMdArrowBack size="20px" style={{color:"white"}} />
    </div>
    <div className='p-2'>
      <div><h5 className='mb-1'>{profile?.name}</h5></div>
      {user?._id === profile?._id && (
  <div><p>{userTweetsCount} Posts</p></div>
)}

    </div>
  </div>
  
  <div className=' p-2 text-center'>
    <div className="d-flex ml-auto px-2">
      <div className='px-2'>
        <h6>Followers</h6>
        <p>{profile?.followers.length}</p>
      </div>
      <div>
        <h6>Following</h6>
        <p>{profile?.following.length}</p>
      </div>
    </div>
  </div>
</div>



    <div className=''style={{position:"relative"}}>
      <img src="https://www.jadeglobal.com/sites/default/files/2022-09/9-ways-to-improve-UI-in-Web-Development.jpg" alt="banner" srcset="" />

      <div className='profile-avtar '>
      <Avatar size='120'   src={profile?.profilepicture}  round={true} />
      
      </div>
      <div className='profile-avtarr '>
      <Avatar size='60'  src={profile?.profilepicture}  round={true} />
      
      </div>
      
    </div>
    <div className='edit-btn'>
      {
        profile?._id===user?._id ?(
<button onClick={()=>toggleModal()}>Edit Profile</button>
        ):(
<button onClick={followAndUnfollow} >{user.following.includes(id) ? "Following" : "Follow"}</button>
        )
      }
        
      </div>
     <div  className=' profile-h card mt-3 mx-2'>
     <div>
      <h5 className='mt-2 mb-0'>{profile?.name}</h5>
      <em>@{profile?.username}</em>
      </div>
      <div>
        <p className='mb-0'>{profile?.bio}</p>
        </div>
        <div className=''>
        {profile?.location && (
    <p className='mb-0'><FaMapMarkerAlt /> {profile?.location} </p>
  )}
  {profile?.dob && <p>DOB: {profile?.dob}</p>}
        </div>
     </div>
   </div>
   {isModalOpen && (
        <form onSubmit={handleUpdate}>
          <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={toggleModal}>&times;</span>
            <h2>Edit Profile</h2>
            <label className='form-control-label'>Name</label>
            <input type="text" value={name} onChange={(e)=>setName(e.target.value)}/>
            <label className='form-control-label'>Bio</label>
            <input type="text" value={bio} onChange={(e)=>setBio(e.target.value)}/>
            <label className='form-control-label'>Email</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <label className='form-control-label'>DOB</label>
            <input type="date" value={dob} onChange={(e)=>setDob(e.target.value)}/>
            <div>
  <label htmlFor="profilePicInput" className="fileInputLabel">
    <AiTwotonePicture className="fileInputIcon" size={"30px"} />
  </label>
  <input id="profilePicInput" type="file" className='form-control px-2 mx-2 input-avtar' onChange={handleProfilePicUpload} style={{ display: 'none' }} />
</div>

            <img src={selectedImage} alt="" srcset="" style={{width:"100px",height:"100px"}} />
            <label className='form-control-label'>Location</label>
            <input type="text" value={location} onChange={(e)=>setLocation(e.target.value)} />
            <input className='py-1' type="submit" value="Submit" style={{width:'40%',backgroundColor:"black", color:"white", border:"1px solid white" ,marginRight:"auto",marginLeft:"auto"}}/>
          </div>
        </div>
        </form>
      )}
      <div>
      <WhoToFollow/>
      </div>
     
   </div>
    )}
   {user?._id===profile?._id && (
   <div>
   <h5 className='mx-3 my-3'>Your Tweets :  </h5>  
   {tweets.map((usertweet) => (
     <div key={usertweet._id} className="card mt-2 py-2 mx-2">
       {/* Render the content of the tweet here */}
       <div className="d-flex">
         {/* Avatar */}
         <div className="mx-2 mb-0">
           <Avatar src={usertweet?.userDetails?.profilepicture} size="30" round={true} />
         </div>
         {/* Tweet details */}
         <div className="tweet-comp">
           <div className="d-flex items-center ml-2  align-items-center">
             <h5 className="m-0 mx-2">{usertweet?.userDetails?.name}</h5>
             <em className="m-0 ">
               <Link to={`/profile/${usertweet?.userDetails?._id}`} style={{ color: "white" }}>
                 @{usertweet?.userDetails?.username}
               </Link>
             </em>
             <small className="px-2 ">
               {usertweet &&
                 usertweet.userDetails &&
                 usertweet.userDetails &&
                 usertweet.userDetails?.username &&
                 timeSince(usertweet?.createdAt)}
             </small>
           </div>
           {/* Tweet description */}
           <p className="mx-2">{usertweet?.description}</p>
         </div>
       </div>
       {/* Tweet image */}
       <div className="tweetimg my-2" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
         {usertweet?.picture ? (
           <img src={usertweet.picture} alt="tweet" />
         ) : (
           <div>
             {/* Placeholder or alternative content when there's no picture */}
           </div>
         )}
       </div>
       {/* Tweet icons */}
       <div className="icons-tweet">
         {/* Comment icon */}
         <div className=" d-flex ">
           <div>
             <FaRegComment className="comment icons-tweet-i" style={{ cursor: "none" }} />{" "}
           </div>
           <p className="mt-2">{usertweet?.replies?.length}</p>
         </div>
         {/* Like icon */}
         <div className=" d-flex ">
           <div>
             <FaHeart className="heart icons-tweet-i" style={{ color: "red", cursor: "none" }} />
           </div>{" "}
           <p className="mt-2">{usertweet?.like?.length}</p>
         </div>
         <div className=" d-flex ">
         <div>
            {" "}
            < FaRetweet  className=" retweet icons-tweet-i" style={{  cursor: "none" }}/>
          </div>
          <p className="mt-2">{usertweet?.retweetedBy?.length}</p>
          </div>
         {/* Bookmark icon */}
         <div className=" d-flex ">
           <div>
             <IoMdBookmark className=" bookmark icons-tweet-i" color='yellow' style={{ cursor: "none" }}/>
           </div>
         </div>
       </div>
     </div>
   ))}
 </div>
 
    )}</div>
    
 
  )
}
