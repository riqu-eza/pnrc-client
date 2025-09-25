import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import "ldrs/jellyTriangle";

const BusinesscityPage = () => {
  const { city } = useParams();
  const [groupedData, setGroupedData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [businessCount, setBusinessCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [totalProductViews, setTotalProductViews] = useState(0);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showSubCategoriesDropdown, setShowSubCategoriesDropdown] = useState(false);

  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({
      left: -300, // Adjust the value to control the scroll distance
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({
      left: 300, // Adjust the value to control the scroll distance
      behavior: "smooth",
    });
  };

  const stats = [
    { id: 1, value: `${businessCount}`, description: "Businesses" },
    { id: 2, value: `${productCount}`, description: "Products" },
    {
      id: 3,
      value: `${totalProductViews}`,
      description: "Total Product Views",
    },
  ];

  useEffect(() => {
    const fetchCityData = async () => {
      try {
        const res = await fetch(
          `/api/business/city?name=${encodeURIComponent(city)}`
        );
        if (!res.ok) {
          throw new Error(`Error: ${res.statusText}`);
        }
        const data = await res.json();
        const { businessCount, productCount, totalProductViews, groupedData } =
          data;

        setGroupedData(groupedData);
        setBusinessCount(businessCount);
        setProductCount(productCount);
        setTotalProductViews(totalProductViews);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching city data:", error);
        setIsLoading(false);
      }
    };
    fetchCityData();
  }, [city]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!groupedData) {
    return <div>No data available for {city}</div>;
  }

  return (
    <div className="bg-white h-screen overflow-y-auto m-4 md:m-10 lg:m-14 mx-4 md:mx-8 lg:mx-20">
      <div className="justify-between px-4 md:px-8 lg:px-10 max-w-screen my-2 mx-auto">
        <div className="flex-grow flex items-center justify-center mb-4">
          <h1 className="font-semibold text-center text-2xl md:text-3xl lg:text-4xl">
            Explore Millions of offerings tailored for your business needs in {city}
          </h1>
        </div>

        <div className="flex flex-wrap justify-center mb-4">
          {stats.map((stat) => (
            <div key={stat.id} className="bg-white p-4 rounded-lg shadow-md m-2 flex-grow w-20">
              <h2 className="text-xl md:text-2xl text-center font-bold text-slate-800">
                {stat.value}
              </h2>
              <p className="mt-2 text-sm md:text-base text-gray-600">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {isLoading ? (
          <div className="flex items-center justify-center h-screen w-screen" >
          <l-jelly-triangle
            size="30"
            speed="1.75"
            color="black"
          ></l-jelly-triangle>
        </div>
        ) : (
          <>
            <div className="w-full md:w-1/4 p-4 border-r border-gray-200 h-auto md:h-80 overflow-auto flex-shrink-0">
              <h2 className="text-lg md:text-xl font-semibold mb-4"></h2>
              <div className="relative md:block">
                <button
                  className="w-full text-left p-2 border rounded md:hidden"
                  onClick={() => setShowCategoriesDropdown(!showCategoriesDropdown)}
                >
                  Select Category
                </button>
                <ul className={`md:block ${showCategoriesDropdown ? 'block' : 'hidden'} mt-2`}>
                  {Object.keys(groupedData).map((category, index) => (
                    <li
                      key={index}
                      className={`cursor-pointer p-2 mb-2 rounded ${selectedCategory === category ? "bg-gray-200" : ""}`}
                      onClick={() => {
                        setSelectedCategory(category);
                        setSelectedSubCategory(null);
                        setShowCategoriesDropdown(false);
                      }}
                    >
                      {category}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {selectedCategory && (
              <div className="w-full md:w-1/4 p-4 border-r border-gray-200 overflow-auto flex-shrink-0">
                <h2 className="text-lg md:text-xl font-semibold mb-4"></h2>
                <div className="relative md:block">
                  <button
                    className="w-full text-left p-2 border rounded md:hidden"
                    onClick={() => setShowSubCategoriesDropdown(!showSubCategoriesDropdown)}
                  >
                    Select Subcategory
                  </button>
                  <ul className={`md:block ${showSubCategoriesDropdown ? 'block' : 'hidden'} mt-2`}>
                    {Object.keys(groupedData[selectedCategory]).map((subCategory, index) => (
                      <li
                        key={index}
                        className={`cursor-pointer p-2 mb-2 rounded ${selectedSubCategory === subCategory ? "bg-gray-200" : ""}`}
                        onClick={() => {
                          setSelectedSubCategory(subCategory);
                          setShowSubCategoriesDropdown(false);
                        }}
                      >
                        {subCategory}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="w-full p-4 relative mt-4 md:mt-0">
              <h2 className="text-lg md:text-xl font-semibold mb-4">Businesses</h2>
              {selectedCategory &&
              selectedSubCategory &&
              Array.isArray(groupedData[selectedCategory][selectedSubCategory]?.businesses) ? (
                <div className="relative">
                  <button
                    onClick={scrollLeft}
                    className="absolute left-0 z-10 p-2 m-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 focus:outline-none"
                  >
                    &larr;
                  </button>
                  <div
                    ref={scrollContainerRef}
                    className="grid grid-flow-col auto-cols-max gap-4 overflow-x-hidden border-black border-t border-b p-2"
                  >
                    {groupedData[selectedCategory][selectedSubCategory].businesses.map((business, businessIndex) => (
                      <div
                        key={businessIndex}
                        className="p-4 m-2 rounded-lg min-w-[250px]"
                      >
                        <Link to={`/businesslisting/${business._id}`}>
                          {business.imageUrls && (
                            <img
                              src={business.imageUrls}
                              alt={business.name}
                              className="w-full h-40 object-cover mb-2 rounded-lg"
                            />
                          )}
                          <p className="font-medium">{business.name}</p>
                          <p className="text-sm">{business.description}</p>
                        </Link>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={scrollRight}
                    className="absolute right-0 z-10 p-2 m-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 focus:outline-none"
                  >
                    &rarr;
                  </button>
                </div>
              ) : (
                <p>....</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BusinesscityPage;
