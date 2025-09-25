/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ListingItem from "../../components/ListingItem";

const EntertainmentSearch = ({ listings }) => {
  const { county, categoryname } = useParams();

  // Filter state values
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filteredListings, setFilteredListings] = useState(listings);

  // Use useEffect to filter the full listing objects—emulating the AccommodationSearch logic.
  useEffect(() => {
    let newFilteredListings = listings;

    // Filter by subcategory:
    // Only include listings that have at least one subcategory (with EntertainmentItems) matching the selected subcategory.
    if (selectedSubcategory) {
      newFilteredListings = newFilteredListings.filter((listing) =>
        listing.category.some((cat) =>
          cat.subcategories.some(
            (sub) =>
              sub.subcategory === selectedSubcategory &&
              sub.EntertainmentItems &&
              sub.EntertainmentItems.length > 0
          )
        )
      );
    }

    // Filter by minimum price:
    // Include listings where at least one EntertainmentItem in any subcategory has a price >= minPrice.
    if (minPrice) {
      newFilteredListings = newFilteredListings.filter((listing) =>
        listing.category.some((cat) =>
          cat.subcategories.some(
            (sub) =>
              sub.EntertainmentItems &&
              sub.EntertainmentItems.some(
                (item) => Number(item.price) >= Number(minPrice)
              )
          )
        )
      );
    }

    // Filter by maximum price:
    // Include listings where at least one EntertainmentItem in any subcategory has a price <= maxPrice.
    if (maxPrice) {
      newFilteredListings = newFilteredListings.filter((listing) =>
        listing.category.some((cat) =>
          cat.subcategories.some(
            (sub) =>
              sub.EntertainmentItems &&
              sub.EntertainmentItems.some(
                (item) => Number(item.price) <= Number(maxPrice)
              )
          )
        )
      );
    }

    setFilteredListings(newFilteredListings);
  }, [selectedSubcategory, minPrice, maxPrice, listings]);

  // Build a list of unique subcategories from listings that include EntertainmentItems.
  const uniqueSubcategories = Array.from(
    new Set(
      listings.flatMap((listing) =>
        listing.category.flatMap((cat) =>
          cat.subcategories
            .filter(
              (sub) => sub.EntertainmentItems && sub.EntertainmentItems.length > 0
            )
            .map((sub) => sub.subcategory)
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
        {/* Price Filters */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Min Price</label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Minimum Price"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Max Price</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Maximum Price"
          />
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
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

export default EntertainmentSearch;
