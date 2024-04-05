import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import { FaRegComment } from "react-icons/fa";

import { CiBookmark } from "react-icons/ci";
import { FaHeart } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa6";
import { CiLocationArrow1 } from "react-icons/ci";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getToken } from "../../redux/userSlice";
import { TWEET_API_ENDPOINT, USER_API_ENDPOINT } from "../../utils/Constant";
import axios from "axios";
import { getRefresh } from "../../redux/tweetSlice";
import { getRefreshForUser } from "../../redux/userSlice";
import toast from "react-hot-toast";
import { timeSince } from "../../utils/Constant";
import { Link } from "react-router-dom";

export default function Tweet({tweet}) {
  const [liked, setLiked] = useState();

  // console.log({tweet})
  const {user}=useSelector(store=>store.user);
  const {tweets}=useSelector(store=>store.tweet);
 
// console.log(user)
const dispatch = useDispatch();
const tokens = useSelector(getToken); // Retrieve the token from Redux state
const token =(tokens.payload.user.token)

useEffect(() => {
  // Check if the current user has previously liked the tweet
  if (tweet?.like?.some(like => like === user?._id)) {
    setLiked(true); // If liked, set the liked state to true
  } else {
    setLiked(false); // Otherwise, set the liked state to false
  }
}, [tweet, user]);


const likeOrDislike = async (id) => {
  
  try {
    const res = await axios.put(
      `${TWEET_API_ENDPOINT}/like/${id}`,
    
      { id: user?._id },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
 
    dispatch(getRefresh());
    setLiked(!liked);
    toast.success(res.data.message);
  } catch (error) {
    toast.error(error.response.data.message);
    console.log(error);
  }
};
  //....................................................................................

  const bookmarkAndUnbookmark = async (id) => {
    try {
      const res = await axios.put(
        `${USER_API_ENDPOINT}/bookmark/${id}`,
        { id: user?._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      dispatch(getRefreshForUser());
   
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message || "server error");
      console.log(error);
    }
  };
  //......................................................................................

  const deleteTweet = async () => {
    try {
      const res = await axios.delete(`${TWEET_API_ENDPOINT}/delete`, {
        data: { id: tweet?._id }, // Pass data containing ID
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(res);
      dispatch(getRefresh())
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error);
    }
  }

//......... comment .......................................................................
const [commentInput, setCommentInput] = useState("");

const addComment = async (id) => {
  try {
    const res = await axios.put(
      `${TWEET_API_ENDPOINT}/${id}/reply`,
      { replyContent: commentInput }, // Check if `commentInput` is correct
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  
    dispatch(getRefresh());
    toast.success(res.data.message);
    setCommentInput(""); // Clear the comment input field after adding the comment
  } catch (error) {
    toast.error(error.response.data.message);
    console.error(error);
  }
};

//.....................................................................................................................



const deleteComment = async (tweetId,replyId) => {

  try {
    const res = await axios.delete(`${TWEET_API_ENDPOINT}/deleteComment`, {
     data: { tweetId, replyId },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(res);
   dispatch(getRefresh())
    toast.success(res.data.message);
  } catch (error) {
    // Handle error
    toast.error(error.response.data.message);
    console.error(error);
  }
}
//................................................................................................................................


const [likedComments, setLikedComments] = useState({});
useEffect(() => {
  // Iterate through each comment in the tweet
  tweet.replies.forEach(comment => {
    // Check if the current user has previously liked the comment
    if (comment.likes.some(like => like === user?._id)) {
      // If liked, update the likedComments state object to reflect that
      setLikedComments(prevState => ({
        ...prevState,
        [comment._id]: true
      }));
    } else {
      // Otherwise, update the likedComments state object accordingly
      setLikedComments(prevState => ({
        ...prevState,
        [comment._id]: false
      }));
    }
  });
}, [tweet, user]);
// Function to toggle like status of a comment
const toggleLike = async (tweetId, replyId) => {
  try {
    // Send a request to like or dislike the comment based on its current state
     const  response=await axios.put(
      `${TWEET_API_ENDPOINT}/tweet/${tweetId}/comment/${replyId}`,
      {id:user?._id},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

  

    // Refresh the tweet list after liking or disliking a comment
    dispatch(getRefresh());
    toast.success(response?.data?.message);
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to like/dislike comment");
  }
};

  
  return (
    <div className="card mt-2 py-2">
      <div className="d-flex">
        <div className="mx-2 mb-0">
        
          <Avatar
            src={tweet?.userDetails?.profilepicture}
            size="30"
            round={true}
          />
  
        </div>
        <div className="tweet-comp">
          <div className="d-flex items-center ml-2  align-items-center">
          
            <h5 className="m-0 mx-2">
            {tweet?.userDetails?.name}
              </h5>
       
              <em className="m-0 ">  <Link to={`/profile/${tweet?.userDetails?._id} `}style={{color:"white"}}>  
           {`@${tweet?.userDetails?.username} `}
 
  </Link>    </em>
    <small className="px-2 "> {tweet &&
    tweet.userDetails &&
    tweet.userDetails &&
    tweet.userDetails?.username &&
    timeSince(tweet?.createdAt)}</small>
          </div>

          <p className="mx-2">
           {tweet?.description}
          </p>
          

        </div>
      </div>
      <div className="tweetimg" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  {tweet?.picture ? (
    <img src={tweet.picture} alt="tweet"  />
  ) : (
    <div>
      {/* Placeholder or alternative content when there's no picture */}
    </div>
  )}
</div>
      <div className="icons-tweet">
        <div className=" d-flex ">
          <div>
            <FaRegComment className="comment icons-tweet-i"  />{" "}
          </div>
          <p className="mt-2">{tweet?.replies?.length}</p>
        </div>
        <div className=" d-flex ">
          <div onClick={()=>likeOrDislike(tweet?._id)}>
          {liked ? (
        <FaHeart className="heart icons-tweet-i "style={{color:"red"}} /> 
      ) : (
        <FaRegHeart className="heart icons-tweet-i" /> 
      )}
          </div>{" "}
          <p className="mt-2">{tweet?.like?.length}</p>
        </div>
        <div className=" d-flex ">
          <div>
            {" "}
            <CiBookmark className=" bookmark icons-tweet-i"  onClick={()=>bookmarkAndUnbookmark(tweet?._id)}/>
          </div>
          {/* <p className="mt-2">{user?.bookmarks?.length}</p> */}
        </div>
        {
          user?._id===tweet?.userId && (
            <div className=" d-flex ">
          <div onClick={()=>deleteTweet(tweet?._id)}>
            {" "}
            <MdOutlineDeleteOutline className=" delete icons-tweet-i"  />
          </div>
          
        </div>
          )
        }
        
      </div>
      <div className="d-flex px-2 ">
      <Avatar size='30'  src={user?.profilepicture}  round={true} />
        <input type="text"className="mb-0 px-3 mx-2" id="commentinput"placeholder="comment" value={commentInput}
  onChange={(e) => setCommentInput(e.target.value)} />
        <div>
        <FaArrowRight style={{color:"white" ,cursor:"pointer"}}onClick={()=>addComment(tweet?._id)}/>
        </div>
      </div>
      <div className="my-3 mx-2">
  {tweet.replies.map((reply, index) => (
    <div className="card my-1" key={index} style={{ backgroundColor: "black" }}>
      <div className="reply d-flex align-items-center px-3 py-2">
        <div className="avatar-container d-flex justify-content-center align-items-center">
          <Avatar size='30' src={reply?.profilepicture} round={true} />
        </div>
        <div className="content-container ml-3 px-2">
          <div className="d-flex justify-content-center align-items-center">
            <Link to={`/profile/${reply?.userId} `}><em className="my-0">@{reply?.username}  </em></Link>
            <small className="px-2">.{timeSince(reply.createdAt)}</small>
          </div>
          <div>
            <p className="mb-0">{reply.content}</p>
          </div>
        </div>
      </div>
      <div className="icons-tweet">
        <div className="d-flex">
          <div>
            <FaRegComment className="comment icons-tweet-i" />{" "}
          </div>
          <p className="mt-2">0</p>
        </div>
        <div className="d-flex">
          <div onClick={() => toggleLike(tweet._id, reply._id)}>
            {likedComments[reply._id] ? (
              <FaHeart className="heart icons-tweet-i" style={{ color: "red" }} />
            ) : (
              <FaRegHeart className="heart icons-tweet-i" />
            )}
          </div>{" "}
          <p className="mt-2">{reply?.likes.length}</p>
        </div>
        {
          user?._id === reply?.userId && (
            <div className="d-flex">
              <div onClick={() => deleteComment(tweet?._id, reply?._id)}>
                <MdOutlineDeleteOutline className="delete icons-tweet-i" />
              </div>
            </div>
          )
        }
      </div>
    </div>
  ))}
</div>

    
    </div>
  );
}
