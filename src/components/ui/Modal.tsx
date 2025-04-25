import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { X } from "lucide-react";
import "leaflet/dist/leaflet.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  newLocation: { lat: number; lng: number } | null;
  setNewLocation: (location: { lat: number; lng: number }) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, newLocation, setNewLocation }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        {title && (
          <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        )}

        {/* Map Section */}
        <div className="h-[300px] w-full overflow-hidden rounded-lg mb-4">
          <MapContainer
            center={[28.6139, 77.2090]}
            zoom={12}
            scrollWheelZoom={false}
            className="h-full w-full z-0"
            onClick={(e) => {
              const { lat, lng } = e.latlng;
              setNewLocation({ lat, lng });
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {newLocation && (
              <Marker position={[newLocation.lat, newLocation.lng]}>
                <Popup>Selected Location</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        {/* Children content */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
