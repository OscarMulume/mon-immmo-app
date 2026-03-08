'use client'; 
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Database } from '@/lib/database.types'; // 1. Importer les types

// Interface pour ton formulaire local
interface ListingForm {
  title: string;
  price: string;
  category: string;
  city: string;
  district: string;
  description: string;
  images: string[];
}

// 2. Définir un type pour l'insertion basé sur le schéma de la base de données
type ListingInsert = Database['public']['Tables']['listings']['Insert'];

export default function DeposerAnnonce() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<ListingForm>({
    title: '',
    price: '',
    category: 'appartement',
    city: '',
    district: '',
    description: '',
    images: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const priceValue = parseFloat(formData.price);
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        alert("Erreur : Vous devez être connecté.");
        setLoading(false);
        return;
      }

      // 1. Préparation des données dans un objet simple
      const dataToInsert: ListingInsert = { // 3. Typer l'objet à insérer
        title: formData.title,
        price: priceValue,
        category: formData.category,
        city: formData.city,
        district: formData.district,
        description: formData.description,
        status: 'pending',
        owner_id: user.id,
        images: [], 
        latitude: 5.34,
        longitude: -4.02
      };

      // 4. L'assertion `as any` n'est plus nécessaire !
      const { error } = await supabase
        .from('listings')
        .insert([dataToInsert]);

      if (error) throw error;

      alert("Annonce envoyée ! Elle est en attente de modération.");
      router.push('/');
      
    } catch (error: unknown) {
      // 3. CORRECTION : Typage de l'erreur pour ESLint
      if (error instanceof Error) {
        alert(`Erreur : ${error.message}`);
      } else {
        alert("Une erreur inconnue est survenue");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-xl rounded-3xl mt-10">
      <div className="mb-8 text-center">
        <p className="text-sm font-bold text-blue-600 mb-2">Étape {step} sur 3</p>
        <div className="w-full bg-gray-100 h-2 rounded-full">
           <div className="bg-blue-600 h-full transition-all duration-500" style={{ width: `${(step/3)*100}%` }}></div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold">L&apos;essentiel du bien</h2>
          {/* Ici, tu peux remettre tes champs inputs selon le step */}
          
          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={loading} 
              className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50"
            >
                {loading ? "Chargement..." : "Publier"}
            </button>
          </div>
      </form>
    </div>
  );
}