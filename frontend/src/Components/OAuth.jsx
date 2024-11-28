import React from "react";
import { FcGoogle } from "react-icons/fc";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  signInStart,
  signInError,
  signInSuccess,
} from "../redux/User/userSlice";

const OAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleOath = async () => {
    try {
      dispatch(signInStart());
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const login = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await login.json();
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      console.error(`An error Occured: ${error}`);
    }
  };
  return (
    <button
      type="button"
      onClick={handleOath}
      className="flex flex-row gap-2 items-center justify-center border p-3 rounded-lg bg-blue-700 text-white uppercase hover:opacity-90 cursor-pointer disabled:opacity-80"
    >
      Continue with <FcGoogle className="size-5" />
    </button>
  );
};

export default OAuth;
