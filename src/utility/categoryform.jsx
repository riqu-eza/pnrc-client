/* eslint-disable react/prop-types */
import InputField from "./InputField"; // Assuming InputField is another component

const FormComponent = ({ formData, setFormData, handleSubmit }) => {
  
  // Handles changes for room fields
  const handleRoomChange = (key, value) => {
    const newRooms = [...formData.details.accommodation.rooms];
    newRooms[0][key] = value;
    setFormData({
      ...formData,
      details: {
        ...formData.details,
        accommodation: {
          ...formData.details.accommodation,
          rooms: newRooms,
        },
      },
    });
  };

  // Handles changes for other nested fields
  // eslint-disable-next-line no-unused-vars
  const handleNestedChange = (section, key, e) => {
    setFormData({
      ...formData,
      details: {
        ...formData.details,
        [section]: {
          ...formData.details[section],
          [key]: e.target.value,
        },
      },
    });
  };

  // Function to add a room
  const addRoom = () => {
    const newRooms = [...formData.details.accommodation.rooms, { type: "", beds: "", price: "", description: "", amenities: [], imageUrls: [] }];
    setFormData({
      ...formData,
      details: {
        ...formData.details,
        accommodation: {
          ...formData.details.accommodation,
          rooms: newRooms,
        },
      },
    });
  };

  // Function to remove a room
  const removeRoom = (index) => {
    const newRooms = formData.details.accommodation.rooms.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      details: {
        ...formData.details,
        accommodation: {
          ...formData.details.accommodation,
          rooms: newRooms,
        },
      },
    });
  };

  return (
    <>
      {/* Conditional Rendering based on formData.category */}
      {formData.category === "Accommodation" && (
        <div>
          <h3>Accommodation Details</h3>
          <div>
            <h3>Rooms</h3>

            {/* Display Added Room Names with Remove Option */}
            {formData.details.accommodation.rooms.length > 0 &&
              formData.details.accommodation.rooms.map((room, index) => (
                <div key={`room-${index}`} className="flex justify-between items-center mb-2">
                  <p>Room {index + 1}: {room.type}</p>
                  <button type="button" className="p-2 bg-red-500 text-white rounded-lg" onClick={() => removeRoom(index)}>
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
                value={formData.details.accommodation.rooms[0].type}
                onChange={(e) => handleRoomChange("type", e.target.value)}
              />
              <InputField
                label="Describe the Room"
                type="text"
                name="description"
                value={formData.details.accommodation.rooms[0].description}
                onChange={(e) => handleRoomChange("description", e.target.value)}
              />
              <InputField
                label="Number of Beds and Size"
                type="text"
                name="beds"
                value={formData.details.accommodation.rooms[0].beds}
                onChange={(e) => handleRoomChange("beds", e.target.value)}
              />
              <InputField
                label="Room Price Per Night"
                type="text"
                name="price"
                value={formData.details.accommodation.rooms[0].price}
                onChange={(e) => handleRoomChange("price", e.target.value)}
              />
              {/* Add more input fields as needed */}
            </div>
            
            <button type="button" className="mt-4 p-3 bg-blue-500 text-white rounded-lg" onClick={addRoom}>
              Add Another Room
            </button>
          </div>
        </div>
      )}

      {/* Submit and Navigation Buttons */}
      <div className="flex gap-4 justify-evenly mt-8">
        <button className="p-3 bg-gray-500 text-white rounded-lg" onClick={() => console.log("Previous Step")}>
          Back
        </button>
        <button className="p-3 bg-blue-500 text-white rounded-lg" onClick={handleSubmit}>
          Continue
        </button>
      </div>
    </>
  );
};

export default FormComponent;
