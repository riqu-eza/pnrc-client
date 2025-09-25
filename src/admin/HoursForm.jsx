import { useState } from "react";

// eslint-disable-next-line react/prop-types
const HoursForm = ({ hours, setHours }) => {
  const [open, setOpen] = useState("");
  const [close, setClose] = useState("");

  // Update hours when open/close time is selected
  const handleOpenChange = (e) => {
    setOpen(e.target.value);
  };

  const handleCloseChange = (e) => {
    setClose(e.target.value);
  };

  const handleAddHours = () => {
    // Add the new open and close hours to the array
    const newHours = [...hours, { open, close }];
    setHours(newHours); // Pass the updated hours to the parent component
    setOpen("");
    setClose("");
  };

  return (
    <div className="mb-6 p-4 bg-gray-100 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Operating Hours</h3>

      <div className="flex space-x-4 mb-4">
        <input
          type="time"
          value={open}
          onChange={handleOpenChange}
          // required
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="time"
          value={close}
          onChange={handleCloseChange}
          // required
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="button"
        onClick={handleAddHours}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Add Hours
      </button>
    </div>
  );
};

export default HoursForm;
