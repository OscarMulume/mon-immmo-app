'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ListingCard from '@/lib/components/ListingCard';
import EditListingModal from '@/lib/components/EditListingModal';

interface Listing {
  id: string;
  title: string;
  price: number;
  currency: string;
  location: string;
  city: string;
  district: string;
  description: string;
  images_urls: string[];
  status: 'pending' | 'published';
  created_at: string;
}

export default function UnifiedListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'published'>('all');
  
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    fetchMyListings();
  }, []);

  async function fetchMyListings() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formatted = (data as any[]).map((item) => ({
          ...item,
          currency: item.currency || 'USD',
          location: item.location || `${item.city || ''} ${item.district || ''}`.trim(),
          images_urls: item.images_urls || []
        }));
        setListings(formatted);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("🚨 Voulez-vous vraiment supprimer cette annonce ?")) return;
    try {
      const { error } = await supabase.from('listings').delete().eq('id', id);
      if (error) throw error;
      setListings(prev => prev.filter(item => item.id !== id));
    } catch (error: any) {
      alert("Erreur : " + error.message);
    }
  };

  const handleUpdateList = (updatedItem: Listing) => {
    setListings(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    setIsEditModalOpen(false);
    setSelectedListing(null);
  };

  const filteredListings = listings.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  if (loading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">IMMO-CI Chargement...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50 font-sans pb-20">
      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-40 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* LIEN VERS PROFIL */}
          <Link href="/profil" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">
            ← Mon Profil
          </Link>
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            {['all', 'pending', 'published'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                  filter === f ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {f === 'all' ? 'Tous' : f === 'pending' ? 'Attente' : 'En Ligne'}
              </button>
            ))}
          </div>
          <Link href="/deposer" className="bg-slate-900 text-white px-5 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-600 transition-all">
            + Publier
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6 md:p-12">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Mon <span className="text-blue-600">Portefeuille</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-3">Gérez vos biens et annonces actives</p>
          <div className="h-1.5 w-16 bg-blue-600 mt-4 rounded-full"></div>
        </header>

        {filteredListings.length === 0 ? (
          <div className="bg-white rounded-[40px] p-20 text-center border border-slate-100 shadow-sm">
            <div className="text-4xl mb-6 text-slate-200">📂</div>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Aucune annonce trouvée ici.</p>
            <Link href="/deposer" className="inline-block mt-8 bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-100 hover:scale-105 transition-transform">
              Publier un nouveau bien
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredListings.map((item) => (
              <div key={item.id} className="relative group bg-white p-4 rounded-[32px] border border-slate-100 hover:shadow-2xl hover:shadow-slate-200 transition-all">
                <div className="absolute top-6 right-6 z-20 flex gap-2">
                  <button onClick={() => { setSelectedListing(item); setIsEditModalOpen(true); }} className="bg-white/95 backdrop-blur shadow-xl text-slate-900 p-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all transform hover:-rotate-6">✏️</button>
                  <button onClick={() => handleDelete(item.id)} className="bg-white/95 backdrop-blur shadow-xl text-red-500 p-3 rounded-xl hover:bg-red-500 hover:text-white transition-all transform hover:rotate-6">🗑️</button>
                </div>
                <div className={`absolute top-6 left-6 z-20 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest text-white shadow-lg ${item.status === 'pending' ? 'bg-amber-500 shadow-amber-200' : 'bg-green-500 shadow-green-200'}`}>
                  {item.status === 'pending' ? '⏳ Modération' : '✨ En Ligne'}
                </div>
                <ListingCard listing={item} />
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedListing && (
        <EditListingModal 
          listing={selectedListing}
          isOpen={isEditModalOpen}
          onClose={() => { setIsEditModalOpen(false); setSelectedListing(null); }}
          onUpdate={handleUpdateList}
        />
      )}
    </main>
  );
}