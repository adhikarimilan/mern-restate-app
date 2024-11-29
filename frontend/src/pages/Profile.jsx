import React from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-3">Profile</h1>

      <form className="flex flex-col gap-3">
        <img
          src={currentUser.photo}
          alt="Photo"
          className="cursor-pointer rounded-full w-20 h-20 object-cover mx-auto"
        />
        <input
          type="text"
          value={currentUser.userName}
          id="username"
          className="border p-3 rounded-lg"
        />
        <input
          type="email"
          id="email"
          value={currentUser.email}
          className="border p-3 rounded-lg"
        />
        <input
          type="password"
          id="oldPassword"
          placeholder="Your Old Password"
          className="border p-3 rounded-lg"
        />
        <input
          type="password"
          id="newPassword"
          placeholder="Your New Password"
          className="border p-3 rounded-lg"
        />
        <input
          type="password"
          id="confirmPassword"
          placeholder="Confirm Pasword"
          className="border p-3 rounded-lg"
        />
        <input
          type="button"
          id="submit"
          value="UpDaTe"
          className="border bg-slate-950 p-3 rounded-lg hover:opacity-90 disabled:opacity-80 cursor-pointer text-gray-300 uppercase"
        />
        <input
          type="button"
          id="newListingBtn"
          value="Add New LiSting"
          className="border bg-blue-700 p-3 rounded-lg hover:opacity-90 disabled:opacity-80 cursor-pointer text-gray-300 uppercase"
        />
      </form>
      <div className="flex flex-row justify-between my-2">
        <span className="text-red-500 cursor-pointer font-bold">
          Delete Account
        </span>
        <span className="text-red-500 cursor-pointer font-bold">Sign Out</span>
      </div>
      <span className="text-center block text-blue-600 font-bold cursor-pointer mx-auto">
        Create New listing
      </span>
    </div>
  );
};

export default Profile;
