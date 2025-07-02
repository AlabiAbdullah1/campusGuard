// Map.js
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import { useState } from 'react';
import './Map.scss';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export const IncidentMap = ({ onPinChange, onLocationNameChange, apiKey }) => {
  const [position, setPosition] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getLocationName = async (lat, lng) => {
    setIsLoading(true);
    try {

      const apiKey = '3f0d82668d9540628eb00a89b76847d6';
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${apiKey}`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const properties = data.features[0].properties;
        // Try to get the most specific name available
        return properties.name || 
               properties.address_line1 || 
               properties.address_line2 || 
               `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      }
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } finally {
      setIsLoading(false);
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      async click(e) {
        const { lat, lng } = e.latlng;
        const newPosition = { lat, lng };
        setPosition(newPosition);
        
        const locationName = await getLocationName(lat, lng);
        
        onPinChange(newPosition);
        onLocationNameChange(locationName);
      },
    });

    return position ? (
      <Marker position={[position.lat, position.lng]}>
        <Popup>
          {isLoading ? "Loading location..." : position.name || `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`}
        </Popup>
      </Marker>
    ) : null;
  };

  return (
    <MapContainer
      center={[8.4799, 4.6716]} // Unilorin center coordinates
      zoom={18} // Higher zoom for better accuracy
      style={{ height: '500px', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapClickHandler />
    </MapContainer>
  );
};