'use client';
import Image from 'next/image';

interface Listing {
  id: string;
  title: string;
  price: number;
  city: string;
  district: string;
  images: string[];
  category: string;
}

export default function ListingCard({ listing }: { listing: Listing }) {
  // Image par défaut si aucune photo n'est trouvée
  const displayImage = listing.images && listing.images.length > 0 
    ? listing.images[0] 
    : 'https://via.placeholder.com/400x300?text=Pas+de+photo';

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100 group">
      {/* Zone Image - Utilisation du composant Image optimisé */}
      <div className="relative h-64 w-full overflow-hidden">
        <Image 
          src={displayImage} 
          alt={listing.title}
          fill // Remplit le conteneur parent
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority={false}
        />
        {/* Badge catégorie avec z-index pour rester au dessus de l'image */}
        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-600">
          {listing.category.toUpperCase()}
        </div>
      </div>

      {/* Infos */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-800 truncate">{listing.title}</h3>
        <p className="text-gray-500 text-sm mb-4">{listing.city}, {listing.district}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-xl font-black text-blue-600">
            {listing.price.toLocaleString()} <small className="text-xs font-normal">FCFA</small>
          </span>
          <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors">
            Voir
          </button>
        </div>
      </div>
    </div>
  );
}