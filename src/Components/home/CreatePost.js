import React, { useState } from 'react';
import Avatar from 'react-avatar';
import { AiTwotonePicture } from "react-icons/ai";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { TWEET_API_ENDPOINT } from '../../utils/Constant';
import { getToken } from '../../redux/userSlice';
import toast from 'react-hot-toast';
import { getIsActive, getRefresh } from '../../redux/tweetSlice';
import { getAllTweets } from '../../redux/tweetSlice';

export default function CreatePost() {
  const [description, setDescription] = useState('');
  const [picture, setPicture] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // For displaying selected image preview
  const { user } = useSelector(store => store.user);
  const { isActive } = useSelector(store => store.tweet);
  const dispatch = useDispatch();
  const tokens = useSelector(getToken);
  const token = tokens.payload.user.token;

  const handlePictureChange = (event) => {
    const selectedImage = event.target.files[0];
    setPicture(selectedImage);
    // Display selected image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(selectedImage);
  };

  const createTweet = async () => {
    try {
      const formData = new FormData();
      formData.append('description', description);
      formData.append('id', user?._id);
      formData.append('picture', picture);

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      const response = await axios.post(
        `${TWEET_API_ENDPOINT}/create`,
        formData,
        config
      );

      dispatch(getRefresh());
      toast.success(response.data.message);
      setDescription('');
      setPicture('');
      setImagePreview(null); // Clear image preview after posting

    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error);
    }
  };

  //......................................................................

  const fetchUserTweets = async () => {
    try {
      const res = await axios.get(`${TWEET_API_ENDPOINT}/getUserTweet/${user?._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      dispatch(getAllTweets(res.data.tweets));
    } catch (error) {
      console.log(error);
    }
  };

  
  const forYou = () => {
    dispatch(getIsActive(true));
  };

  const following = () => {
    dispatch(getIsActive(false));
  };
  
  const usertweet = () => {
    fetchUserTweets()
    // You may want to dispatch an action or perform other logic related to "Yours" tab
  };
  
  return (
    <div style={{ position: 'sticky', top: '0',zIndex:"5",backgroundColor:"black"}}>
       <div className='d-flex col'>
        <div onClick={forYou} className={`col-4 text-center `}>
          <button className='w-100 btn-createpost'>For You</button>
        </div>
        <div onClick={following} className={`col-4 text-center `}>
          <button className='w-100 btn-createpost'>Following</button>
        </div>
        <div onClick={usertweet} className={`col-4 text-center`}>
          <button className='w-100 btn-createpost'>Yours</button>
        </div>
      </div>

      <div className='px-2 py-3 d-flex avtar'>
        <div>
          <Avatar src={user?.profilepicture} size="30" round={true} />
        </div>
        <input value={description} onChange={(e) => setDescription(e.target.value)} type="text" className='form-control px-2 mx-2 input-avtar' placeholder='What is Happening ....!' />
      </div>

      <div className='d-flex picture-btn p-2'>
        <div>
          <label htmlFor="fileInput" className="fileInputLabel">
            <AiTwotonePicture className="fileInputIcon" />
          </label>
          <input id="fileInput" type="file" className='form-control px-2 mx-2 input-avtar' onChange={handlePictureChange} style={{ display: 'none' }} />
        </div>
        {imagePreview && (
          <div>
            <img src={imagePreview} alt="Selected" style={{ maxWidth: '100px' }} />
          </div>
        )}
        <div><button onClick={createTweet} className='post-btn'>Post</button></div>
      </div>
      <hr style={{ color: "white" }} />
    </div>
  );
}