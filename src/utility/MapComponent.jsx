import  { useState, useEffect } from 'react';
import AddressAutocomplete from './addressautocomplete';

// eslint-disable-next-line react/prop-types
const MapComponent = ({ formData, setFormData }) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  const initMap = () => {
    const googleMap = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    });

    setMap(googleMap);
  };

  const handleSelect = (place) => {
    const { geometry, formatted_address } = place;

    if (map && geometry) {
      const { location } = geometry;
      const position = { lat: location.lat(), lng: location.lng() };

      map.setCenter(position);

      if (marker) {
        marker.setMap(null);
      }

      const newMarker = new window.google.maps.Marker({
        position,
        map,
        title: formatted_address,
      });

      setMarker(newMarker);

      // Update formData with the selected address and coordinates
      setFormData({
        ...formData,
        address: {
          // eslint-disable-next-line react/prop-types
          ...formData.address,
          location: {
            address: formatted_address,
            lat: position.lat,
            lng: position.lng,
          }
        }
      });
    }
  };

  useEffect(() => {
    if (!window.google) return;
    initMap();
  }, []);

  return (
    <div>
      <AddressAutocomplete onSelect={handleSelect} />
      <div id="map" style={{ height: '400px', width: '100%' }}></div>
    </div>
  );
};

export default MapComponent;
