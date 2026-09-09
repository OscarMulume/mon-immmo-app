'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;
      
      setMessage("Compte créé ! Vérifiez votre boîte mail pour confirmer.");
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white font-sans">
      
      {/* SECTION GAUCHE : FORMULAIRE D'INSCRIPTION */}
      <div className="flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-block mb-10">
            <h1 className="text-2xl font-black tracking-tighter uppercase italic">
              IMMO<span className="text-blue-600">CI</span>
            </h1>
          </Link>

          <header className="mb-8">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">Créer un compte.</h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Rejoignez le réseau immobilier numéro 1 en RDC</p>
          </header>

          <form onSubmit={handleSignup} className="space-y-5">
            {message && (
              <div className="bg-green-50 text-green-600 p-5 rounded-[24px] text-xs font-bold border border-green-100">
                ✅ {message}
              </div>
            )}
            {error && (
              <div className="bg-red-50 text-red-500 p-5 rounded-[24px] text-xs font-bold border border-red-100">
                ⚠️ {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Nom complet</label>
              <input 
                type="text" 
                required 
                placeholder="Ex: Oscar Mulume"
                className="w-full p-5 bg-slate-50 rounded-[24px] outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all border border-transparent focus:bg-white"
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Email</label>
              <input 
                type="email" 
                required 
                placeholder="votre@email.com"
                className="w-full p-5 bg-slate-50 rounded-[24px] outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all border border-transparent focus:bg-white"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Mot de passe</label>
              <input 
                type="password" 
                required 
                placeholder="Minimum 6 caractères"
                className="w-full p-5 bg-slate-50 rounded-[24px] outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all border border-transparent focus:bg-white"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white py-5 rounded-[24px] font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-blue-100 hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50 mt-4"
            >
              {loading ? 'Création en cours...' : "S'inscrire gratuitement"}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-400 font-bold text-xs uppercase tracking-tight">
            Déjà inscrit ?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>

      {/* SECTION DROITE : ARGUMENTS DE VENTE */}
      <div className="hidden lg:flex flex-col justify-center bg-slate-50 p-20 relative overflow-hidden">
        {/* Cercles décoratifs en fond */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-200 rounded-full -ml-32 -mb-32 blur-3xl"></div>

        <div className="relative z-10 space-y-12">
          <h3 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight uppercase">
            Pourquoi choisir <br/> IMMO<span className="text-blue-600">CI</span> ?
          </h3>

          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-xl shrink-0">🚀</div>
              <div>
                <h4 className="font-black text-slate-900 uppercase text-sm tracking-tight">Visibilité Maximale</h4>
                <p className="text-slate-500 text-sm font-medium mt-1">Vos annonces sont vues par des milliers d&apos;acheteurs potentiels chaque jour.</p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-xl shrink-0">📊</div>
              <div>
                <h4 className="font-black text-slate-900 uppercase text-sm tracking-tight">Gestion Simplifiée</h4>
                <p className="text-slate-500 text-sm font-medium mt-1">Modifiez vos prix et vos photos en un clic depuis votre tableau de bord.</p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-xl shrink-0">🔒</div>
              <div>
                <h4 className="font-black text-slate-900 uppercase text-sm tracking-tight">Transactions Sûres</h4>
                <p className="text-slate-500 text-sm font-medium mt-1">Nous vérifions chaque compte pour garantir un environnement de confiance.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}