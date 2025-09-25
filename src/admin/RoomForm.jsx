/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

// eslint-disable-next-line react/prop-types, no-unused-vars
const RoomForm = ({ setRooms, rooms }) => {
  const [roomType, setRoomType] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [amenities, setAmenities] = useState("");
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  // Function to handle image submission
  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);

      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setImageUrls((prev) => [...prev, ...urls]);
          setImageUploadError(false);
          setUploading(false);
          setFiles([]); // Clear the selected files after upload
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2MB max per image)");
          console.log(err)
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
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle room addition
  const handleAddRoom = () => {
    if (roomType && description && pricePerNight && amenities && imageUrls.length > 0) {
      const newRoom = {
        roomType,
        description,
        pricePerNight,
        amenities: amenities.split(","),
        imageUrls, // Include image URLs in room data
      };

      // Update the room list with the new room
      setRooms((prev) => [...prev, newRoom]);

      // Clear the input fields
      setRoomType("");
      setDescription("");
      setPricePerNight("");
      setAmenities("");
      setImageUrls([]); // Clear uploaded images
    } else {
      alert("Please fill in all fields and upload at least one image.");
    }
  };

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-lg">
      <h5 className="text-lg font-semibold mb-4">Room Details</h5>

      <div className="space-y-4">
        <input
          type="text"
          value={roomType}
          onChange={(e) => setRoomType(e.target.value)}
          placeholder="Room Type"
          required
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="number"
          value={pricePerNight}
          onChange={(e) => setPricePerNight(e.target.value)}
          placeholder="Price per Night"
          required
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          value={amenities}
          onChange={(e) => setAmenities(e.target.value)}
          placeholder="Amenities (comma separated)"
          required
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

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
        <p className="text-red-700 text-sm">{imageUploadError && imageUploadError}</p>

        {/* Display uploaded images */}
        {imageUrls.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {imageUrls.map((url, index) => (
              <div key={url} className="flex flex-col items-center">
                <img src={url} alt="Room image" className="w-20 h-20 object-cover rounded-lg" />
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
          onClick={handleAddRoom}
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Add Room
        </button>
      </div>

      {/* Display the list of added rooms */}
      {rooms.length > 0 && (
        <div className="mt-6">
          <h6 className="text-lg font-semibold mb-4">Added Rooms</h6>
          <ul className="space-y-2">
            {rooms.map((room, idx) => (
              <li key={idx} className="p-2 bg-gray-100 rounded-lg">
                <strong>{room.roomType}</strong> - ${room.pricePerNight} per night
                <p>{room.description}</p>
                <small>Amenities: {room.amenities.join(", ")}</small>
                {/* Display room images */}
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {room.imageUrls.map((url, index) => (
                    <img key={index} src={url} alt="Room" className="w-1 h-1 object-cover rounded-lg" />
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RoomForm;
