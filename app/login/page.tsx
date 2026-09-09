'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleAuth = async (type: 'LOGIN' | 'SIGNUP') => {
    setLoading(true);
    setMessage('');

    try {
      const { error } = type === 'LOGIN' 
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (error) throw error;

      if (type === 'SIGNUP') {
        setMessage("Vérifiez votre boîte mail pour confirmer l'inscription !");
      } else {
        // Redirection vers la page de dépôt après connexion
        router.push('/deposer'); 
        router.refresh();
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white font-sans">
      
      {/* SECTION GAUCHE : FORMULAIRE */}
      <div className="flex items-center justify-center p-8 md:p-16 bg-white">
        <div className="w-full max-w-md">
          {/* LOGO */}
          <Link href="/" className="inline-block mb-12 group">
            <h1 className="text-3xl font-black tracking-tighter uppercase group-hover:text-blue-600 transition-colors">
              IMMO<span className="text-blue-600">CI</span>
            </h1>
          </Link>

          <header className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase mb-2">Bienvenue.</h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Connectez-vous pour gérer vos annonces</p>
          </header>

          <div className="space-y-6">
            {message && (
              <div className={`p-5 rounded-2xl text-xs font-bold border animate-in fade-in slide-in-from-top-4 ${
                message.includes('Vérifiez') 
                ? 'bg-blue-50 text-blue-600 border-blue-100' 
                : 'bg-red-50 text-red-500 border-red-100'
              }`}>
                {message.includes('Vérifiez') ? '📧 ' : '⚠️ '} {message}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Email</label>
                <input 
                  type="email" 
                  required 
                  placeholder="nom@exemple.com"
                  className="w-full p-5 bg-slate-50 rounded-[24px] outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all border border-transparent focus:bg-white text-slate-900"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Mot de passe</label>
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••"
                  className="w-full p-5 bg-slate-50 rounded-[24px] outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all border border-transparent focus:bg-white text-slate-900"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-4">
              <button 
                onClick={() => handleAuth('LOGIN')}
                disabled={loading}
                className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>

              <button 
                onClick={() => handleAuth('SIGNUP')}
                disabled={loading}
                className="w-full bg-white text-slate-900 border-2 border-slate-100 py-5 rounded-[24px] font-black uppercase text-[10px] tracking-[0.2em] hover:bg-slate-50 transition-all active:scale-95"
              >
                Créer un compte
              </button>
            </div>
          </div>

          <p className="mt-12 text-center text-slate-400 font-bold text-[9px] uppercase tracking-[0.3em]">
            Sécurité garantie par Supabase Auth
          </p>
        </div>
      </div>

      {/* SECTION DROITE : VISUEL (Inspiré du marché immobilier moderne) */}
      <div className="hidden lg:block relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-70 grayscale hover:grayscale-0 transition-all duration-1000"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        
        <div className="absolute bottom-20 left-20 right-20 text-white">
          <div className="bg-white/10 backdrop-blur-2xl p-10 rounded-[40px] border border-white/20 shadow-2xl">
             <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-1 bg-blue-500 rounded-full"></span>
                <span className="text-blue-400 font-black uppercase text-[10px] tracking-widest">Conseil du jour</span>
             </div>
            <h3 className="text-3xl font-black leading-tight mb-4 uppercase tracking-tighter">
              &quot;Investir dans l&apos;immobilier, c&apos;est acheter le futur au prix du présent."
            </h3>
            <p className="text-slate-300 font-bold uppercase text-[10px] tracking-widest italic">Oscar Mulume — IMMO-CI</p>
          </div>
        </div>
      </div>
    </main>
  );
}