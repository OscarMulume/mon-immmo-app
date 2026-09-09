'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  // Remplacez par votre email exact
  const ADMIN_EMAIL = "oscarmulume1612@gmail.com";

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session || session.user.email !== ADMIN_EMAIL) {
          // Si pas connecté ou pas le bon email -> redirection accueil
          router.push('/');
        } else {
          // C'est bien Oscar, on autorise l'affichage
          setAuthorized(true);
        }
      } catch (err) {
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: '📊' },
    { name: 'Modération', path: '/admin/moderation', icon: '🛡️' },
    { name: 'Utilisateurs', path: '/admin/users', icon: '👥' },
    { name: 'Quartiers', path: '/admin/districts', icon: '📍' },
    { name: 'Paramètres', path: '/admin/settings', icon: '⚙️' },
  ];

  // Écran de chargement pendant la vérification
  if (loading) {
    return (
      <div className="h-screen w-full bg-slate-900 flex flex-col items-center justify-center">
        <div className="text-white font-black text-2xl animate-pulse italic uppercase tracking-tighter">
          IMMO<span className="text-blue-500">ADMIN</span>
        </div>
        <p className="text-slate-500 text-[10px] uppercase tracking-[0.3em] mt-4">Vérification de l'accès...</p>
      </div>
    );
  }

  // Si pas autorisé, on ne rend rien (la redirection fera le reste)
  if (!authorized) return null;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* SIDEBAR FIXE */}
      <aside className="w-72 bg-slate-900 m-4 rounded-[40px] p-8 flex flex-col shadow-2xl shrink-0 sticky top-4 h-[calc(100vh-2rem)]">
        <div className="mb-12">
          <h2 className="text-white font-black text-2xl tracking-tighter italic uppercase">
            IMMO<span className="text-blue-500">ADMIN</span>
          </h2>
          <div className="h-1 w-12 bg-blue-600 mt-2 rounded-full"></div>
        </div>

        <nav className="space-y-3 flex-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex items-center gap-4 p-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all duration-300 ${
                  isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Pied de sidebar */}
        <div className="mt-auto pt-6 space-y-4">
          <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700/30">
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Connecté en tant que</p>
            <p className="text-[10px] font-bold text-blue-400 truncate uppercase italic">{ADMIN_EMAIL}</p>
          </div>
          
          <Link 
            href="/" 
            className="block p-4 text-center text-slate-500 font-bold text-[10px] uppercase hover:text-white transition-colors"
          >
            ← Retour au site
          </Link>
        </div>
      </aside>

      {/* ZONE DE CONTENU DYNAMIQUE */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}