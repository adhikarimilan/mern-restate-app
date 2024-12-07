import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
      state.currentUser = null;
    },
    clearError: (state) => {
      state.error = null;
      state.loading = false;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateUserSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.currentUser = action.payload;
    },
    updateUserError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logoutUser: (state) => {
      state.loading = false;
      state.error = null;
      state.currentUser = null;
    },
  },
});

export default userSlice.reducer;

export const {
  signInStart,
  signInSuccess,
  signInError,
  clearError,
  updateUserStart,
  updateUserSuccess,
  updateUserError,
  logoutUser,
} = userSlice.actions;
