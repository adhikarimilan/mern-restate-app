import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MdOutlineModeEdit } from "react-icons/md";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [photo, setPhoto] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    try {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name.replace(/\s/g, "_");

      const storageRef = ref(storage, fileName);
      const uploadFile = uploadBytesResumable(storageRef, file);

      console.log(fileName);
      uploadFile.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(progress));
        },
        (error) => {
          console.error(`An error occured while uploading: ${error}`);
        },
        () => {
          getDownloadURL(uploadFile.snapshot.ref).then((downloadUrl) => {
            setPhoto(downloadUrl);
            console.log(downloadUrl);
          });
        }
      );
    } catch (error) {
      console.error(`An error occured : ${error}`);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-3">Profile</h1>

      <form className="flex flex-col gap-3">
        <input
          type="file"
          id="file"
          ref={fileRef}
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
          accept="image/*"
        />
        <div className="relative group mx-auto">
          <img
            src={photo ?? currentUser.photo}
            alt="Photo"
            className="cursor-pointer rounded-full w-20 h-20 object-cover"
          />
          <div
            onClick={() => fileRef.current.click()}
            className="w-20 h-20 bg-black opacity-20 rounded-full hidden items-center justify-around absolute top-0 left-0 group-hover:flex"
          >
            <MdOutlineModeEdit className="text-white text-3xl font-bold" />
          </div>
        </div>

        {uploadProgress > 0 &&
          (uploadProgress < 100 ? (
            <h4 className="text-blue-500 text-center font-bold">
              File uploading: {uploadProgress}%
            </h4>
          ) : (
            <h4 className="text-blue-500 text-center font-bold">
              File uploaded Successfully
            </h4>
          ))}

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
          id="currentPassword"
          placeholder="Your Current Password"
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
