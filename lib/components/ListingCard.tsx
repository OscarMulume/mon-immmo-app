'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Listing {
  id: string;
  title: string;
  price: number;
  currency: string; // Ajouté ici
  city: string;
  district: string;
  images: string[];
  category: string;
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.includes(listing.id));
  }, [listing.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (favorites.includes(listing.id)) {
      favorites = favorites.filter((id: string) => id !== listing.id);
      setIsFavorite(false);
    } else {
      favorites.push(listing.id);
      setIsFavorite(true);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
  };

  const displayImage = listing.images && listing.images.length > 0 
    ? listing.images[0] 
    : 'https://via.placeholder.com/400x300?text=Pas+de+photo';

  return (
    <div className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 group relative">
      
      <button 
        onClick={toggleFavorite}
        className={`absolute top-5 right-5 z-20 p-3 rounded-2xl backdrop-blur-md transition-all active:scale-75 ${
          isFavorite ? 'bg-red-500 text-white shadow-lg' : 'bg-white/80 text-slate-400 hover:text-red-500'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      </button>

      <Link href={`/listings/${listing.id}`} className="relative h-72 w-full block overflow-hidden">
        <Image 
          src={displayImage} 
          alt={listing.title}
          fill 
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        <div className="absolute top-5 left-5 z-10 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-2xl text-[10px] font-black text-blue-600 uppercase tracking-widest">
          {listing.category}
        </div>
      </Link>

      <div className="p-6">
        <Link href={`/listings/${listing.id}`}>
          <h3 className="text-xl font-black text-slate-800 truncate group-hover:text-blue-600 transition-colors">
            {listing.title}
          </h3>
        </Link>
        
        <p className="text-slate-400 font-bold text-xs uppercase tracking-tight mt-1 mb-6">
          📍 {listing.city}, {listing.district}
        </p>
        
        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
          <span className="text-lg font-black text-blue-600">
            {listing.price.toLocaleString()} <small className="text-[10px] font-bold text-blue-400 uppercase ml-1">{listing.currency || 'USD'}</small>
          </span>
          
          <Link href={`/listings/${listing.id}`}>
            <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase hover:bg-blue-600 transition-all shadow-lg active:scale-90">
              Voir
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}