import React from "react";

const CreateListing = () => {
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
              className="p-2 border border-gray-300 rounded w-full"
            />
            <button className="border p-3 border-green-600 bg-green-600 hover:opacity-90 disabled:opacity-80 text-white rounded uppercase">
              Upload
            </button>
          </div>
          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
