import  { useEffect, useRef } from 'react';

// eslint-disable-next-line react/prop-types
const AddressAutocomplete = ({ onSelect }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!window.google) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        onSelect(place);
      }
    });
  }, [onSelect]);

  return (
    <div>
      <label htmlFor="address">Location:</label>
      <input
        id="address"
        ref={inputRef}
        type="text"
        placeholder="Start typing an address"
        className="w-full p-2 border border-gray-300 rounded-lg"
      />
    </div>
  );
};

export default AddressAutocomplete;
