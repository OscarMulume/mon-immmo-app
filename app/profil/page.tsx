'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [listingCount, setListingCount] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    async function getUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUserEmail(user.email || null);
        
        // Récupérer le nombre d'annonces de l'utilisateur
        const { count } = await supabase
          .from('listings')
          .select('*', { count: 'exact', head: true })
          .eq('owner_id', user.id);
        
        setListingCount(count || 0);
      }
    }
    getUserData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', text: '' });

    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', text: 'Les nouveaux mots de passe ne correspondent pas.' });
      setLoading(false);
      return;
    }

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userEmail!,
        password: currentPassword,
      });

      if (signInError) throw new Error("Le mot de passe actuel est incorrect.");

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      setStatus({ type: 'success', text: 'Mot de passe mis à jour avec succès !' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setStatus({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans p-6 md:p-12 pb-24">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <header className="mb-12 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-xl font-black tracking-tighter uppercase italic text-slate-900">
              IMMO<span className="text-blue-600">CI</span>
            </h1>
          </Link>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleLogout}
              className="text-[9px] font-black uppercase text-red-500 bg-white px-5 py-2.5 rounded-full border border-slate-200 tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm"
            >
              Déconnexion
            </button>
          </div>
        </header>

        {/* TITRE DE SECTION */}
        <div className="mb-8">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Mon <span className="text-blue-600">Espace</span>
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-3">Gestion de votre compte et de vos activités</p>
        </div>

        {/* DASHBOARD GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* ACCÈS GESTION POSTES */}
          <Link href="/my-listings" className="md:col-span-2 group relative bg-slate-900 p-8 rounded-[40px] shadow-2xl shadow-slate-200 overflow-hidden border border-slate-800 transition-all hover:scale-[1.01]">
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <h3 className="text-white font-black uppercase italic tracking-tighter text-2xl leading-none">Gestion des Postes</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Modifier ou supprimer vos annonces</p>
              </div>
              <div className="mt-8">
                <span className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest group-hover:bg-white group-hover:text-blue-600 transition-all">
                  Accéder au portefeuille →
                </span>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 text-white/5 text-9xl font-black italic select-none group-hover:scale-110 transition-transform duration-700">LIST</div>
          </Link>

          {/* STATISTIQUE RAPIDE */}
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center group">
            <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Annonces Actives</div>
            <div className="text-6xl font-black text-blue-600 italic tracking-tighter group-hover:scale-110 transition-transform">
              {listingCount < 10 ? `0${listingCount}` : listingCount}
            </div>
            <div className="w-8 h-1 bg-slate-100 mt-4 rounded-full"></div>
          </div>
        </div>

        {/* SECTION SÉCURITÉ */}
        <div className="bg-white p-8 md:p-12 rounded-[50px] border border-slate-100 shadow-2xl shadow-slate-100/50">
          <div className="flex items-center gap-5 mb-10">
            <div className="w-14 h-14 bg-slate-50 rounded-[22px] flex items-center justify-center text-2xl border border-slate-100 shadow-sm">🛡️</div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">Sécurité & Accès</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Mise à jour de vos identifiants</p>
            </div>
          </div>

          <form onSubmit={handlePasswordUpdate} className="space-y-6 max-w-2xl">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-3 tracking-widest">Email du compte</label>
              <input 
                type="text" 
                disabled 
                value={userEmail || ''} 
                className="w-full p-5 bg-slate-50 rounded-[24px] font-bold text-slate-400 border border-slate-100 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-3 tracking-widest">Mot de passe actuel</label>
              <input 
                type="password" 
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-5 bg-slate-50 rounded-[24px] outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all border border-transparent focus:bg-white text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-3 tracking-widest">Nouveau code</label>
                <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="8+ caractères" className="w-full p-5 bg-slate-50 rounded-[24px] outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all border border-transparent focus:bg-white text-slate-900" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-3 tracking-widest">Confirmation</label>
                <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirmez" className="w-full p-5 bg-slate-50 rounded-[24px] outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all border border-transparent focus:bg-white text-slate-900" />
              </div>
            </div>

            {status.text && (
              <div className={`p-5 rounded-[24px] text-xs font-black uppercase tracking-widest border ${status.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                {status.type === 'success' ? '✅ ' : '⚠️ '} {status.text}
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-5 rounded-[24px] font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50">
              {loading ? 'Traitement...' : 'Sauvegarder les changements'}
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}