import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../Components/OAuth";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSucces] = useState(null);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    console.log({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.email || !formData.username || !formData.password) {
      setError("Please fill username, email and password field properly");
      return;
    }
    setLoading(true);
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success == false) {
        setError(data.message);
      } else {
        setFormData({});
        setError("");
        setSucces(data.message);
      }
      setLoading(false);
    } catch (error) {
      console.error(`An error occured: ${error}`);
    }
  };
  return (
    <div className="p-5 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7"> Signup</h1>
      {error && <p className="text-red-600 text-md">{error}</p>}
      {success && <p className="text-blue-700 text-md">{success}</p>}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="userName"
          id="username"
          placeholder="username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          id="email"
          placeholder="email"
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
          value={loading ? "Loading..." : "Sign up"}
          id="submit"
          onClick={handleSubmit}
          className="border p-3 rounded-lg bg-slate-800 text-white uppercase hover:opacity-90 cursor-pointer disabled:opacity-80"
        />
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Already have an account?</p>
        <Link to={"/signin"}>
          <span className="text-blue-700">Sign In</span>
        </Link>
      </div>
    </div>
  );
}

export default Signup;
