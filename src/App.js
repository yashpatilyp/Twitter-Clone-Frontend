import React from "react";
import './Pages/profile/profile.css'

import "./App.css";
import "./Pages/home.css";
import './Components/home/WhoToFollow/whotofollow.css'
import {Toaster} from 'react-hot-toast'

import Body from "./Components/home/Body";

const App = () => {
  return (
   
      <div className="App">
       <Body/>
       <Toaster/>
        </div>
  );
};

export default App;
