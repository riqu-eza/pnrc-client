import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const center = [51.505, -0.09];

// eslint-disable-next-line no-unused-vars
const MapComponent = (location) => {

  // const center = location ? [location.lat, location.lng] : [51.505, -0.09];
  return (
    <MapContainer center={center} zoom={13} style={{ height: "150px",  }} className="p-4" >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={center}>
        <Popup>
          A pretty popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
