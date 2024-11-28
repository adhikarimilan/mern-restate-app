import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInError,
  signInSuccess,
} from "../redux/User/userSlice";
import OAuth from "../Components/OAuth";

function Signin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    console.log({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.email || !formData.password) {
      dispatch(
        signInError("Please fill username or email and password field properly")
      );
      return;
    }
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInError(data.message));
      } else {
        setFormData({});
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInError(error));
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-3xl text-center font-semibold my-7">Signin</h1>
      {error && <p className="text-red-600 text-md">{error}</p>}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="userName"
          id="email"
          placeholder="Username or Email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="submit"
          value={loading ? "Loading..." : "Sign in"}
          id="submit"
          disabled={loading}
          className="border p-3 rounded-lg bg-slate-800 text-white uppercase hover:opacity-90 cursor-pointer disabled:opacity-80"
        />
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Do not have an account?</p>
        <Link to={"/signup"}>
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
    </div>
  );
}

export default Signin;
