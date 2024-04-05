import axios from "axios";
import { USER_API_ENDPOINT } from "../utils/Constant";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  getOtherUsers } from "../redux/userSlice";
import { getToken } from "../redux/userSlice";



const useOtherUsers = (id) => {

  const dispatch = useDispatch();
  const tokens = useSelector(getToken); // Retrieve the token from Redux state
const token =(tokens.payload.user.token)

  useEffect(() => {
    const fetchOtherUsers = async () => {
      try {
        const res = await axios.get(`${USER_API_ENDPOINT}/otheruser/${id}`, {
           //  authentication
        
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });
        
        dispatch(getOtherUsers(res.data.otherUsers));
        console.log(res.data.otherUsers);
      } catch (error) {
        console.log(error);
      }
    };

    if (token) { 
          fetchOtherUsers();
    }
  
  }, []);
};


export default useOtherUsers;