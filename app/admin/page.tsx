'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  
  // États de sécurité
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [dbPin, setDbPin] = useState(''); // Stocke le PIN récupéré en base
  const [pinError, setPinError] = useState(false);

  // États de données
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<any[]>([]);
  const [stats, setStats] = useState({
    activeListings: 0,
    pendingListings: 0,
    totalUsers: 0
  });

  // 1. Vérification initiale & Récupération du PIN dynamique
  useEffect(() => {
    async function checkAccess() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      // Vérifier si l'utilisateur est admin dans son profil
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();

      if (profile?.is_admin) {
        // Récupérer le PIN depuis la table admin_settings
        const { data: setting } = await supabase
          .from('admin_settings')
          .select('value')
          .eq('key', 'admin_pin')
          .single();
        
        // Si aucun PIN n'existe en base, on utilise celui par défaut Izuba1612
        setDbPin(setting?.value || "Izuba1612");
        setIsAuthorized(true);
      } else {
        alert("Accès refusé : Droits administrateur requis.");
        router.push('/');
      }
    }
    checkAccess();
  }, [router]);

  // 2. Chargement des données (Stats + Liste)
  async function fetchData() {
    setLoading(true);
    
    const { count: active } = await supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');
      
    const { count: pending } = await supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    const { data: recentListings } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    setStats({
      activeListings: active || 0,
      pendingListings: pending || 0,
      totalUsers: 0 
    });
    
    if (recentListings) setListings(recentListings);
    setLoading(false);
  }

  // 3. Logique de déverrouillage
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === dbPin) {
      setIsUnlocked(true);
      fetchData();
    } else {
      setPinError(true);
      setPin('');
      setTimeout(() => setPinError(false), 500);
    }
  };

  // 4. Modifier le mot de passe
  const handleUpdatePin = async () => {
    const newPin = prompt("Entrez le nouveau mot de passe administrateur :");
    if (!newPin || newPin.length < 4) {
      alert("Le mot de passe doit contenir au moins 4 caractères.");
      return;
    }

    const { error } = await supabase
      .from('admin_settings')
      .update({ value: newPin })
      .eq('key', 'admin_pin');

    if (error) {
      alert("Erreur lors de la mise à jour du mot de passe.");
    } else {
      setDbPin(newPin);
      alert("Mot de passe mis à jour avec succès.");
    }
  };

  // 5. Fonction de suppression
  const handleDeleteListing = async (listingId: string) => {
    const confirmDelete = confirm("Voulez-vous vraiment supprimer cette annonce définitivement ?");
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId);

      if (error) throw error;
      alert("Annonce supprimée.");
      fetchData(); 
      
    } catch (error: any) {
      alert(`Erreur : ${error.message}`);
    }
  };

  if (isAuthorized === null) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">Vérification cryptographique...</p>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="h-[90vh] flex items-center justify-center p-6">
        <form 
          onSubmit={handleUnlock} 
          className={`bg-white p-10 md:p-16 rounded-[60px] shadow-2xl border border-slate-100 text-center transition-all ${pinError ? 'animate-bounce border-red-200' : ''}`}
        >
          <div className="w-20 h-20 bg-slate-900 rounded-[30px] flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <span className="text-3xl">🔐</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">Accès Sécurisé</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-10 italic">Entrez le code d&apos;accès</p>
          
          <input 
            type="password" 
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="••••••••"
            className="w-full text-center text-lg font-black tracking-widest bg-slate-50 border-none rounded-3xl p-5 focus:ring-2 focus:ring-blue-600 outline-none mb-6"
            autoFocus 
          />
          
          <button 
            type="submit" 
            className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black uppercase text-[11px] tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
          >
            Déverrouiller
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 p-4">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">
            Admin <span className="text-blue-600">Secure</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2 ml-1">
            Gestion Plateforme — Kinshasa
          </p>
        </div>
        <div className="flex items-center gap-3">
            <button 
                onClick={handleUpdatePin}
                className="text-[9px] font-black uppercase text-blue-600 bg-blue-50 px-5 py-3 rounded-full border border-blue-100 hover:bg-blue-600 hover:text-white transition-all tracking-widest"
            >
                Changer le PIN
            </button>
            <button 
                onClick={() => setIsUnlocked(false)}
                className="text-[9px] font-black uppercase text-slate-400 hover:text-red-500 transition-colors tracking-widest bg-slate-50 px-5 py-3 rounded-full border border-slate-100"
            >
                Verrouiller
            </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <StatCard title="Annonces Publiées" value={stats.activeListings} trend="+12%" color="blue" icon="🏘️" />
        <StatCard title="En attente" value={stats.pendingListings} trend="Action" color="orange" icon="⏳" />
        <StatCard title="Signalements" value="0" trend="Sain" color="green" icon="🛡️" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[50px] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-slate-900 uppercase italic tracking-tighter">Gestion Annonces</h3>
            <button onClick={fetchData} className="text-[10px] font-black uppercase text-blue-600 hover:underline">Sync Live</button>
          </div>

          <div className="space-y-4">
            {loading ? (
              <p className="text-center py-10 text-slate-300 font-bold uppercase text-xs animate-pulse tracking-[0.2em]">Chargement des données...</p>
            ) : listings.length === 0 ? (
              <p className="text-center py-10 text-slate-300 font-bold uppercase text-xs italic">Aucune donnée</p>
            ) : (
              listings.map((listing) => (
                <div key={listing.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-[30px] border border-transparent hover:border-slate-200 transition-all group">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest mb-1">
                      {listing.status === 'published' ? '✅ Publiée' : '⏳ En attente'}
                    </span>
                    <h4 className="font-bold text-slate-900 truncate max-w-[200px] uppercase text-xs">{listing.title}</h4>
                  </div>
                  
                  <button 
                    onClick={() => handleDeleteListing(listing.id)}
                    className="w-10 h-10 flex items-center justify-center bg-white text-red-500 rounded-2xl border border-red-50 shadow-sm hover:bg-red-500 hover:text-white transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-slate-900 p-10 rounded-[50px] shadow-2xl relative overflow-hidden h-fit">
          <h3 className="font-black text-white uppercase italic tracking-tighter mb-6 relative z-10 text-xl leading-tight">
            Sécurité <br/> <span className="text-blue-500 underline">Active</span>
          </h3>
          <p className="text-slate-400 text-[11px] font-medium leading-relaxed relative z-10 uppercase tracking-wider">
            Le changement de PIN affecte tous les accès futurs. Assurez-vous de le noter en lieu sûr. Toute suppression est irréversible.
          </p>
          <div className="mt-8 relative z-10 flex items-center gap-3">
             <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]"></span>
             <span className="text-green-500 font-black text-[9px] uppercase tracking-widest">Proxy Kinshasa SSL</span>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, color, icon }: any) {
  const colorMap: any = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    green: "bg-green-50 text-green-600 border-green-100"
  };

  return (
    <div className="bg-white p-8 rounded-[45px] shadow-sm border border-slate-50 hover:shadow-2xl transition-all duration-500 group">
      <div className="flex justify-between items-start mb-4">
        <p className="text-slate-400 font-black uppercase text-[9px] tracking-[0.2em]">{title}</p>
        <span className="text-xl opacity-50 group-hover:opacity-100 transition-opacity">{icon}</span>
      </div>
      <div className="flex items-end gap-3">
        <span className="text-5xl font-black text-slate-900 tracking-tighter">{value}</span>
        <span className={`text-[8px] font-black mb-2 px-3 py-1 rounded-full border ${colorMap[color] || colorMap.blue} uppercase tracking-widest`}>
          {trend}
        </span>
      </div>
    </div>
  );
}