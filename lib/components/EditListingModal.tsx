'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface EditListingModalProps {
  listing: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedListing: any) => void;
}

export default function EditListingModal({ listing, isOpen, onClose, onUpdate }: EditListingModalProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: listing.title,
    price: listing.price,
    description: listing.description,
    district: listing.district,
    images_urls: listing.images_urls || []
  });

  if (!isOpen) return null;

  // --- GESTION DES PHOTOS ---
  
  // Supprimer une photo de la liste locale
  const removeImage = (urlToRemove: string) => {
    setFormData({
      ...formData,
      images_urls: formData.images_urls.filter((url: string) => url !== urlToRemove)
    });
  };

  // Uploader de nouvelles photos vers Supabase Storage
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const newUrls = [...formData.images_urls];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `listings/${fileName}`; // Assurez-vous que le dossier existe dans votre bucket

        const { error: uploadError } = await supabase.storage
          .from('listings-images') // Remplacez par le nom EXACT de votre bucket Supabase
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('listings-images').getPublicUrl(filePath);
        newUrls.push(data.publicUrl);
      }

      setFormData({ ...formData, images_urls: newUrls });
    } catch (error: any) {
      alert("Erreur lors de l'envoi des images : " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // --- SAUVEGARDE FINALE ---

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('listings')
        .update({
          title: formData.title,
          price: parseFloat(formData.price.toString()),
          description: formData.description,
          district: formData.district,
          images_urls: formData.images_urls // On enregistre la nouvelle liste d'URLs
        } as any)
        .eq('id', listing.id);

      if (error) throw error;

      onUpdate({ ...listing, ...formData });
      onClose();
    } catch (error: any) {
      alert("Erreur lors de la mise à jour : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[40px] p-8 shadow-2xl scale-in-center overflow-y-auto max-h-[95vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Modifier <br/><span className="text-blue-600">l&apos;annonce</span></h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 font-bold text-xl">✕</button>
        </div>

        <div className="space-y-4">
          {/* Section Photos */}
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2 block mb-2">Photos de l'annonce</label>
            <div className="grid grid-cols-3 gap-2">
              {formData.images_urls.map((url: string, index: number) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-100">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => removeImage(url)}
                    className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[8px] font-black uppercase"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all">
                <span className="text-lg">{uploading ? '⏳' : '📸'}</span>
                <span className="text-[7px] font-black uppercase mt-1">{uploading ? 'Envoi...' : 'Ajouter'}</span>
                <input type="file" multiple onChange={handlePhotoUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Titre du bien</label>
            <input 
              className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Prix (USD)</label>
              <input 
                type="number"
                className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Quartier</label>
              <input 
                className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                value={formData.district}
                onChange={(e) => setFormData({...formData, district: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Description</label>
            <textarea 
              className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-medium h-24 resize-none"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button 
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
          >
            Annuler
          </button>
          <button 
            onClick={handleSave}
            disabled={loading || uploading}
            className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-100 disabled:opacity-50"
          >
            {loading ? 'Enregistrement...' : 'Sauvegarder'}
          </button>
        </div>
      </div>
    </div>
  );
}