/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { 
  FaWifi, 
  FaParking, 
  FaSwimmer, 
  FaUtensils, 
  FaTv, 
  FaSnowflake,
  FaHotTub,
  FaCoffee,
  FaConciergeBell,
  FaDumbbell,
  FaSpa,
  FaChild,
  FaDog,
  FaWheelchair,
  FaFirstAid,
  FaSmokingBan,
  FaUmbrellaBeach,
  FaMountain,
  FaBicycle,
  FaCar,
  FaBus,
  FaShuttleVan,
  FaKey,
  FaLuggageCart,
  FaBell,
  FaLock,
  FaFireExtinguisher
} from "react-icons/fa";
import { 
  GiPartyPopper,
  GiDesk,
  GiWaterBottle,
  GiElectric
} from "react-icons/gi";
import { 
  IoIosFitness,
  IoMdRestaurant
} from "react-icons/io";
import { 
  MdMeetingRoom,
  MdAir,
  MdKitchen,
  MdLocalLaundryService,
  MdBusinessCenter,
  MdAcUnit
} from "react-icons/md";
import { 
  BiDrink
} from "react-icons/bi";

const amenitiesIconMap = {
  // Technology
  wifi: <FaWifi className="text-blue-500" />,
  television: <FaTv className="text-purple-500" />,
  "smart tv": <FaTv className="text-purple-600" />,
  "streaming services": <FaTv className="text-red-500" />,
  computer: <GiDesk className="text-gray-600" />,
  workspace: <GiDesk className="text-blue-600" />,
  
  // Parking & Transportation
  parking: <FaParking className="text-yellow-500" />,
  "free parking": <FaParking className="text-green-500" />,
  "valet parking": <FaParking className="text-blue-400" />,
  "garage parking": <FaParking className="text-gray-700" />,
  "car rental": <FaCar className="text-red-600" />,
  "shuttle service": <FaShuttleVan className="text-blue-600" />,
  "airport shuttle": <FaBus className="text-teal-500" />,
  bicycle: <FaBicycle className="text-green-600" />,
  
  // Food & Drink
  restaurant: <FaUtensils className="text-green-500" />,
  "breakfast included": <IoMdRestaurant className="text-yellow-500" />,
  "free breakfast": <IoMdRestaurant className="text-yellow-600" />,
  "mini bar": <BiDrink className="text-red-500" />,
  "coffee maker": <FaCoffee className="text-brown-500" />,
  "water bottle": <GiWaterBottle className="text-blue-400" />,
  "room service": <FaConciergeBell className="text-gold-500" />,
  
  // Recreation
  pool: <FaSwimmer className="text-blue-700" />,
  "hot tub": <FaHotTub className="text-pink-500" />,
  "fitness center": <IoIosFitness className="text-red-500" />,
  gym: <FaDumbbell className="text-gray-700" />,
  spa: <FaSpa className="text-pink-400" />,
  beach: <FaUmbrellaBeach className="text-yellow-400" />,
  "ski access": <FaMountain className="text-white-500" />,
  "kids club": <FaChild className="text-primary-500" />,
  "game room": <GiPartyPopper className="text-purple-400" />,
  
  // Room Features
  ac: <MdAcUnit className="text-blue-400" />,
  heating: <FaFireExtinguisher className="text-orange-500" />,
  kitchen: <MdKitchen className="text-brown-600" />,
  "kitchenette": <MdKitchen className="text-brown-500" />,
  "washing machine": <MdLocalLaundryService className="text-blue-600" />,
  "laundry service": <MdLocalLaundryService className="text-purple-500" />,
  "business center": <MdBusinessCenter className="text-gray-700" />,
  "meeting rooms": <MdMeetingRoom className="text-blue-700" />,
  
  // Accessibility
  "pet friendly": <FaDog className="text-brown-400" />,
  "wheelchair accessible": <FaWheelchair className="text-blue-600" />,
  "elevator": <GiElectric className="text-gray-600" />,
  
  // Safety
  "security": <FaLock className="text-gray-700" />,
  "safe": <FaKey className="text-yellow-600" />,
  "fire extinguisher": <FaFireExtinguisher className="text-red-600" />,
  "first aid": <FaFirstAid className="text-red-500" />,
  "smoke-free": <FaSmokingBan className="text-green-600" />,
  
  // Services
  "housekeeping": <FaLuggageCart className="text-blue-500" />,
  "wake-up service": <FaBell className="text-yellow-500" />,
  "24-hour front desk": <FaConciergeBell className="text-gray-700" />,
  "luggage storage": <FaLuggageCart className="text-brown-500" />,
};

const Amenities = ({ amenities }) => {
  let amenitiesArray = [];

  // Normalize the amenities input
  if (typeof amenities === 'string') {
    amenitiesArray = amenities.split(',').map(item => item.trim().toLowerCase());
  } else if (Array.isArray(amenities)) {
    amenitiesArray = amenities.map(item => item.trim().toLowerCase());
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
      {/* <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Amenities & Services
      </h3> */}
      
      {amenitiesArray.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {amenitiesArray.map((amenity, index) => (
            <div 
              key={index} 
              className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-200"
            >
              <div className="flex-shrink-0 text-xl mr-3">
                {amenitiesIconMap[amenity] || (
                  <span className="text-gray-400">•</span>
                )}
              </div>
              <span className="text-gray-700 font-medium capitalize">
                {amenity.replace(/-/g, ' ')}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          No amenities listed
        </div>
      )}
    </div>
  );
};

export default Amenities;