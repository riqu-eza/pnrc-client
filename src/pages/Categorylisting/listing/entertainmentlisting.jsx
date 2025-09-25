/* eslint-disable no-unused-vars */
import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Amenities from "../amenities";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaRegClipboard,
  FaRegClock,
} from "react-icons/fa";
import Entertainmentmenu from "../menu/entertainmentmenu";

const EntertainmentListingPage = () => {
  const { state } = useLocation();
  const listing = state?.listing;
  const scrollContainerRef = useRef(null);
  console.log("entertainment listing page", listing);
  const [selectedImage, setSelectedImage] = useState(
    listing?.imageUrls[0] || ""
  );

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

  const subcategories = category.length > 0 ? category[0].subcategories : []; // Default to empty if no categories

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 mt-4">
      {/* Hero Section Container */}
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
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col lg:flex-row gap-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Description Section */}
          <div className="lg:w-2/5 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-inner">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              About
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed text-center">
              {description}
            </p>
          </div>

          {/* Amenities Section */}
          <div className="lg:w-3/5 p-6 bg-white rounded-lg border border-gray-200 shadow-inner">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Amenities & Features
            </h3>
            <div className="p-2">
              <Amenities amenities={amenities} />
            </div>
          </div>
        </div>

        <div className="mb-6 p-1">
          <div className="border bg-gray-100 shadow-lg">
            <Entertainmentmenu
              subcategories={subcategories}
              listingemail={email}
              listingname={name}
              listingaddress={address}
            />
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200">
            {/* Property Rules Section */}
            <div className="p-6 md:w-1/2">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-2xl font-bold text-center mb-6 text-gray-800 bg-gradient-to-r from-blue-100 to-blue-200 py-2 px-4 rounded-full inline-block">
                  <FaRegClipboard className="inline mr-2" />
                  Property Rules
                </h3>
                <div className="space-y-3">
                  {hours.map((hour) => (
                    <div
                      key={hour._id}
                      className="flex items-center bg-blue-50 p-3 rounded-lg"
                    >
                      <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full">
                        <FaRegClock className="text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-700 font-medium">
                          <span className="font-semibold text-blue-600">
                            Opens:
                          </span>{" "}
                          {hour.open} Hrs
                        </p>
                        <p className="text-gray-700 font-medium">
                          <span className="font-semibold text-blue-600">
                            Closes:
                          </span>{" "}
                          {hour.close} Hrs
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="p-6 md:w-1/2">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 h-full">
                <h3 className="text-2xl font-bold text-center mb-6 text-gray-800 bg-gradient-to-r from-indigo-100 to-purple-200 py-2 px-4 rounded-full inline-block">
                  <FaEnvelope className="inline mr-2" />
                  Contact Us
                </h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">
                      For Compliments & Complaints:
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <FaPhone className="text-blue-500 mr-3" />
                        <a
                          href="tel:0794369806"
                          className="text-gray-700 hover:text-blue-600 transition-colors"
                        >
                          0794 369 806
                        </a>
                      </div>
                      <div className="flex items-center">
                        <FaEnvelope className="text-blue-500 mr-3" />
                        <a
                          href="mailto:info@palmnazi_rc.com"
                          className="text-blue-600 hover:text-blue-800 transition-colors underline"
                        >
                          info@palmnazi_rc.com
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">
                      Visit Us
                    </h4>
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="text-red-500 mr-3" />
                      <span className="text-gray-700">
                        Palmnazi RC, Nairobi
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntertainmentListingPage;
