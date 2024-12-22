import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Scrollbar, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const SingleListing = () => {
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState({
    images: [],
  });
  const [error, setError] = useState(null);

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
      console.log(data);
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
        )}
      </div>
    </main>
  );
};

export default SingleListing;
