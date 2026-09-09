'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface SearchProps {
  onSearch: (filters: any) => void;
}

export default function SearchBar({ onSearch }: SearchProps) {
  const [districts, setDistricts] = useState<{name: string}[]>([]);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    district: ''
  });

  // On récupère les quartiers pour le filtre
  useEffect(() => {
    async function getDistricts() {
      const { data } = await supabase
        .from('districts')
        .select('name')
        .order('name', { ascending: true });
      if (data) setDistricts(data);
    }
    getDistricts();
  }, []);

  const handleSearch = () => {
    onSearch(filters);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white/80 backdrop-blur-xl p-4 rounded-[32px] shadow-2xl border border-white flex flex-col md:flex-row gap-4 items-center">
      
      {/* Filtre Type */}
      <div className="w-full md:flex-1 space-y-1 px-4">
        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Contrat</label>
        <select 
          className="w-full bg-transparent font-bold text-slate-900 outline-none cursor-pointer appearance-none text-sm"
          onChange={(e) => setFilters({...filters, type: e.target.value})}
        >
          <option value="">Tous les types</option>
          <option value="LOCATION">À Louer</option>
          <option value="VENTE">À Vendre</option>
        </select>
      </div>

      <div className="hidden md:block w-px h-8 bg-slate-100"></div>

      {/* Filtre Quartier Dynamique */}
      <div className="w-full md:flex-1 space-y-1 px-4">
        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Quartier</label>
        <select 
          className="w-full bg-transparent font-bold text-slate-900 outline-none cursor-pointer appearance-none text-sm"
          onChange={(e) => setFilters({...filters, district: e.target.value})}
        >
          <option value="">Tout Kinshasa</option>
          {districts.map((d, i) => (
            <option key={i} value={d.name}>{d.name}</option>
          ))}
        </select>
      </div>

      <div className="hidden md:block w-px h-8 bg-slate-100"></div>

      {/* Filtre Catégorie */}
      <div className="w-full md:flex-1 space-y-1 px-4">
        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Bien</label>
        <select 
          className="w-full bg-transparent font-bold text-slate-900 outline-none cursor-pointer appearance-none text-sm"
          onChange={(e) => setFilters({...filters, category: e.target.value})}
        >
          <option value="">Catégories</option>
          <option value="appartement">Appartement</option>
          <option value="villa">Villa</option>
          <option value="studio">Studio</option>
          <option value="terrain">Terrain</option>
        </select>
      </div>

      {/* Bouton de recherche */}
      <button 
        onClick={handleSearch}
        className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-200"
      >
        Rechercher
      </button>
    </div>
  );
}