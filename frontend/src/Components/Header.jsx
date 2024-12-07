import React from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdLogout } from "react-icons/md";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/User/userSlice";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const userLogout = async () => {
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
        <form className="bg-slate-100 p-3 rounded-lg flex flex-row items-center">
          <input
            type="text"
            placeholder="Search &#8230;"
            className="bg-transparent w-24 sm:w-64"
          />
          <FaSearch className="text-slate-600" />
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
