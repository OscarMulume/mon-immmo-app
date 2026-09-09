'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AddListingForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) throw new Error("Vous devez être connecté pour publier.");

      const imageUrls: string[] = [];

      // 1. Upload des images
      for (const file of images) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${userData.user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('listings-images')
          .upload(filePath, file);

        if (!uploadError) {
          const { data } = supabase.storage.from('listings-images').getPublicUrl(filePath);
          imageUrls.push(data.publicUrl);
        }
      }

      // 2. Insertion en base de données
      const { error: insertError } = await supabase.from('listings').insert({
        title: formData.get('title') as string,
        price: parseInt(formData.get('price') as string),
        city: formData.get('city') as string,
        category: formData.get('category') as string,
        description: formData.get('description') as string,
        images_urls: imageUrls,
        owner_id: userData.user.id,
      });

      if (insertError) throw insertError;
      
      alert("Félicitations ! Votre annonce est en ligne.");
      router.push('/');
      router.refresh();
    } catch (error: any) {
      alert(error.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-6">
      <div className="space-y-4">
        <input name="title" placeholder="Titre de l'annonce" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900" required />
        
        <div className="grid grid-cols-2 gap-4">
          <input name="price" type="number" placeholder="Prix (FCFA)" className="p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900" required />
          <select name="category" className="p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900">
            <option value="appartement">Appartement</option>
            <option value="villa">Villa</option>
            <option value="studio">Studio</option>
            <option value="terrain">Terrain</option>
          </select>
        </div>

        <input name="city" placeholder="Ville (ex: Abidjan, Cocody)" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900" required />
        
        <textarea name="description" placeholder="Description détaillée..." rows={4} className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900" required />

        <div className="p-4 border-2 border-dashed border-gray-200 rounded-2xl text-center">
          <label className="cursor-pointer font-bold text-blue-600 block">
            📸 Cliquez pour ajouter des photos
            <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => setImages(Array.from(e.target.files || []))} />
          </label>
          <p className="text-xs text-gray-400 mt-1">{images.length} photo(s) sélectionnée(s)</p>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-xl hover:bg-blue-600 transition-all disabled:bg-gray-400"
      >
        {loading ? "Publication en cours..." : "Publier maintenant"}
      </button>
    </form>
  );
} // <--- Cette accolade fermante à la ligne 83 règle ton erreur !