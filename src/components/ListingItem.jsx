/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

export default function ListingItem({ listing }) {  // Destructure listing from props
console.log("ITemlistingdin", listing)
  const handleMapClick = (location) => {
    const [latitude, longitude] = location.split(",");
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, "_blank");
  };

  return (
    <div className="bg-white shadow-md hover:shadow-lg border-2 border-blue-400 p-2 transition-shadow overflow-hidden w-[170px] sm:w-[170px] md:w-[260px] lg:w-[250px]">
      <div>
        {/* Render the listing details as passed from AccommodationSearch */}
        {listing.imageUrls && listing.imageUrls.length > 0 ? (
          <img
            src={listing.imageUrls[0]}
            alt="listing cover"
            className="h-[220px] sm:h-[250px] md:h-[280px] lg:h-[230px] w-full object-cover hover:scale-105 transition-scale duration-300"
          />
        ) : (
          <div className="h-[220px] sm:h-[250px] md:h-[280px] lg:h-[200px] w-full bg-gray-300 flex items-center justify-center">
            <p className="text-gray-500">No Image Available</p>
          </div>
        )}

        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="text-lg font-semibold text-slate-700 truncate">
            {listing.name}
          </p>
          <div className="flex items-center gap-1">
            <p className="text-sm text-gray-600 truncate w-full">
              {listing.description}
            </p>
          </div>

          {listing.address && (
            <div className="flex flex-col text-sm text-gray-600">
              <span>{listing.address.street}</span>
              <span>{listing.address.city}, {listing.address.postal_code}</span>
            </div>
          )}

          {listing.location && (
            <div className="flex items-center mt-2">
              <span className="text-gray-500 mr-2">Open in Maps</span>
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="text-blue-500 cursor-pointer"
                onClick={() => handleMapClick(listing.location)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
