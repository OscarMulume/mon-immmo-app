'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Correction de l'icône Leaflet pour Next.js (évite les images manquantes)
const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Composant interne pour forcer le déplacement de la vue
function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 15);
  }, [lat, lng, map]);
  return null;
}

interface MapProps {
  lat: number;
  lng: number;
  title: string;
}

export default function PropertyMap({ lat, lng, title }: MapProps) {
  // Coordonnées par défaut si les données sont absentes (Kinshasa Centre)
  const position: [number, number] = [lat || -4.3224, lng || 15.3070];

  return (
    <div className="h-[350px] w-full rounded-[40px] overflow-hidden shadow-2xl border-4 border-white z-0 relative group">
      <MapContainer 
        center={position} 
        zoom={15} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%' }}
        className="grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        {/* Force le recentrage si l'ID de l'annonce change */}
        <RecenterMap lat={position[0]} lng={position[1]} />

        <Marker position={position} icon={customIcon}>
          <Popup>
            <div className="p-1">
              <span className="font-black text-blue-600 uppercase text-[10px] tracking-widest">{title}</span>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Petit indicateur visuel en bas de carte */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-slate-100 pointer-events-none">
        <p className="text-[8px] font-black text-slate-900 uppercase tracking-[0.2em]">
          📍 Localisation exacte
        </p>
      </div>
    </div>
  );
}