import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    otherUsers: null,
    refreshin: false,
    profile: null,
    token: null
  },
  reducers: {
    getUser: (state, action) => {
      state.user = action.payload;
    },
    getOtherUsers: (state, action) => {
      state.otherUsers = action.payload;
    },
    getMyProfile: (state, action) => {
      state.profile = action.payload;
    },
    getToken: (state, action) => {
      state.token = action.payload;
    },
    followingUpdate: (state, action) => {
      if (state.user.following.includes(action.payload)) {
        state.user.following = state.user.following.filter((itemId) => itemId !== action.payload);
      } else {
        state.user.following.push(action.payload);
      }
    },
    getRefreshForUser: (state) => {
      state.refreshin = !state.refreshin;
    }
  }
});

export const { getUser, getOtherUsers, getMyProfile, getToken, followingUpdate, getRefreshForUser } = userSlice.actions;
export default userSlice.reducer;
