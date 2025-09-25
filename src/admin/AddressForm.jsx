/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

const AddressForm = ({ address, setAddress }) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to handle input changes (street, city)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value, // Update street, city, etc.
      },
    }));
  };

  // Function to handle lat/lng and address changes
  // const handleLocationChange = (e) => {
  //   const { name, value } = e.target;
  //   setAddress((prev) => ({
  //     ...prev,
  //     address: {
  //       ...prev.address,
  //       location: {
  //         ...prev.address.location,
  //         [name]: value, // Update latitude, longitude, and location address
  //       },
  //     },
  //   }));
  // };

  // Fetch cities on component mount
  useEffect(() => {
    fetchCities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCities = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/cities");
      if (!response.ok) {
        throw new Error("Failed to fetch cities");
      }
      const data = await response.json();
      setCities(data); // Ensure data is an array of cities
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize Google Map

  // Reverse Geocode to get address from lat/lng

  return (
    <div className="mb-6 p-4 bg-gray-100 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Address</h3>

      <input
        type="text"
        name="street"
        placeholder="Street"
        value={address.street || ""}
        onChange={handleChange}
        required
        className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select
        name="city"
        value={address.city || ""}
        onChange={handleChange}
        required
        className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled>
          {loading ? "Loading cities..." : "Select a city"}
        </option>
        {cities.length > 0 ? (
          cities.map((city) => (
            <option key={city._id} value={city.newcity}>
              {city.newcity}
            </option>
          ))
        ) : (
          <option value="" disabled>
            No cities available
          </option>
        )}
      </select>

      

      <div className="relative">
        <label htmlFor="mapurl" className="block font-medium mb-2">
          Map URL
          <span
            title="Open Google Maps > Share > Embed a map > Copy the embed URL"
            className="ml-2 text-blue-500 cursor-pointer"
          >
            [?]
          </span>
        </label>
        <input
          id="mapurl"
          placeholder="Paste embed URL"
          type="text"
          name="mapurl"
          value={address.mapurl}
          onChange={handleChange}
          required
          className="border rounded p-2 w-full"
        />
      </div>

      {/* Google Map */}
    </div>
  );
};

export default AddressForm;
