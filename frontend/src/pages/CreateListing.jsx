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

const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  useEffect(() => {
    console.log(formData);
  }, [formData.imageUrls]);

  //handling image submit
  const handleImageSubmit = (e) => {
    e.preventDefault();
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
            imageUrls: formData.imageUrls.concat(urls),
          });
        })
        .finally(() => {
          setUploading(false);
        }); // Ensures loading is set to false after all uploads finish.
    }
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

  const removeUploadedImage = (index) => {
    console.log(index);
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a New Listing
      </h1>
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
          />
          <textarea
            name="description"
            id="Description"
            className="border p-3 rounded-lg"
            required
            placeholder="Description"
          ></textarea>
          <input
            type="address"
            placeholder="Address"
            className=" border p-3 rounded-lg"
            id="address"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" name="sell" id="sell" className="w-5" />
              <label htmlFor="sell">
                <span>sell</span>
              </label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" name="rent" id="rent" className="w-5" />
              <label htmlFor="rent">
                <span>rent</span>
              </label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="furnished"
                id="furnished"
                className="w-5"
              />
              <label htmlFor="furnished">
                <span>furnished</span>
              </label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" name="offer" id="offer" className="w-5" />
              <label htmlFor="offer">
                <span>offer</span>
              </label>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                name="bedroom"
                id="bedroom"
                defaultValue={0}
                className="w-20 p-2"
              />
              <label htmlFor="bedroom">
                <span>Bedroom</span>
              </label>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                name="bathroom"
                id="bathroom"
                defaultValue={0}
                className="w-20 p-2"
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
                defaultValue={0}
                className="w-20 p-2"
              />
              <label htmlFor="parking">
                <span>Parking Spot</span>
              </label>
            </div>
            <div className="flex gap-6 flex-wrap">
              <div className="flex gap-2">
                <input
                  type="number"
                  name="regularPrice"
                  id="regularPrice"
                  defaultValue={0}
                  className="p-3"
                />
                <label htmlFor="regularPrice" className="flex flex-col">
                  <span>Regular Price</span>
                  <small>AUD/week</small>
                </label>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="discountedPrice"
                  id="discountedPrice"
                  defaultValue={0}
                  className="p-3"
                />
                <label htmlFor="discountedPrice" className="flex flex-col">
                  <span>discounted Price</span>
                  <small>AUD/week</small>
                </label>
              </div>
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
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {formData.imageUrls.length > 0 ? (
            <div className="flex flex-col p-2 gap-2">
              {formData.imageUrls.map((url, index) => (
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

          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
