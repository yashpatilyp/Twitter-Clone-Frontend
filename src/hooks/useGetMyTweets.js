import axios from "axios";
import { TWEET_API_ENDPOINT } from "../utils/Constant";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getToken } from "../redux/userSlice";
import { getAllTweets } from "../redux/tweetSlice";


const useGetMyTweets = () => {
  const {user}=useSelector(store=>store.user);
 
const id = user?._id;
console.log(id)
  const dispatch = useDispatch();
  const tokens = useSelector(getToken); // Retrieve the token from Redux state
const token =(tokens.payload.user.token)

const {refresh,isActive} = useSelector(store=>store.tweet)
const {refreshin} = useSelector(store=>store.user)

const fetchMyTweets = async () => {
  try {
    const res = await axios.get(`${TWEET_API_ENDPOINT}/getalltweets/${id}`, {
       //  authentication
      headers: {
        Authorization: `Bearer ${token}` // Set the Authorization header with the token
      }
    });
    dispatch(getAllTweets(res.data.tweets));

  } catch (error) {
    console.log(error);
  }
};

const followingTweet=async()=>{
  
  try {
    const res = await axios.get(`${TWEET_API_ENDPOINT}/getfollwingtweets/${id}`, {
       //  authentication
      headers: {
        Authorization: `Bearer ${token}` // Set the Authorization header with the token
      }
    });
    dispatch(getAllTweets(res.data.tweets));
// console.log(res.data.tweets); 
  } catch (error) {
    console.log(error);
  }

}


useEffect(() => {
  if (token) { // Only fetch profile if token is present
    if (isActive) {
      fetchMyTweets();
      
    } else {
      followingTweet();
    }
   
  }
}, [refresh, isActive, refreshin]);


 
};




export default useGetMyTweets;