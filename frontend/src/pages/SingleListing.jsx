import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";

//contact from
import ContactForm from "../Components/ContactForm";

//icons
import { MdLocationOn } from "react-icons/md";
import { IoIosBed } from "react-icons/io";
import { FaBath, FaCar, FaCouch, FaDog } from "react-icons/fa";

//swiper
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const SingleListing = () => {
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState({
    images: [],
  });
  const [error, setError] = useState(null);
  const [contactFormOpen, setContactFormOpen] = useState(false);

  const { currentUser } = useSelector((state) => state.user);

  const params = useParams();
  useEffect(() => {
    getListing();
  }, []);

  const getListing = async () => {
    try {
      setLoading(true);
      const listingId = params.listingId;

      const res = await fetch(`/api/listing/get/${listingId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setListing(data.listing);
      //console.log(data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };
  return (
    <main>
      <div className="px-3">
        {loading && (
          <p className="p-5 text-2xl text-center font-bold">Loading...</p>
        )}
        {error && <p className="p-5 text-lg text-red-600 font-bold">{error}</p>}
        {listing && !loading && !error && (
          <>
            <Swiper
              modules={[Thumbs, Scrollbar]}
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
            >
              {listing.images.map((url) => (
                <SwiperSlide key={url}>
                  <div
                    className="h-[550px]"
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: "cover", // Add this for better image scaling
                    }}
                  ></div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="flex flex-col gap-3 my-2 p-3">
              <h3 className="text-xl font-bold">{listing.name}</h3>

              <div className="flex-flex-row gap-3">
                <span className="text-red-700 rounded p-1 font-bold">
                  {listing.type === "sale" ? "Sale" : "Rent"}
                </span>
                {listing.offer &&
                  (listing.regularPrice > listing.discountedPrice ? (
                    <>
                      <span className="text-red-700 rounded p-1 font-bold line-through">
                        {+listing.regularPrice}
                      </span>
                      <span className="text-red-700 rounded p-1 font-bold">
                        {+listing.discountedPrice}
                        {listing.rent ?? " per Week"}
                      </span>
                    </>
                  ) : (
                    <span className="text-red-700 rounded p-1 font-bold">
                      {+listing.regularPrice}
                      {listing.rent ?? " per Week"}
                    </span>
                  ))}
              </div>
              <div className="flex flex-row gap-3 items-center flex-wrap">
                <div className="flex flex-row gap-2 items-center">
                  <IoIosBed className="text-lg text-green-700" />
                  <span className="text-lg text-green-700 font-bold">
                    {+listing.bedrooms}
                  </span>
                </div>

                <div className="flex flex-row gap-2 items-center">
                  <FaBath className="text-lg text-green-700" />
                  <span className="text-lg text-green-700 font-bold">
                    {+listing.bathrooms}
                  </span>
                </div>

                <div className="flex flex-row gap-2 items-center">
                  <FaCar className="text-lg text-green-700" />
                  <span className="text-lg text-green-700 font-bold">
                    {+listing.parking}
                  </span>
                </div>
              </div>
              <div className="flex-flex-row gap-3">
                <div className="flex flex-row gap-2 items-center">
                  <FaCouch className="text-lg text-green-700" />
                  <span className="text-lg text-green-700 font-bold">
                    {listing.furnished ? "Furnished" : "Unfurnished"}
                  </span>
                </div>

                <div className="flex flex-row gap-2 items-center">
                  <FaDog className="text-lg text-green-700" />
                  <span className="text-lg text-green-700 font-bold">
                    {listing.pets ? "Pets Allowed" : "Pets not Allowed"}
                  </span>
                </div>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <MdLocationOn className="font-bold text-green-700 text-xl" />
                <h3 className="text-xl text-green-700">{listing.address}</h3>
              </div>
              <h5 className="text-lg text-slate-900">{listing.description}</h5>
              <div className="flex flex-col justify-center my-2 items-center gap-4">
                {currentUser && currentUser._id === listing.userRef ? (
                  <Link to={`/edit-listing/${listing._id}`}>
                    <span className="bg-white rounded-full font-bold text-lg p-3 mx-auto my-3 hover:bg-opacity-90 border-gray-100 shadow">
                      Edit Listing
                    </span>
                  </Link>
                ) : (
                  <>
                    {contactFormOpen ? (
                      <>
                        <ContactForm listing={listing} />
                      </>
                    ) : (
                      <button
                        className="bg-blue-700 text-white rounded font-bold text-lg p-3 shadow hover:opacity-90"
                        onClick={() => setContactFormOpen(true)}
                      >
                        Message Owner
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default SingleListing;
