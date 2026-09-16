'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ListingCard from '@/lib/components/ListingCard';
import Link from 'next/link';

interface Listing {
  id: string;
  title: string;
  price: number;
  currency: string;
  city: string;
  district: string;
  images: string[];
  category: string;
}

export default function FavorisPage() {
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavorites() {
      setLoading(true);
      // 1. Récupérer les IDs stockés dans le navigateur
      const storedIds = JSON.parse(localStorage.getItem('favorites') || '[]');

      if (storedIds.length === 0) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      // 2. Récupérer les données depuis Supabase pour ces IDs uniquement
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .in('id', storedIds); // Filtre pour ne prendre que les favoris

        if (error) throw error;

        // Formater les images pour le composant ListingCard
        const formatted = (data as any[] || []).map(item => ({
          ...item,
          currency: item.currency || 'FCFA',
          images: item.images_urls || item.images || []
        }));

        setFavorites(formatted);
      } catch (err) {
        console.error("Erreur lors de la récupération des favoris:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Navigation simplifiée */}
      <nav className="bg-white border-b border-slate-100 p-6">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/" className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all">
            ⬅️
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
            Mes Coups de <span className="text-red-500">Cœur</span>
          </h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 md:p-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 bg-slate-200 animate-pulse rounded-[2.5rem]"></div>
            ))}
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="text-6xl mb-6">❤️</div>
            <h3 className="text-2xl font-black text-slate-800 uppercase">Aucun favori pour l'instant</h3>
            <p className="text-slate-400 mt-2 font-medium">Parcourez les annonces et cliquez sur le cœur pour les retrouver ici.</p>
            <Link href="/">
              <button className="mt-8 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-900 transition-all shadow-xl">
                Explorer les biens
              </button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}