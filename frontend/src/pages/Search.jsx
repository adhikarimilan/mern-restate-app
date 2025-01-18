import React from "react";

const Search = () => {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-4 border-b-2 md:border-r-2 md:border-b-0 md:min-h-screen">
        <form className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap">Search Term: </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search ..."
              className="border rounded-lg p-3 w-full"
            />
          </div>
          <div className="flex flex-row gap-2 flex-wrap">
            <label>Property Type: </label>
            <div className="flex items-center gap-1">
              <input type="checkbox" id="rent" className="w-5" />
              <label htmlFor="rent">Rent</label>
            </div>
            <div className="flex items-center gap-1">
              <input type="checkbox" id="sell" className="w-5" />
              <label htmlFor="sell">Sell</label>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <input type="checkbox" id="offer" className="w-5" />
              <label htmlFor="offer">Offer</label>
            </div>
          </div>
          <div className="flex flex-row gap-2 flex-wrap">
            <label>Amenities: </label>
            <div className="flex items-center gap-1">
              <input type="checkbox" id="parking" className="w-5" />
              <label htmlFor="parking">Parking</label>
            </div>
            <div className="flex items-center gap-1">
              <input type="checkbox" id="furnished" className="w-5" />
              <label htmlFor="furnished">Furnished</label>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sort_order">Sort & Order: </label>
            <select id="sort_order" className="border-2 rounded-lg p-3">
              <option value="p_htl">Price High to Low</option>
              <option value="p_lth">Price Low to High</option>
              <option value="n_frst">Newest First</option>
              <option value="o_frst">Oldest First</option>
            </select>
          </div>
          <button className="p-3 w-full bg-slate-900 hover:opacity-95 disabled:opacity-85 text-white uppercase">
            Search
          </button>
        </form>
      </div>
      <div className="p-4 ">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700">
          Listings
        </h1>
      </div>
    </div>
  );
};

export default Search;
