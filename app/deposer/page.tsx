'use client';

import { useState, FormEvent, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Database } from '@/lib/database.types'; 
import ImageUpload from '@/lib/components/ImageUpload';
import dynamic from 'next/dynamic';

// Chargement dynamique du sélecteur de carte pour éviter les erreurs SSR
const LocationPicker = dynamic(() => import('@/lib/components/LocationPicker'), { 
  ssr: false,
  loading: () => <div className="h-[300px] bg-slate-50 animate-pulse rounded-3xl flex items-center justify-center text-slate-400 font-bold uppercase text-xs">Chargement de la carte...</div>
});

type ListingCategory = "appartement" | "studio" | "villa" | "bureau" | "terrain";
type ListingType = "LOCATION" | "VENTE";

interface FormDataType {
  title: string;
  price: string;
  type: ListingType;
  category: ListingCategory;
  city: string;
  district: string;
  description: string;
  latitude: number;
  longitude: number;
  images: string[];
}

export default function DeposerAnnonce() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  
  // États pour les quartiers chargés depuis Supabase
  const [districts, setDistricts] = useState<{id: string, name: string}[]>([]);
  const [loadingDistricts, setLoadingDistricts] = useState(true);

  const [formData, setFormData] = useState<FormDataType>({
    title: '',
    price: '',
    type: 'LOCATION',
    category: 'appartement',
    city: 'Kinshasa',
    district: '',
    description: '',
    latitude: -4.3224, // Kinshasa par défaut
    longitude: 15.3070,
    images: [], 
  });

  // 1. Protection de la page et vérification session
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("Vous devez être connecté pour accéder à cette page.");
        router.push('/login');
      }
    };
    checkUser();
  }, [router]);

  // 2. Chargement des quartiers (Tri A-Z)
  useEffect(() => {
    async function loadDistricts() {
      setLoadingDistricts(true);
      const { data, error } = await supabase
        .from('districts')
        .select('id, name')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (!error && data) {
        setDistricts(data);
      }
      setLoadingDistricts(false);
    }
    loadDistricts();
  }, []);

  const handleImageUpload = (urls: string[]) => {
    setFormData({ ...formData, images: urls.slice(0, 6) });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Session expirée.");
      
      const user = session.user;

      // Insertion propre avec typage Database
      const { error } = await supabase
        .from('listings')
        .insert([{
          owner_id: user.id,
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price) || 0,
          category: formData.category,
          type: formData.type,
          city: formData.city,
          district: formData.district,
          images_urls: formData.images, 
          status: 'pending',
          latitude: formData.latitude,
          longitude: formData.longitude,
          currency: 'USD'
        }]);

      if (error) throw error;

      router.push('/my-listings'); 
      
    } catch (error: any) {
      alert(`Erreur technique : ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-2xl rounded-[40px] mt-10 border border-slate-100 mb-20">
      
      {/* Progression */}
      <div className="mb-10">
        <div className="flex justify-between items-end mb-3">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Étape {step} / 3</p>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">
             {step === 1 ? 'Contrat & Prix' : step === 2 ? 'Localisation' : 'Photos & Description'}
            </p>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-blue-600 h-full transition-all duration-700 ease-in-out" 
            style={{ width: `${(step/3)*100}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* ÉTAPE 1 : OFFRE & CATEGORIE */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Type de <br/> <span className="text-blue-600 underline decoration-4">Publication</span></h2>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2 italic">Offre de service</label>
              <div className="flex bg-slate-100 p-1.5 rounded-3xl gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'LOCATION'})}
                  className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${
                    formData.type === 'LOCATION' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
                  }`}
                >Location</button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'VENTE'})}
                  className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${
                    formData.type === 'VENTE' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500'
                  }`}
                >Vente</button>
              </div>
            </div>

            <input 
              type="text" placeholder="Titre (ex: Bel appartement à Gombe)" required
              className="w-full p-5 bg-slate-50 border-none rounded-[20px] outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800"
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <input 
                  type="number" placeholder="Prix" required 
                  className="w-full p-5 bg-slate-50 border-none rounded-[20px] outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 pr-16"
                  value={formData.price} 
                  onChange={(e) => setFormData({...formData, price: e.target.value})} 
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-900 bg-white px-2 py-1 rounded-lg text-[10px] border border-slate-100 shadow-sm">USD</div>
              </div>

              <select 
                className="p-5 bg-slate-50 border-none rounded-[20px] outline-none focus:ring-2 focus:ring-blue-500 font-black text-slate-700 uppercase text-[10px] tracking-widest cursor-pointer appearance-none" 
                value={formData.category} 
                onChange={(e) => setFormData({...formData, category: e.target.value as ListingCategory})}
              >
                <option value="appartement">Appartement</option>
                <option value="studio">Studio</option>
                <option value="villa">Villa</option>
                <option value="bureau">Bureau</option>
                <option value="terrain">Terrain</option>
              </select>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 : LOCALISATION OPTIMISÉE */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">Localisation <br/> à <span className="text-blue-600 underline">Kinshasa</span></h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[8px] font-black uppercase text-slate-400 ml-4 tracking-widest">Ville</label>
                <input 
                  type="text" placeholder="Ville" required
                  className="w-full p-5 bg-slate-50 border-none rounded-[20px] outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800"
                  value={formData.city} 
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[8px] font-black uppercase text-slate-400 ml-4 tracking-widest">Quartier ou Commune</label>
                {loadingDistricts ? (
                  <div className="p-5 bg-slate-50 rounded-[20px] animate-pulse text-[10px] font-black text-slate-300 uppercase italic">Chargement des zones...</div>
                ) : (
                  <select 
                    required 
                    className="w-full p-5 bg-slate-50 border-none rounded-[20px] outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 appearance-none cursor-pointer uppercase text-[10px] tracking-tight"
                    value={formData.district} 
                    onChange={(e) => setFormData({...formData, district: e.target.value})}
                  >
                    <option value="">Choisir un quartier</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            
            <LocationPicker 
              onLocationSelect={(lat, lng) => setFormData({...formData, latitude: lat, longitude: lng})}
              defaultLat={formData.latitude}
              defaultLng={formData.longitude}
            />
          </div>
        )}

        {/* ÉTAPE 3 : MÉDIAS & DESCRIPTION */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">Photos & <br/> <span className="text-green-500">Détails</span></h2>
            
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 p-3 rounded-xl border border-dashed border-slate-200">
              📸 Les photos iPhone (HEIC) sont automatiquement converties.
            </p>

            <ImageUpload onUpload={handleImageUpload} />
            
            <textarea 
              placeholder="Décrivez les atouts (sécurité 24h/24, eau constante, électricité stable...)" required
              className="w-full p-6 bg-slate-50 border-none rounded-[30px] h-40 outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800 resize-none"
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
        )}

        {/* NAVIGATION BAS DE PAGE */}
        <div className="flex justify-between items-center pt-8 border-t border-slate-50">
          {step > 1 && (
            <button 
              type="button" 
              onClick={() => setStep(step - 1)} 
              className="text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-900 transition-all px-4"
            >
              Précédent
            </button>
          )}
          <button 
            type="submit"
            disabled={loading}
            className={`
              ${step < 3 ? 'bg-slate-900' : 'bg-blue-600'} 
              text-white px-12 py-5 rounded-[24px] font-black uppercase text-[10px] tracking-[0.2em] ml-auto shadow-xl active:scale-95 disabled:opacity-50 transition-all
            `}
          >
            {loading ? 'Conversion & Envoi...' : step < 3 ? 'Suivant' : 'Publier en USD'}
          </button>
        </div>
      </form>
    </div>
  );
}