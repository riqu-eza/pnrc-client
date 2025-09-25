/* eslint-disable no-unused-vars */
import  { useEffect, useState } from 'react';
import categories from "../utility/CategoryData"
import { useSelector } from 'react-redux';
import { useUser } from '../components/Adminuser';
const CreateListing = async (req, res, next) => {

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const { username } = useUser("");
  const [formData, setFormData] = useState({
    // id: '',
    name: '',
    email:'',
    description: '',
    contact:'',
    address: {
      street: '',
      city: '',
      postal_code: '',
      location: '',
    },
    category: '',
    subcategory: '',
    username: currentUser.username,
    details: {
      accommodation: {
        type: '',
        rooms: [{ room_id: '', type: '', size: '', amenities: [] }],
        check_in_time: '',
        check_out_time: ''
      },
      dining: {
        meals: [{ meal_id: '', name: '', description: '', price: '' }],
        operating_hours: { open: '', close: '' }
      },
      entertainment: {
        activities: [{ activity_id: '', name: '', description: '', price: '' }]
      },
      education: {
        classes: [{ class_id: '', name: '', subject: '', schedule: { day: '', time: '' } }]
      },
      health_and_fitness: {
        services: [{ service_id: '', name: '', description: '', price: '' }]
      }
    }
  });
  const [countiesInKenya, setCounties] = useState([]);
  useEffect(() => {
    fetchCounties();
  }, []);

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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleNestedChange = (section, field, e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      details: {
        ...prevData.details,
        [section]: {
          ...prevData.details[section],
          [field]: value
        }
      }
    }));
  };

  const handleRoomsChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRooms = formData.details.accommodation.rooms.map((room, i) =>
      i === index ? { ...room, [name]: value } : room
    );
    setFormData((prevData) => ({
      ...prevData,
      details: {
        ...prevData.details,
        accommodation: {
          ...prevData.details.accommodation,
          rooms: updatedRooms
        }
      }
    }));
  };
 
  const handleCountyChange = (e) => {
    const value = e.target.value;
    setFormData((prevState) => ({
      ...prevState,                    // Keep the entire formData object
      address: {
        ...prevState.address,          // Keep all the existing fields in the address object
        city: value                    // Update only the 'city' field
      }
    }));
  };
  
  const [selectedCategory, setSelectedCategory] = useState('');
  const handleCategoryChange = (category) => {
    setFormData((prevState) => ({
      ...prevState,
      category: category,  // Update the category in formData
      subcategory: '',      // Reset the subcategory when category changes
    }));
    setSelectedCategory(category);    // Update the selectedCategory state
  };

  // Function to handle subcategory change
  const handleSubcategoryChange = (subcategory) => {
    setFormData((prevState) => ({
      ...prevState,
      subcategory: subcategory,  // Update the subcategory in formData
    }));
  };

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setStep((prevStep) => prevStep - 1);
  };
  // Similar handlers for other nested sections like meals, activities, classes, and services...

  return (
    <form>
      <h2>Property Details</h2>
      {/* common details */}
      <div>
        <label>ID:</label>
        <input type="text" name="id" value={formData.id} onChange={handleChange} />
      </div>
      <div>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} />
      </div>
      <div>
        <label>Contact:</label>
        <input type="number" name="Contact" value={formData.contact} onChange={handleChange} />
      </div>
      <div>
        <label>Description:</label>
        <input type="text" name="description" value={formData.description} onChange={handleChange} />
      </div>
      {/* address */}
      <div>
        <h3>Address</h3>
        <label>Street:</label>
        <input type="text" name="address.street" value={formData.address.street} onChange={handleChange} />
        
        <div className="county-selector ">
        <label>City:</label>
                <select
                  value={formData.address.city}
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
        
        
        <label>Postal Code:</label>
        <input type="text" name="address.postal_code" value={formData.address.postal_code} onChange={handleChange} />
        <label>Location:</label>
        <input type="text" name="address.location" value={formData.address.location} onChange={handleChange} />
      </div>
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
      {/* Accommodation Section */}

      {formData.category === 'Accommodation' &&(
      <div>
        <h3>Accommodation Details</h3>
        <label>Type:</label>
        <input type="text" name="accommodation.type" value={formData.details.accommodation.type} onChange={(e) => handleNestedChange('accommodation', 'type', e)} />
        {/* Render rooms */}
        {formData.details.accommodation.rooms.map((room, index) => (
          <div key={index}>
            <h4>Room {index + 1}</h4>
            <label>Room ID:</label>
            <input type="text" name="room_id" value={room.room_id} onChange={(e) => handleRoomsChange(index, e)} />
            <label>Type:</label>
            <input type="text" name="type" value={room.type} onChange={(e) => handleRoomsChange(index, e)} />
            <label>Size:</label>
            <input type="number" name="size" value={room.size} onChange={(e) => handleRoomsChange(index, e)} />
            <label>Amenities (comma-separated):</label>
            <input type="text" name="amenities" value={room.amenities.join(', ')} onChange={(e) => handleRoomsChange(index, e)} />
          </div>
        ))}
        <label>Check-in Time:</label>
        <input type="text" name="accommodation.check_in_time" value={formData.details.accommodation.check_in_time} onChange={(e) => handleNestedChange('accommodation', 'check_in_time', e)} />
        <label>Check-out Time:</label>
        <input type="text" name="accommodation.check_out_time" value={formData.details.accommodation.check_out_time} onChange={(e) => handleNestedChange('accommodation', 'check_out_time', e)} />
      </div>)}
      {/* Dining Section */}
      {formData.category === 'accomodation' &&(
      <div>
        <h3>Dining Details</h3>
        {/* Similar structure as Accommodation */}
      </div>
      )}
      {/* Entertainment Section */}
      {formData.category === 'accomodation' &&(

      <div>
        <h3>Entertainment Details</h3>
       
      </div>
      )}
      {/* Education Section */}
      {formData.category === 'accomodation' &&(

      <div>
        <h3>Education Details</h3>
        {/* Similar structure as Accommodation */}
      </div>
      )}
      {/* Health and Fitness Section */}
      {formData.category === 'accomodation' &&(

      <div>
        <h3>Health and Fitness Details</h3>
        {/* Similar structure as Accommodation */}
      </div>
      )}
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
    </form>
    
  );
};

export default CreateListing;
