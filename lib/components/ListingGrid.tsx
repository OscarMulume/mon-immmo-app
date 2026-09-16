'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ListingCard from './ListingCard';
import FilterBar from './FilterBar'; // Assure-toi que ce fichier est créé

// Interface pour sécuriser TypeScript
interface ListingData {
  id: string;
  title: string;
  price: number;
  currency: string;
  city: string;
  district: string;
  images_urls: string[];
  images: string[];
  category: string;
  created_at: string;
}

export default function ListingGrid() {
  const [listings, setListings] = useState<ListingData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // État pour stocker les critères de recherche
  const [filters, setFilters] = useState({ 
    city: '', 
    category: '', 
    maxPrice: '' 
  });

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      try {
        // Initialisation de la requête de base
        let query = supabase.from('listings').select('*');

        // --- Application des filtres dynamiques ---
        
        // Filtre par ville (insensible à la casse)
        if (filters.city) {
          query = query.ilike('city', `%${filters.city}%`);
        }
        
        // Filtre par catégorie exacte
        if (filters.category) {
          query = query.eq('category', filters.category);
        }
        
        // Filtre par prix maximum (inférieur ou égal)
        if (filters.maxPrice) {
          const priceNum = parseInt(filters.maxPrice);
          if (!isNaN(priceNum)) {
            query = query.lte('price', priceNum);
          }
        }

        // Tri par date de création
        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;

        // Transformation des données pour ListingCard
        const formattedData = (data as unknown as ListingData[] || []).map((item) => ({
          ...item,
          currency: item.currency || 'FCFA',
          images: item.images_urls
        }));

        setListings(formattedData);
      } catch (error) {
        console.error('Erreur lors de la récupération des annonces:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, [filters]); // Le useEffect se relance dès qu'un filtre change

  return (
    <>
      {/* Barre de filtres qui met à jour l'état local */}
      <FilterBar 
        onFilterChange={(newFilters) => setFilters({ ...filters, ...newFilters })} 
      />

      <div className="max-w-7xl mx-auto p-6">
        {loading ? (
          // État de chargement (Squelette)
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-80 bg-gray-100 animate-pulse rounded-[32px]"></div>
            ))}
          </div>
        ) : (
          <>
            {/* Grille des résultats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {listings.map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>

            {/* Message si aucun résultat */}
            {listings.length === 0 && (
              <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                <p className="text-gray-500 text-xl font-medium">
                  Désolé, aucune annonce ne correspond à vos critères.
                </p>
                <button 
                  onClick={() => setFilters({ city: '', category: '', maxPrice: '' })}
                  className="mt-4 text-blue-600 font-bold hover:underline"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}