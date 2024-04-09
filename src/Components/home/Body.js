import React from 'react'
import Home from './Home'
import Feed from './Feed'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Profile from '../../Pages/profile/Profile'
import Login from '../login/Login'
import Register from '../register/Register'
import ReComment from '../../Pages/comment/ReComment'
import Bookmark from '../../Pages/bookmark/Bookmark'
import ForgotPassword from '../login/ForgotPassword'
import ResetPassword from '../login/ResetPassword'

export default function Body() {
  const appRouter = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
      children: [
        {
          path: '/',
          element: <Feed />
        },
        {
          path: "/profile/:id",
          element: <Profile />
        },
        {
          path: "/comment/:id",
          element: <ReComment />
        }, {
          path: "/bookmark/:id",
          element: <Bookmark />
        }
      ]
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/forgot",
      element: <ForgotPassword />
    },
    {
      path: "/reset-password",
      element: <ResetPassword />
    },
    {
      path: "/register",
      element: <Register />
    },
  ])
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  )
}
