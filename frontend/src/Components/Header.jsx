import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdLogout } from "react-icons/md";
import { useDispatch } from "react-redux";
import {
  logoutUser,
  updateUserError,
  updateUserStart,
} from "../redux/User/userSlice";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const searchByTerm = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) setSearchTerm(searchTermFromUrl);
  }, [location.search]);

  const userLogout = async () => {
    try {
      dispatch(updateUserStart());
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success === false) dispatch(updateUserError(data.message));
      dispatch(clearError());
      dispatch(logoutUser());
    } catch (error) {
      dispatch(updateUserError(error));
    }
    dispatch(logoutUser());
  };
  return (
    <header className="bg-slate-200 shadow-md p-3">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <Link to={"/"}>
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Milan</span>{" "}
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form
          onSubmit={searchByTerm}
          className="bg-slate-100 p-3 rounded-lg flex flex-row items-center"
        >
          <input
            type="text"
            placeholder="Search &#8230;"
            className="bg-transparent w-24 sm:w-64 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="flex gap-4 items-center">
          <Link to="/">
            <li className="hidden sm:inline">Home</li>
          </Link>
          <Link to={"/about"}>
            <li className="hidden sm:inline">About</li>
          </Link>
          {currentUser ? (
            <>
              <Link to={"/profile"}>
                <img
                  src={currentUser.photo}
                  alt="profile photo"
                  className="rounded-full object-cover w-8"
                />
              </Link>
              <MdLogout
                className="font-bold size-7 cursor-pointer"
                onClick={userLogout}
              />
            </>
          ) : (
            <>
              <Link to={"/signin"}>
                <li>Signin</li>
              </Link>
              <Link to={"/signup"}>
                <li>Signup</li>
              </Link>
            </>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
