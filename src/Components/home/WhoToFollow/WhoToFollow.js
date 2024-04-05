import React from 'react';
import Avatar from 'react-avatar';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './whotofollow.css'; // Import the external CSS file
import { useSelector } from 'react-redux';
import useOtherUsers from '../../../hooks/useOtherUsers';
import { Link } from 'react-router-dom';

export default function WhoToFollow() {
  //custom hook
const {user ,otherUsers}=useSelector(store=>store.user);
console.log(otherUsers);
useOtherUsers(user?._id)

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      }
    ]
  };

  return (
    <div className="WhoToFollowContainer">
      <div>
        <h5>Who to follow</h5>
      </div>
      <Slider {...settings}>
      {otherUsers?.map((user) => (
  <div key={user?._id} className='d-flex align-items-center WhoToFollow'>
    <div style={{ marginRight: '10px' }}>
      <Avatar src={user.profilepicture} size="30" round={true} />
    </div>
    <div>
      <h5 className='m-0'>{user?.name}</h5>
      <em className='mb-1'>{`@${user?.username}`}</em>
    </div>
    <div style={{ marginLeft: 'auto' }}>
      <Link to={`/profile/${user?._id}`}>
      <button>Profile</button>
      </Link>
     
    </div>
  </div>
))}

        
        
        {/* Repeat similar structure for other items */}
      </Slider>
      <hr style={{color:"white"}}/>
    </div>
  );
}
