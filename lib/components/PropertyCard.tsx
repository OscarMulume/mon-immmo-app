'use client';

import Link from 'next/link';

interface PropertyCardProps {
  listing: {
    id: string;
    title: string;
    price: number;
    type: 'LOCATION' | 'VENTE';
    category: string;
    city: string;
    district: string;
    images_urls: string[];
  };
}

export default function PropertyCard({ listing }: PropertyCardProps) {
  // Image par défaut si aucune n'est fournie
  const displayImage = listing.images_urls?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1000';

  return (
    <div className="group bg-white rounded-[32px] overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 flex flex-col h-full">
      
      {/* SECTION IMAGE AVEC BADGES */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={displayImage} 
          alt={listing.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* BANNER DYNAMIQUE : VENTE OU LOCATION */}
        <div className={`absolute top-4 left-4 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg backdrop-blur-md border border-white/20 ${
          listing.type === 'VENTE' 
            ? 'bg-slate-900/90 text-white' 
            : 'bg-blue-600/90 text-white'
        }`}>
          {listing.type === 'VENTE' ? '🏷️ À Vendre' : '🔑 À Louer'}
        </div>

        {/* PRIX EN USD */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-xl border border-slate-50">
          <span className="text-blue-600 font-black text-lg">
            {new Intl.NumberFormat('en-US').format(listing.price)}
          </span>
          <span className="ml-1 text-[10px] font-black text-slate-400 uppercase tracking-tighter">USD</span>
          {listing.type === 'LOCATION' && (
            <span className="text-[10px] text-slate-400 font-bold ml-1">/mois</span>
          )}
        </div>
      </div>

      {/* SECTION INFOS */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {listing.category}
          </span>
          <div className="flex items-center gap-1 text-slate-400 font-bold text-[10px] uppercase">
             <span className="text-xs">📍</span> {listing.district}
          </div>
        </div>

        <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-tight mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
          {listing.title}
        </h3>

        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
          <div className="text-[9px] font-black uppercase text-slate-400 tracking-widest">
            {listing.city}, RDC
          </div>
          
          <Link 
            href={`/listings/${listing.id}`}
            className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-900 hover:bg-blue-600 hover:text-white transition-all active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}