'use client';

interface FilterProps {
  onFilterChange: (filters: any) => void;
}

export default function FilterBar({ onFilterChange }: FilterProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 mb-10">
      <div className="bg-white p-4 rounded-[32px] shadow-xl border border-gray-50 flex flex-wrap gap-4 items-center">
        
        {/* Filtre Ville */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-gray-400 ml-4 mb-1 uppercase">Localisation</label>
          <input 
            type="text" 
            placeholder="Où cherchez-vous ?" 
            className="w-full bg-gray-50 border-none rounded-2xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            onChange={(e) => onFilterChange({ city: e.target.value })}
          />
        </div>

        {/* Filtre Catégorie */}
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-bold text-gray-400 ml-4 mb-1 uppercase">Type de bien</label>
          <select 
            className="w-full bg-gray-50 border-none rounded-2xl p-3 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
            onChange={(e) => onFilterChange({ category: e.target.value })}
          >
            <option value="">Tous les types</option>
            <option value="appartement">Appartement</option>
            <option value="studio">Studio</option>
            <option value="villa">Villa</option>
            <option value="terrain">Terrain</option>
          </select>
        </div>

        {/* Filtre Prix Max */}
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-bold text-gray-400 ml-4 mb-1 uppercase">Budget Max</label>
          <input 
            type="number" 
            placeholder="Ex: 500 000" 
            className="w-full bg-gray-50 border-none rounded-2xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
          />
        </div>

        <button className="bg-blue-600 text-white h-14 px-8 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95">
          Rechercher
        </button>
      </div>
    </div>
  );
}