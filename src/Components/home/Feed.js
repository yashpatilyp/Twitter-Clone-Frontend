import React from 'react'
import CreatePost from './CreatePost'
import Tweet from './Tweet'
import WhoToFollow from './WhoToFollow/WhoToFollow'
import { useSelector } from 'react-redux'

export default function Feed() {
  const {tweets} = useSelector(store=>store.tweet);
console.log(tweets)
  return (
          <div className=' feed-container p-2'>
         <CreatePost  />
          <WhoToFollow/>
          {Array.isArray(tweets) && tweets.map(tweet => (
        <Tweet key={tweet?._id} tweet={tweet} />
      ))}
      
         

        </div>
        
  )
}
