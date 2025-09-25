/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// ListingsByCounty.js

import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Countylisting = ({ countyBackgrounds }) => {
  const { county } = useParams();
  const [ListingsByCounty, setListingsByCounty] = useState([]);
  const [selectedCounty, setSelectedCounty] = useState([]);
  const [ListingsByCategory, setListingsByCategory] = useState({});
  const [searchTerm] = useState("");
  // const countyInfo = queryParams.get("countyInfo");

  const navigate = useNavigate();
  const location = useLocation();
  console.log("Location object:", location);

  const queryParams = new URLSearchParams(location.search);
  const backgroundUrl = queryParams.get("backgroundUrl");
  const cityInfo = queryParams.get("countyInfo");

  console.log("Background URL from URL parameters:", backgroundUrl);
  console.log("Background URL from URL parameters:", cityInfo);

  const handleSearch = () => {
    navigate(`/search?searchTerm=${searchTerm}`);
  };
  // console.log("url received:" backgroundUrl)
  console.log("Background URL:", backgroundUrl);

  useEffect(() => {
    const fetchListingsByCounty = async (county) => {
      try {

        const res = await fetch(
          `/api/listing/get-by-county?selectedCounty=${county}`
        );
        const data = await res.json();
        setListingsByCounty(data);
        setSelectedCounty(county);

        const groupedByCategory = {};

        data.forEach((listing) => {
          const category = listing.selectedCategory;
          if (!groupedByCategory[category]) {
            groupedByCategory[category] = [];
          }
          groupedByCategory[category].push(listing);
        });

        setListingsByCategory(groupedByCategory);
      } catch (error) {
        console.error(error);
      }
    };

    fetchListingsByCounty(county);
  }, [county]);

  const categories = [
    { name: "Accommodation" },
    { name: "Dining" },
    { name: "Entertainment" },
    { name: "Shopping" },
    { name: "Education_and_Learning" },
    { name: "Services" },
    { name: "Culture_and_Historicalsites" },
  ];

  return (
    <div className="mt-9">
      {/* Hero Section */}
      <div
        className="flex flex-col gap-6 sm:gap-12 md:gap-24 bg-cover bg-center h-96 items-center text-center justify-between relative"
        style={{ backgroundImage: `url(${backgroundUrl})` }}
      >
        <div className="absolute inset- bg-black bg-opacity-40"></div>
        <h1 className="relative bg-gradient-to-r from-white via-white to-white bg-clip-text text-transparent z-10 text-2xl sm:text-3xl md:text-4xl font-bold px-4">
          Welcome To The Magic of {selectedCounty}
        </h1>

        <div className="relative z-10 flex flex-wrap justify-center gap-2 md:gap-4">
          {categories.map((category, index) => (
            <div key={index} className="flex">
              <Link
                to={`/listings/${county}/${category.name || category}`}
                className="categoryname category-link bg-black text-white px-4 py-2 rounded-full hover:bg-gray-400 shadow-md text-sm sm:text-base md:text-lg"
              >
                {category.name || category}
              </Link>
            </div>
          ))}
          {/* <button
            className="bg-black text-white px-4 py-2 text-sm sm:text-base md:text-lg rounded-full hover:bg-gray-400 shadow-md"
            onClick={handleSearch}
          >
            Search
          </button> */}
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4 md:p-6 lg:px-12 bg-black flex items-center justify-center">
        <p className="text-white text-base md:text-lg lg:text-2xl text-center mx-4 md:mx-12 lg:mx-20">
          {cityInfo}
        </p>
      </div>
    </div>
  );
};

export default Countylisting;
