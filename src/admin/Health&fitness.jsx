/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
const Health = ({ setHealthItems, Subcategory }) => {
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);

  const subcategoryFields = {
    "Swimming Pools": [
      { name: "name", type: "text", placeholder: "name" },
      { name: "day", type: "text", placeholder: "Day (e.g., Monday)" },
      { name: "time", type: "text", placeholder: "Time (e.g., 9:30-10:00)" },
    ],
    "Martial arts Studios": [
      { name: "name", type: "text", placeholder: "name" },
      { name: "day", type: "text", placeholder: "Day (e.g., Monday)" },
      { name: "time", type: "text", placeholder: "Time (e.g., 9:30-10:00)" },
    ],
    "Dance Studio": [
      { name: "name", type: "text", placeholder: "name" },
      { name: "price", type: "text", placeholder: "price" },
      { name: "day", type: "text", placeholder: "Day (e.g., Monday)" },
      { name: "time", type: "text", placeholder: "Time (e.g., 9:30-10:00)" },
    ],
    Hospital: [
      { name: "name", type: "text", placeholder: "name" },
      { name: "day", type: "text", placeholder: "Day (e.g., Monday)" },
      { name: "time", type: "text", placeholder: "Time (e.g., 9:30-10:00)" },
    ],
  };

  const initialFormState = {
    ...(subcategoryFields[Subcategory]?.reduce((acc, field) => {
      acc[field.name] = "";
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
    if (Object.values(formData).some((value) => !value)) {
      alert("Please fill in all fields.");
      return;
    }

    const newEntry = {
      subcategory: Subcategory,
      ...formData,
    };
    console.log("New Entry:", newEntry);

    setHealthItems((prev) => [...prev, newEntry]);

    setFormData(initialFormState);
  };
  return (
    <form className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
      <h4 className="text-lg font-medium mb-2">
        Add Details for {Subcategory}
      </h4>

      {subcategoryFields[Subcategory]?.map((field) =>
        field.type === "boolean" ? (
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
        ) : (
          <input
            key={field.name}
            type={field.type}
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            placeholder={field.placeholder}
            required
            className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )
      )}
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
        Add Item
      </button>
    </form>
  );
};

export default Health;
