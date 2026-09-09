                                                                            'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminDistricts() {
  const [districts, setDistricts] = useState<{id: string, name: string}[]>([]);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDistricts();
  }, []);

  async function fetchDistricts() {
    const { data } = await supabase.from('districts').select('*').order('name');
    if (data) setDistricts(data);
  }

  async function addDistrict(e: React.FormEvent) {
    e.preventDefault();
    if (!newName) return;
    setLoading(true);

    const { error } = await supabase.from('districts').insert([{ name: newName }]);
    
    if (error) {
      alert("Erreur : Ce quartier existe peut-être déjà.");
    } else {
      setNewName('');
      fetchDistricts();
    }
    setLoading(false);
  }

  async function deleteDistrict(id: string) {
    if (confirm("Supprimer ce quartier ? Cela n'affectera pas les annonces existantes.")) {
      await supabase.from('districts').delete().eq('id', id);
      fetchDistricts();
    }
  }

  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic">
          Zones <span className="text-blue-600">&</span> Quartiers
        </h1>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">
          Gérez les localisations disponibles pour les annonces
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FORMULAIRE D'AJOUT */}
        <div className="lg:col-span-1">
          <form onSubmit={addDistrict} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 sticky top-8">
            <h3 className="font-black text-slate-900 uppercase italic mb-6">Ajouter un quartier</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Nom du quartier</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: Ma Campagne"
                  className="w-full mt-1 p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {loading ? 'Enregistrement...' : 'Enregistrer la zone'}
              </button>
            </div>
          </form>
        </div>

        {/* LISTE DES QUARTIERS */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Liste des zones actives à Kinshasa</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:gap-px bg-slate-50">
              {districts.map((d) => (
                <div key={d.id} className="bg-white p-6 flex justify-between items-center group">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    <span className="font-bold text-slate-700 uppercase text-xs tracking-tight">{d.name}</span>
                  </div>
                  <button 
                    onClick={() => deleteDistrict(d.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}