'use client';

import { useState } from 'react';
import { useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AddListingForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      // Vérification de l'utilisateur
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) throw new Error("Vous devez être connecté pour publier.");

      const imageUrls: string[] = [];

      // 1. Upload des images
      for (const file of images) {
        // On crée un nom de fichier unique et propre
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${userData.user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('listings-images')
          .from('listing-images')
          .upload(filePath, file);

        if (uploadError) {
          console.error("Erreur upload:", uploadError.message);
          continue; // On passe à l'image suivante si une échoue
        }

        const { data } = supabase.storage.from('listings-images').getPublicUrl(filePath);
        const { data } = supabase.storage.from('listing-images').getPublicUrl(filePath);
        imageUrls.push(data.publicUrl);
      }

      // 2. Insertion en base de données
      const { error: insertError } = await supabase.from('listings').insert({
        title: formData.get('title') as string,
        price: parseInt(formData.get('price') as string),
        price: parseFloat(formData.get('price') as string),
        city: formData.get('city') as string,
        category: formData.get('category') as string,
        description: formData.get('description') as string,
        images_urls: imageUrls,
        owner_id: userData.user.id,
      });

      if (insertError) throw insertError;
      
      alert("Félicitations ! Votre annonce est en ligne.");
      router.push('/');
      router.refresh(); // Pour forcer la mise à jour de la liste
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Une erreur est survenue.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... reste de ton JSX (inchangé car il est déjà très bon)
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-8 bg-white rounded-[40px] shadow-2xl space-y-6">
      {/* Ton code HTML actuel */}
    </form>
  );
}