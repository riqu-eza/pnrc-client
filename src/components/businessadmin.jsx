import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useState } from "react";
import { app } from "../firebase";
import { useUser } from "../components/Adminuser";
import { useSelector } from "react-redux";

export default function CreateBusinessListing() {
  const [businessListings, setBusinessListings] = useState([]);
  const { currentUser } =useSelector((state) => state.user);
  const [currentBusiness, setCurrentBusiness] = useState({
    imageUrls: [],
    name: "",
    description: "",
    email: "",
    contact: "",
    category: {
      selectedCategory: "",
      selectedSubcategory: "",
    },
    location: "",
    selectedCounty: "",
    address: "",
    products: [
      {
        productName: "",
        productPrice: "",
        productDescription: "",
        productImage: [],
      },
    ],
    username: currentUser.username,
  });
  const categoriesData = {
    Technology: [
      "Software Development",
      "IT Services",
      "Hardware Manufacturing",
      "Telecommunications",
      "Web Design",
      "Mobile App Development",
      "Cybersecurity",
      "Cloud Services",
      "Data Analytics",
      "Network Solutions",
      "Tech Support",
    ],
    Agriculture: [
      "Crop Farming",
      "Livestock Farming",
      "Agri-Tech",
      "Poultry Farming",
      "Dairy Farming",
      "Organic Farming",
      "Fish Farming",
      "Floriculture",
      "Horticulture",
      "Beekeeping",
      "Agro-Processing",
      "Farm Equipment Supply",
    ],
    Construction: [
      "Residential Construction",
      "Commercial Construction",
      "Infrastructure Development",
      "Renovation Services",
      "Civil Engineering",
      "Architectural Services",
      "Building Materials Supply",
      "Landscaping",
      "Roofing Services",
      "Electrical Installations",
      "Plumbing Services",
      "HVAC Services",
      "Interior Design",
    ],
    Retail: [
      "E-commerce",
      "Department Stores",
      "Specialty Stores",
      "Supermarkets",
      "Wholesale Distribution",
      "Convenience Stores",
      "Clothing Boutiques",
      "Electronics Stores",
      "Furniture Stores",
      "Toy Stores",
      "Bookstores",
      "Home Appliances",
    ],
    Hospitality: [
      "Restaurants",
      "Cafes",
      "Bars",
      "Hotels",
      "Motels",
      "Bed and Breakfasts",
      "Travel Agencies",
      "Tour Operators",
      "Catering Services",
      "Event Planning",
      "Resorts",
      "Lodges",
      "Food Delivery Services",
    ],
    Healthcare: [
      "Hospitals",
      "Clinics",
      "Pharmacies",
      "Dental Services",
      "Optical Services",
      "Physiotherapy",
      "Laboratories",
      "Health Insurance",
      "Medical Equipment Supply",
      "Home Care Services",
      "Mental Health Services",
      "Rehabilitation Centers",
    ],
    Finance: [
      "Banks",
      "Insurance Companies",
      "Investment Firms",
      "Microfinance Institutions",
      "SACCOs (Savings and Credit Cooperative Organizations)",
      "Accountants",
      "Tax Consultants",
      "Financial Advisors",
      "Forex Trading",
      "Mortgage Brokers",
      "Wealth Management",
      "Auditing Services",
      "Credit Unions",
    ],
    Education: [
      "Preschools",
      "Primary Schools",
      "Secondary Schools",
      "Universities",
      "Vocational Training Centers",
      "Tutoring Services",
      "Language Schools",
      "Music Schools",
      "Dance Schools",
      "Art Schools",
      "Driving Schools",
      "Online Learning Platforms",
    ],
    Manufacturing: [
      "Food and Beverage Production",
      "Textile and Apparel",
      "Electronics Manufacturing",
      "Furniture Manufacturing",
      "Plastic Products",
      "Chemical Manufacturing",
      "Metal Fabrication",
      "Paper Products",
      "Packaging Materials",
      "Building Materials",
      "Automotive Parts",
      "Cosmetics and Personal Care",
    ],
    Transportation: [
      "Freight Services",
      "Courier Services",
      "Public Transportation",
      "Car Rentals",
      "Taxi Services",
      "Logistics and Distribution",
      "Warehousing",
      "Moving Services",
      "Bike Rentals",
      "Airport Shuttles",
      "Bus Services",
      "Shipping Companies",
    ],
    Entertainment: [
      "Movie Theaters",
      "Music Production",
      "Event Planning",
      "Nightclubs",
      "Game Arcades",
      "Amusement Parks",
      "Sports Centers",
      "Live Performance Venues",
      "Cinemas",
      "Art Galleries",
      "Museums",
      "Photography Studios",
    ],
    RealEstate: [
      "Real Estate Agencies",
      "Property Management",
      "Real Estate Development",
      "Real Estate Investment",
      "Residential Properties",
      "Commercial Properties",
      "Rental Services",
      "Real Estate Valuation",
      "Land Sales",
      "Real Estate Consulting",
      "Property Listings",
      "Vacation Rentals",
    ],
    Energy: [
      "Solar Power",
      "Wind Power",
      "Hydroelectric Power",
      "Oil and Gas",
      "Energy Consulting",
      "Biomass Energy",
      "Geothermal Energy",
      "Energy Efficiency Solutions",
      "Electricity Providers",
      "Battery Storage Solutions",
      "Renewable Energy Installations",
    ],
    Automotive: [
      "Car Dealerships",
      "Auto Repair Services",
      "Car Rentals",
      "Auto Parts Stores",
      "Car Wash Services",
      "Auto Detailing",
      "Motorcycle Sales",
      "Tire Shops",
      "Vehicle Inspection Services",
      "Towing Services",
      "Driving Schools",
    ],
    ProfessionalServices: [
      "Legal Services",
      "Accounting Services",
      "Consulting Services",
      "Marketing Agencies",
      "Public Relations Firms",
      "Human Resources Services",
      "Graphic Design",
      "Business Coaching",
      "Translation Services",
      "Event Planning",
      "Recruitment Agencies",
      "IT Consulting",
    ],
    FoodAndBeverage: [
      "Bakeries",
      "Butcheries",
      "Dairy Products",
      "Seafood Markets",
      "Beverage Production",
      "Spices and Herbs",
      "Food Trucks",
      "Farmers Markets",
      "Gourmet Foods",
      "Ice Cream Parlors",
      "Juice Bars",
      "Catering Services",
    ],
    Fashion: [
      "Clothing Stores",
      "Shoe Stores",
      "Jewelry Stores",
      "Fashion Designers",
      "Tailoring Services",
      "Bridal Shops",
      "Accessories Stores",
      "Sportswear Stores",
      "Lingerie Stores",
      "Children's Clothing",
      "Second-hand Clothing",
      "Fashion Consulting",
    ],
    MediaAndPublishing: [
      "Newspapers",
      "Magazines",
      "Radio Stations",
      "TV Stations",
      "Book Publishing",
      "Online Media",
      "Advertising Agencies",
      "Content Creation",
      "Graphic Design Services",
      "Copywriting Services",
      "Editing Services",
      "Print Advertising",
    ],
    SecurityServices: [
      "Private Security",
      "Cybersecurity Services",
      "Surveillance Systems",
      "Alarm Systems",
      "Security Consulting",
      "Bodyguard Services",
      "Event Security",
      "Security Training",
      "Locksmith Services",
      "Background Checks",
      "Security Equipment",
      "Guard Dog Services",
    ],
    WasteManagement: [
      "Recycling Services",
      "Waste Collection",
      "Hazardous Waste Disposal",
      "Composting Services",
      "E-Waste Recycling",
      "Waste Treatment",
      "Landfill Management",
      "Waste-to-Energy",
      "Waste Consulting",
      "Junk Removal",
      "Organic Waste Management",
      "Environmental Cleanup",
    ],
    Telecommunications: [
      "Internet Service Providers",
      "Mobile Network Operators",
      "Telecommunications Equipment",
      "Call Centers",
      "VOIP Services",
      "Satellite Communications",
      "Broadband Services",
      "Telecommunications Consulting",
      "Data Centers",
      "IT Support",
      "Network Solutions",
      "Cable Services",
    ],
    BeautyAndWellness: [
      "Beauty Salons",
      "Spas",
      "Barber Shops",
      "Skincare Clinics",
      "Fitness Centers",
      "Yoga Studios",
      "Massage Therapy",
      "Nail Salons",
      "Cosmetic Surgery Clinics",
      "Health Clubs",
      "Wellness Retreats",
      "Herbal Medicine",
    ],
    TravelAndTourism: [
      "Travel Agencies",
      "Tour Operators",
      "Safari Services",
      "Travel Insurance",
      "Car Rentals",
      "Cruise Services",
      "Cultural Tours",
      "Adventure Travel",
      "Travel Blogging",
      "Travel Consulting",
      "Vacation Rentals",
      "Airline Ticketing",
    ],
    HumanResources: [
      "Recruitment Agencies",
      "HR Consulting",
      "Employee Training",
      "Payroll Services",
      "Employee Benefits",
      "Performance Management",
      "Talent Management",
      "HR Software",
      "HR Outsourcing",
      "Career Counseling",
      "Executive Search",
      "Workforce Planning",
    ],
    NonprofitAndNGOs: [
      "Charities",
      "Environmental NGOs",
      "Human Rights Organizations",
      "Health NGOs",
      "Educational NGOs",
      "Animal Welfare NGOs",
      "Community Development",
      "Disaster Relief",
      "International Aid",
      "Microfinance NGOs",
      "Advocacy Groups",
      "Social Enterprises",
    ],
    LogisticsAndSupplyChain: [
      "Freight Forwarding",
      "Courier Services",
      "Warehousing",
      "Distribution Services",
      "Inventory Management",
      "Supply Chain Consulting",
      "Cold Chain Logistics",
      "Transportation Management",
      "Procurement Services",
      "Third-Party Logistics",
      "Customs Brokerage",
      "Logistics Software",
    ],
    PrintingAndPublishing: [
      "Printing Services",
      "Book Publishing",
      "Magazine Publishing",
      "Newspaper Publishing",
      "Digital Printing",
      "Graphic Design Services",
      "Copywriting Services",
      "Editing Services",
      "Print Advertising",
      "Bookstores",
      "E-Publishing",
      "Print Shops",
    ],
    GreenAndSustainable: [
      "Solar Panel Installation",
      "Wind Turbine Manufacturing",
      "Organic Farms",
      "Eco-Friendly Products",
      "Green Building Materials",
      "Sustainable Fashion",
      "Recycling Centers",
      "Environmental Consulting",
      "Green Energy Solutions",
      "Water Conservation Services",
      "Eco-Tourism",
      "Sustainable Landscaping",
    ],
    // Add more categories and subcategories as needed
  };
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { username } = useUser("");

  const [countiesInKenya, setCountiesInKenya] = useState([]);

  useEffect(() => {
    fetchCounties();
  }, []);

  const fetchCounties = async () => {
    try {
      const response = await fetch("/api/admin/cities");
      if (!response.ok) {
        throw new Error("Failed to fetch cities");
      }
      const data = await response.json();
      setCountiesInKenya(data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleImageSubmit = () => {
    if (
      currentBusiness.imageUrls.length > 0 &&
      currentBusiness.imageUrls.length < 2
    ) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < currentBusiness.imageUrls.length; i++) {
        promises.push(storeImage(currentBusiness.imageUrls[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setCurrentBusiness({
            ...currentBusiness,
            imageUrls: currentBusiness.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch(() => {
          setImageUploadError("Image upload failed (max 2 MB per image)");
          setUploading(false);
        });
    } else if (currentBusiness.imageUrls.length === 0) {
      setImageUploadError("Select images to upload");
      setUploading(false);
    } else {
      setImageUploadError("You can only upload up to 6 images per listing");
      setUploading(false);
    }
  };

  const handleProductImageSubmit = (index) => {
    const product = currentBusiness.products[index];
    if (product.productImage.length > 0 && product.productImage.length < 9) {
      setUploading(true);
      setImageUploadError(false);
      const promises = product.productImage.map(storeImage);

      Promise.all(promises)
        .then((urls) => {
          const updatedProducts = currentBusiness.products.map((p, i) =>
            i === index ? { ...p, productImage: urls } : p
          );
          setCurrentBusiness({
            ...currentBusiness,
            products: updatedProducts,
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch(() => {
          setImageUploadError("Image upload failed (max 2 MB per image)");
          setUploading(false);
        });
    } else if (product.productImage.length === 0) {
      setImageUploadError("Select images to upload");
      setUploading(false);
    } else {
      setImageUploadError("You can only upload up to 6 images per listing");
      setUploading(false);
    }
  };
 

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload progress: ${progress}%`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              resolve(downloadURL);
            })
            .catch((error) => {
              reject(error);
            });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setCurrentBusiness({
      ...currentBusiness,
      imageUrls: currentBusiness.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleLocationChange = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const newLocation = {
          ...currentBusiness,
          location: `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`,
        };
        setCurrentBusiness(newLocation);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleChange = (e) => {
    const { id, type, checked, value } = e.target;

    if (type === "checkbox") {
      setCurrentBusiness({ ...currentBusiness, [id]: checked });
    } else if (type === "number" || type === "text" || type === "textarea") {
      if (id === "selectedCategory") {
        setCurrentBusiness({
          ...currentBusiness,
          category: {
            ...currentBusiness.category,
            selectedCategory: value,
          },
        });
      } else if (id === "selectedSubcategory") {
        setCurrentBusiness({
          ...currentBusiness,
          category: {
            ...currentBusiness.category,
            selectedSubcategory: value,
          },
        });
      } else {
        setCurrentBusiness({ ...currentBusiness, [id]: value });
      }
    }
  };

  const handleCountyChange = (e) => {
    const value = e.target.value;
    setCurrentBusiness((prevState) => ({
      ...prevState,
      selectedCounty: value,
    }));
  };

  const handleCategoryChange = (selectedCategory) => {
    setCurrentBusiness((prevState) => ({
      ...prevState,
      category: {
        ...prevState.category,
        selectedCategory: selectedCategory,
      },
    }));
  };

  const handleSubcategoryChange = (selectedSubcategory) => {
    setCurrentBusiness((prevState) => ({
      ...prevState,
      category: {
        ...prevState.category,
        selectedSubcategory: selectedSubcategory,
      },
    }));
  };

  const handleProductChange = (e, index) => {
    const { id, value } = e.target;
    const updatedProducts = currentBusiness.products.map((product, i) =>
      i === index ? { ...product, [id]: value } : product
    );
    setCurrentBusiness({
      ...currentBusiness,
      products: updatedProducts,
    });
  };
  

  const handleAddProduct = () => {
    setCurrentBusiness((prevState) => ({
      ...prevState,
      products: [
        ...prevState.products,
        {
          productName: "",
          productPrice: "",
          productDescription: "",
          productImage: [],
        },
      ],
    }));
  };
  

  const handleRemoveProduct = (index) => {
    const updatedProducts = [...currentBusiness.products];
    updatedProducts.splice(index, 1);
    setCurrentBusiness({
      ...currentBusiness,
      products: updatedProducts,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // if (currentBusiness.imageUrls.length < 1) {
      //   setError("You must upload at least one image");
      //   return;
      // }
      setLoading(true);
      setError(false);
      const res = await fetch("/api/business/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...currentBusiness,
          username: username,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        console.log(currentBusiness);
        console.log(data.message);
      } else {
        setBusinessListings([...businessListings, data]);
        setCurrentBusiness({
          imageUrls: [],
          name: "",
          description: "",
          email: "",
          contact: "",
          category: {
            selectedCategory: "",
            selectedSubcategory: "",
          },
          location: "",
          selectedCounty: "",
          address: "",
          products: [
            {
              productName: "",
              productPrice: "",
              productDescription: "",
              productImage: [],
            },
          ],
        });
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Business Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="5"
            required
            onChange={handleChange}
            value={currentBusiness.name}
          />
          <input
            type="text"
            placeholder="Business Email"
            className="border p-3 rounded-lg"
            id="email"
            required
            onChange={handleChange}
            value={currentBusiness.email}
          />
          <input
            type="number"
            placeholder="Business Contact"
            className="border p-3 rounded-lg"
            id="contact"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={currentBusiness.contact}
          />
          <textarea
            type="text"
            placeholder="Business Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={currentBusiness.description}
          />
          <input
            type="text"
            placeholder="Business Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={currentBusiness.address}
          />
          <div className="">
            <button type="button" onClick={handleLocationChange}>
              Pin Location
            </button>
          </div>
          <div className="county-selector">
            <select
              value={currentBusiness.selectedCounty}
              onChange={handleCountyChange}
            >
              <option value="">Select County</option>
              {countiesInKenya.map((county, index) => (
                <option key={index} value={county.newcity}>
                  {county.newcity}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={currentBusiness.category.selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="">Select Category</option>
              {Object.keys(categoriesData).map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {currentBusiness.category.selectedCategory && (
              <div>
                <select
                  value={currentBusiness.category.selectedSubcategory}
                  onChange={(e) => handleSubcategoryChange(e.target.value)}
                >
                  <option value="">Select Subcategory</option>
                  {categoriesData[
                    currentBusiness.category.selectedCategory
                  ]?.map((subcategory, index) => (
                    <option key={index} value={subcategory}>
                      {subcategory}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <input
              onChange={(e) =>
                setCurrentBusiness({
                  ...currentBusiness,
                  imageUrls: Array.from(e.target.files),
                })
              }
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
          {currentBusiness.imageUrls.length > 0 &&
            currentBusiness.imageUrls.map((url, index) => (
              <div
                key={index}
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
        </div>
{/*  products*/}
        <div className="flex flex-col gap-4">
          <h1>Add Products</h1>
          {currentBusiness.products.map((product, index) => (
            <div key={index} className="flex items-center gap-4">
              <p>{product.productName}</p>
              <div className="flex gap-2">
                <button type="button" className="text-green-700">
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveProduct(index)}
                  className="text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          <div>
            {currentBusiness.products.map((product, index) => (
              <div key={index}>
                <div>
                  <input
                    onChange={(e) => handleProductChange(e, index)}
                    value={product.productName}
                    className="p-2 border border-gray-300 rounded w-full"
                    placeholder="Product Name"
                    type="text"
                    id="productName"
                  />
                  <textarea
                    onChange={(e) => handleProductChange(e, index)}
                    value={product.productDescription}
                    className="p-3 border border-gray-300 rounded w-full"
                    placeholder="Product Description"
                    id="productDescription"
                  />
                  <input
                    onChange={(e) => handleProductChange(e, index)}
                    value={product.productPrice}
                    className="p-3 border border-gray-300 rounded w-full"
                    placeholder="Product Price"
                    type="number"
                    id="productPrice"
                  />
                </div>
                <div className="flex gap-4">
                  <input
                    onChange={(e) => {
                      const updatedProducts = currentBusiness.products.map(
                        (p, i) =>
                          i === index
                            ? { ...p, productImage: Array.from(e.target.files) }
                            : p
                      );
                      setCurrentBusiness({
                        ...currentBusiness,
                        products: updatedProducts,
                      });
                    }}
                    className="p-3 border border-gray-300 rounded w-full"
                    type="file"
                    id={`productImages-${index}`}
                    accept="image/*"
                    multiple
                  />
                  <button
                    disabled={uploading}
                    type="button"
                    onClick={() => handleProductImageSubmit(index)}
                    className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
                  >
                    {uploading ? "loading..." : "load"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddProduct}
            className="p-3 bg-blue-700 text-white rounded-lg uppercase hover:opacity-95"
          >
            Add Product
          </button>
          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Creating..." : "Create Business"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
