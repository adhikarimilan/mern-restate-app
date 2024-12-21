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
  //user listings
  const [loadingListing, setLoadingListing] = useState(false);
  const [errorFetchListing, setErrorFetchListing] = useState(undefined);
  const [listings, setListings] = useState([]);

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

  useEffect(() => {
    //if (listings.length) {
    // console.log(listings);
    // console.log(listings.map((listing) => listing));
  }, [listings]);

  const handleListingDelete = async (listingId) => {
    try {
      setLoadingListing(true);
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success === false) {
        setErrorFetchListing(data.message);
      }
      setListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
      setLoadingListing(false);
    } catch (error) {
      setErrorFetchListing(error);
      setLoadingListing(false);
    }
  };

  const fetchListings = async () => {
    try {
      const res = await fetch(`/api/listing/user/${currentUser._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success === false) {
        setErrorFetchListing(data.message);
        return;
      }
      setErrorFetchListing(undefined);
      setLoadingListing(false);

      // Convert `data.data` into an array
      const listingsArray = Object.values(data.data);
      setListings(data.data);
    } catch (error) {
      console.log(`An error occured: ${error}`);
      setErrorFetchListing(error);
      setLoadingListing(false);
    }
  };

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
      if (data.success === false) {
        dispatch(updateUserError(data.message));
        return;
      }
      dispatch(clearError());
      dispatch(logoutUser());
    } catch (error) {
      dispatch(updateUserError(error));
    }
  };

  const clearPassword = () => {
    formData.newPassword = null;
    formData.currentPassword = null;
    formData.confirmPassword = null;
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
      clearPassword();
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

      //console.log(fileName);
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
          value={(formData && formData.currentPassword) || ""}
        />
        <input
          type="password"
          id="newPassword"
          placeholder="Your New Password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          value={(formData && formData.newPassword) || ""}
        />
        <input
          type="password"
          id="confirmPassword"
          placeholder="Confirm Pasword"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          value={(formData && formData.confirmPassword) || ""}
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
      <div className="flex flex-col justify-around items-center w-full gap-2">
        <button
          className="text-blue-600 hover:opacity-90 cursor-pointer font-bold my-2"
          onClick={fetchListings}
          disabled={loadingListing}
        >
          {loadingListing ? "Loading Listing..." : "Show Listing"}
        </button>
        {errorFetchListing !== undefined && (
          <p className="text-red-600 font-bold">{errorFetchListing}</p>
        )}

        <div>
          {listings.length > 0 &&
            listings.map((listing) => (
              <div className="flex flex-col my-2 max-w-sm" key={listing._id}>
                <div className="flex flex-row justify-around items-center gap-2">
                  <img
                    src={listing.images[0]}
                    alt="image 1"
                    className="w-20 h-20"
                  />
                  <h3>{listing.name}</h3>
                  <div className="flex flex-col gap-2 items-center justify-around">
                    <Link to={`/listing/edit/${listing._id}`}>
                      <span className="text-slate-700 bg-white p-2 font-bold rounded hover:opacity-90 shadow">
                        Edit
                      </span>
                    </Link>

                    <button
                      onClick={() => handleListingDelete(listing._id)}
                      className="text-red-700 bg-white p-2 font-bold cursor-pointer rounded hover:opacity-90 shadow disabled:opacity-80"
                      disabled={loadingListing}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
