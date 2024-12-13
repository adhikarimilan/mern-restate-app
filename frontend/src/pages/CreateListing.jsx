import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Link } from "react-router-dom";
import { app } from "../firebase.js";
import { useSelector } from "react-redux";

const CreateListing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const defaultFormData = {
    images: [],
    name: null,
    description: null,
    address: null,
    regularPrice: 0,
    discountedPrice: 0,
    bathrooms: 1,
    bedrooms: 1,
    parking: 0,
    furnished: false,
    pets: false,
    offer: false,
    type: "rent",
  };
  const [formData, setFormData] = useState(defaultFormData);
  // useEffect(() => {
  //   console.log(formData);
  // }, [formData]);

  //clear error and success msg
  const clearMessages = () => {
    setSuccess(null);
    setError(null);
    setUploadProgress(0);
  };

  //handle change
  const handleChange = (e) => {
    //console.log(e);
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    if (
      e.target.id === "name" ||
      e.target.id === "description" ||
      e.target.id === "address" ||
      e.target.id === "regularPrice" ||
      e.target.id === "discountedPrice" ||
      e.target.id === "bathrooms" ||
      e.target.id === "bedrooms" ||
      e.target.id === "parking"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
    if (
      e.target.id === "furnished" ||
      e.target.id === "offer" ||
      e.target.id === "pets"
    ) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.checked,
      }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    if (formData.offer && +formData.regularPrice < +formData.discountedPrice) {
      setError("Discounted price must be lesser than regular price");
      return;
    }
    if (!formData.images.length) {
      setError("Upload at least one image");
      return;
    }
    if (!formData.offer) formData.discountedPrice = formData.regularPrice;
    try {
      setLoading(true);
      console.log(currentUser._id);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await res.json();
      if (data.success == false) {
        setError("An error Occured while adding the listing");
        console.error(data);
        setLoading(false);
        return;
      }
      setSuccess("Listing Created Successfully");
      setFormData(defaultFormData);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  //handling image submit
  const handleImageSubmit = (e) => {
    e.preventDefault();
    setUploading(true);
    if (files.length > 0 && files.length < 7) {
      setUploading(true);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(uploadImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            images: formData.images.concat(urls),
          });
        })
        .finally(() => {
          setUploading(false);
          document.getElementById("images").value = "";
        }); // Ensures loading is set to false after all uploads finish.
    } else setUploading(false);
  };

  //uploading each image indivually
  const uploadImage = async (file) => {
    try {
      return new Promise((resolve, reject) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name.replace(/\s/g, "_");

        const storageRef = ref(storage, fileName);
        const uploadFile = uploadBytesResumable(storageRef, file);

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
            getDownloadURL(uploadFile.snapshot.ref).then(
              async (downloadUrl) => {
                resolve(downloadUrl);
              }
            );
          }
        );
      });
    } catch (error) {
      console.error(`An error occured: ${error}`);
    }
  };

  const removeUploadedImage = async (index) => {
    // try {
    //   const storage = getStorage(app);
    // const fileName = formData.images[index];

    // const storageRef = ref(storage, fileName);
    // await storageRef.delete();
    // } catch (error) {
    //   console.error(`An error occured: ${error}`)
    // }

    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a New Listing
      </h1>
      {error && <p className="text-red-700 font-bold p-3">{error}</p>}
      {success && <p className="text-blue-700 font-bold p-3">{success}</p>}
      <form className="flex flex-col sm:flex-row w-auto gap-6">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            value={formData.name || ""}
            onChange={handleChange}
          />
          <textarea
            name="description"
            id="description"
            className="border p-3 rounded-lg"
            required
            placeholder="Description"
            onChange={handleChange}
            value={formData.description || ""}
          ></textarea>
          <input
            type="address"
            placeholder="Address"
            className=" border p-3 rounded-lg"
            id="address"
            value={formData.address || ""}
            onChange={handleChange}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="sale"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <label htmlFor="sale">
                <span>sell</span>
              </label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="rent"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <label htmlFor="rent">
                <span>rent</span>
              </label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="furnished"
                value="furnished"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <label htmlFor="furnished">
                <span>furnished</span>
              </label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="offer"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <label htmlFor="offer">
                <span>offer</span>
              </label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="pets"
                id="pets"
                className="w-5"
                onChange={handleChange}
                checked={formData.pets}
              />
              <label htmlFor="pets">
                <span>Pets</span>
              </label>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                name="bedroom"
                id="bedrooms"
                value={formData.bedrooms}
                className="w-20 p-2"
                onChange={handleChange}
              />
              <label htmlFor="bedroom">
                <span>Bedroom</span>
              </label>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                name="bathroom"
                id="bathrooms"
                value={formData.bathrooms}
                className="w-20 p-2"
                onChange={handleChange}
              />
              <label htmlFor="bathroom">
                <span>Bathroom</span>
              </label>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                name="parking"
                id="parking"
                value={formData.parking}
                className="w-20 p-2"
                onChange={handleChange}
              />
              <label htmlFor="parking">
                <span>Parking Spot</span>
              </label>
            </div>
            <div className="flex gap-6 flex-wrap">
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  name="regularPrice"
                  id="regularPrice"
                  value={formData.regularPrice}
                  className="p-3"
                  onChange={handleChange}
                />
                <label htmlFor="regularPrice" className="flex flex-col">
                  <span>Regular Price</span>
                  {formData.type === "rent" && <small>AUD/week</small>}
                </label>
              </div>
              {formData.offer && (
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    name="discountedPrice"
                    id="discountedPrice"
                    defaultValue={formData.discountedPrice}
                    className="p-3"
                    onChange={handleChange}
                  />
                  <label htmlFor="discountedPrice" className="flex flex-col">
                    <span>Discounted Price</span>
                    {formData.type === "rent" && <small>AUD/week</small>}
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <p className="font-semibold">
            Images{" "}
            <span className="font-normal text-sm text-gray-600">
              The first image will be the cover (max: 6){" "}
            </span>
          </p>
          <div className="flex justify-between gap-4">
            <input
              type="file"
              name="images"
              id="images"
              accept="image/*"
              multiple
              onChange={(e) => {
                setFiles(Array.from(e.target.files)); // Convert FileList to array
              }}
              className="p-2 border border-gray-300 rounded w-full"
            />
            <button
              className="border p-3 border-green-600 bg-green-600 hover:opacity-90 disabled:opacity-80 text-white rounded uppercase"
              onClick={handleImageSubmit}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
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
          {formData.images.length > 0 ? (
            <div className="flex flex-col p-2 gap-2">
              {formData.images.map((url, index) => (
                <div
                  key={url}
                  className="flex justify-between items-center gap-2"
                >
                  <img
                    src={url}
                    alt={"uploaded_img_" + (index + 1)}
                    className="w-20 h-20 object-contain rounded-lg"
                  />
                  <AiOutlineClose
                    className="text-red-600 font-bold hover:opacity-90"
                    onClick={() => removeUploadedImage(index)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <></>
          )}

          <button
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            onClick={handleFormSubmit}
            disabled={uploading || loading}
          >
            {loading ? "Loading" : "Create Listing"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
