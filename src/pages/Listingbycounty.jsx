import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "ldrs/jellyTriangle";

import "./page.css";
import "../components/loading.css";

const ListingsByCounty = () => {
  const [uniqueCounties, setUniqueCounties] = useState([]);
  const [listingsByCounty, setListingsByCounty] = useState([]);
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [countyBackgrounds, setCountyBackgrounds] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [cityinfo, setCityInfo] = useState([]);
  const [introVisible, setIntroVisible] = useState(true);

  useEffect(() => {
    const fetchUniqueCounties = async () => {
      try {
        const res = await fetch("/api/listing/unique-counties");
        const data = await res.json();
        setUniqueCounties(data);
        const backgrounds = {};
        const cityInfo = {};

        for (const county of data) {
          try {
            const imageRes = await fetch(
              `/api/admin/bckimg?county=${encodeURIComponent(county)}`
            );
            const imageData = await imageRes.json();
            backgrounds[county] = imageData.imageUrls || [];
            cityInfo[county] = imageData.description || "";
          } catch (err) {
            console.warn(`Failed to fetch data for county: ${county}`, err);
          }
        }

        setCountyBackgrounds(backgrounds);
        setCityInfo(cityInfo);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch unique counties", error);
        setIsLoading(false);
      }
    };

    fetchUniqueCounties();
  }, []);

  const fetchListingsByCounty = async (county) => {
    const backgroundUrl = countyBackgrounds[county];
    console.log("State data to be passed:", { backgroundUrl });

    try {
      const res = await fetch(
        `/api/listing/get?selectedCounty=${encodeURIComponent(county)}`
      );
      const data = await res.json();
      setListingsByCounty(data);
      setSelectedCounty(county);
    } catch (error) {
      console.error(error);
    }
  };

  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    return words.length <= wordLimit
      ? text
      : `${words.slice(0, wordLimit).join(" ")} ...`;
  };

  return (
    <>
      {introVisible && (
        <div
          className="fixed inset-0 flex items-start justify-center bg-opacity-100 z-40"
          role="dialog"
          aria-modal="true"
          style={{
            backgroundImage: `url(/images/resort.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="text-black p-8 mt-16 rounded-md text-center bg-opacity-70">
            <h2 className="text-2xl font-bold md:text-3xl">
              Welcome to Our Resort Cities!
            </h2>

            <p className="mt-4 text-lg leading-8">
              Join us on a journey through Africa’s breathtaking Resort Cities.
              At Palmnazi RC, we provide a glimpse of stunning destinations with
              royal treatment, delivering a majestic experience at the heart of
              Africa.
            </p>
            <button
              className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => setIntroVisible(false)}
            >
              Explore Cities
            </button>
          </div>
        </div>
      )}

      {!introVisible && (
        <div>
          {isLoading ? (
            <div className="flex items-center justify-center h-screen">
              <l-jelly-triangle
                size="30"
                speed="1.75"
                color="black"
              ></l-jelly-triangle>
            </div>
          ) : (
            <div className="p-4">
              <h1 className="text-center text-3xl p-4 font-bold text-blue-600">
                Welcome to Our Resort Cities Destinations
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {uniqueCounties.map((county) => (
                  <div
                    key={county}
                    className="relative group overflow-hidden border rounded-lg shadow-lg transform hover:scale-105 transition-transform"
                    style={{
                      backgroundImage: `url(${countyBackgrounds[county]})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      height: "300px",
                    }}
                  >
                    <Link
                      to={`/listings/${county}?backgroundUrl=${encodeURIComponent(
                        countyBackgrounds[county]
                      )}&county=${encodeURIComponent(
                        county
                      )}&countyInfo=${encodeURIComponent(cityinfo[county])}`}
                      onClick={() => fetchListingsByCounty(county)}
                      className="block w-full h-full"
                    >
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-between p-4">
                        <h2 className="text-2xl text-white font-bold uppercase">
                          {county}
                        </h2>
                        <p className="text-sm text-white">
                          {truncateText(cityinfo[county], 20)}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {selectedCounty && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4">
                    Listings in {selectedCounty}
                  </h2>
                  {listingsByCounty.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {listingsByCounty.map((listing) => (
                        <div
                          key={listing._id}
                          className="p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow"
                        >
                          <h3 className="text-lg font-bold">{listing.title}</h3>
                          <p className="text-sm text-gray-600">
                            {truncateText(listing.description, 15)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No listings found in {selectedCounty}.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ListingsByCounty;
