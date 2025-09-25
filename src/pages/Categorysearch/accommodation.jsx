/* eslint-disable react/prop-types */
import  { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ListingItem from "../../components/ListingItem";

const AccommodationSearch = ({ listings }) => {
  const { county, categoryname } = useParams();

  // Filter states (similar to EntertainmentSearch)
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [filteredListings, setFilteredListings] = useState(listings);

  // Filtering logic – similar in spirit to the EntertainmentSearch inline filtering.
  // Adjust as needed based on your data structure.
  useEffect(() => {
    let newFilteredListings = listings;

    // Filter by subcategory if one is selected.
    if (selectedSubcategory) {
      newFilteredListings = newFilteredListings.filter((listing) =>
        listing.category.some((cat) =>
          cat.subcategories.some(
            (subcat) => subcat.subcategory === selectedSubcategory
          )
        )
      );
    }

    // Filter by maximum price (price per night) if provided.
    if (maxPrice) {
      newFilteredListings = newFilteredListings.filter((listing) =>
        listing.category.some((cat) =>
          cat.subcategories.some((subcat) =>
            subcat.rooms.some(
              (room) => Number(room.pricePerNight) <= Number(maxPrice)
            )
          )
        )
      );
    }

    // Filter by room type if one is selected.
    if (selectedRoomType) {
      newFilteredListings = newFilteredListings.filter((listing) =>
        listing.category.some((cat) =>
          cat.subcategories.some((subcat) =>
            subcat.rooms.some((room) => room.roomType === selectedRoomType)
          )
        )
      );
    }

    setFilteredListings(newFilteredListings);
  }, [selectedSubcategory, maxPrice, selectedRoomType, listings]);

  // Get a list of unique subcategories from the data.
  const uniqueSubcategories = Array.from(
    new Set(
      listings.flatMap((listing) =>
        listing.category.flatMap((cat) =>
          cat.subcategories.map((subcat) => subcat.subcategory)
        )
      )
    )
  );

  // Get a list of unique room types.
  const uniqueRoomTypes = Array.from(
    new Set(
      listings.flatMap((listing) =>
        listing.category.flatMap((cat) =>
          cat.subcategories.flatMap((subcat) =>
            subcat.rooms.map((room) => room.roomType)
          )
        )
      )
    )
  );

  return (
    <div className="flex flex-col md:flex-row mt-5">
      {/* Filter Sidebar */}
      <aside className="md:w-[20%] p-4 border-b md:border-b-0 md:border-r">
        <h2 className="text-2xl font-bold mb-4">Filters</h2>

        {/* Subcategory Filter */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Subcategory</label>
          <select
            className="w-full border p-2 rounded"
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
          >
            <option value="">All</option>
            {uniqueSubcategories.map((sub, idx) => (
              <option key={idx} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        {/* Price Filter */}
        <div className="mb-4">
          <label className="block font-medium mb-1">
            Max Price Per Night
          </label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Enter maximum price"
          />
        </div>

        {/* Room Type Filter */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Room Type</label>
          <select
            className="w-full border p-2 rounded"
            value={selectedRoomType}
            onChange={(e) => setSelectedRoomType(e.target.value)}
          >
            <option value="">All</option>
            {uniqueRoomTypes.map((type, idx) => (
              <option key={idx} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </aside>

      {/* Listings Grid */}
      <main className="md:w-[80%] p-4">
        <div>
          <h2>
            {categoryname} in {county}
          </h2>
        </div>
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {filteredListings.map((listing) => (
              <Link
                key={listing._id}
                to={`/${county}/${categoryname}/${listing._id}`}
                state={{ listing }}
              >
                <ListingItem listing={listing} />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-xl">No listings found matching your filters.</p>
        )}
      </main>
    </div>
  );
};

export default AccommodationSearch;
