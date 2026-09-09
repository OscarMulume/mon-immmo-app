'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-black text-slate-900 tracking-tighter hover:opacity-80 transition-opacity">
          IMMO<span className="text-blue-600">DIRECT</span>
        </Link>

        {/* Menu */}
        <div className="flex items-center gap-4 md:gap-8">
          {user ? (
            <>
              {/* Liens de navigation pour utilisateurs connectés */}
              <div className="flex items-center gap-6">
                <Link 
                  href="/my-listings" 
                  className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
                >
                  Mes biens
                </Link>
                <Link 
                  href="/add-listing" 
                  className="hidden sm:block bg-blue-50 text-blue-600 px-5 py-2.5 rounded-2xl font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                >
                  + Publier
                </Link>
              </div>

              {/* Bloc Utilisateur & Déconnexion */}
              <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-2xl pl-4 border border-gray-100">
                <span className="text-xs font-black uppercase tracking-tight text-slate-400 hidden lg:block">
                  {user.email?.split('@')[0]}
                </span>
                <button 
                  onClick={handleLogout}
                  className="bg-white text-red-500 px-4 py-2 rounded-xl text-xs font-black shadow-sm hover:bg-red-500 hover:text-white transition-all uppercase tracking-wider border border-red-100"
                >
                  Déconnexion
                </button>
              </div>
            </>
          ) : (
            <Link 
              href="/login" 
              className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-100"
            >
              Se connecter
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}   