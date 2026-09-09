'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import PropertyCard from '@/lib/components/PropertyCard';
import Link from 'next/link';

interface Listing {
  id: string;
  title: string;
  price: number;
  type: 'LOCATION' | 'VENTE';
  city: string;
  district: string;
  images_urls: string[];
  category: string;
  created_at: string;
}

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [districts, setDistricts] = useState<{ name: string }[]>([]); // Pour le filtre dynamique
  const [loading, setLoading] = useState(true);
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('tous'); // Nouveau filtre
  const [typeFilter, setTypeFilter] = useState<'TOUS' | 'LOCATION' | 'VENTE'>('TOUS');
  const [categoryFilter, setCategoryFilter] = useState('tous');
  const [priceMax, setPriceMax] = useState<string>('');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // 1. Récupérer les annonces
        const { data: listingsData, error: listingsError } = await supabase
          .from('listings')
          .select('*')
          .order('created_at', { ascending: false });

        if (listingsError) throw listingsError;
        setListings(listingsData || []);

        // 2. Récupérer les quartiers pour le filtre
        const { data: districtsData } = await supabase
          .from('districts')
          .select('name')
          .eq('is_active', true)
          .order('name', { ascending: true });
        
        if (districtsData) setDistricts(districtsData);

      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Logique de filtrage dynamique améliorée
  const filteredListings = listings.filter(l => {
    const matchSearch = 
      l.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.district?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchDistrict = districtFilter === 'tous' || l.district === districtFilter;
    const matchType = typeFilter === 'TOUS' || l.type === typeFilter;
    const matchCategory = categoryFilter === 'tous' || l.category === categoryFilter;
    const matchPrice = priceMax === '' || l.price <= parseFloat(priceMax);
    
    return matchSearch && matchDistrict && matchType && matchCategory && matchPrice;
  });

  return (
    <main className="min-h-screen bg-slate-50 font-sans">
      {/* Barre de navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-black text-slate-900 tracking-tighter italic uppercase">
            IMMO<span className="text-blue-600">ADMIN</span>
          </Link>
          <div className="flex gap-2 md:gap-4 items-center">
            <Link href="/favoris" className="text-slate-600 hover:text-red-500 p-2 transition-colors" title="Mes favoris">❤️</Link>
            <Link href="/my-listings" className="hidden md:block text-slate-600 font-bold py-2 px-4 hover:text-blue-600 transition-colors text-sm uppercase tracking-widest">Mes annonces</Link>
            <Link 
              href="/deposer" 
              className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-blue-100"
            >
              + Publier
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero & Filtres Avancés */}
      <section className="bg-slate-900 py-20 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-10 tracking-tighter leading-[0.9] uppercase italic">
            L&apos;immobilier <br/><span className="text-blue-500">à Kinshasa</span> sans stress.
          </h1>
          
          <div className="inline-flex bg-white/5 p-2 rounded-[2rem] mb-8 backdrop-blur-xl border border-white/10">
            {['TOUS', 'LOCATION', 'VENTE'].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type as any)}
                className={`px-8 py-3 rounded-[1.5rem] font-black text-[10px] tracking-widest uppercase transition-all ${
                  typeFilter === type ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                }`}
              >
                {type === 'TOUS' ? 'Tout voir' : type === 'LOCATION' ? 'Louer' : 'Acheter'}
              </button>
            ))}
          </div>

          {/* BARRE DE RECHERCHE ULTRA-COMPLÈTE */}
          <div className="bg-white p-4 rounded-[3rem] shadow-2xl flex flex-col lg:flex-row gap-4 items-center border border-white">
            
            {/* Filtre Quartier (Dynamique) */}
            <div className="flex-1 flex items-center w-full px-6 bg-slate-50 lg:bg-transparent rounded-2xl lg:rounded-none">
              <span className="text-xl mr-3">📍</span>
              <select 
                className="w-full p-4 bg-transparent outline-none text-slate-900 font-bold text-sm appearance-none cursor-pointer"
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
              >
                <option value="tous">Tout Kinshasa</option>
                {districts.map((d) => (
                  <option key={d.name} value={d.name}>{d.name.toUpperCase()}</option>
                ))}
              </select>
            </div>
            
            <div className="h-10 w-[1px] bg-slate-100 hidden lg:block"></div>

            {/* Filtre Catégorie */}
            <div className="w-full lg:w-auto flex items-center px-6">
              <select 
                className="w-full lg:w-auto p-4 bg-slate-50 lg:bg-transparent rounded-2xl outline-none font-black text-slate-700 uppercase text-[10px] tracking-widest cursor-pointer appearance-none"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="tous">Catégories</option>
                <option value="appartement">Appartements</option>
                <option value="studio">Studios</option>
                <option value="villa">Villas</option>
                <option value="terrain">Terrains</option>
              </select>
            </div>

            <div className="h-10 w-[1px] bg-slate-100 hidden lg:block"></div>

            {/* Filtre Prix */}
            <div className="flex items-center w-full lg:w-56 px-6 bg-slate-50 lg:bg-transparent rounded-2xl lg:rounded-none relative">
              <span className="font-black text-slate-400 mr-2 text-[10px] uppercase tracking-tighter">Budget Max:</span>
              <input 
                type="number" 
                placeholder="USD" 
                className="w-full p-4 lg:p-3 bg-transparent outline-none text-blue-600 font-black text-lg placeholder:text-blue-200"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
      </section>

      {/* Résultats */}
      <div className="max-w-7xl mx-auto p-6 md:p-12 -mt-12 relative z-20">
        <div className="flex justify-between items-center mb-10">
           <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">
            {filteredListings.length} Biens disponibles
           </h2>
           <div className="h-[1px] flex-1 bg-slate-200 ml-8 hidden md:block opacity-30"></div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-[450px] bg-slate-200 animate-pulse rounded-[40px]"></div>
            ))}
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredListings.map((item) => (
              <PropertyCard key={item.id} listing={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[4rem] border border-slate-100 shadow-xl">
            <div className="text-7xl mb-8 text-slate-200">🏜️</div>
            <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Aucun résultat</h3>
            <p className="text-slate-400 mt-4 font-bold uppercase text-[10px] tracking-widest">Essayez d&apos;élargir votre recherche ou de changer de quartier.</p>
            <button 
              onClick={() => {setSearchTerm(''); setTypeFilter('TOUS'); setCategoryFilter('tous'); setPriceMax(''); setDistrictFilter('tous');}}
              className="mt-10 bg-blue-600 text-white px-10 py-5 rounded-[24px] font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl hover:bg-slate-900 transition-all"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      <footer className="py-20 text-center opacity-30">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-900">IMMO-ADMIN — Kinshasa 2026</p>
      </footer>
    </main>
  );
}