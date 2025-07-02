import { useMap, Marker } from 'react-leaflet';
import { useState } from 'react';

function LocateUser() {
  const map = useMap();
  const [position, setPosition] = useState(null);

  const handleLocate = () => {
    map.locate({ setView: true, maxZoom: 18 });

    map.once('locationfound', (e) => {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng }); // explicitly setting both lat and lng
    });

    map.once('locationerror', () => {
      alert('Location access denied.');
    });
  };

  return (
    <>
      <button
        onClick={handleLocate}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          padding: '8px 12px',
        }}
      >
        📍 Use My Location
      </button>

      {position && <Marker position={[position.lat, position.lng]} />}
    </>
  );
}

export default LocateUser;
