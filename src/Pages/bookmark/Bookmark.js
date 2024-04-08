import React, { useEffect, useState } from 'react';
import { getMyProfile, getRefreshForUser, getToken } from '../../redux/userSlice';
import { USER_API_ENDPOINT, timeSince } from '../../utils/Constant';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import toast from "react-hot-toast";
import { IoMdBookmark } from 'react-icons/io';
import { FaHeart, FaRegComment, FaRetweet } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Avatar from 'react-avatar';
import { getRefresh } from '../../redux/tweetSlice';

export default function Bookmark() {
  const { profile, user } = useSelector(store => store.user);
  const { tweets } = useSelector(store => store.tweet);
  const dispatch = useDispatch();
  const tokens = useSelector(getToken);
  const token = tokens.payload.user.token;
const[bookmarkedTweets,setBookmarkTweets]=useState([])
  useEffect(() => {
    fetchBookmarkedTweets();
  }, []);

  const fetchBookmarkedTweets = async () => {
    try {
      const res = await axios.get(`${USER_API_ENDPOINT}/users/${user._id}/bookmarks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(getRefreshForUser());
      dispatch(getMyProfile(res.data.user));
    
      setBookmarkTweets(res.data.bookmarkedTweets);
      console.log(res.data.bookmarkedTweets)
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

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
      dispatch(getMyProfile(res.data.user));
      toast.success(res.data.message);
    
      fetchBookmarkedTweets();
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

 

  return (
    <div>
      {bookmarkedTweets.length > 0 ? (
        <div>
          {bookmarkedTweets.length > 0 ? (
            <>
              <h5 className='mx-3 my-3'>Bookmarked Tweets :</h5>
              {bookmarkedTweets.map((tweet) => (

                <div key={tweet._id} >

                  <div className="card mt-2 py-2 mx-2">
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

                          <em className="m-0 ">   <Link to={`/profile/${tweet?.userDetails?._id} `} style={{ color: "white" }}>
                            {`@${tweet?.userDetails?.username} `}

                          </Link>   </em>
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
                    <div className="tweetimg my-2" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      {tweet?.picture ? (
                        <img src={tweet.picture} alt="tweet" />
                      ) : (
                        <div>
                          {/* Placeholder or alternative content when there's no picture */}
                        </div>
                      )}
                    </div>
                    <div className="icons-tweet">
                      <div className=" d-flex ">
                        <div>
                          <FaRegComment className="comment icons-tweet-i" style={{ cursor: "none" }} />{" "}
                        </div>
                        <p className="mt-2">{tweet?.replies?.length}</p>
                      </div>
                      <div className=" d-flex ">
                        <div>

                          <FaHeart
                            className="heart icons-tweet-i"
                            style={{ color: "red", cursor: "none" }}
                          />



                        </div>{" "}
                        <p className="mt-2">{tweet?.like?.length}</p>
                      </div>
                      <div className=" d-flex ">
         <div>
            {" "}
            < FaRetweet  className=" retweet icons-tweet-i" style={{  cursor: "none" }}/>
          </div>
          <p className="mt-2">{tweet?.retweetedBy?.length}</p>
          </div>
                      <div className=" d-flex ">
                        <div>
                          {" "}
                          <IoMdBookmark className=" bookmark icons-tweet-i" color='yellow' onClick={() => bookmarkAndUnbookmark(tweet?._id)} />
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

              ))}
            </>
          ) : (
            " "
          )}
        </div>
 ) : (
          <p className="d-flex justify-content-center py-2">No bookmarked tweets.</p>
          
        )}
    </div>
  )
}
