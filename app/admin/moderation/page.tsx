'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default function ModerationPage() {
  const [pendingListings, setPendingListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  async function fetchPending() {
    setLoading(true);
    const { data } = await supabase
      .from('listings')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    setPendingListings(data || []);
    setLoading(false);
  }

  async function updateStatus(id: string, newStatus: 'published' | 'rejected') {
    const { error } = await supabase
      .from('listings')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      // Rafraîchir la liste localement
      setPendingListings(pendingListings.filter(item => item.id !== id));
      alert(`Annonce ${newStatus === 'published' ? 'validée' : 'rejetée'} avec succès !`);
    }
  }

  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic">Modération</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">
            {pendingListings.length} annonces en attente de vérification
          </p>
        </div>
        <button 
          onClick={fetchPending}
          className="p-3 bg-white rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
        >
          🔄 Actualiser
        </button>
      </header>

      {loading ? (
        <div className="py-20 text-center animate-pulse font-black uppercase text-slate-300 tracking-widest">Chargement des dossiers...</div>
      ) : pendingListings.length === 0 ? (
        <div className="bg-white rounded-[40px] p-20 text-center border border-dashed border-slate-200">
          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest text-center">Toutes les annonces ont été traitées. Bon travail Oscar !</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {pendingListings.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-[35px] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-all">
              {/* Mini-aperçu image */}
              <div className="w-full md:w-48 h-32 bg-slate-100 rounded-2xl overflow-hidden relative">
                {item.images_urls?.[0] ? (
                  <img src={item.images_urls[0]} alt="" className="object-cover w-full h-full" />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-300">Pas d'image</div>
                )}
              </div>

              {/* Infos */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                   <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-widest">{item.type}</span>
                   <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-widest">{item.category}</span>
                </div>
                <h3 className="font-black text-slate-900 text-xl tracking-tight">{item.title}</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wide">{item.district} — {item.price} USD</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => updateStatus(item.id, 'rejected')}
                  className="px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all"
                >
                  ❌ Rejeter
                </button>
                <button 
                  onClick={() => updateStatus(item.id, 'published')}
                  className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-slate-900 transition-all"
                >
                  ✅ Approuver
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}