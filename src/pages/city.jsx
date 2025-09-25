import  { useEffect, useState } from "react";
import { useUser } from "../components/Adminuser";

const City = () => {
  const [showAddCity, setShowAddCity] = useState(false);
  const [showViewCities, setShowViewCities] = useState(false);
  const [cities, setCities] = useState([]);
  const { username } = useUser("");

  const [city, setCity] = useState({
    newCity: "",
  });

  const handleAddCity = () => {
    setShowAddCity(true);
    setShowViewCities(false);
  };

  const handleViewCities = () => {
    setShowViewCities(true);
    setShowAddCity(false);
  };

  const handleCityNameChange = (event) => {
    setCity({
      ...city,
      newCity: event.target.value,
    });
  };

  const handleSubmitCity = async () => {
    if (!city.newCity) return;

    try {
      const cityData = {
        ...city,
        username: username, // Include the username from useUser hook
      };
      const response = await fetch("/api/admin/city", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cityData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorData.message}`
        );
      }
      const data = await response.json();
      console.log(data);
      setCity({ newCity: "" }); // Clear the city input field
      setShowAddCity(false);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      alert(`There was a problem adding the city: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchCities(); // Invoke fetchCities properly
  }, []); // Ensure empty dependency array to fetch data only once

  const fetchCities = async () => {
    try {
      const response = await fetch("/api/admin/cities");
      if (!response.ok) {
        throw new Error("Failed to fetch cities");
      }
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Resort Cities</h1>
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={handleAddCity}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add City
          </button>
          <button
            onClick={handleViewCities}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            View Cities
          </button>
        </div>

        {showAddCity && (
          <div className="mb-6">
            <input
              type="text"
              placeholder="Enter city name"
              value={city.newCity}
              onChange={handleCityNameChange}
              className="border p-2 rounded w-full mb-4"
            />
            <button
              onClick={handleSubmitCity}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        )}

        {showViewCities && (
          <div>
            <h2 className="text-2xl font-bold mb-4">City List</h2>
            <ul className="list-disc list-inside">
              {cities.map((city) => (
                <li key={city._id} className="mb-2">
                  {city.newcity}{" "}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default City;
