'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // 1. Détection du défilement pour l'effet de design (Glassmorphism)
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Gestion de la session utilisateur avec Supabase
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      isScrolled 
        ? 'py-3 bg-white/90 backdrop-blur-xl shadow-sm border-b border-slate-100' 
        : 'py-5 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
        
        {/* LOGO : Adaptatif mobile */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-200 group-hover:rotate-12 transition-transform">
            I
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-tighter uppercase text-slate-900">
            IMMO<span className="text-blue-600">CI</span>
          </span>
        </Link>

        {/* NAVIGATION CENTRALE : Cachée sur mobile pour éviter l'encombrement */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-100">
          <Link href="/" className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${pathname === '/' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
            Accueil
          </Link>
          <Link href="/a-propos" className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${pathname === '/a-propos' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
            À Propos
          </Link>
          <Link href="/contact" className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${pathname === '/contact' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
            Contact
          </Link>
        </div>

        {/* ACTIONS : Flexibles selon l'écran */}
        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link 
                href="/deposer" 
                className="bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-blue-100 active:scale-95"
              >
                <span className="xs:hidden">+</span>
                <span className="hidden xs:inline">+ Publier</span>
              </Link>
              
              <button 
                onClick={handleLogout}
                className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-red-50 text-red-500 rounded-xl sm:rounded-2xl hover:bg-red-500 hover:text-white transition-all border border-red-100 shadow-sm active:scale-90"
                title="Déconnexion"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="bg-slate-900 text-white px-5 sm:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95"
            >
              Connexion
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}