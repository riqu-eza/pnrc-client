import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AccommodationSearch from "./accommodation";
import DiningSearch from "./Diningsearch";
import Entainmentsearch from "./Enternment";
import Cultureandhistoricalsites from "./Culture_and_Historicalsites";
import Shopping from "./Shopping";
import Education_and_Learning from "./Educationandlearning";
import Health_and_Fitness from "./Healthandfitness";
import Services from "./Services";

const CategorySearch = () => {
  const { county, categoryname } = useParams();
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  console.log("categorylist", listings);
  console.log(categoryname);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/listing/${county}/${categoryname}`);
        if (response.ok) {
          const data = await response.json();
          setListings(data);
          console.log("Fetched listings:", data);
        } else {
          console.error("Failed to fetch data:", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [county, categoryname]);
console.log("categoryname", categoryname);
  // Select the appropriate component based on the category
  const renderCategoryComponent = () => {
    switch (categoryname.toLowerCase()) {
      case "accommodation":
        return <AccommodationSearch listings={listings} />;
      case "dining":
        return <DiningSearch listings={listings} />;
      case "entertainment":
        return <Entainmentsearch listings={listings} />;
      case "culture_and_historicalsites":
        return <Cultureandhistoricalsites listings={listings} />;
      case "shopping":
        return <Shopping listings={listings} />;
      case "education_and_learning":
        return <Education_and_Learning listings={listings} />;
      case "health_and_fitness":
        return <Health_and_Fitness listings={listings} />;
      case "services":
        return <Services listings={listings} />;
      default:
        return <div>Category not found</div>;
    }
  };

  return (
    <div>{isLoading ? <div>Loading...</div> : renderCategoryComponent()}</div>
  );
};

export default CategorySearch;
