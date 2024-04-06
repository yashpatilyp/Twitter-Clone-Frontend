import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "react-avatar";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { TWEET_API_ENDPOINT, timeSince } from "../../utils/Constant";
import {
  FaArrowRight,
  FaHeart,
  FaRegComment,
  FaRegHeart,
} from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { getToken } from "../../redux/userSlice";
import { getRefresh } from "../../redux/tweetSlice";
import { toast } from "react-hot-toast";
export default function ReComment() {

  const [commentInput, setCommentInput] = useState("");
  const dispatch = useDispatch();
  const tokens = useSelector(getToken); // Retrieve the token from Redux state
  const token = tokens.payload.user.token;
  const { user } = useSelector((store) => store.user);
  const { tweets } = useSelector((store) => store.tweet);
  console.log(tweets);

  const { id } = useParams();

  const addcomment = async () => {
    try {
      const res = await axios.put(
        `${TWEET_API_ENDPOINT}/addCommentOnReply/${id}`,
        { commentContent: commentInput },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(getRefresh());
      toast.success(res.data.message);
      setCommentInput("");
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error);
    }
  };
//.......................................................................................................................

  // Find the tweet containing the reply corresponding to the ID
  const tweetWithReply = tweets.find((tweet) =>
    tweet.replies.some((reply) => reply._id === id)
  );

  // Find the reply within the tweet
  const reply = tweetWithReply?.replies.find((reply) => reply._id === id);
 //.........................................................................................................................
 
 
const deleteComment = async (id) => {
console.log(id)
          try {
            const res = await axios.delete(`${TWEET_API_ENDPOINT}/deleteCommentOnReply/${id}`, {
            
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

        //.........................................................................................................................

        const [liked, setLiked] = useState(false);
       
      
        const handleLikeClick = async(commentId) => {
    
          try {
           
         
            // Send a request to like or dislike the comment based on its current state
             const  response=await axios.post(
              `${TWEET_API_ENDPOINT}/reply/${id}/comment/${commentId}`,
              {id:user?._id},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setLiked((prevLiked) => !prevLiked);
            setLiked(!liked);
            // Refresh the tweet list after liking or disliking a comment
            dispatch(getRefresh());
            toast.success(response?.data?.message);
          } catch (error) {
            toast.error(error.response?.data?.message || "Failed to like/dislike comment");
          }
          
          
        };
  return (
    <div>
      <div className="my-3 mx-2">
        <div className="card my-1 py-2" style={{position: 'sticky', top: '0',zIndex:"5",backgroundColor:"black"}} >
          <div className="reply d-flex align-items-center px-3 py-2">
            <div className="avatar-container d-flex justify-content-center align-items-center">
              <Avatar size="30" src={reply?.profilepicture} round={true} />
            </div>
            <div className="content-container ml-3 px-2">
              <div className="d-flex justify-content-center align-items-center">
              <Link to={`/profile/${reply?.userId}`}>  <em className="my-0">@{reply?.username} </em></Link>
                <small className="px-2">.{timeSince(reply.createdAt)}</small>
              </div>
              <div>
                <p className="mb-0">{reply?.content}</p>
              </div>
            </div>
          </div>
          <div className="icons-tweet">
            <div className="d-flex">
              <div>
                <FaRegComment className="comment icons-tweet-i" />{" "}
              </div>
              <p className="mt-2">{reply?.comments.length}</p>
            </div>
            <div className="d-flex">
              <div>
                <FaHeart
                  className="heart icons-tweet-i"
                  style={{ color: "red" }}
                />

                {/* <FaRegHeart className="heart icons-tweet-i" /> */}
              </div>{" "}
              <p className="mt-2">{reply?.likes.length}</p>
            </div>

            <div className="d-flex">
              <div>
                {/* <MdOutlineDeleteOutline className="delete icons-tweet-i" /> */}
              </div>
            </div>
          </div>
          <div className="d-flex px-2 ">
       <div><Avatar size="30" src={user?.profilepicture} round={true} /></div> 
        <input
          type="text"
          className="mb-0 px-3 mx-2"
          id="commentinput"
          placeholder="comment"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
        />
        <div>
          <FaArrowRight
            style={{ color: "white", cursor: "pointer" }}
            onClick={() => addcomment()}
          />
        </div>
      </div>
        </div>
        <h5>Replies -</h5>
        {reply?.comments.map((comment) => (
        <div key={comment._id}  className="my-3 mx-2">
        <div className="card my-1">
          <div className="reply d-flex align-items-center px-3 py-2">
            <div className="avatar-container d-flex justify-content-center align-items-center">
              <Avatar size="30" src={comment.profilepicture} round={true} />
            </div>
            <div className="content-container ml-3 px-2">
              <div className="d-flex justify-content-center align-items-center">
              <Link to={`/profile/${comment?.userId}`}>  <em className="my-0">@{comment?.username} </em></Link>
                <small className="px-2">.{timeSince(comment.createdAt)}</small>
              </div>
              <div>
                <p className="mb-0">{comment?.content}</p>
              </div>
            </div>
          </div>
          <div className="icons-tweet">
            <div className="d-flex">
              <div>
                <FaRegComment className="comment icons-tweet-i" />{" "}
              </div>
              <p className="mt-2">{comment?.length}</p>
            </div>
            <div className="d-flex" onClick={()=>handleLikeClick(comment?._id)}>
      <div>
      {comment.likes.includes(user?._id) ? (
      <FaHeart className="heart icons-tweet-i" style={{ color: 'red' }} />
    ) : (
      <FaRegHeart className="heart icons-tweet-i" />
    )}
      </div>{" "}
      <p className="mt-2">{comment?.likes?.length}</p>
    </div>
{  user?._id === comment?.userId && (
          <div className="d-flex">
              <div>
                <MdOutlineDeleteOutline className="delete icons-tweet-i" onClick={()=>deleteComment(comment?._id)}/>
              </div>
            </div>
)}
            
          </div>
          
        </div>
        
      </div>
         ))}
      </div>
      
    </div>
  );
}
