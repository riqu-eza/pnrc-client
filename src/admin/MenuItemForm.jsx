/* eslint-disable react/prop-types */
// MenuItemForm.jsx
import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
const MenuItemForm = ({ setMenuItems, meals }) => {
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    DishName: "",
    DietaryInformation: "",
    AllergenInformation: "",
    NutritionInformation: "",
    ServingTime: "",
    PreparationTime: "",
    ServingSize: "",
    description: "",
    imageUrls: [],
    Price: "",
    dishType: "",
    orderable: false, // Checkbox value
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  // Function to handle image submission
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
    const {
      DishName,
      DietaryInformation,
      AllergenInformation,
      NutritionInformation,
      ServingTime,
      ServingSize,
      PreparationTime,
      Price,
    } = formData;

    if (
      DishName &&
      DietaryInformation &&
      AllergenInformation &&
      NutritionInformation &&
      ServingTime &&
      ServingSize &&
      PreparationTime &&
      Price
    ) {
      const newMeal = { ...formData };
      console.log("newMeal", newMeal);
      setMenuItems((prev) => [...prev, newMeal]);

      // Clear form data after submission
      setFormData({
        DishName: "",
        DietaryInformation: "",
        AllergenInformation: "",
        NutritionInformation: "",
        ServingTime: "",
        PreparationTime: "",
        description: "",
        ServingSize: "",
        Price: "",
        dishType: "",
        orderable: false,
        imageUrls:[],
      });
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-lg">
      <h5 className="text-lg font-semibold mb-4">Menu Item Details</h5>

      <div className="space-y-4">
        <input
          type="text"
          name="DishName"
          value={formData.DishName}
          onChange={handleChange}
          placeholder="Dish Name"
          required
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="DietaryInformation"
          value={formData.DietaryInformation}
          onChange={handleChange}
          placeholder="Dietary Information"
          required
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="AllergenInformation"
          value={formData.AllergenInformation}
          onChange={handleChange}
          placeholder="Allergen Information"
          required
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="NutritionInformation"
          value={formData.NutritionInformation}
          onChange={handleChange}
          placeholder="Nutrition Information"
          required
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="ServingSize"
          value={formData.ServingSize}
          onChange={handleChange}
          placeholder="Serving Size"
          required
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="ServingTime"
          value={formData.ServingTime}
          onChange={handleChange}
          placeholder="Serving Time"
          required
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="number"
          name="PreparationTime"
          value={formData.PreparationTime}
          onChange={handleChange}
          placeholder="Preparation Time (mins)"
          required
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          required
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="dishType"
          value={formData.dishType}
          onChange={handleChange}
          placeholder="Dish Type"
          required
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="number"
          name="Price"
          value={formData.Price}
          onChange={handleChange}
          placeholder="Price"
          required
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="orderable"
            checked={formData.orderable}
            onChange={handleChange}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span>Orderable</span>
        </label>
        <p className="font-semibold">Image:</p>
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
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Add Menu Item
        </button>
      </div>

      {meals.length > 0 && (
        <div className="mt-6">
          <h6 className="text-lg font-semibold mb-4">Added meals</h6>
          <ul className="space-y-2">
            {meals.map((meal, idx) => (
              <li key={idx} className="p-2 bg-gray-100 rounded-lg">
                <strong>{meal.DishName}</strong> - {meal.dishType} -{" "}
                {meal.Price} 
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MenuItemForm;
