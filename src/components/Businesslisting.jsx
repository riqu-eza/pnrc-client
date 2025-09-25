import { Link } from "react-router-dom";

const Businesslisting = ({ business }) => {
  return (
    <div className="flex border">
      <div className="m-4">
        <img
          src={business.imageUrls[0]}
          alt={business.name}
          className="w-52 h-28 object-cover rounded-md"
        />
        <Link to={`/business/${business._id}`} >
          <p className="text-gray-600">Merchant:</p>
          <h3 className="text-black">{business.name}</h3>
        </Link  >
      </div>
      <Link to={`/business/${business._id}`}>
        <div className="m-4">
          <p className="text-3xl">{business.productName}</p>
          <p className="text-5xl p-2 text-orange-900">
            {business.productprice}{" "}
            <span className="text-base">
              <sub>Ksh</sub>
            </span>
          </p>
          <p>{business.productdescription}</p>
        </div>
      </Link>
    </div>
  );
};

export default Businesslisting;
