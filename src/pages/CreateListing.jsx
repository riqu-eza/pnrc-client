/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import categories from "../utility/CategoryData";
import { useSelector } from "react-redux";
import { useUser } from "../components/Adminuser";
import InputField from "../utility/inputfield";
import MapComponent from "../utility/MapComponent";
import { app } from "../firebase";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
const CreateListing = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0); 

  const { currentUser } = useSelector((state) => state.user);
  const { username } = useUser("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    description: "",
    amenities: "",
    imageUrls: [],
    address: {
      street: "",
      city: "",
      location: {
        address: "",
        lat: null,
        lng: null,
      },
    },
    category: "",
    subcategory: "",
    username: currentUser.username,
    details: {
      accommodation: {
        rooms: [
          {
            type: "",
            beds: "",
            price: "",
            discount: "",
            description: "",
            amenities: [],
            imageUrls: [],
          },
        ],
        check_in_time: "",
        check_out_time: "",
        amenities: [],
      },
      dining: {
        meals: [{ meal_id: "", name: "", description: "", price: "" }],
        operating_hours: { open: "", close: "" },
      },
      entertainment: {
        activities: [{ activity_id: "", name: "", description: "", price: "" }],
      },
      education: {
        classes: [
          {
            class_id: "",
            name: "",
            subject: "",
            schedule: { day: "", time: "" },
          },
        ],
      },
      health_and_fitness: {
        services: [{ service_id: "", name: "", description: "", price: "" }],
      },
    },
  });
 
  const [countiesInKenya, setCounties] = useState([]);
  const [currentRoom, setCurrentRoom] = useState({
    type: '',
    beds: '',
    price: '',
    discount: '',
    description: '',
    amenities: [],
    imageUrls: [],
  });
  const [roomFiles, setRoomFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState('');

  // Handle input changes for the current room
  const handleRoomChange = (field, value) => {
    // Update the current room
    setCurrentRoom((prevRoom) => ({
      ...prevRoom,
      [field]: value,
    }));
  };
  

  // Add the current room to the list of rooms
  const addRoom = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      details: {
        ...prevFormData.details,
        accommodation: {
          ...prevFormData.details.accommodation,
          rooms: [...prevFormData.details.accommodation.rooms, currentRoom],
        },
      },
    }));
  
    // Reset currentRoom after adding it
    setCurrentRoom({
      type: "",
      beds: "",
      price: "",
      discount: "",
      description: "",
      amenities: [],
      imageUrls: [],
    });
  };
  
  // Handle image uploads for the current room
  const handleroomImageSubmit = () => {
    const currentRoomImages = formData.details.accommodation.rooms[currentRoomIndex]?.imageUrls || [];
    
    if (roomFiles.length > 0 && currentRoomImages.length + roomFiles.length < 7) {
      setUploading(true);
      setImageUploadError('');
  
      const promises = []; // Initialize an empty array to hold promises
  
      for (let i = 0; i < roomFiles.length; i++) {
        console.log(`File ${i} size:`, roomFiles[i].size); // Log file size
        promises.push(storeImage(roomFiles[i])); // Store image
      }
  
      Promise.all(promises)
        .then((urls) => {
          const updatedRooms = [...formData.details.accommodation.rooms];
          updatedRooms[currentRoomIndex].imageUrls = [
            ...currentRoomImages,
            ...urls,
          ];
  
          setFormData({
            ...formData,
            details: {
              ...formData.details,
              accommodation: {
                ...formData.details.accommodation,
                rooms: updatedRooms,
              },
            },
          });
  
          // Reset after successful upload
          setRoomFiles([]);
          setUploading(false);
        })
        .catch((error) => {
          console.error('Upload Error:', error.message); // Log the specific error message
          setImageUploadError('Image upload failed (2 MB max per image)');
          setUploading(false);
        });
    } else if (roomFiles.length === 0) {
      setImageUploadError('Select images to upload');
    } else {
      setImageUploadError('You can only upload 6 images per room');
    }
  };
  
  

  // Remove a room from the list
  const removeRoom = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      details: {
        ...prevData.details,
        accommodation: {
          ...prevData.details.accommodation,
          rooms: prevData.details.accommodation.rooms.filter((_, i) => i !== index),
        },
      },
    }));

    // Clear current room selection if the removed room was the current one
    if (index === currentRoomIndex) {
      setCurrentRoomIndex(0);
      setCurrentRoom({
        type: '',
        beds: '',
        price: '',
        discount: '',
        description: '',
        amenities: [],
        imageUrls: [],
      });
    }
  };

  // Remove an image from a specific room
  const handleRemoveImage = (roomIndex, imageIndex) => {
    const updatedRooms = [...formData.details.accommodation.rooms];
    updatedRooms[roomIndex].imageUrls = updatedRooms[roomIndex].imageUrls.filter((_, i) => i !== imageIndex);

    setFormData({
      ...formData,
      details: {
        ...formData.details,
        accommodation: {
          ...formData.details.accommodation,
          rooms: updatedRooms,
        },
      },
    });
  };
  useEffect(() => {
    fetchCounties();
  }, []);

  const fetchCounties = async () => {
    try {
      const response = await fetch("/api/admin/cities");
      if (!response.ok) {
        throw new Error("Failed to fetch cities");
      }
      const data = await response.json();
      setCounties(data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit button clicked"); // Log when the submit button is clicked

    try {
      console.log("Validation passed. Sending request...");

      setLoading(true);
      setError(false);
      console.log("form data", formData);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          username: username,
        }),
      });

      console.log("Response received from server:", res);

      const data = await res.json();
      console.log("Data received from server:", data);

      setLoading(false);

      if (data.success === false) {
        console.log("Error from server:", data.message);
        setError(data.message);
      } else {
        console.log("Listing created successfully");
        // Optionally, navigate or perform other actions
        // navigate(`/listing/${data._id}`);
        // Clear the form if needed
        setFormData({
          name: "",
          email: "",
          description: "",
          contact: "",
          address: {
            street: "",
            city: "",
            postal_code: "",
            location: "",
          },
          category: "",
          subcategory: "",
          username: currentUser.username,
          details: {
            accommodation: {
              type: "",
              rooms: [{ room_id: "", type: "", size: "", amenities: [] }],
              check_in_time: "",
              check_out_time: "",
            },
            dining: {
              meals: [{ meal_id: "", name: "", description: "", price: "" }],
              operating_hours: { open: "", close: "" },
            },
            entertainment: {
              activities: [
                { activity_id: "", name: "", description: "", price: "" },
              ],
            },
            education: {
              classes: [
                {
                  class_id: "",
                  name: "",
                  subject: "",
                  schedule: { day: "", time: "" },
                },
              ],
            },
            health_and_fitness: {
              services: [
                { service_id: "", name: "", description: "", price: "" },
              ],
            },
          },
        });
      }
    } catch (error) {
      console.error("Error occurred:", error); // Log errors for debugging
      setError(error.message);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested fields
    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [field]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleNestedChange = (section, field, e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      details: {
        ...prevData.details,
        [section]: {
          ...prevData.details[section],
          [field]: value,
        },
      },
    }));
  };

 
  const handleCountyChange = (e) => {
    const value = e.target.value;
    setFormData((prevState) => ({
      ...prevState, // Keep the entire formData object
      address: {
        ...prevState.address, // Keep all the existing fields in the address object
        city: value, // Update only the 'city' field
      },
    }));
  };
  const [selectedCategory, setSelectedCategory] = useState("");
  const handleCategoryChange = (category) => {
    setFormData((prevState) => ({
      ...prevState,
      category: category, // Update the category in formData
      subcategory: "", // Reset the subcategory when category changes
    }));
    setSelectedCategory(category); // Update the selectedCategory state
  };

  // Function to handle subcategory change
  const handleSubcategoryChange = (subcategory) => {
    setFormData((prevState) => ({
      ...prevState,
      subcategory: subcategory, // Update the subcategory in formData
    }));
  };

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setStep((prevStep) => prevStep - 1);
  };
  const handleLocationChange = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            ...formData,
            address: {
              ...formData.address,
              location: {
                address: `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`,
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
            },
          };
          setFormData(newLocation);
        },
        (error) => {
          // Handle errors
          console.error("Error fetching location:", error);
          alert("Unable to retrieve location. Please try again.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };
  const [files, setFiles] = useState([]);
  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        // eslint-disable-next-line no-unused-vars
        .catch((err) => {
          setImageUploadError("Image upload fail (2 mb max per image)");
          setUploading(false);
        });
    } else if (files.length === 0) {
      setImageUploadError("Select images to upload");
      setUploading(false);
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageref = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageref, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`The progress is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
 

  return (
    <form>
      <h2>collecting Property Details</h2>
      {/* common details */}
      {step === 1 && (
        <div>
          <div>
            <InputField
              label="Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <InputField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <InputField
              label="Contact"
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
            />
          </div>
          <div>
            <InputField
              label="Description"
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
            <div>
              <p className="font-semibold">
                add the Property Image:
                <span className="font-normal text-gray-600 ml-2">
                  The first image will be the cover
                </span>
              </p>
              <div className="flex gap-4">
                <input
                  onChange={(e) => setFiles(e.target.files)}
                  className="p-3 border border-gray-300 rounded w-full"
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                />
                <button
                  disabled={uploading}
                  type="button"
                  onClick={() => handleImageSubmit("listing")}
                  className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
                >
                  {uploading ? "uploading" : "upload"}
                </button>
              </div>
              <p className="text-red-700 text-sm">
                {imageUploadError && imageUploadError}
              </p>
              {formData.imageUrls.length > 0 &&
                formData.imageUrls.map((url, index) => (
                  <div
                    key={url}
                    className="flex justify-between p-3 border items-center"
                  >
                    <img
                      src={url}
                      alt="listing image"
                      className="w-20 h-20 object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                    >
                      Delete
                    </button>
                  </div>
                ))}
            </div>
          </div>
          <button
            className="p-3 bg-blue-500 w-20 text-white rounded-lg"
            onClick={handleNextStep}
            // Disable continue if name is empty
          >
            Continue
          </button>
        </div>
      )}
      {/* address */}
      {step === 2 && (
        <>
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-4">Address</h3>

            <div className="mb-4">
              <InputField
                label="Street"
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              {/* Conditional rendering based on loading and data */}
              {loading ? (
                <p>Loading counties...</p>
              ) : countiesInKenya.length > 0 ? (
                <select
                  onChange={handleCountyChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select resort-city</option>
                  {countiesInKenya.map((county, index) => (
                    <option key={index} value={county.newcity}>
                      {county.newcity}
                    </option>
                  ))}
                </select>
              ) : (
                <p>No counties available</p>
              )}
            </div>

            <button type="button" onClick={handleLocationChange}>
              Pin location
            </button>
          </div>
          <div className="flex gap-4 justify-evenly mt-8 ">
            <button
              className="p-3 bg-gray-500 text-white rounded-lg"
              onClick={handlePreviousStep}
            >
              Back
            </button>
            <button
              className="p-3 bg-blue-500 text-white rounded-lg"
              onClick={handleNextStep}
              // Disable continue if email is empty
            >
              Continue
            </button>
          </div>
        </>
      )}
      {step === 3 && (
        <>
          <div>
            <div>
              <label>Category:</label>
              <select
                value={formData.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="">Select Category</option>
                {Object.keys(categories).map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory Selector (only visible if a category is selected) */}
            {formData.category && (
              <div>
                <label>Subcategory:</label>
                <select
                  value={formData.subcategory}
                  onChange={(e) => handleSubcategoryChange(e.target.value)}
                >
                  <option value="">Select Subcategory</option>
                  {categories[formData.category].map((subcategory) => (
                    <option key={subcategory} value={subcategory}>
                      {subcategory}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="flex gap-4 justify-evenly mt-8 ">
            <button
              className="p-3 bg-gray-500 text-white rounded-lg"
              onClick={handlePreviousStep}
            >
              Back
            </button>
            <button
              className="p-3 bg-blue-500 text-white rounded-lg"
              onClick={handleNextStep}
              // Disable continue if email is empty
            >
              Continue
            </button>
          </div>
        </>
      )}
      {/* Accommodation Section */}
      {step === 4 && (
        <>
          {formData.category === "Accommodation" && (
            <div>
              <h3>Accommodation Details</h3>

              <div>
                <h3>Rooms</h3>

                {/* Display Added Room Names with Remove Option */}
                {formData.details.accommodation.rooms.length > 0 &&
                  formData.details.accommodation.rooms.map((room, index) => (
                    <div
                      key={`room-${index}`}
                      className="flex justify-between items-center mb-2"
                    >
                      <p>
                        Room {index + 1}: {room.type}
                      </p>
                      <button
                        type="button"
                        className="p-2 bg-red-500 text-white rounded-lg"
                        onClick={() => removeRoom(index)}
                      >
                        Remove Room
                      </button>
                    </div>
                  ))}

                {/* Room Input Form */}
                <div className="room-details">
                  <h4>New Room</h4>

                  <InputField
                    label="Name of the Room"
                    type="text"
                    name="type"
                    value={currentRoom.type}
                    onChange={(e) => handleRoomChange("type", e.target.value)}
                  />

                  <InputField
                    label="Describe the Room"
                    type="text"
                    name="description"
                    value={currentRoom.description}
                    onChange={(e) =>
                      handleRoomChange("description", e.target.value)
                    }
                  />

                  <InputField
                    label="Number of Beds and Size"
                    type="text"
                    name="beds"
                    value={currentRoom.beds}
                    onChange={(e) => handleRoomChange("beds", e.target.value)}
                  />

                  <InputField
                    label="Room Price Per Night"
                    type="text"
                    name="price"
                    value={currentRoom.price}
                    onChange={(e) => handleRoomChange("price", e.target.value)}
                  />

                  <InputField
                    label="Discount (if any)"
                    type="text"
                    name="discount"
                    value={currentRoom.discount}
                    onChange={(e) =>
                      handleRoomChange("discount", e.target.value)
                    }
                  />

                  <label>Amenities (comma-separated)</label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    type="text"
                    name="amenities"
                    value={currentRoom.amenities}
                    onChange={(e) =>
                      handleRoomChange(
                        "amenities",
                        e.target.value.split(",").map((item) => item.trim())
                      )
                    }
                  />

                  <div>
                    <p className="font-semibold">Image:</p>
                    <div className="flex gap-4">
                      <input
                        onChange={(e) =>
                          setRoomFiles(Array.from(e.target.files))
                        }
                        className="p-3 border border-gray-300 rounded w-full"
                        type="file"
                        id="images"
                        accept="image/*"
                        multiple
                      />
                      <button
                        disabled={uploading}
                        type="button"
                        onClick={handleroomImageSubmit}
                        className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
                      >
                        {uploading ? "uploading" : "upload"}
                      </button>
                    </div>

                    <p className="text-red-700 text-sm">
                      {imageUploadError && imageUploadError}
                    </p>
                    {formData.details.accommodation.rooms.map(
                      (room, roomIndex) => (
                        <div key={roomIndex} className="mb-4">
                          {room.imageUrls &&
                            room.imageUrls.length > 0 &&
                            room.imageUrls.map((url, index) => (
                              <div
                                key={url}
                                className="flex justify-between p-3 border items-center"
                              >
                                <img
                                  src={url}
                                  alt={`Room image ${index + 1}`}
                                  className="w-20 h-20 object-contain rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveImage(roomIndex, index)
                                  } // Use roomIndex and image index
                                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                                >
                                  Delete
                                </button>
                              </div>
                            ))}
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Button to Add Another Room */}
                <button
                  type="button"
                  className="mt-4 p-3 bg-blue-500 text-white rounded-lg"
                  onClick={addRoom}
                  disabled={
                    !currentRoom.type || !currentRoom.beds || !currentRoom.price
                  }
                >
                  Add Another Room
                </button>
              </div>

              <InputField
                label="Check-in Time"
                type="text"
                name="accommodation.check_in_time"
                value={formData.details.accommodation.check_in_time}
                onChange={(e) =>
                  handleNestedChange("accommodation", "check_in_time", e)
                }
              />
              <InputField
                label="Check-out Time"
                type="text"
                name="accommodation.check_out_time"
                value={formData.details.accommodation.check_out_time}
                onChange={(e) =>
                  handleNestedChange("accommodation", "check_out_time", e)
                }
              />
              <label>Amenities In the Property(comma-separate)</label>
              <input
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                name="accommodation.amenities"
                value={formData.details.accommodation.amenities}
                onChange={(e) =>
                  handleNestedChange("accommodation", "amenities", e)
                }
              />
            </div>
          )}
          {/* Dining Section */}
          {formData.category === "accomodation" && (
            <div>
              <h3>Dining Details</h3>
              {/* Similar structure as Accommodation */}
            </div>
          )}
          {/* Entertainment Section */}
          {formData.category === "accomodation" && (
            <div>
              <h3>Entertainment Details</h3>
            </div>
          )}
          {/* Education Section */}
          {formData.category === "accomodation" && (
            <div>
              <h3>Education Details</h3>
              {/* Similar structure as Accommodation */}
            </div>
          )}
          {/* Health and Fitness Section */}
          {formData.category === "accomodation" && (
            <div>
              <h3>Health and Fitness Details</h3>
              {/* Similar structure as Accommodation */}
            </div>
          )}
          <div className="flex gap-4 justify-evenly mt-8 ">
            <button
              className="p-3 bg-gray-500 text-white rounded-lg"
              onClick={handlePreviousStep}
            >
              Back
            </button>
            <button
              className="p-3 bg-blue-500 text-white rounded-lg"
              onClick={handleNextStep}
            >
              Continue
            </button>
          </div>
        </>
      )}
      {step === 5 && (
        <div className="text-center m-12">
          <h3 className="text-3xl m-8"> Submit</h3>

          <div>
            <button
              className="p-3 bg-gray-500 text-white rounded-lg"
              onClick={handlePreviousStep}
            >
              Back
            </button>
            <button
              disabled={loading}
              onClick={handleSubmit}
              className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            >
              {loading ? "Submitting..." : "Create listing"}
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default CreateListing;
