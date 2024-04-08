import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_ENDPOINT } from "../utils/Constant";
import { getMyProfile, getToken } from "../redux/userSlice";


const useGetProfile = (id) => {
  const dispatch = useDispatch();
  const tokens = useSelector(getToken);
  const token = tokens?.payload?.user?.token;
  const {refreshin} = useSelector(store=>store.user)
  const {refresh}=useSelector(store=>store=>store.tweet)
  const fetchMyProfile = async () => {
    try {
      const res = await axios.get(`${USER_API_ENDPOINT}/profile/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    
      dispatch(getMyProfile(res.data.user));
      console.log(res.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMyProfile();
    }
  }, [id,refreshin,refresh]); // Added dispatch as dependency

  return fetchMyProfile; // Return the fetch function
};

export default useGetProfile;
