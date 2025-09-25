/* eslint-disable no-unused-vars */
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
  } from "firebase/storage";
  import { useEffect, useState } from "react";
  import { app } from "../firebase";
  
  import "react-phone-input-2/lib/style.css";
  import { useUser } from "../components/Adminuser";
  import { useSelector } from "react-redux";
  import DynamicForm from "./exa";
  import { categorySteps } from "../components/CategorySteps";
  import PropertyForm from "./exa";
  
  export default function CreateListing() {
    const { currentUser } = useSelector((state) => state.user);
    const [files, setFiles] = useState([]);
    const [step, setStep] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [formData, setFormData] = useState({
      imageUrls: [],
      name: "",
      description: "",
      email: currentUser.email || "",
      contact: "",
      selectedCategory: "",
      selectedSubcategory: "",
      location: "",
      selectedCounty: "",
      inputValue: "",
      address: "",
      type: "rent",
      openinghour: "",
      bedrooms: 1,
      bathrooms: 1,
      regularPrice: 50,
      discountedPrice: 0,
      offer: false,
      parking: false,
      furnished: false,
      recreation: false,
      eventfacilities: false,
      security: false,
      transportation: false,
      rooms: 1,
      username: currentUser.username,
      items: [],
    });
  
    const handleNextStep = () => {
      setStep((prevStep) => prevStep + 1);
    };
  
    const handlePreviousStep = () => {
      setStep((prevStep) => prevStep - 1);
    };
    //console.log(formData);
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const { username } = useUser("");
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
  
    const handleRemoveImage = (index) => {
      setFormData({
        ...formData,
        imageUrls: formData.imageUrls.filter((_, i) => i !== index),
      });
    };
  
    const handleLocationChange = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const newLocation = {
            ...formData,
            location: `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`,
          };
          setFormData(newLocation);
        });
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    };
  
    const handleChange = (e) => {
      const { id, type, checked, value } = e.target;
  
      if (type === "checkbox") {
        setFormData({ ...formData, [id]: checked });
      } else if (type === "number" || type === "text" || type === "textarea") {
        setFormData({ ...formData, [id]: value });
      }
    };
    const handleChanges = (e, index = null) => {
      const { id, value } = e.target;
      if (index !== null) {
        // Update fields in the items array
        const newItems = [...formData.items];
        newItems[index][id] = value;
        setFormData({ ...formData, items: newItems });
      } else {
        // Update other form fields
        setFormData({ ...formData, [id]: value });
      }
    };
  
    // const handleChange = (e) => {
    //   if (e.target.id === "sale" || e.target.id === "rent") {
    //     setFormData({ ...formData, type: e.target.id });
    //   }
    //   if (
    //     e.target.id === "parking" ||
    //     e.target.id === "furnished" ||
    //     e.target.id === "offer" ||
    //     e.target.id ===  "recreation"
    //   ) {
    //     setFormData({ ...formData, [e.target.id]: e.target.checked });
    //   }
    //   if (
    //     e.target.type === "number" ||
    //     e.target.type === "text" ||
    //     e.target.type === "textarea"
    //   ) {
    //     setFormData({ ...formData, [e.target.id]: e.target.value });
    //   }
    // };
  
    useEffect(() => {
      fetchCounties();
    }, []);
  
    const [countiesInKenya, setCounties] = useState([]);
    const fetchCounties = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/admin/cities");
        if (!response.ok) {
          throw new Error("Failed to fetch cities");
        }
        const data = await response.json();
        setCounties(data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
  
    const handleCountyChange = (e) => {
      const value = e.target.value;
      setFormData((prevState) => ({
        ...prevState,
        selectedCounty: value,
      }));
    };
    const categoriesData = {
      Relaxation: [
        "Spa & Wellness Centers",
        "Yoga Studios",
        "Meditation Centers",
        "Parks & Gardens",
        "Beaches",
        "Lakes & Rivers",
        "Picnic Areas",
        "Hot Springs",
      ],
  
      Accommodation: [
        "Hotels",
        "Resorts",
        "Motels",
        "Bed & Breakfast",
        "Inns",
        "Guest Houses",
        "Hotels",
        "Vacation Rentals",
        "Camping Sites",
      ],
      Dining: [
        "Traditional foods",
        "Restaurants",
        "Cafes & Coffee Shops",
        "Bakeries",
        "Bars & Pubs",
        "Food Trucks",
        "Fine Dining Restaurants",
        "Ethnic Cuisine Restaurants",
        "Fast Food Chains",
        "Sea food",
      ],
      Entertainment: [
        "Movie Theaters",
        "Concert Halls",
        "Live Music Venues",
        "Night Clubs",
        "Bowling Alleys",
        "Arcahdes",
        "Amusement Parks",
        "Casinos",
        "Golf Courses",
      ],
      Culture_and_Historicalsites: [
        "Museums",
        "Art Galleries",
        "Historic Landmarks",
        "Monuments",
        "Archaelogical Sites",
        "Cultural Sites",
        "Heritage Sites",
        "Religious plsces of interest",
      ],
      Shopping: [
        "Shopping Malls",
        "Boutiques",
        "Markets",
        "Antique Stores",
        "Souvenir Shops",
        "Department stores",
        "Outlet Stores",
        "Speciality Stores",
      ],
      Education_and_Learning: [
        "Libraries",
        "Bookstores",
        "Education Centers",
        "Art Schools",
        "Cooking Schools",
        "Language Schools",
        "Workshops & Classes",
        "Reserch Institution",
      ],
      Health_and_Fitness: [
        "Sport Clubs",
        "Swimming Pools",
        "Martial arts Studios",
        "Gym",
        "Dance Studio",
        "Rock Climbing Gyms",
        "Cycling Tracks",
        "Running Tracks",
        "Hospital",
      ],
      Services: [
        "Spar & massage centers",
        "Hair Salons",
        "Nail Salons",
        "Dry Cleaners",
        "Pet Groomers",
        "Car Washes",
        "Post Offices",
        "Banks and ATMS",
        "Medical Centers",
        "legal Services",
      ],
    };
  
    const handleCategoryChange = (category) => {
      setFormData((prevState) => ({
        ...prevState,
        selectedCategory: category,
      }));
      setSelectedCategory(category);
    };
  
    const handleSubcategoryChange = (subcategory) => {
      setFormData((prevState) => ({
        ...prevState,
        selectedSubcategory: subcategory,
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (formData.imageUrls.length < 1)
          return setError("You must upload at least one image");
        if (+formData.regularPrice < +formData.discountedPrice)
          return setError("Discount price must be greater than regular price");
        setLoading(true);
        setError(false);
        const res = await fetch("http://localhost:3000/api/listing/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            username: username,
          }),
        });
        const data = await res.json();
        setLoading(false);
        if (data.success === false) {
          setError(data.message);
        }
        setFormData({
          imageUrls: [],
          name: "",
          description: "",
          email: "",
          contact: "",
          selectedCategory: "",
          selectedSubcategory: "",
          location: "",
          selectedCounty: "",
          inputValue: "",
          address: "",
          type: "rent",
          openinghour: "",
          bedrooms: 1,
          bathrooms: 1,
          regularPrice: 50,
          discountedPrice: 0,
          offer: false,
          parking: false,
          furnished: false,
          recreation: false,
          eventfacilities: false,
          security: false,
          transportation: false,
          rooms: 1,
        });
        // navigate(`/listing/${data._id}`);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    const renderDynamicFields = () => {
      if (!selectedCategory || !categorySteps[selectedCategory]) return null;
  
      const currentStepConfig = categorySteps[selectedCategory][step - 7];
      if (!currentStepConfig) return null;
  
      return (formData.items || []).map((item, index) => (
        <div key={index} className="mb-4">
          <h4 className="text-xl mb-4">Item {index + 1}</h4>
          {(currentStepConfig.fields || []).map((field) => (
            <div key={field.id} className="mb-4">
              <label htmlFor={`${field.id}-${index}`} className="block mb-2">
                {field.label}
              </label>
              <input
                type={field.type}
                id={`${field.id}-${index}`}
                value={item[field.id]}
                onChange={(e) => handleChanges(e, index)}
                placeholder={field.placeholder}
                required={field.required}
                className=" border border-black  p-2 rounded-lg w-full"
              />
            </div>
          ))}
          <button
            className="p-2 bg-red-500 text-white rounded-lg mt-4"
            onClick={() => handleRemoveItem(index)}
          >
            Remove Item
          </button>
        </div>
      ));
    };
    const addNewRoom = () => {
      setRoomDetails([...roomDetails, {}]); // Add a new room object to roomDetails array
    };
    const handleAddItem = () => {
      const newItem = categorySteps[selectedCategory][step - 7].fields.reduce(
        (acc, field) => {
          acc[field.id] = "";
          return acc;
        },
        {}
      );
      setFormData({
        ...formData,
        items: [...formData.items, newItem],
      });
    };
  
    const handleRemoveItem = (index) => {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: newItems });
    };
  
    return (
      <main className="p-3 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold g text-center my-7">
          Create a Listing
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col gap-4 flex-1">
            {step === 1 && (
              <div className="text-center m-12 text-blue-400 ">
                <h3 className="text-3xl m-8 ">
                  Hello what the name of your property
                </h3>
                <div className="flex flex-col gap-4 flex-1">
                  <input
                    type="text"
                    placeholder="Name"
                    className="border p-3 rounded-lg"
                    id="name"
                    maxLength="62"
                    minLength="5"
                    required
                    onChange={handleChange}
                    value={formData.name}
                  />
                  <button
                    className="p-3 bg-blue-500 w-20 text-white rounded-lg"
                    onClick={handleNextStep}
                    disabled={!formData.name} // Disable continue if name is empty
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="text-center">
                <h3 className="text-blue-400 text-2xl m-6">
                  would you like to continue with this email. <br /> If not you
                  can edit this one
                </h3>
                <input
                  type="text"
                  placeholder="email"
                  className="border p-3 rounded-lg"
                  id="email"
                  required
                  onChange={handleChange}
                  value={formData.email}
                />
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
                    disabled={!formData.email} // Disable continue if email is empty
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="text-center  p-12">
                <h3 className="text-blue-400 text-2xl p-6">
                  Add the phone contact.
                  <span>It may be used in communication</span>
                </h3>
                <input
                  type="number"
                  placeholder="Contact"
                  className="border p-3 rounded-lg"
                  id="contact"
                  maxLength="62"
                  minLength="10"
                  required
                  onChange={handleChange}
                  value={formData.contact}
                />
                <div className="flex gap-4 justify-evenly p-4  m-2 ">
                  <button
                    className="p-3 bg-gray-500 text-white rounded-lg"
                    onClick={handlePreviousStep}
                  >
                    Back
                  </button>
                  <button
                    className="p-3 bg-blue-500 text-white rounded-lg"
                    onClick={handleNextStep}
                    disabled={!formData.contact} // Disable continue if email is empty
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
            {step === 4 && (
              <div className=" text-center">
                <h4 className="text-3xl p-4 m-4 text-blue-400">
                  How would like to express your property. In about 100-150 words
                </h4>
                <textarea
                  type="text"
                  placeholder="Description"
                  className="border p-8 m-4 w-52 h-26 rounded-lg"
                  id="description"
                  required
                  onChange={handleChange}
                  value={formData.description}
                />
                <div className="flex gap-4 justify-evenly p-4 m-2 ">
                  <button
                    className="p-3 bg-gray-500 text-white rounded-lg"
                    onClick={handlePreviousStep}
                  >
                    Back
                  </button>
                  <button
                    className="p-3 bg-blue-500 text-white rounded-lg"
                    onClick={handleNextStep}
                    disabled={!formData.description} // Disable continue if email is empty
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
            {step === 5 && (
              <div className="text-center  p-4 m-4 flex flex-col ">
                <h4 className="text-blue-400 text-4xl pb-12">
                  where is your property located.
                </h4>
                <div className="county-selector p-8 m-4">
                  <select
                    value={formData.selectedCounty}
                    onChange={handleCountyChange}
                  >
                    <option value="">Select resort-city</option>
                    {countiesInKenya.map((county, index) => (
                      <option key={index} value={county.newcity}>
                        {county.newcity}
                      </option>
                    ))}
                  </select>
                  {/* <p>Selected County: {selectedCounty}</p> */}
                </div>
                <p className="text-black">start entering your location</p>
  
                <input
                  type="text"
                  placeholder="Address"
                  className="border m-4  p-3 rounded-lg"
                  id="address"
                  required
                  onChange={handleChange}
                  value={formData.address}
                />
                <button type="button" onClick={handleLocationChange}>
                  Pin location
                </button>
                <div className="flex gap-4 p-4  justify-evenly">
                  <button
                    className="p-3 bg-gray-500 text-white rounded-lg"
                    onClick={handlePreviousStep}
                  >
                    Back
                  </button>
                  <button
                    className="p-3 bg-blue-500 text-white rounded-lg"
                    onClick={handleNextStep}
                    disabled={!formData.address} // Disable continue if email is empty
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
            <div>
              <PropertyForm/>
            </div>
            {step === 6 && (
              <div className="m-8 p-4 text-center">
                <h3 className="p-4 text-2xl text-blue-400">
                  on this section first choose the category est as you could the
                  preceed with the instrcuction that follows:
                </h3>
                <select
                  value={formData.selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {Object.keys(categoriesData).map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
  
                {formData.selectedCategory && (
                  <div>
                    <select
                      value={formData.selectedSubcategory}
                      onChange={(e) => handleSubcategoryChange(e.target.value)}
                    >
                      <option value="">Select Subcategory</option>
                      {categoriesData[formData.selectedCategory]?.map(
                        (subcategory, index) => (
                          <option key={index} value={subcategory}>
                            {subcategory}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                )}
                <div className="flex gap-4 justify-evenly">
                  <button
                    className="p-3 bg-gray-500 text-white rounded-lg"
                    onClick={handlePreviousStep}
                  >
                    Back
                  </button>
                  <button
                    className="p-3 bg-blue-500 text-white rounded-lg"
                    onClick={handleNextStep}
                    disabled={!formData.selectedCategory} // Disable continue if email is empty
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
            {/*  */}
            {step === 7 && selectedCategory && (
              <>
                <h3 className="text-3xl m-8">
                  Step 6: Enter Details for {selectedCategory}
                </h3>
                {renderDynamicFields()}
  
                <div className="flex gap-4 justify-evenly">
                  <button
                    className="p-3 bg-gray-500 text-white rounded-lg"
                    onClick={handlePreviousStep}
                  >
                    Back
                  </button>
                  <button
                    className="p-3 bg-blue-500 text-white rounded-lg"
                    onClick={handleNextStep}
                    disabled={!formData.selectedCategory} // Disable continue if email is empty
                  >
                    Continue
                  </button>
                </div>
              </>
            )}
  {step === 8 && selectedCategory && (
    <>
      <h3 className="text-3xl m-8">Step 7: Add Room Details</h3>
      {renderDynamicFields()}  {/* Render the room details fields */}
      
      {/* Add Another Room Button */}
      {roomDetails.length > 0 && (
        <div className="flex flex-col items-center">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
            onClick={() => {
              // Add a new room by appending to the roomDetails array
              addNewRoom();
            }}
          >
            Add Another Room
          </button>
        </div>
      )}
  
      <div className="flex gap-4 justify-evenly mt-6">
        <button
          className="bg-gray-500 text-white py-2 px-4 rounded-lg"
          onClick={() => setStep(6)} // Go back to previous step
        >
          Back
        </button>
        <button
          className="bg-green-500 text-white py-2 px-4 rounded-lg"
          onClick={() => {
            if (validateRoomDetails()) {
              setStep(8); // Move to the next step
            }
          }}
        >
          Continue
        </button>
      </div>
    </>
  )}
  
            {step === categorySteps[selectedCategory]?.length + 8 && (
              <div className="text-center m-12">
                <h3 className="text-3xl m-8">Review & Submit</h3>
                <pre>{JSON.stringify(formData, null, 2)}</pre>
                <div>
                  <button
                    className="p-3 bg-gray-500 text-white rounded-lg"
                    onClick={handlePreviousStep}
                  >
                    Back
                  </button>
                  <button
                    disabled={loading || uploading}
                    className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
                  >
                    {loading ? "Creating..." : "Create listing"}
                  </button>
                </div>
              </div>
            )}
            <div>
              {/* {step === 7 && (
              <div>
                <p className="font-semibold">
                  Images:
                  <span className="font-normal text-gray-600 ml-2">
                    The first image will be the cover (max 6)
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
                    onClick={handleImageSubmit}
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
                <div className="flex gap-4">
                  <button
                    className="p-3 bg-gray-500 text-white rounded-lg"
                    onClick={handlePreviousStep}
                  >
                    Back
                  </button>
                  <button
                    className="p-3 bg-blue-500 text-white rounded-lg"
                    onClick={handleNextStep}
                    disabled={!formData.email} // Disable continue if email is empty
                  >
                    Continue
                  </button>
                </div>
              </div>
            )} */}
  
              {/* {step === 8 && (
              <div className="flex gap-6 flex-wrap">
                <h3>Amenities Available:</h3>
  
                
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="parking"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.parking === true}
                  />
                  <span>Parking Area</span>
                </div>
  
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="recreation"
                    className="w-5"
                    onChange={handleChange}
                    value={formData.recreation === true}
                  />
                  <span>Recreational Facilities</span>
                </div>
  
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="eventfacilities"
                    className="w-5"
                    onChange={handleChange}
                    value={formData.eventfacilities === true}
                  />
                  <span>Event Facilities</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="transportationServices"
                    className="w-5"
                    onChange={handleChange}
                    value={formData.transportation === true}
                  />
                  <span>Transportation Services</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="security"
                    className="w-5"
                    onChange={handleChange}
                    value={formData.security === true}
                  />
                  <span>Security Survailance</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="furnished"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.furnished === true}
                  />
                  <span>Accomodation</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="offer"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.offer === true}
                  />
                  <span>Offer</span>
                </div>
                <div className="flex gap-4">
                  <button
                    className="p-3 bg-gray-500 text-white rounded-lg"
                    onClick={handlePreviousStep}
                  >
                    Back
                  </button>
                  <button
                    className="p-3 bg-blue-500 text-white rounded-lg"
                    onClick={handleNextStep}
                    disabled={!formData.email} // Disable continue if email is empty
                  >
                    Continue
                  </button>
                </div>
              </div>
            )} */}
              {/* {step === 9 && (
              <div className="flex flex-wrap gap-6">
                {formData.furnished && (
                  <div className="flex">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        id="rooms"
                        min="1"
                        max="5"
                        required
                        className="p-3 border border-gray-300 rounded-lg w-16"
                        onChange={handleChange}
                        value={formData.rooms}
                      />
                      <p>rooms</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        id="bedrooms"
                        min="1"
                        max="10"
                        required
                        className="p-3 border border-gray-300 rounded-lg w-16"
                        onChange={handleChange}
                        value={formData.bedrooms}
                      />
                      <p>Beds</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        id="bathrooms"
                        min="1"
                        max="5"
                        required
                        className="p-3 border border-gray-300 rounded-lg w-16"
                        onChange={handleChange}
                        value={formData.bathrooms}
                      />
                      <p>Baths</p>
                    </div>
                  </div>
                )}
  
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="regularPrice"
                    min="50"
                    max="1000000"
                    required
                    className="p-3 border border-gray-300 rounded-lg w-16"
                    onChange={handleChange}
                    value={formData.regularPrice}
                  />
                  <div className="flex flex-col items-center">
                    <p>Regular Price</p>
                    <span className="text-xs">(Ksh/night)</span>
                  </div>
                </div>
                {formData.offer && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      id="discountedPrice"
                      min="0"
                      max="10000000"
                      required
                      className="p-3 border border-gray-300 rounded-lg w-16"
                      onChange={handleChange}
                      value={formData.discountedPrice}
                    />
                    <div className="flex flex-col items-center">
                      <p>Discounted Price</p>
                      <span className="text-xs">(Ksh / night)</span>
                    </div>
                  </div>
                )}
                <div className="flex gap-4">
                  <button
                    className="p-3 bg-gray-500 text-white rounded-lg"
                    onClick={handlePreviousStep}
                  >
                    Back
                  </button>
                  <button
                    className="p-3 bg-blue-500 text-white rounded-lg"
                    onClick={handleNextStep}
                    disabled={!formData.email} // Disable continue if email is empty
                  >
                    Continue
                  </button>
                </div>
              </div>
            )} */}
  
              {/* {step === 10 && (
              <div>
                <button
                  className="p-3 bg-gray-500 text-white rounded-lg"
                  onClick={handlePreviousStep}
                >
                  Back
                </button>
                <button
                  disabled={loading || uploading}
                  className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
                >
                  {loading ? "Creating..." : "Create listing"}
                </button>
              </div>
            )} */}
            </div>
            {error && <p className="text-red-700 text-sm">{error}</p>}
          </div>
        </form>
      </main>
    );
  }
  