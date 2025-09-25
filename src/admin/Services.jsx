/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
const Services = ({ setServicesItems, Subcategory }) => {
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);

  const subcategoryFields = {
  "Spa & Massage Centers": [
    {
      name: "servicesOffered",
      type: "text",
      placeholder: "Services Offered (e.g., Spa, Massage, Facial)"
    },
    { name: "priceRange", type: "text", placeholder: "Price Range" },
    {
      name: "appointmentRequired",
      type: "boolean",
      placeholder: "Appointment Required?"
    }
  ],
  "Hair Salons": [
    {
      name: "servicesOffered",
      type: "text",
      placeholder: "Services Offered (e.g., Haircut, Coloring)"
    },
    { name: "pricing", type: "text", placeholder: "Pricing Details" },
    {
      name: "stylistsCount",
      type: "number",
      placeholder: "Number of Stylists"
    }
  ],
  "Nail Salons": [
    {
      name: "servicesOffered",
      type: "text",
      placeholder: "Services Offered (e.g., Manicure, Pedicure)"
    },
    { name: "pricing", type: "text", placeholder: "Pricing Details" },
    
  ],
  "Dry Cleaners": [
    {
      name: "servicesOffered",
      type: "text",
      placeholder: "Services Offered (e.g., Dry Cleaning, Alterations)"
    },
    { name: "turnaroundTime", type: "text", placeholder: "Turnaround Time in Hours" },
    { name: "pricing", type: "text", placeholder: "Pricing Details" }
  ],
  "Pet Groomers": [
    {
      name: "servicesOffered",
      type: "text",
      placeholder: "Services Offered (e.g., Bathing, Haircut)"
    },
    { name: "pricing", type: "text", placeholder: "Pricing Details" },
    {
      name: "appointmentRequired",
      type: "boolean",
      placeholder: "Appointment Required?"
    }
  ],
  "GYM": [
    {
      name: "membershipFees",
      type: "number",
      placeholder: "Membership Fees"
    },
    {
      name: "facilities",
      type: "text",
      placeholder: "Facilities Available (e.g., weights, cardio machines)"
    },
    {
      name: "personalTraining",
      type: "boolean",
      placeholder: "Personal Training Available?"
    },
    { name: "contact", type: "text", placeholder: "Contact Information" }
  ],
  "Car Washes": [
    {
      name: "servicesOffered",
      type: "text",
      placeholder: "Services Offered (e.g., manual, automatic)"
    },
    { name: "pricing", type: "text", placeholder: "Pricing Details" }
  ],
  "Banks and ATMs": [
    {
      name: "servicesOffered",
      type: "text",
      placeholder: "Services Offered (e.g., cash withdrawal, account services)"
    }
  ],
  "Legal Services": [
    {
      name: "specialization",
      type: "text",
      placeholder: "Specialization (e.g., family law, corporate law)"
    },
    {
      name: "consultationFees",
      type: "number",
      placeholder: "Consultation Fees"
    }
  ],
  "Swimming Pools": [
    {
      name: "pool_type",
      type: "select",
      options: ["Olympic", "Recreational", "Therapeutic", "Kids"],
      placeholder: "Pool type"
    },
    {
      name: "peak_hours",
      type: "text",
      placeholder: "Peak hours (e.g., 4-7 PM)"
    },
    {
      name: "popular_programs",
      type: "checkbox",
      options: ["Swim Lessons", "Aqua Aerobics", "Lap Swimming", "Water Polo"],
      placeholder: "Top programs"
    },
    {
      name: "unique_features",
      type: "checkbox",
      options: ["Heated Pool", "Diving Board", "Waterslide", "Sauna"],
      placeholder: "Amenities"
    },
    {
      name: "social_media",
      type: "url",
      placeholder: "Instagram/Facebook page"
    }
  ],
  "Martial Arts Studios": [
    { name: "day", type: "text", placeholder: "Day (e.g., Monday)" },
    { name: "time", type: "text", placeholder: "Time (e.g., 9:30-10:00)" },
    {
      name: "belt_level",
      type: "select",
      options: ["Beginner", "Intermediate", "Advanced", "Black Belt"],
      placeholder: "Skill level"
    },
    {
      name: "equipment_needed",
      type: "checkbox",
      options: ["Gloves", "Uniform", "Protective Gear", "Weapons"],
      placeholder: "Required equipment"
    }
  ],
  "Dance Studio": [
    { name: "name", type: "text", placeholder: "Class name" },
    { name: "price", type: "number", placeholder: "Price per session" },
    { name: "day", type: "text", placeholder: "Day (e.g., Monday)" },
    { name: "time", type: "text", placeholder: "Time (e.g., 9:30-10:00)" },
    {
      name: "dance_style",
      type: "select",
      options: ["Ballet", "Hip-Hop", "Salsa", "Contemporary", "Ballroom"],
      placeholder: "Dance style"
    },
    {
      name: "experience_level",
      type: "select",
      options: ["Beginner", "Intermediate", "Advanced"],
      placeholder: "Experience level"
    },
    { name: "attire", type: "text", placeholder: "Recommended attire" }
  ],
  "Hospital": [
    { name: "name", type: "text", placeholder: "Department/Service name" },
    { name: "day", type: "text", placeholder: "Day (e.g., Monday)" },
    { name: "time", type: "text", placeholder: "Time (e.g., 9:30-10:00)" },
    {
      name: "specialization",
      type: "select",
      options: ["Cardiology", "Pediatrics", "Orthopedics", "Neurology"],
      placeholder: "Specialization"
    },
    { name: "doctor", type: "text", placeholder: "Doctor name" },
    {
      name: "appointment_type",
      type: "select",
      options: ["Consultation", "Follow-up", "Emergency", "Procedure"],
      placeholder: "Appointment type"
    },
    {
      name: "insurance_accepted",
      type: "checkbox",
      options: ["Medicare", "Private", "Self-pay"],
      placeholder: "Insurance options"
    }
  ],
  "Additional Fields for All": [
    { name: "contact_email", type: "email", placeholder: "Contact email" },
    { name: "contact_phone", type: "tel", placeholder: "Contact phone" },
    { name: "location", type: "text", placeholder: "Location/Address" },
    { name: "notes", type: "textarea", placeholder: "Additional notes" }
  ]
};

  const initialFormState = {
  ...(subcategoryFields[Subcategory]?.reduce((acc, field) => {
    if (field.type === "checkbox") {
      acc[field.name] = [];
    } else if (field.type === "boolean") {
      acc[field.name] = false;
    } else {
      acc[field.name] = "";
    }
    return acc;
  }, {}) || {}),
  imageUrls: [],
};

  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageSubmit = () => {
    if (files.length > 0 && formData.imageUrls.length + files.length <= 6) {
      setUploading(true);
      setImageUploadError(false);

      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          // Update the formData.imageUrls with the new URLs
          setFormData((prevData) => ({
            ...prevData,
            imageUrls: [...prevData.imageUrls, ...urls],
          }));
          setImageUploadError(false);
          setUploading(false);
          setFiles([]); // Clear the selected files after upload
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2MB max per image)");
          console.log(err);
          setUploading(false);
        });
    } else if (files.length === 0) {
      setImageUploadError("Please select images to upload");
      setUploading(false);
    } else {
      setImageUploadError("You can upload a maximum of 6 images per listing");
      setUploading(false);
    }
  };

  // Simulate image storage and returning URLs (mocked function)
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
  // Remove image handler
  const handleRemoveImage = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      imageUrls: prevData.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleAddMenuItem = () => {
    const newEntry = {
      subcategory: Subcategory,
      ...formData,
    };

    console.log("New Entry:", newEntry);

    setServicesItems((prev) => [...prev, newEntry]);
    setFormData(initialFormState);
  };
  return (
  <form className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
    <h4 className="text-lg font-medium mb-2">
      Add Details for {Subcategory}
    </h4>

    {subcategoryFields[Subcategory]?.map((field) => {
      if (field.type === "boolean") {
        return (
          <div key={field.name} className="flex items-center mb-2">
            <label className="mr-2 text-gray-700">{field.placeholder}:</label>
            <input
              type="checkbox"
              name={field.name}
              checked={formData[field.name] || false}
              onChange={(e) => {
                setFormData((prevData) => ({
                  ...prevData,
                  [field.name]: e.target.checked,
                }));
              }}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        );
      } else if (field.type === "select") {
        return (
          <div key={field.name} className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.placeholder}
            </label>
            <select
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select {field.placeholder}</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );
      } else if (field.type === "checkbox") {
        return (
          <div key={field.name} className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.placeholder}
            </label>
            <div className="flex flex-wrap gap-2">
              {field.options?.map((option) => (
                <div key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`${field.name}-${option}`}
                    name={field.name}
                    value={option}
                    checked={formData[field.name]?.includes(option) || false}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prevData) => {
                        const currentValues = prevData[field.name] || [];
                        return {
                          ...prevData,
                          [field.name]: e.target.checked
                            ? [...currentValues, value]
                            : currentValues.filter((v) => v !== value),
                        };
                      });
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`${field.name}-${option}`}
                    className="ml-2 text-sm text-gray-700"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );
      } else if (field.type === "textarea") {
        return (
          <div key={field.name} className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.placeholder}
            </label>
            <textarea
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
        );
      } else {
        return (
          <div key={field.name} className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.placeholder}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );
      }
    })}

    {/* Rest of your form (image upload, submit button, etc.) */}
    <p className="font-semibold">Image:</p>
    <div className="flex gap-4">
      <input
        onChange={(e) => setFiles(Array.from(e.target.files))}
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
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
    <p className="text-red-700 text-sm">
      {imageUploadError && imageUploadError}
    </p>

    {/* Display uploaded images */}
    {formData.imageUrls && formData.imageUrls.length > 0 && (
      <div className="mt-4 grid grid-cols-3 gap-2">
        {formData.imageUrls.map((url, index) => (
          <div key={url} className="flex flex-col items-center">
            <img
              src={url}
              alt="Uploaded"
              className="w-20 h-20 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="mt-2 text-red-600 text-xs"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    )}

    <button
      type="button"
      onClick={handleAddMenuItem}
      className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-4"
    >
      Add Item
    </button>
  </form>
);
};

export default Services;
