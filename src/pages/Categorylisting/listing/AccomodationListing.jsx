/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import { FaRegClipboard } from "react-icons/fa";
import {  useLocation } from "react-router-dom";
import Amenities from "../amenities";
import RoomDisplay from "../modal/roomdisplay";

const AccommodationListingPage = () => {
  const { state } = useLocation(); // Get the state passed from the Link
  const listing = state?.listing; // Access the listing object safely
  const scrollContainerRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState(
    listing?.imageUrls[0] || ""
  ); // Initialize selectedImage

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200, // Adjust the scroll amount as needed
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200, // Adjust the scroll amount as needed
        behavior: "smooth",
      });
    }
  };

  if (!listing) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-xl">Loading...</p>
      </div>
    ); // Handle case where listing is not available
  }

  const {
    address,
    name,
    email,
    description,
    contact,
    imageUrls,
    amenities,
    category,
    hours,
  } = listing;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 mt-4">
      {/* Hero Image Section */}
      <div className="relative rounded-xl overflow-hidden shadow-2xl">
        {/* Main Hero Image with Gradient Overlay */}
        <div className="relative w-full h-64 sm:h-96 lg:h-[32rem]">
          <img
            src={selectedImage}
            alt={name}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Title and Location */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">
              {name}
            </h1>
            <div className="flex items-center gap-2 text-sm sm:text-base">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">
                {address.street}, {address.city}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnail Gallery */}
      <div className="mt-4 px-1">
        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {imageUrls.map((url, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(url)}
              className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden transition-all duration-200 ${
                selectedImage === url
                  ? "ring-4 ring-blue-500 scale-105"
                  : "hover:scale-105 opacity-90 hover:opacity-100"
              }`}
            >
              <img
                src={url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
      {/* Details Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-4">
        {/* Description and Amenities */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3">
            <p className="text-gray-700 text-base sm:text-lg">{description}</p>
          </div>
          <div className="md:w-1/3">
            <Amenities amenities={amenities} />
          </div>
        </div>

        {/* Category Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">
            How we can accommodate you
          </h3>
          {category.map((cat) => (
            <div key={cat._id} className="mb-6">
              {cat.subcategories.map((sub) => (
                <div
                  key={sub._id}
                  className="mb-4 border bg-slate-100 border-gray-200 rounded-lg p-4"
                >
                  <h5 className="text-md text-center font-medium mb-2">
                    {sub.subcategory}
                  </h5>
                  <div className="relative">
                    {/* Scroll Buttons */}
                    <button
                      onClick={scrollLeft}
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full z-10 hidden md:block"
                    >
                      &#8249; {/* Left arrow icon */}
                    </button>

                    <div
                      ref={scrollContainerRef}
                      className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
                    >
                      {sub.rooms.map((room) => (
                        <RoomDisplay
                          key={room._id}
                          room={room}
                          listingemail={email}
                          listingname={name}
                          listingaddress={address}
                        />
                      ))}
                    </div>

                    <button
                      onClick={scrollRight}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full z-10 hidden md:block"
                    >
                      &#8250; {/* Right arrow icon */}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Operating Hours Section */}
        <div className="mb-6 border p-4 flex flex-col md:flex-row justify-between border-gray-900 bg-gray-100 shadow-md rounded-lg">
          <div className="border-2 border-gray-200 shadow-md p-4 bg-gray-200 rounded-lg mb-4 md:mb-0 md:mr-4">
            <h3 className="text-xl font-semibold mb-4 text-center bg-blue-300 rounded-lg p-2">
              Property Rules
            </h3>
            <div className="border-2 border-blue-100 p-3 rounded-lg bg-blue-200">
              {hours.map((hour) => (
                <div key={hour._id} className="flex items-center gap-2 mb-2">
                  <FaRegClipboard className="text-gray-700" />
                  <p className="text-gray-700">
                    Check In: {hour.open} Hrs - Check Out: {hour.close} Hrs
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">
              For Compliments and Complaints:
            </h2>
            <div className="border-2 border-black p-3 rounded-lg bg-gray-50">
              <p className="text-gray-700 mb-2">Contact: 0794369806</p>
              <p className="text-gray-700 mb-2">
                Email:{" "}
                <a
                  href={`mailto:info@palmnazi_rc.com`}
                  className="text-blue-500 hover:underline"
                >
                  info@palmnazi_rc.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Back to Listing Link */}
        
      </div>
    </div>
  );
};

export default AccommodationListingPage;
