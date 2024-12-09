import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MdOutlineModeEdit } from "react-icons/md";
import { useDispatch } from "react-redux";
import {
  updateUserError,
  updateUserStart,
  updateUserSuccess,
  clearError,
  logoutUser,
} from "../redux/User/userSlice.js";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Link } from "react-router-dom";
import { app } from "../firebase.js";

const Profile = () => {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [photo, setPhoto] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  useEffect(() => {
    dispatch(clearError());
  }, []);

  // handling image submit only after photo value is updated
  useEffect(() => {
    if (photo) handleImageSubmit();
  }, [photo]);

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
  };

  const handleAccountDelete = async () => {
    try {
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success === false) dispatch(updateUSerError(data));
      dispatch(logoutUser());
    } catch (error) {
      dispatch(updateUserError(error.message));
    }
  };

  const handleChange = (e) => {
    dispatch(clearError());
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log({ ...formData, [e.target.id]: e.target.value });
  };
  const handleImageSubmit = async () => {
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ photo: photo }),
      });
      const data = await res.json();
      if (data.success == false) {
        dispatch(updateUserError(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
    } catch (error) {
      dispatch(updateUserError(error.message));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData) {
      dispatch(updateUserError("No changes to update"));
      return;
    }
    if (formData.currentPassword) {
      if (!formData.newPassword) {
        dispatch(updateUserError("Please Enter your new password Value"));
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        dispatch(updateUserError("Password Confirmation do not match!"));
        return;
      }
    }

    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success == false) {
        dispatch(updateUserError(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
    } catch (error) {
      dispatch(updateUserError(error.message));
    }
  };

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
          getDownloadURL(uploadFile.snapshot.ref).then(async (downloadUrl) => {
            setPhoto(downloadUrl);
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

      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
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
        {error && <p className="text-red-500 font-bold">{error}</p>}
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
          defaultValue={currentUser.userName}
          id="userName"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          id="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          id="currentPassword"
          placeholder="Your Current Password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          id="newPassword"
          placeholder="Your New Password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          id="confirmPassword"
          placeholder="Confirm Pasword"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="submit"
          id="submit"
          value={loading ? "Loading..." : "upDate"}
          className="border bg-slate-950 p-3 rounded-lg hover:opacity-90 disabled:opacity-80 cursor-pointer text-gray-300 uppercase"
        />

        <Link to="/create-listing">
          <span className="border block text-center bg-blue-700 p-3 rounded-lg hover:opacity-90 disabled:opacity-80 cursor-pointer text-gray-300 uppercase">
            Add New Listing
          </span>
        </Link>
      </form>
      <div className="flex flex-row justify-between my-2">
        <span
          className="text-red-500 cursor-pointer font-bold hover:opacity-90"
          onClick={handleAccountDelete}
        >
          Delete Account
        </span>
        <span
          className="text-red-500 cursor-pointer font-bold hover:opacity-90"
          onClick={userLogout}
        >
          Sign Out
        </span>
      </div>
    </div>
  );
};

export default Profile;
