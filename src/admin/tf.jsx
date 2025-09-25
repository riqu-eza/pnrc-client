/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import CinemaForm from "./CinemaForm";
import MusicLivePerformances from "./MusicLivePerformances";
import Gaming from "./Gaming";
import Amusement from "./Amusement";

const EntertainmentForm = ({ setEntertainmentItems, Subcategory }) => {
  const [entertainmentDetails, setEntertainmentDetails] = useState({});
  const [entertainmentCategories, setEntertainmentCategories] = useState([
    {
      category: "Entertainment",
      subcategories: [
        { subcategory: "Cinema & Theaters", EntertainmentItems: [] },
        { subcategory: "Music & Live Performances", EntertainmentItems: [] },
        { subcategory: "Gaming & Indoor Fun", EntertainmentItems: [] },
        { subcategory: "Amusement & Recreation", EntertainmentItems: [] },
      ],
    },
  ]);

  useEffect(() => {
    // Reset details when subcategory changes
    setEntertainmentDetails({});
  }, [Subcategory]);

  const addEntertainmentItem = (item) => {
    // Update the correct subcategory's EntertainmentItems
    setEntertainmentCategories((prevCategories) => {
      return prevCategories.map((category) => {
        if (category.category === "Entertainment") {
          return {
            ...category,
            subcategories: category.subcategories.map((sub) => {
              if (sub.subcategory === Subcategory) {
                return {
                  ...sub,
                  EntertainmentItems: [...sub.EntertainmentItems, item],
                };
              }
              return sub;
            }),
          };
        }
        return category;
      });
    });
  };

  const renderSubcategoryForm = () => {
    switch (Subcategory) {
      case "Cinema & Theaters":
        return (
          <CinemaForm
            details={entertainmentDetails}
            setDetails={setEntertainmentDetails}
            addItem={addEntertainmentItem}
          />
        );
      case "Music & Live Performances":
        return (
          <MusicLivePerformances
            details={entertainmentDetails}
            setDetails={setEntertainmentDetails}
            addItem={addEntertainmentItem}
          />
        );
      case "Gaming & Indoor Fun":
        return (
          <Gaming
            details={entertainmentDetails}
            setDetails={setEntertainmentDetails}
            addItem={addEntertainmentItem}
          />
        );
      case "Amusement & Recreation":
        return (
          <Amusement
            details={entertainmentDetails}
            setDetails={setEntertainmentDetails}
            addItem={addEntertainmentItem}
          />
        );
      default:
        return <p>Select a valid subcategory</p>;
    }
  };

  const handleSubmit = () => {
    setEntertainmentItems(entertainmentCategories);
    console.log("Final Entertainment Categories:", entertainmentCategories);
  };

  return (
    <form className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
      <h4 className="text-lg font-medium mb-2">
        Add Entertainment Details for {Subcategory}
      </h4>
      {renderSubcategoryForm()}
      <button
        type="button"
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Submit All
      </button>
    </form>
  );
};

export default EntertainmentForm;
