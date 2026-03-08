'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Correction pour les icônes Leaflet dans Next.js
const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapDisplay({ listings }: { listings: any[] }) {
  const center = [5.34, -4.02]; // Coordonnées par défaut (ex: Abidjan)

  return (
    <div className="h-[500px] w-full rounded-2xl overflow-hidden shadow-inner border border-gray-200">
      <MapContainer center={center as any} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {listings?.map((listing) => (
          listing.latitude && (
            <Marker 
              key={listing.id} 
              position={[listing.latitude, listing.longitude]} 
              icon={customIcon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold">{listing.title}</h3>
                  <p className="text-blue-600 font-semibold">{listing.price} FCFA</p>
                  <a href={`/listings/${listing.id}`} className="text-xs underline text-gray-500">Voir les détails</a>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
}