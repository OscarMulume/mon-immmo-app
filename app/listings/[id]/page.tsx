'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Import dynamique de la carte pour éviter les erreurs SSR de Leaflet
const PropertyMap = dynamic(() => import('@/lib/components/PropertyMap'), { 
  ssr: false,
  loading: () => (
    <div className="h-[350px] bg-slate-100 animate-pulse rounded-[40px] flex items-center justify-center font-black text-slate-400 uppercase tracking-[0.3em] text-[10px]">
      Chargement de la carte...
    </div>
  )
});

interface ListingDetail {
  id: string;
  title: string;
  description: string;
  price: number;
  type: 'LOCATION' | 'VENTE'; // Ajouté
  city: string;
  district: string;
  images_urls: string[];
  category: string;
  owner_id: string;
  latitude?: number;
  longitude?: number;
}

export default function ListingDetails() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const MON_NUMERO_RDC = "243975585150"; 
  const MON_EMAIL = "oscarmulume1612@gmail.com";

  useEffect(() => {
    async function getListing() {
      if (!id) return;
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id as string)
        .single();

      if (!error && data) {
        setListing(data as unknown as ListingDetail);
      }
      setLoading(false);
    }
    getListing();
  }, [id]);

  if (loading) return <div className="p-20 text-center animate-pulse text-slate-400 font-black uppercase tracking-[0.5em] text-xs">Chargement en cours...</div>;
  if (!listing) return <div className="p-20 text-center text-red-500 font-black uppercase italic">Annonce introuvable.</div>;

  // MESSAGE WHATSAPP PERSONNALISÉ KINSHASA
  const messageWhatsApp = encodeURIComponent(
    `Bonjour IMMO-CI,\n\n` +
    `Je suis intéressé par l'annonce : *${listing.title.toUpperCase()}*\n` +
    `📍 Quartier : ${listing.district}\n` +
    `💰 Prix : ${listing.price.toLocaleString()} USD ${listing.type === 'LOCATION' ? '/mois' : ''}\n\n` +
    `Est-ce que ce bien est toujours disponible pour une visite ?`
  );

  const whatsappUrl = `https://wa.me/${MON_NUMERO_RDC}?text=${messageWhatsApp}`;

  return (
    <div className="max-w-7xl mx-auto p-6 mt-6 pb-32">
      {/* BOUTON RETOUR STYLE PREMIUM */}
      <button 
        onClick={() => router.back()}
        className="mb-10 flex items-center text-slate-400 hover:text-blue-600 transition-all font-black group uppercase text-[10px] tracking-[0.3em]"
      >
        <span className="mr-3 bg-slate-100 p-3 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors italic text-sm">←</span> 
        Retour au catalogue
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* COLONNE GAUCHE : VISUELS (7/12) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative h-[600px] w-full rounded-[50px] overflow-hidden shadow-2xl border border-slate-50 bg-slate-100 group">
            <Image 
              src={listing.images_urls?.[activeImage] || 'https://via.placeholder.com/800x600?text=Pas+de+photo'} 
              alt={listing.title} 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-1000"
              priority
            />
            {/* BADGE TYPE SUR L'IMAGE */}
            <div className={`absolute top-8 left-8 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl backdrop-blur-md border border-white/20 ${
              listing.type === 'VENTE' ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white'
            }`}>
              {listing.type === 'VENTE' ? '📦 À Vendre' : '🔑 À Louer'}
            </div>
          </div>
          
          {/* MINIATURES GRID */}
          {listing.images_urls && listing.images_urls.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {listing.images_urls.map((url, index) => (
                <div 
                  key={index} 
                  onClick={() => setActiveImage(index)}
                  className={`relative h-28 w-28 shrink-0 rounded-[24px] overflow-hidden border-4 transition-all cursor-pointer shadow-sm ${activeImage === index ? 'border-blue-600 scale-95 shadow-blue-100' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'}`}
                >
                  <Image src={url} alt={`Photo ${index}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COLONNE DROITE : INFOS & CTA (5/12) */}
        <div className="lg:col-span-5 flex flex-col pt-4">
          <div className="mb-6 flex items-center gap-3">
            <span className="bg-blue-50 text-blue-600 px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
              {listing.category}
            </span>
            <span className="text-slate-200 font-bold">/</span>
            <span className="text-slate-400 font-black text-[9px] uppercase tracking-[0.2em]">Ref: {listing.id.slice(0,6)}</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-[0.9] tracking-tighter uppercase italic">
            {listing.title}
          </h1>

          <div className="flex items-center text-blue-600 font-black mb-10 uppercase tracking-[0.1em] text-sm italic">
             <span className="mr-3 text-2xl bg-blue-50 p-2 rounded-xl">📍</span>
             {listing.district}, {listing.city}
          </div>

          {/* BOX PRIX USD */}
          <div className="mb-10 p-10 bg-slate-900 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
            <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4 italic">Offre exclusive</p>
            <div className="flex items-baseline gap-3">
              <span className="text-6xl font-black tracking-tighter">
                {listing.price.toLocaleString()}
              </span>
              <span className="text-xl font-black text-blue-500 underline decoration-4 underline-offset-8 uppercase">USD</span>
              {listing.type === 'LOCATION' && <span className="text-slate-400 font-bold text-sm ml-2">/ mois</span>}
            </div>
            {/* Element deco */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-600 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
          </div>

          {/* DESCRIPTION */}
          <div className="mb-10">
            <h2 className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-[0.3em] border-b border-slate-100 pb-4">Atouts du bien</h2>
            <p className="text-slate-600 leading-relaxed text-xl font-medium whitespace-pre-line italic">
              « {listing.description} »
            </p>
          </div>

          {/* CARTE DE LOCALISATION */}
          <div className="mb-12">
            <h2 className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-[0.3em] border-b border-slate-100 pb-4">Position sur la carte</h2>
            <div className="rounded-[40px] overflow-hidden shadow-xl border border-slate-100">
              <PropertyMap 
                lat={listing.latitude || -4.3224} 
                lng={listing.longitude || 15.3070} 
                title={listing.title} 
              />
            </div>
          </div>

          {/* BOUTONS D'ACTION FIXES SUR MOBILE / FLOOTTANTS SUR DESKTOP */}
          <div className="space-y-4">
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] text-white py-8 rounded-[32px] font-black hover:bg-black shadow-2xl shadow-green-200 transition-all flex items-center justify-center gap-4 text-xs uppercase tracking-[0.3em] active:scale-95"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-2.32 0-4.519.903-6.16 2.544-3.4 3.4-3.4 8.92 0 12.317 1.055 1.055 2.348 1.787 3.738 2.126l.764.187V24l3.354-2.012h.304c4.799 0 8.703-3.904 8.703-8.703s-3.904-8.703-8.703-8.703zm5.021 12.106c-.208.583-1.026 1.07-1.42 1.135-.353.058-.809.112-2.316-.487-1.928-.766-3.15-2.73-3.246-2.859-.096-.129-.785-.944-.785-1.799 0-.855.449-1.275.609-1.45.16-.175.353-.219.469-.219s.233.003.334.009c.109.006.256-.041.402.31.161.385.55 1.341.597 1.438.047.096.078.208.015.334-.063.126-.094.208-.187.316-.093.109-.196.243-.28.327-.093.093-.19.196-.082.383.109.187.483.797 1.037 1.288.713.633 1.314.829 1.499.923.186.094.293.079.401-.044.108-.123.467-.542.591-.726.124-.184.249-.155.42-.091.171.063 1.082.51 1.269.604.187.093.31.14.356.219.047.079.047.458-.161 1.041z"/></svg>
              Contacter sur WhatsApp
            </a>
            
            <a 
              href={`mailto:${MON_EMAIL}?subject=Annonce IMMO-CI: ${listing.title}`}
              className="w-full text-slate-400 py-4 rounded-[24px] font-black hover:text-blue-600 transition-all flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.4em]"
            >
              Envoyer un email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}