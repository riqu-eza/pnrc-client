import { useState, useEffect } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useParams, Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

const BusinessDetails = () => {
  const { id } = useParams();
  const [businessDetails, setBusinessDetails] = useState(null);
  const [selectedProductName, setSelectedProductName] = useState(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await fetch(
          `/api/business/${id}`
        );
        const data = await response.json();
        setBusinessDetails(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching business:", error);
      }
    };

    fetchBusiness();
  }, [id]);

  const handleMapClick = (location) => {
    const [latitude, longitude] = location.split(",");

    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;

    window.open(url, "_blank");
  };

  if (!businessDetails) {
    return <p>Loading...</p>;
  }

  const {
    businessDetails: details,
    keyProducts,
    allProducts,
  } = businessDetails;

  if (!details || !keyProducts || !allProducts) {
    return <p>Loading...</p>;
  }

  const displayedProducts = selectedProductName
    ? keyProducts.find((group) => group.productName === selectedProductName)
        .products
    : allProducts;

  return (
    <div className="text-center p-4 h-screen overflow-auto flex flex-col">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
        {details.name}
      </h1>

      <div className="flex flex-col md:flex-row md:justify-center md:space-x-4 mb-4">
        <p className="text-base md:text-lg">
          <span className="text-slate-700">Phone No:</span> {details.contact}
        </p>
        <p className="text-base md:text-lg">
          <span className="text-slate-700">Email us @</span> {details.email}
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:justify-center items-center mb-4 space-y-2 md:space-x-2">
        <span className="text-gray-500">{details.address}</span>
        <FaMapMarkerAlt
          className="text-black cursor-pointer"
          onClick={() => handleMapClick(details.location)}
        />
      </div>

      <p className="text-base md:text-lg mb-4 px-2">{details.description}</p>

      <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8">
        {/* Key Products Section */}
        <div
          className="flex flex-col border-r border-gray-300 mb-4 md:mb-0 overflow-x-auto"
          style={{ width: "100%", maxWidth: "350px", padding: "1rem" }}
        >
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            Key Products
          </h2>
          <div className="flex flex-row overflow-x-hidden space-y-2">
            {keyProducts.map((productGroup, index) => (
              <button
                key={index}
                className={`p-2 border rounded text-left ${
                  selectedProductName === productGroup.productName
                    ? "bg-gray-200"
                    : ""
                }`}
                onClick={() => setSelectedProductName(productGroup.productName)}
              >
                {productGroup.productName} ({productGroup.count})
              </button>
            ))}
          </div>
        </div>

        {/* Displaying Products */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ padding: "1rem", maxHeight: "80vh" }}
        >
          <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayedProducts.map((product, index) => (
              <Link
                to={`/product/${product._id}`} 
                key={index}
                className="p-4 border border-gray-300 rounded-lg flex flex-col hover:shadow-md"
              >
                <Swiper className="mb-2">
                  {product.productImage.map((image, imgIndex) => (
                    <SwiperSlide key={imgIndex}>
                      <img
                        src={image}
                        alt={product.productName}
                        className="w-full h-40 object-contain rounded-lg"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <p className="font-semibold text-base">{product.productName}</p>
                <p className="text-sm text-green-500">{product.productPrice}</p>
                <p className="text-sm truncate">{product.productDescription}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetails;
