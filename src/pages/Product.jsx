import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
// import Comment from "./commentsection/Comment";
import Comments from "./commentsection/Comments";
import { useSelector } from "react-redux";

const Product = () => {
  const { productId } = useParams();
  const [productData, setProductData] = useState(null);
  const [message, setMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `/api/business/product/${productId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProductData(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  
  const handleChatOpen = () => setIsChatOpen(!isChatOpen);

  const handleSendMessage = () => {
    // Implement the chat message sending logic here
    console.log("Message sent:", message);
    setMessage(""); // Clear the input after sending
  };

  if (!productData) {
    return <p>Loading...</p>;
  }

  const { product, businessDetails } = productData;

  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      <div className="flex  flex-col lg:flex-row">
        {/* Product Images and Rating */}
        <div className="w-full  lg:w-1/2 flex flex-col items-center">
          <img
            src={product.productImage[0]}
            alt={product.productName}
            className="w-full h-80 object-contain mb-2 rounded-lg shadow-md"
          />
          <div className="flex space-x-2 overflow-x-auto">
            {product.productImage.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={product.productName}
                className="w-12 h-12 object-cover rounded-lg border cursor-pointer"
              />
            ))}
          </div>
          {/* Ratings and Reviews */}
          <div className="mt-4 w-full">
            {/* Display Reviews */}

            {/*chat box*/}
          </div>
          <div className="mt-4">
            <button
              onClick={handleChatOpen}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg mb-4"
            >
              {isChatOpen ? "Close Chat" : "Chat with Us"}
            </button>

            {isChatOpen && (
              <div className="fixed bottom-4 right-4 bg-white border rounded-lg shadow-lg p-4 max-w-sm w-full">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Chat with Us</h3>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows="4"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Type your message here..."
                  ></textarea>
                </div>
                <button
                  onClick={handleSendMessage}
                  className="bg-green-500 text-white py-2 px-4 rounded-lg"
                >
                  Send
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Product Details and Business Details */}
        <div className="w-full  lg:w-1/2 lg:pl-4  h-full">
          <div className="flex gap-6 mb-4 ">
            <div className="w-full  border rounded-lg text-center bg-gray-100  ">
              <h1 className="text-3xl font-bold mb-2">{product.productName}</h1>
              <p className="text-lg text-green-600 font-semibold mb-4">
                {product.productPrice} Ksh
              </p>
              <p className="text-base mb-4">{product.productDescription}</p>
            </div>

            {/* Business Details */}
            <div className="p-4 border rounded-lg bg-gray-100 mb-4">
              <h2 className="text-xl font-semibold mb-2">
                {businessDetails.name}
              </h2>
              <p className="flex items-center mb-2">
                <FaMapMarkerAlt className="mr-2 text-blue-500" />
                {businessDetails.address}
              </p>
              <p className="flex items-center mb-2">
                <FaPhoneAlt className="mr-2 text-green-500" />
                {businessDetails.contact}
              </p>
              <p className="flex items-center mb-2">
                <FaEnvelope className="mr-2 text-red-500" />
                {businessDetails.email}
              </p>
              <p className="mb-2">{businessDetails.description}</p>
              <a
                href={`https://www.google.com/maps?q=${businessDetails.location}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                View on Google Maps
              </a>
            </div>
          </div>

          {/* product reviews */}

          <div></div>
        </div>
      </div>
      <Comments currentUser={currentUser} listingId={productId} />

    </div>
  );
};

export default Product;
