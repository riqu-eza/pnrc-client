/* eslint-disable react/prop-types */
import  { useState, useEffect } from "react";

// Recursive Component for Nested Fields
const NestedField = ({
  data,
  path,
  handleChange,
  readOnlyFields,
  hiddenFields,
}) => {
  if (hiddenFields.includes(path.join("."))) return null; // Skip hidden fields

  if (typeof data !== "object" || data === null) {
    // Render non-object fields
    return (
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">
          {path.join(".")}
        </label>
        <input
          type="text"
          value={data}
          readOnly={readOnlyFields.includes(path.join("."))} // Set read-only
          onChange={(e) => handleChange(e, path)}
          className="border p-2 rounded w-full"
        />
      </div>
    );
  }

  // Render object or array fields recursively
  return Object.entries(data)
    .filter(([key, value]) => value !== null && value !== undefined && value !== "") // Show only available fields
    .map(([key, value]) => (
      <div key={key} className="ml-4">
        <h3 className="text-sm font-bold mb-2">
          {path.length === 0 ? key : `${path.join(".")}.${key}`}
        </h3>
        <NestedField
          data={value}
          path={[...path, key]}
          handleChange={handleChange}
          readOnlyFields={readOnlyFields}
          hiddenFields={hiddenFields}
        />
      </div>
    ));
};

const ViewListing = () => {
  const [listings, setListings] = useState([]);
  const [editingListing, setEditingListing] = useState(null);
  const [formData, setFormData] = useState({});

  const readOnlyFields = ["_id", "createdAt", "updatedAt"]; // Fields that should be read-only
  const hiddenFields = ["_id", "__v"]; // Fields that should not be displayed

  // Fetch listings
  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await fetch("/api/listing/getall");
      const data = await response.json();
      setListings(data);
    } catch (error) {
      console.error("Error fetching listings", error);
    }
  };

  const handleDeleteListing = async (id) => {
    try {
      await fetch(`/api/listing/delete/${id}`, {
        method: "DELETE",
      });
      setListings((prevListings) =>
        prevListings.filter((listing) => listing._id !== id)
      );
    } catch (error) {
      console.error("Error deleting listing", error);
    }
  };

  const startEditing = (listing) => {
    setEditingListing(listing._id);
    setFormData(listing);
  };

  const cancelEditing = () => {
    setEditingListing(null);
    setFormData({});
  };

  const handleUpdateListing = async (id) => {
    try {
      const response = await fetch(`/api/listing/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setEditingListing(null);
        fetchListings(); // Refresh listings
      } else {
        console.error("Error updating listing", response.statusText);
      }
    } catch (error) {
      console.error("Error updating listing", error);
    }
  };

  const handleChange = (e, path) => {
    const { value } = e.target;

    // Update nested data dynamically
    setFormData((prevFormData) => {
      const updatedFormData = { ...prevFormData };
      let current = updatedFormData;

      // Traverse to the target path
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
      }

      // Update the final key
      current[path[path.length - 1]] = value;
      return updatedFormData;
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Admin Dashboard - Manage Listings
      </h1>
      {listings.length === 0 ? (
        <p className="text-center text-gray-600">No listings available.</p>
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => (
            <div key={listing._id} className="border p-4 rounded shadow">
              {editingListing === listing._id ? (
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Editing {listing.name}
                  </h2>
                  <NestedField
                    data={formData}
                    path={[]}
                    handleChange={handleChange}
                    readOnlyFields={readOnlyFields}
                    hiddenFields={hiddenFields}
                  />
                  <button
                    onClick={() => handleUpdateListing(listing._id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">{listing.name}</h2>
                  <div>
                    <button
                      onClick={() => startEditing(listing)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteListing(listing._id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewListing;
