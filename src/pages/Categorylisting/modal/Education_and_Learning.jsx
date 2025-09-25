/* eslint-disable react/prop-types */
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css"; // Import Swiper styles

const Education_and_Learningmodal = ({
  event,
  onClose,
  listingemail,
  listingname,
  listingaddress,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    ticketCount: 1,
    totalPrice: event ? event.price : 0,
    eventName: event ? event.name : "",
    listingEmail: listingemail,
    listingName: listingname,
    listingAddress: listingaddress,
  });

  if (!event) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // eslint-disable-next-line no-unused-vars
  const handleBookingClick = () => {
    setShowForm(true);
    setBookingSuccess(false);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const bookingData = {
      ...formData,
      totalPrice: formData.totalPrice * formData.ticketCount,
      eventType: event.subcategory,
      eventTime: event.time,
      venue: event.venue,
    };

    console.log("Booking request body:", bookingData); // 🔍 Log the request body

    try {
      const res = await fetch("/api/booking/create/entertainment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const data = await res.json();
      console.log("Booking created successfully", data);
      setIsLoading(false);
      setBookingSuccess(true);
    } catch (error) {
      console.log("Error occurred", error);
      setIsLoading(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    if (bookingSuccess) {
      onClose();
    }
  };

  // Render appropriate details based on subcategory
  const renderEventDetails = () => {
    switch (event.subcategory) {
      case "Libraries":
        return (
          <>
            <p className="text-lg mb-2">
              <strong>Library Type:</strong>{" "}
              {event.libraryType || "Not specified"}
            </p>
            <p className="text-lg mb-2">
              <strong>Collection Size:</strong>{" "}
              {event.collectionSize || "Not specified"} items
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <h4 className="font-medium">Facilities:</h4>
                <ul className="list-disc pl-5">
                  {event.wifiAvailability && <li>WiFi Available</li>}
                  {event.studyRooms && <li>Study Rooms</li>}
                </ul>
              </div>
            </div>
          </>
        );
      case "Bookstores":
        return (
          <>
            <p className="text-lg mb-2">
              <strong>Store Type:</strong> {event.storeType || "Not specified"}
            </p>
            <p className="text-lg mb-2">
              <strong>Genres Offered:</strong>{" "}
              {event.genresOffered || "Not specified"}
            </p>
            {event.cafeAvailable && (
              <p className="text-lg mb-2">✔ Café Available</p>
            )}
          </>
        );
      case "Education Centers":
        return (
          <>
            <p className="text-lg mb-2">
              <strong>Center Type:</strong>{" "}
              {event.centerType || "Not specified"}
            </p>
            <p className="text-lg mb-2">
              <strong>Courses Offered:</strong>{" "}
              {event.coursesOffered || "Not specified"}
            </p>
            {event.facilities && (
              <p className="text-lg mb-2">
                <strong>Facilities:</strong> {event.facilities}
              </p>
            )}
          </>
        );
      case "Art Schools":
        return (
          <>
            <p className="text-lg mb-2">
              <strong>Specializations:</strong>{" "}
              {event.specializations || "Not specified"}
            </p>
            <p className="text-lg mb-2">
              <strong>Courses Offered:</strong>{" "}
              {event.coursesOffered || "Not specified"}
            </p>
            <p className="text-lg mb-2">
              <strong>Tuition Fees:</strong> $
              {event.tuitionFees || "Not specified"}
            </p>
            {event.facilities && (
              <p className="text-lg mb-2">
                <strong>Facilities:</strong> {event.facilities}
              </p>
            )}
          </>
        );
      case "Cooking Schools":
        return (
          <>
            <p className="text-lg mb-2">
              <strong>Cuisines Offered:</strong>{" "}
              {event.cuisinesOffered || "Not specified"}
            </p>
            <p className="text-lg mb-2">
              <strong>Courses Offered:</strong>{" "}
              {event.coursesOffered || "Not specified"}
            </p>
            <p className="text-lg mb-2">
              <strong>Tuition Fees:</strong> $
              {event.tuitionFees || "Not specified"}
            </p>
            <p className="text-lg mb-2">
              <strong>Course Duration:</strong>{" "}
              {event.courseDuration || "Not specified"} months
            </p>
          </>
        );
      case "Language Schools":
        return (
          <>
            <p className="text-lg mb-2">
              <strong>Languages Taught:</strong>{" "}
              {event.languagesTaught || "Not specified"}
            </p>
            <p className="text-lg mb-2">
              <strong>Courses Offered:</strong>{" "}
              {event.coursesOffered || "Not specified"}
            </p>
            <p className="text-lg mb-2">
              <strong>Tuition Fees:</strong> $
              {event.tuitionFees || "Not specified"}
            </p>
            <p className="text-lg mb-2">
              <strong>Course Duration:</strong>{" "}
              {event.courseDuration || "Not specified"} months
            </p>
          </>
        );
      case "Workshops & Classes":
        return (
          <>
            <p className="text-lg mb-2">
              <strong>Subject:</strong> {event.subject || "Not specified"}
            </p>
            <p className="text-lg mb-2">
              <strong>Schedule:</strong> {event.schedule || "Not specified"}{" "}
              days/week
            </p>
            <p className="text-lg mb-2">
              <strong>Fees:</strong> ${event.fees || "Not specified"}
            </p>
            {event.instructor && (
              <p className="text-lg mb-2">
                <strong>Instructor:</strong> {event.instructor}
              </p>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto py-10">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex-1 pr-4 min-w-0">
          <Swiper spaceBetween={10} slidesPerView={1}>
            {event.imageUrls?.length > 0 ? (
              event.imageUrls.map((url, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={url}
                    alt={event.name || event.subcategory}
                    className="rounded-lg mb-2 w-full h-64 object-cover"
                  />
                </SwiperSlide>
              ))
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg mb-2">
                No Image Available
              </div>
            )}
          </Swiper>
          <h2 className="text-2xl font-bold mb-2">
            {event.name || event.subcategory}
          </h2>
          <p className="text-lg mb-2">
            <strong>Category:</strong> {event.subcategory}
          </p>
          {event.location && (
            <p className="text-lg mb-2">
              <strong>Location:</strong> {event.location}
            </p>
          )}
          {renderEventDetails()}
        </div>

        {/* Booking Form Modal */}
        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              {bookingSuccess ? (
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <svg
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mt-3 mb-2">
                    Booking Confirmed!
                  </h2>
                  <p className="text-lg mb-4">
                    Thank you for your booking. A confirmation has been sent to
                    your email. Please check your inbox (and spam folder) for
                    details.
                  </p>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    onClick={handleCloseForm}
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-4">
                    Booking Form - {event.name}
                  </h2>
                  <form onSubmit={handleConfirmBooking}>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-lg p-2 mb-2 w-full"
                      required
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-lg p-2 mb-2 w-full"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-lg p-2 mb-2 w-full"
                      required
                    />
                    <input
                      type="text"
                      name="contact"
                      placeholder="Contact Number"
                      value={formData.contact}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-lg p-2 mb-2 w-full"
                      required
                    />
                    <input
                      type="number"
                      name="ticketCount"
                      placeholder="Number of Tickets"
                      value={formData.ticketCount}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-lg p-2 mb-2 w-full"
                      min="1"
                      required
                    />
                    <p className="text-lg mb-2">
                      <strong>Event Time:</strong> {event.time}
                    </p>
                    <p className="text-lg mb-2">
                      <strong>Venue:</strong> {event.venue}
                    </p>
                    <p className="text-lg mb-4">
                      <strong>Total Price:</strong> $
                      {formData.totalPrice * formData.ticketCount}
                    </p>
                    <div className="flex justify-between mt-4">
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center justify-center"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          "Confirm Booking"
                        )}
                      </button>
                      <button
                        type="button"
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                        onClick={handleCloseForm}
                        disabled={isLoading}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

        {/* Close Button */}
        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          onClick={onClose}
          disabled={isLoading}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Education_and_Learningmodal;
