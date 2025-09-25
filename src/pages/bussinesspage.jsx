import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "ldrs/jellyTriangle";

// Default values shown

const Bussinesspage = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [introVisible, setIntroVisible] = useState(true);

  useEffect(() => {
    const fethuniquecity = async () => {
      try {
        const res = await fetch("/api/business/cities");
        if (!res.ok) {
          throw new Error(`Error: ${res.statusText}`);
        }
        const data = await res.json();
        setCities(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fethuniquecity();
  }, []);

  // Default values shown

  return (
    <>
      {introVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white p-8 rounded-md text-center max-w-md">
            <h2 className="text-2xl font-bold">
              Welcome to Our Resort Cities!
            </h2>
            <p className="mt-4">Discover the most beautiful destinations...</p>
            <button
              className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md"
              onClick={() => setIntroVisible(false)}
            >
              Explore Cities
            </button>
          </div>
        </div>
      )}
      {!introVisible && (
        <div className="h-full">
          <h3 className="text-3xl text-center p-2 bg-white text-blue-400 ">
            Local Business to supply your needs at :-
          </h3>
          {loading ? (
            <div className="flex items-center justify-center h-screen w-screen">
              <l-jelly-triangle
                size="30"
                speed="1.75"
                color="black"
              ></l-jelly-triangle>
            </div>
          ) : (
            <div className=" flex justify-center bg-white p-12  mx-6 max-h-screen overflow-auto ">
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-6 
        "
              >
                {cities.map((city, index) => (
                  <div
                    key={index}
                    className="p-6 bg-gray-400 shadow-lg hover:bg-blue-400 rounded-lg"
                  >
                    <Link
                      to={`/business/${city}`}
                      className="text-center block text-2xl font-bold text-black "
                    >
                      {city}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Bussinesspage;
