/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

const ImageGallery = ({ listing }) => {
  console.log("Received listing:", listing);
  console.log("Image URLs:", listing.imageUrls);

  const [randomImages, setRandomImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  // Shuffle and get 1 to 5 random images for initial render
  useEffect(() => {
    if (listing.imageUrls?.length > 0) {
      const shuffledImages = [...listing.imageUrls].sort(() => 0.5 - Math.random());
      const numberOfImagesToShow = Math.min(Math.max(shuffledImages.length, 1), 5); // 1 to 5 images
      setRandomImages(shuffledImages.slice(0, numberOfImagesToShow)); // Get random images
      setSelectedImage(shuffledImages[0]); // Set the first random image as default
    }
  }, [listing.imageUrls]);
console.log("random", randomImages)
console.log("selected ", selectedImage)
console.log(`URL for selected image: ${selectedImage || randomImages[0]}`);

  return (
    <div className="w-full md:w-3/4 mx-auto my-auto    mt-4 mb-8">
      {/* Upper Section - Display the selected image */}
      <div className="grid grid-cols-2 md:grid-cols-3 m-1 gap-2 mb-4 h-[300px]">
        {randomImages.length > 0 ? (
          <div
            className="col-span-3 bg-cover  "
            style={{
              backgroundImage: `url(${selectedImage || randomImages[0]})`,
              
              
              // height: "100%", // Full height
            }}
          ></div>
        ) : (
          <p>No images available</p>
        )}
      </div>

      {/* Lower Section - Scrollable Thumbnail Gallery */}
      <div className="flex m-1  overflow-x-scroll space-x-2 py-2">
        { listing.imageUrls?.length > 0 ? (
           listing.imageUrls.map((url, index) => (
            <div
              key={index}
              className="flex-shrink-0 cursor-pointer bg-cover bg-center"
              style={{
                backgroundImage: `url(${url})`,
                width: "80px", // Thumbnail size
                height: "30px",
              }}
              onClick={() => setSelectedImage(url)} // Set clicked image as selected
            ></div>
          ))
        ) : (
          <p>No images available</p>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;
