'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
// On utilise un chemin relatif si l'alias @ pose problème
import ImageUpload from '../../lib/components/ImageUpload'; 

// On crée une interface pour expliquer à TypeScript la structure du formulaire
interface FormDataType {
  title: string;
  price: string;
  category: string;
  city: string;
  district: string;
  description: string;
  latitude: number;
  longitude: number;
  images: string[];
}

export default function DeposerAnnonce() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // On applique l'interface ici
  const [formData, setFormData] = useState<FormDataType>({
    title: '',
    price: '',
    category: 'appartement',
    city: '',
    district: '',
    description: '',
    latitude: 5.34, 
    longitude: -4.02,
    images: [], 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Vous devez être connecté pour publier une annonce.");
      setLoading(false);
      return;
    }

    const priceValue = parseFloat(formData.price);

    // Pour éviter le soulignement de "as any", on passe par une variable intermédiaire
    const dataToInsert = { 
      title: formData.title,
      price: priceValue,
      category: formData.category,
      city: formData.city,
      district: formData.district,
      description: formData.description,
      latitude: formData.latitude,
      longitude: formData.longitude,
      owner_id: user.id, 
      status: 'pending',
      images: formData.images
    };

   // On envoie l'objet dans un tableau [ ] et on dit "as any" juste après le crochet fermant.
    const { error } = await supabase
      .from('listings')
      .insert([dataToInsert] as any);
    if (error) {
      alert(`Erreur technique : ${error.message}`);
    } else {
      alert("Félicitations ! Votre annonce est en cours de modération.");
      router.push('/dashboard'); 
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-xl rounded-3xl mt-10 border border-gray-100">
      <div className="mb-8">
        <p className="text-sm font-bold text-blue-600 mb-2">Étape {step} sur 3</p>
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-full transition-all duration-500" style={{ width: `${(step/3)*100}%` }}></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-bold text-slate-800">L&apos;essentiel du bien</h2>
            <input 
              type="text" placeholder="Titre (ex: Villa avec piscine)" required
              className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-4">
              <input type="number" placeholder="Prix (FCFA)" required className="p-4 border rounded-xl"
                value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
              <select className="p-4 border rounded-xl bg-white" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                <option value="appartement">Appartement</option>
                <option value="studio">Studio</option>
                <option value="villa">Villa</option>
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-bold text-slate-800">Localisation</h2>
            <input type="text" placeholder="Ville" required className="w-full p-4 border rounded-xl"
              value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
            <input type="text" placeholder="Quartier" required className="w-full p-4 border rounded-xl"
              value={formData.district} onChange={(e) => setFormData({...formData, district: e.target.value})} />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-bold text-slate-800">Détails & Photos</h2>
            <textarea 
              placeholder="Décrivez votre bien en détail..." required
              className="w-full p-4 border rounded-xl h-32 outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
            
            <div className="mt-4">
              {/* L'interface FormDataType règle le soulignement de urls */}
              <ImageUpload onUpload={(urls: string[]) => setFormData({...formData, images: urls})} />
            </div>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
               <p className="text-sm text-blue-700 italic">La position GPS est fixée par défaut.</p>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-6 border-t border-gray-100">
          {step > 1 && (
            <button type="button" onClick={() => setStep(step - 1)} className="text-gray-500 font-medium hover:text-gray-700">Retour</button>
          )}
          
          <button 
            type="submit"
            disabled={loading}
            className={`${step < 3 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} text-white px-10 py-3 rounded-xl font-bold ml-auto disabled:opacity-50 transition-colors`}
          >
            {loading ? 'Envoi...' : step < 3 ? 'Suivant' : 'Publier l\'annonce'}
          </button>
        </div>
      </form>
    </div>
  );
}