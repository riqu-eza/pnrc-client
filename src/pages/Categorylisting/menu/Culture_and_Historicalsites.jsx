/* eslint-disable react/prop-types */
import { useState } from "react";
import Culture_and_Historicalsitesmodal from "../modal/Culture_and_Historicalsites";

const Culture_and_Historicalsitesmenu = ({
  subcategories,
  listingemail,
  listingname,
  listingaddress,
}) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to handle subcategory selection
  const handleSubcategorySelect = (subcategory) => {
    setSelectedSubcategory(subcategory);
  };
  console.log("selected subcategory", selectedSubcategory);
  console.log("subcategories", subcategories);

  // Filter menu items based on the selected subcategory
  const filteredMenuItems = selectedSubcategory
    ? subcategories.find((subcat) => subcat.subcategory === selectedSubcategory)
        ?.CultureItems || []
    : subcategories.flatMap((subcat) => subcat.CultureItems); // Show all if no subcategory is selected

  // Function to open modal with selected meal details
  const handleViewMore = (meal) => {
    setSelectedMeal(meal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMeal(null);
  };

  if (!Array.isArray(subcategories) || subcategories.length === 0) {
    return <p>No subcategories available.</p>; // Fallback if no subcategories
  }
  console.log("filtered subcategory", filteredMenuItems);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with subtle animation */}

      {/* Subcategory Bar - Sticky with gradient background */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur-sm bg-opacity-90 mb-8 py-4 px-2 rounded-xl shadow-sm">
        <div className="flex flex-wrap justify-center gap-3">
          {subcategories.map((subcat) => (
            <button
              key={subcat._id}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedSubcategory === subcat.subcategory
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
              }`}
              onClick={() => handleSubcategorySelect(subcat.subcategory)}
            >
              {subcat.subcategory}
            </button>
          ))}
          <button
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedSubcategory === null
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
            }`}
            onClick={() => handleSubcategorySelect(null)}
          >
            All Items
          </button>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="space-y-8">
        {filteredMenuItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMenuItems.map((item) => (
              <div
                key={item._id || item.name}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image with overlay effect */}
                {item.imageUrls?.length > 0 ? (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.imageUrls[0]}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                ) : (
                  <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">No Image Available</span>
                  </div>
                )}

                {/* Content */}
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900 truncate">
                      {item.name}
                    </h3>
                    {item.entryFee && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full ml-2 whitespace-nowrap">
                        ${item.entryFee}
                      </span>
                    )}
                  </div>

                  {/* Dynamic description based on subcategory */}
                  <p className="mt-2 text-gray-600 line-clamp-2">
                    {item.subcategory === "Museums" && item.exhibits}
                    {item.subcategory === "Art Galleries" && item.artStyles}
                    {item.subcategory === "Historic Landmarks" &&
                      item.historicalSignificance}
                    {item.subcategory === "Monuments" &&
                      item.historicalSignificance}
                    {item.subcategory === "Archaelogical Sites" &&
                      item.significance}
                    {item.subcategory === "Cultural Sites" &&
                      item.culturalSignificance}
                    {item.subcategory === "Heritage Sites" &&
                      item.historicalSignificance}
                    {item.subcategory === "Religious places of interest" &&
                      "Religious site"}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    {/* Show opening hours if available */}
                    {item.openingHours ? (
                      <span className="inline-flex items-center text-sm text-gray-500">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {item.openingHours}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">
                        Hours not specified
                      </span>
                    )}

                    <button
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      onClick={() => handleViewMore(item)}
                    >
                      View Details
                    </button>
                  </div>

                  {/* Quick facility indicators */}
                  {(item.guidedTours || item.wheelchairAccess) && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {item.guidedTours && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Guided Tours
                        </span>
                      )}
                      {item.wheelchairAccess && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                          Wheelchair Access
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No sites found
            </h3>
            <p className="mt-1 text-gray-500">
              We couldn&#39;t find any{" "}
              {selectedSubcategory
                ? selectedSubcategory.toLowerCase()
                : "cultural/historical"}{" "}
              sites.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Culture_and_Historicalsitesmodal
          event={selectedMeal}
          listingemail={listingemail}
          listingname={listingname}
          listingaddress={listingaddress}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Culture_and_Historicalsitesmenu;
