import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ContactForm = ({ listing }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchLandlord();
  }, []);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  const fetchLandlord = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/user/${listing.userRef}`, {
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

      setLandlord(data.user);

      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  return (
    <>
      <textarea
        id="message"
        className="w-1/2 p-3 text-base"
        rows={3}
        placeholder="Type your message here ..."
        onChange={handleChange}
      ></textarea>

      <Link
        to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
      >
        <span className="w-1/2 p-3 font-semibold text-sm bg-white text-blue-700 hover:opacity-90 my-3 border-1 border-gray-400 shadow rounded">
          Message {landlord ? landlord.userName : "owner"}
        </span>
      </Link>
    </>
  );
};

export default ContactForm;
