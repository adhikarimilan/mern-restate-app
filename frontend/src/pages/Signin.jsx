import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
      setError("Please fill username or email and password field properly");
      return;
    }
    setLoading(true);
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signin", {
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
        navigate("/");
      }
      setLoading(false);
    } catch (error) {
      console.error(`An error occured: ${error}`);
    }
  };
  return (
    <div className="p-5">
      <h1 className="text-3xl text-center font-semibold my-7"> Signin</h1>
      {error && <p className="text-red-600 text-md">{error}</p>}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="userName"
          id="email"
          placeholder="username or password"
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
          value={loading ? "Loading" : "Sign in"}
          id="submit"
          onClick={handleSubmit}
          className="border p-3 rounded-lg bg-slate-800 text-white uppercase hover:opacity-90 cursor-pointer disabled:opacity-80"
        />
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
