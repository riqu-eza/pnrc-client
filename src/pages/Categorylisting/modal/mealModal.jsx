/* eslint-disable react/prop-types */
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css"; // Import Swiper styles

const MealModal = ({ meal, onClose, listingemail, listingname, listingaddress }) => {
  const [showForm, setShowForm] = useState(false);
  const [orderType, setOrderType] = useState(""); // 'delivery' or 'pickup'
  const [isLoading, setIsLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    mealCount: 1,
    totalPrice: meal ? meal.Price : 0,
    mealname: meal ? meal.DishName : "",
    listingEmail: listingemail,
    listingName: listingname,
    listingAddress: listingaddress,
    orderType: "", // Will be set when user clicks delivery/pickup
  });

  if (!meal) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleOrderClick = (type) => {
    setOrderType(type);
    setFormData((prev) => ({ ...prev, orderType: type }));
    setShowForm(true);
    setOrderSuccess(false); // Reset success message when opening form
  };

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/booking/create/meal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          totalPrice: formData.totalPrice * formData.mealCount, // Calculate final price
        }),
      });
      const data = await res.json();
      console.log("created successfully", data);
      setIsLoading(false);
      setOrderSuccess(true);
      // Don't close the form immediately so user can see the success message
    } catch (error) {
      console.log("error occurred", error);
      setIsLoading(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setOrderType("");
    if (orderSuccess) {
      onClose(); // Only close the modal if order was successful
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto py-10">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex flex-wrap">
          {/* Left Section: Image and Meal Info */}
          <div className="flex-1 pr-4 min-w-0">
            <Swiper spaceBetween={10} slidesPerView={1}>
              {meal.imageUrls.length > 0 ? (
                meal.imageUrls.map((url, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={url}
                      alt={meal.DishName}
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
            <h2 className="text-2xl font-bold mb-2">{meal.DishName}</h2>
            <p className="text-lg mb-2">
              <strong>Description:</strong> {meal.description}
            </p>
            <p className="text-lg mb-2">
              <strong>Price:</strong> ${meal.Price}
            </p>
          </div>
          {/* Middle Section: Additional Details */}
          <div className="flex-1 px-4 border-l border-gray-300 min-w-0">
            <h3 className="text-xl font-semibold mb-2">Additional Details</h3>
            <p className="text-lg mb-2">
              <strong>Dietary Information:</strong> {meal.DietaryInformation}
            </p>
            <p className="text-lg mb-2">
              <strong>Serving Time:</strong> {meal.ServingTime}
            </p>
            <p className="text-lg mb-2">
              <strong>Serving Size:</strong> {meal.ServingSize}
            </p>
            <p className="text-lg mb-2">
              <strong>Preparation Time:</strong> {meal.PreparationTime} mins
            </p>
          </div>
          {/* Right Section: Ordering Buttons */}
          <div className="flex flex-col pl-4 min-w-0">
            <h3 className="text-xl font-semibold mb-2">Order Options</h3>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition mb-2 flex items-center justify-center"
              onClick={() => handleOrderClick("delivery")}
              disabled={isLoading}
            >
              {isLoading && orderType === "delivery" ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Order for Delivery"
              )}
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition mb-2 flex items-center justify-center"
              onClick={() => handleOrderClick("pickup")}
              disabled={isLoading}
            >
              {isLoading && orderType === "pickup" ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Order for Pickup"
              )}
            </button>
          </div>
        </div>

        {/* Order Form Modal */}
        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              {orderSuccess ? (
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mt-3 mb-2">Order Placed Successfully!</h2>
                  <p className="text-lg mb-4">
                    Thank you for your order. A confirmation has been sent to your email.
                    Please check your inbox (and spam folder) for details.
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
                    Order Form - {orderType === "delivery" ? "Delivery" : "Pickup"}
                  </h2>
                  <form onSubmit={handleConfirmOrder}>
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
                      name="mealCount"
                      placeholder="Count"
                      value={formData.mealCount}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-lg p-2 mb-2 w-full"
                      min="1"
                      required
                    />
                    <p className="text-lg mb-2">
                      <strong>Total Price:</strong> $
                      {formData.totalPrice * formData.mealCount}
                    </p>
                    <input
                      type="hidden"
                      name="orderType"
                      value={orderType}
                    />
                    <div className="flex justify-between mt-4">
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center justify-center"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          "Confirm Order"
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

export default MealModal;