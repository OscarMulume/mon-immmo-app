'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Import du type depuis votre fichier database.types.ts
import { Database } from '@/lib/database.types';

// On définit le type d'une ligne de la table listings pour TypeScript
type Listing = Database['public']['Tables']['listings']['Row'];

export default function Dashboard() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    fetchUserListings();
  }, []);

  async function fetchUserListings() {
    try {
      setLoading(true);
      
      // Récupération de l'utilisateur
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Récupération des annonces de cet utilisateur uniquement
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setListings(data);
      
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Erreur de chargement";
      console.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function deleteListing(id: string) {
    if (!confirm("Voulez-vous vraiment supprimer cette annonce ?")) return;

    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);

    if (error) {
      alert("Erreur lors de la suppression");
    } else {
      setListings(listings.filter(l => l.id !== id));
    }
  }

  if (loading) return <div className="p-10 text-center">Chargement de vos annonces...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Mon Tableau de Bord</h1>
        <Link 
          href="/deposer" 
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          + Nouvelle annonce
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-300 text-center">
          <p className="text-gray-500">Vous n&apos;avez pas encore publié d&apos;annonce.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {listings.map((listing) => (
            <div key={listing.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              {/* Image miniature */}
              <div className="h-20 w-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {listing.images_urls && listing.images_urls.length > 0 ? (
                  <img src={listing.images_urls[0]} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-xs text-gray-400">Pas d&apos;image</div>
                )}
              </div>

              {/* Infos */}
              <div className="flex-grow">
                <h3 className="font-bold text-slate-800">{listing.title}</h3>
                <p className="text-sm text-gray-500">{listing.city}, {listing.district}</p>
                <p className="text-blue-600 font-bold mt-1">{listing.price.toLocaleString()} FCFA</p>
              </div>

              {/* Statut Badge */}
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  listing.status === 'published' ? 'bg-green-100 text-green-700' : 
                  listing.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>
                  {listing.status === 'published' ? 'En ligne' : 
                   listing.status === 'pending' ? 'En révision' : 'Refusée'}
                </span>
                
                <button 
                  onClick={() => deleteListing(listing.id)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}