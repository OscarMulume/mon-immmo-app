'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditAdPage() {
  const { id } = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    location: '',
    description: ''
  });

  // 1. Charger l'annonce et l'image actuelle
  useEffect(() => {
    async function fetchAd() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('annonces')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id) // Sécurité supplémentaire : vérifier l'auteur
        .single();

      if (error || !data) {
        router.push('/mes-annonces');
        return;
      }

      setFormData({
        title: data.title,
        price: data.price.toString(),
        location: data.location,
        description: data.description || ''
      });
      setCurrentImageUrl(data.image_url);
      setLoading(false);
    }
    fetchAd();
  }, [id, router]);

  // 2. Gérer la mise à jour (Texte + Image)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setStatus({ type: '', text: '' });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté.");

      let finalImageUrl = currentImageUrl;

      // SI UNE NOUVELLE IMAGE EST SÉLECTIONNÉE
      if (newFile) {
        // a. Supprimer l'ancienne image du Storage (si elle existe)
        if (currentImageUrl) {
          const oldPath = currentImageUrl.split('public/annonces/')[1];
          if (oldPath) {
            await supabase.storage.from('annonces').remove([oldPath]);
          }
        }

        // b. Uploader la nouvelle image
        const fileExt = newFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('annonces')
          .upload(filePath, newFile);

        if (uploadError) throw uploadError;

        // c. Récupérer la nouvelle URL publique
        const { data: { publicUrl } } = supabase.storage
          .from('annonces')
          .getPublicUrl(filePath);
        
        finalImageUrl = publicUrl;
      }

      // 3. Mettre à jour la table 'annonces'
      const { error: updateError } = await supabase
        .from('annonces')
        .update({
          title: formData.title,
          price: parseFloat(formData.price),
          location: formData.location,
          description: formData.description,
          image_url: finalImageUrl // Nouvelle ou ancienne URL
        })
        .eq('id', id);

      if (updateError) throw updateError;

      setStatus({ type: 'success', text: 'Annonce mise à jour avec succès !' });
      setTimeout(() => router.push('/mes-annonces'), 1500);

    } catch (error: any) {
      console.error(error);
      setStatus({ type: 'error', text: error.message || "Erreur lors de la mise à jour." });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-black animate-pulse text-slate-300">CHARGEMENT...</div>;

  return (
    <main className="min-h-screen bg-white p-6 md:p-12 font-sans relative overflow-hidden">
      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* HEADER */}
        <header className="mb-10 flex justify-between items-center bg-slate-50 p-5 rounded-[26px] border border-slate-100">
          <h1 className="text-xl font-black tracking-tighter uppercase italic text-slate-900">
            Modifier <span className="text-blue-600">le poste</span>
          </h1>
          <Link href="/mes-annonces" className="text-[10px] font-black uppercase text-slate-400 bg-white px-5 py-3 rounded-full border border-slate-100 hover:text-red-500 transition-colors">
            Annuler
          </Link>
        </header>

        <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLONNE GAUCHE : GESTION IMAGE */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-7 rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-50 text-center">
              <label className="text-[10px] font-black uppercase text-slate-400 block tracking-widest mb-4">Photo du bien</label>
              
              {/* Prévisualisation */}
              <div className="w-full h-48 bg-slate-50 rounded-[30px] border border-slate-100 overflow-hidden flex items-center justify-center text-4xl mb-6 relative group">
                {newFile ? (
                  <img src={URL.createObjectURL(newFile)} alt="Aperçu" className="w-full h-full object-cover" />
                ) : currentImageUrl ? (
                  <img src={currentImageUrl} alt="Actuelle" className="w-full h-full object-cover" />
                ) : (
                  "🏠"
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold uppercase tracking-widest">Changer</div>
              </div>

              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={(e) => setNewFile(e.target.files?.[0] || null)} 
                className="hidden" 
              />
              
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-slate-100 text-slate-900 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all active:scale-95"
              >
                {currentImageUrl ? 'Remplacer la photo' : 'Ajouter une photo'}
              </button>
              {newFile && <p className="text-[9px] text-blue-600 font-bold mt-3 truncate">{newFile.name}</p>}
            </div>
          </div>

          {/* COLONNE DROITE : INFOS TEXTE */}
          <div className="lg:col-span-2 space-y-6 bg-white p-8 md:p-10 rounded-[50px] border border-slate-100 shadow-2xl shadow-slate-100">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-3 tracking-widest">Titre de l'annonce</label>
              <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-5 bg-slate-50 rounded-[24px] outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all border border-transparent focus:bg-white text-slate-900" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-3 tracking-widest">Prix ($)</label>
                <input type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full p-5 bg-slate-50 rounded-[24px] outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all border border-transparent focus:bg-white text-slate-900" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-3 tracking-widest">Localisation (Ville/Quartier)</label>
                <input type="text" required value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full p-5 bg-slate-50 rounded-[24px] outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all border border-transparent focus:bg-white text-slate-900" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-3 tracking-widest">Description détaillée</label>
              <textarea rows={5} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-5 bg-slate-50 rounded-[24px] outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all border border-transparent focus:bg-white resize-none text-slate-900" />
            </div>

            {status.text && (
              <div className={`p-5 rounded-[24px] text-xs font-bold border animate-in fade-in ${
                status.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-500 border-red-100'
              }`}>
                {status.type === 'success' ? '✅ ' : '⚠️ '} {status.text}
              </div>
            )}

            <button type="submit" disabled={updating} className="w-full bg-blue-600 text-white py-5 rounded-[24px] font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50 mt-4 shadow-blue-100">
              {updating ? 'Mise à jour sécurisée...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>

        <p className="mt-12 text-center text-slate-300 font-bold text-[9px] uppercase tracking-[0.4em]">IMMO-CI — Serveur Kinshasa SSL Secure</p>
      </div>
      
      {/* Déco fond */}
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
    </main>
  );
}