import React from 'react'
import Home from './Home'
import Feed from './Feed'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Profile from '../../Pages/profile/Profile'
import Login from '../login/Login'
import Register from '../register/Register'

export default function Body() {
          const appRouter= createBrowserRouter([
                    {
                              path:'/',
                              element:<Home/>,
                          children:[
                              {
                                        path:'/',
                                        element:<Feed/>
                              },
                              {
                                        path:"/profile/:id",
                                        element:<Profile/>
                              }
                          ]    
                    },
                    {
                              path:"/login",
                              element:<Login/>
                    },
                    {
                      path:"/register",
                      element:<Register/>
                    },
          ])
  return (
    <div>
      <RouterProvider router={appRouter}/>
    </div>
  )
}
