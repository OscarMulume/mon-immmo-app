'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
// On pointe vers ton composant dans lib/components
import ListingCard from '@/lib/components/ListingCard';
import Link from 'next/link';

// AJOUT DE L'INTERFACE : Cela règle l'erreur rouge sur "any"
interface Listing {
  id: string;
  title: string;
  price: number;
  city: string;
  district: string;
  images: string[];
  category: string;
  created_at: string;
}

export default function Home() {
  // Utilisation de l'interface Listing[] au lieu de any[]
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      try {
        setLoading(true);
        // Récupération des annonces dans Supabase
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        // On force le type ici pour confirmer à TS que les données sont valides
        setListings((data as Listing[]) || []);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Barre de navigation simple */}
      <nav className="bg-white border-b border-slate-200 p-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h2 className="text-xl font-bold text-blue-600 tracking-tight">MonImmo App</h2>
          <Link 
            href="/deposer" 
            className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition-all hover:shadow-md"
          >
            + Déposer une annonce
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 md:p-12">
        {/* En-tête */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Découvrez nos biens
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Les meilleures opportunités immobilières en un clic.
          </p>
        </div>

        {/* Grille de résultats */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-[400px] bg-slate-200 animate-pulse rounded-[2.5rem]"></div>
            ))}
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-bold text-slate-800">Aucune annonce trouvée</h3>
            <p className="text-gray-400 mt-2">Soyez le premier à publier une annonce !</p>
          </div>
        )}
      </div>
    </main>
  );
}