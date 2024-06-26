import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import './index.css'
import { Provider } from "react-redux";
import store from "./redux/store";
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from "redux-persist";

let persistor = persistStore(store);
ReactDOM.render(
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
            <App />
            </PersistGate>
          
          </Provider>

, document.getElementById("root"));
