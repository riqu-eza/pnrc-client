import { useState } from "react";
import AddressForm from "./AddressForm";
import HoursForm from "./HoursForm";
import CategoryForm from "./CategoryForm";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";

const PropertyForm = () => {
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false); // State to track form submission
  const [files, setFiles] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [propertyData, setPropertyData] = useState({
    name: "",
    email: "",
    description: "",
    contact: "",
    amenities: "",
    imageUrls: [],
    category: [],
    hours: [],
    address: {
      street: "",
      city: "",
      mapurl: [],
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPropertyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + propertyData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setPropertyData({
            ...propertyData,
            imageUrls: propertyData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch(() => {
          setImageUploadError("Image upload failed (2 MB max per image)");
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
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
    setPropertyData({
      ...propertyData,
      imageUrls: propertyData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading state
    console.log(propertyData);

    const amenitiesArray = propertyData.amenities
      .split(",")
      .map((amenity) => amenity.trim());

    const finalData = {
      ...propertyData,
      amenities: amenitiesArray, // Now store as an array
    };

    try {
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      });

      const data = await res.json();
      if (data.success === false) {
        console.log("Error from server:", data.message);
      } else {
        console.log("Listing created successfully");
        setPropertyData({
          name: "",
          email: "",
          description: "",
          contact: "",
          amenities: "",
          imageUrls: [],
          category: [],
          hours: [],
          address: {
            street: "",
            city: "",
            mapurl: [],
          },
        }); // Reset form state
      }
    } catch (err) {
      console.error("Error occurred:", err);
    } finally {
      setLoading(false); // End loading state
    }
  };

  const handleHoursUpdate = (newHours) => {
    setPropertyData((prevData) => ({
      ...prevData,
      hours: newHours,
    }));
  };

  const goNextStep = () => setCurrentStep((prev) => prev + 1);
  const goPreviousStep = () => setCurrentStep((prev) => prev - 1);


  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4">Property Information</h2>

      {currentStep === 1 && (
        <>
          <input
            type="text"
            name="name"
            value={propertyData.name}
            placeholder="Property Name"
            onChange={handleChange}
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            value={propertyData.email}
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="description"
            value={propertyData.description}
            placeholder="Description"
            onChange={handleChange}
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="contact"
            value={propertyData.contact}
            placeholder="Contact Number"
            onChange={handleChange}
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="amenities"
            value={propertyData.amenities}
            placeholder="Amenities (separated by `,`)"
            onChange={handleChange}
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        
         <p>Add images</p>
                   <div           className="flex gap-4">
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
                       {uploading ? "Uploading" : "Upload"}
                     </button>
                     <p className="text-red-700 text-sm">{imageUploadError}</p>
                   </div>
                   {propertyData.imageUrls.length > 0 &&
                     propertyData.imageUrls.map((url, index) => (
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
                 </>
      )}

      

      {currentStep === 2 && (
        <>
          <AddressForm
            address={propertyData.address}
            setAddress={setPropertyData}
          />
          <HoursForm hours={propertyData.hours} setHours={handleHoursUpdate} />
        </>
      )}

      {currentStep === 3 && (
        <CategoryForm
          setCategories={(categories) =>
            setPropertyData((prev) => ({ ...prev, category: categories }))
          }
        />
      )}

      <div className="flex justify-between mt-4">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={goPreviousStep}
            className="p-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Previous
          </button>
        )}
        {currentStep < 4 ? (
          <button
            type="button"
            onClick={goNextStep}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className={`p-2 text-white rounded ${
              loading ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        )}
      </div>
    </form>
  );
};

export default PropertyForm;
