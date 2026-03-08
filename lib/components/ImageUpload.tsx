'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ImageUploadProps {
  onUpload: (urls: string[]) => void;
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      // 1. Vérification de l'utilisateur pour le dossier sécurisé
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Vous devez être connecté");

      const publicUrls: string[] = [];

      for (const file of files) {
        // 2. Sécurité : Taille max 2 Mo
        if (file.size > 2 * 1024 * 1024) {
          alert(`Fichier trop lourd : ${file.name} (Max 2Mo)`);
          continue;
        }

        // 3. Sécurité : Type de fichier
        if (!file.type.startsWith('image/')) {
          alert(`Format non supporté : ${file.name}`);
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        // Organisation par dossier : user_id/nom_du_fichier
        const filePath = `${user.id}/${fileName}`;

        // 4. Upload vers le bucket 'listing-images'
        const { error: uploadError } = await supabase.storage
          .from('listing-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 5. Récupération de l'URL publique
        const { data } = supabase.storage
          .from('listing-images')
          .getPublicUrl(filePath);

        publicUrls.push(data.publicUrl);
      }

      onUpload(publicUrls);
      alert(`${publicUrls.length} image(s) prête(s) !`);
   } catch (error) {
  // On vérifie si l'objet est bien une instance d'Error
  const errorMessage = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
  
  alert("Erreur : " + errorMessage); // Ici, errorMessage est une string, donc plus de soulignement !
} finally {
  setUploading(false);
}
  };

  return (
    <div className="p-6 border-2 border-dashed border-blue-100 rounded-2xl bg-blue-50/30 text-center">
      <label className="cursor-pointer group">
        <div className="flex flex-col items-center">
          <span className="text-3xl mb-2">📸</span>
          <span className="text-sm font-semibold text-blue-600 group-hover:text-blue-800">
            {uploading ? "Envoi en cours..." : "Cliquez pour ajouter des photos"}
          </span>
          <span className="text-xs text-gray-400 mt-1">JPG, PNG (Max 2Mo par image)</span>
        </div>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
      </label>
    </div>
  );
}