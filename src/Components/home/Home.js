import React, { useEffect } from 'react'
import Sidebar from './Sidebar'

import { Outlet, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useGetMyTweets from '../../hooks/useGetMyTweets';


export default function Home() {
  const { user } = useSelector(store => store.user);
  useGetMyTweets(user?.id);
  const navigate =useNavigate();
  
  useEffect(()=>{
    if(!user){
      navigate('/login')
    }
  },[]);

  return (
    <div>
           <div className="container-fluid col-10">
          <div className="row flex-nowrap ">
          <Sidebar/>
         
          <div className="col px-1 forborder">
     <Outlet/>
    </div>
    </div>
    </div>
    </div>
    
  )
}
