/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Amenities from "../amenities";

const RoomDisplay = ({ room, listingemail, listingname, listingaddress }) => {
  const [showBookingOverlay, setShowBookingOverlay] = useState(false);
  const [selectedImage, setSelectedImage] = useState(room.imageUrls[0] || "");
const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Ref for thumbnail container within the overlay
  const thumbnailRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (showBookingOverlay && overlayRef.current) {
      overlayRef.current.scrollTo(0, 0);
    }
  }, [showBookingOverlay]);

  const handleBookNowClick = () => {
    setShowBookingOverlay(true); // Show the overlay
  };

   const handleCloseOverlay = () => {
    setShowBookingOverlay(false);
    setShowSuccessMessage(false);
  };

  const calculateTotalPrice = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const days = Math.ceil((end - start) / (1000 * 3600 * 24)); // Calculate the difference in days
      return days * room.pricePerNight; // Assuming room.pricePerNight is provided
    }
    return 0;
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    startDate: "",
    endDate: "",
    numberOfPeople: "",
    listingEmail: listingemail,
    listingName: listingname,
    listingAddress: listingaddress,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    fetch("/api/booking/create/room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        roomId: room._id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Booking successful", data);
        setIsLoading(false);
        setShowSuccessMessage(true);
        resetForm();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 5000);
      })
      .catch((error) => {
        console.error("Error during booking:", error);
        setIsLoading(false);
      });
  };
const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      contactNumber: "",
      startDate: "",
      endDate: "",
      numberOfPeople: "",
      listingEmail: listingemail,
      listingName: listingname,
      listingAddress: listingaddress,
    });
  };

  // Scroll functions for thumbnails in overlay
  const scrollThumbnailsLeft = () => {
    if (thumbnailRef.current) {
      thumbnailRef.current.scrollBy({
        left: -100, // Adjust scroll amount as needed
        behavior: "smooth",
      });
    }
  };

  const scrollThumbnailsRight = () => {
    if (thumbnailRef.current) {
      thumbnailRef.current.scrollBy({
        left: 100, // Adjust scroll amount as needed
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {/* Room Container */}
      <div className="rounded-md p-3 mb-4 bg-white shadow-lg flex-shrink-0 snap-center w-full sm:w-full md:w-80 lg:w-96">
        {/* Room Images */}
        {room.imageUrls.length > 0 ? (
          <div className="relative mb-2">
            <img
              src={selectedImage}
              alt={room.name}
              className="w-full h-40 sm:h-48 lg:h-56 object-cover rounded-lg shadow-md"
              loading="lazy" // Optional: Lazy load images
            />

            {/* Thumbnails Container */}
            <div className="flex items-center mt-2">
              {/* Scroll Left Button */}
              <button
                onClick={scrollThumbnailsLeft}
                className="hidden sm:flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full hover:bg-gray-400 transition"
                aria-label="Scroll Left"
              >
                <FaArrowLeft className="text-gray-700" />
              </button>

              {/* Thumbnails */}
              <div
                ref={thumbnailRef}
                className="flex space-x-2 overflow-x-auto scrollbar-hide scroll-smooth"
              >
                {room.imageUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Thumbnail ${index + 1}`}
                    className={`w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80 flex-shrink-0 ${
                      selectedImage === url ? "border-2 border-blue-500" : ""
                    }`}
                    onClick={() => setSelectedImage(url)}
                    loading="lazy" // Optional: Lazy load images
                  />
                ))}
              </div>

              {/* Scroll Right Button */}
              <button
                onClick={scrollThumbnailsRight}
                className="hidden sm:flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full hover:bg-gray-400 transition"
                aria-label="Scroll Right"
              >
                <FaArrowRight className="text-gray-700" />
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full h-40 sm:h-48 lg:h-56 bg-gray-200 rounded-md mb-3 flex items-center justify-center">
            <span className="text-gray-500">No Image Available</span>
          </div>
        )}

        {/* Room Details */}
        <h6 className="font-semibold text-center text-lg sm:text-xl">
          {room.roomType}
        </h6>
        <p className="text-gray-700 font-serif mt-1 text-sm sm:text-base">
          {room.description}
        </p>

        {/* Amenities */}
        <div className="flex flex-wrap mt-3 space-x-2">
          <Amenities amenities={room.amenities} />
        </div>

        {/* Price and Book Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4">
          <p className="font-light text-md sm:text-lg">
            Price per Night: ${room.pricePerNight}
          </p>
          <button
            onClick={handleBookNowClick}
            className="mt-2 sm:mt-0 bg-blue-600 text-white py-1 px-3 sm:py-2 sm:px-4 rounded hover:bg-blue-700 transition"
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Booking Overlay */}
       {showBookingOverlay && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-start z-50 p-4 overflow-y-auto">
          <div 
            ref={overlayRef}
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl relative my-8 max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={handleCloseOverlay}
              className="absolute top-2 right-2 text-2xl font-bold text-gray-600 hover:text-gray-800"
              aria-label="Close Booking Form"
            >
              &times;
            </button>

            {/* Overlay Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Room Details */}
              <div>
                {room.imageUrls.length > 0 ? (
                  <div className="relative mb-4">
                    <img
                      src={selectedImage}
                      alt={room.name}
                      className="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-lg shadow-md"
                      loading="lazy"
                    />

                    {/* Thumbnails in Overlay */}
                    <div className="flex items-center mt-2">
                      <button
                        onClick={scrollThumbnailsLeft}
                        className="hidden sm:flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full hover:bg-gray-400 transition"
                        aria-label="Scroll Left"
                      >
                        <FaArrowLeft className="text-gray-700" />
                      </button>

                      <div
                        ref={thumbnailRef}
                        className="flex space-x-2 overflow-x-auto scrollbar-hide scroll-smooth"
                      >
                        {room.imageUrls.map((url, index) => (
                          <img
                            key={index}
                            src={url}
                            alt={`Thumbnail ${index + 1}`}
                            className={`w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80 flex-shrink-0 ${
                              selectedImage === url ? "border-2 border-blue-500" : ""
                            }`}
                            onClick={() => setSelectedImage(url)}
                            loading="lazy"
                          />
                        ))}
                      </div>

                      <button
                        onClick={scrollThumbnailsRight}
                        className="hidden sm:flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full hover:bg-gray-400 transition"
                        aria-label="Scroll Right"
                      >
                        <FaArrowRight className="text-gray-700" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                    <span className="text-gray-500">No Image Available</span>
                  </div>
                )}
                <h2 className="text-xl sm:text-2xl font-bold mb-2">
                  {room.roomType}
                </h2>
                <p className="mt-2 text-gray-600 text-sm sm:text-base">
                  {room.description}
                </p>

                {/* Amenities in Overlay */}
                <div className="flex flex-wrap mt-3 space-x-2">
                  <Amenities amenities={room.amenities} />
                </div>

                {/* Price */}
                <p className="font-bold text-md sm:text-lg mt-4">
                  Price per Night: ${room.pricePerNight}
                </p>
              </div>

              {/* Booking Form */}
              <div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Form fields remain the same */}
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Number of People */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Number of People
                    </label>
                    <input
                      type="number"
                      name="numberOfPeople"
                      value={formData.numberOfPeople}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Total Price Calculation */}
                  <p className="font-bold text-md sm:text-lg">
                    Total Price: ${calculateTotalPrice()}
                  </p>

                  {/* Confirm Booking Button */}
                  <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition flex justify-center items-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </button>

                  {/* Success Message */}
                  {showSuccessMessage && (
                    <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
                      Booking successful! Please check your email for confirmation.
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RoomDisplay;
