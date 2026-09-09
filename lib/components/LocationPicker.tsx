'use client';

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Icône personnalisée pour le marqueur
const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  defaultLat?: number;
  defaultLng?: number;
}

export default function LocationPicker({ onLocationSelect, defaultLat = 5.3484, defaultLng = -4.0305 }: LocationPickerProps) {
  const [position, setPosition] = useState<[number, number]>([defaultLat, defaultLng]);

  // Sous-composant pour gérer l'événement de clic
  function MapEvents() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        onLocationSelect(lat, lng);
      },
    });
    return position ? <Marker position={position} icon={customIcon} /> : null;
  }

  return (
    <div className="h-[300px] w-full rounded-3xl overflow-hidden border-2 border-slate-100 shadow-inner group">
      <MapContainer 
        center={position} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapEvents />
      </MapContainer>
      <div className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest p-2 text-center">
        Cliquez sur la carte pour placer le bien
      </div>
    </div>
  );
}