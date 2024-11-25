import React from "react";
import { Link } from "react-router-dom";

function Signup() {
  return (
    <div className="p-5">
      <h1 className="text-3xl text-center font-semibold my-7"> Signup</h1>
      <form className="flex flex-col gap-4">
        <input
          type="text"
          name="userName"
          id="username"
          placeholder="username"
          className="border p-3 rounded-lg"
        />
        <input
          type="email"
          name="email"
          id="email"
          placeholder="email"
          className="border p-3 rounded-lg"
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
        />
        <input
          type="submit"
          value="Submit"
          id="submit"
          className="border p-3 rounded-lg bg-slate-800 text-white uppercase hover:opacity-90 cursor-pointer disabled:opacity-80"
        />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account</p>
        <Link to={"/signin"}>
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
    </div>
  );
}

export default Signup;
