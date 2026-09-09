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

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Vous devez être connecté");

      // --- IMPORT DYNAMIQUE SÉCURISÉ ---
      const heicModule = await import("heic2any");
      // Certains bundles Next.js nécessitent de vérifier .default
      const heic2any = heicModule.default || heicModule;

      const publicUrls: string[] = [];

      for (let file of files) {
        let fileToUpload = file;

        // --- GESTION DU FORMAT HEIC (iPhone) ---
        if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
          try {
            // On convertit le fichier en Blob pur pour heic2any
            const blobData = new Blob([file], { type: file.type });
            
            const result = await heic2any({
              blob: blobData,
              toType: "image/jpeg",
              quality: 0.7,
            });

            const convertedBlob = Array.isArray(result) ? result[0] : result;
            
            fileToUpload = new File(
              [convertedBlob], 
              file.name.replace(/\.[^/.]+$/, ".jpg"), 
              { type: "image/jpeg" }
            );
          } catch (err) {
            console.error("Détails échec conversion HEIC:", err);
            // Si la conversion échoue, on garde le fichier original
            // (Supabase peut parfois gérer le HEIC selon la config du bucket)
            fileToUpload = file;
          }
        }

        // 2. Sécurité : Taille max 5 Mo
        if (fileToUpload.size > 5 * 1024 * 1024) {
          alert(`Fichier trop lourd : ${fileToUpload.name} (Max 5Mo)`);
          continue;
        }

        const fileExt = fileToUpload.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        // 4. Upload vers le bucket 'listing-images'
        const { error: uploadError } = await supabase.storage
          .from('listing-images')
          .upload(filePath, fileToUpload);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('listing-images')
          .getPublicUrl(filePath);

        publicUrls.push(data.publicUrl);
      }

      onUpload(publicUrls);
      
      if (publicUrls.length > 0) {
        alert(`${publicUrls.length} image(s) enregistrée(s) !`);
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue";
      alert("Erreur : " + errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8 border-2 border-dashed border-blue-200 rounded-[32px] bg-blue-50/30 text-center transition-all hover:border-blue-400 group">
      <label className="cursor-pointer block">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="text-3xl">📸</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-2">
            {uploading ? "Traitement en cours..." : "Ajouter des photos du bien"}
          </span>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest italic">
            iPhone (HEIC), JPG, PNG (Max 5Mo)
          </span>
        </div>
        <input
          type="file"
          multiple
          accept="image/*,.heic"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
      </label>
      
      {uploading && (
        <div className="mt-4 flex justify-center">
           <div className="w-20 h-1.5 bg-blue-100 rounded-full overflow-hidden relative">
              <div className="absolute inset-0 bg-blue-600 animate-pulse"></div>
           </div>
        </div>
      )}
    </div>
  );
}