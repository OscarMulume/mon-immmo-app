'use client';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/'); // Redirige vers l'accueil
    router.refresh(); // Rafraîchit l'état de l'authentification
  };

  return (
    <button 
      onClick={handleLogout}
      className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 hover:bg-red-50 px-6 py-3 rounded-2xl transition-all border border-transparent hover:border-red-100"
    >
      Déconnexion
    </button>
  );
}