'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  created_at: string;
  avatar_url?: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    // On récupère les profils depuis ta table 'profiles'
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setUsers(data);
    setLoading(false);
  }

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic">
            Gestion <span className="text-blue-600">Utilisateurs</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">
            {users.length} membres inscrits sur la plateforme
          </p>
        </div>

        {/* Barre de recherche interne */}
        <div className="relative group">
          <input 
            type="text"
            placeholder="Rechercher un nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white border border-slate-100 py-3 px-6 pr-12 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all w-full md:w-80"
          />
          <span className="absolute right-4 top-3.5 opacity-30">🔍</span>
        </div>
      </header>

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Utilisateur</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Rôle</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Date d'inscription</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              [1, 2, 3].map(i => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={4} className="p-8 h-20 bg-slate-50/20"></td>
                </tr>
              ))
            ) : filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-black text-xs uppercase">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        user.full_name?.substring(0, 2) || "U"
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{user.full_name || "Utilisateur sans nom"}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-50 text-blue-500'
                  }`}>
                    {user.role || 'client'}
                  </span>
                </td>
                <td className="p-6 text-slate-400 text-xs font-medium">
                  {new Date(user.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </td>
                <td className="p-6 text-right">
                  <button className="text-[10px] font-black uppercase text-slate-300 hover:text-red-500 transition-colors tracking-widest">
                    Suspendre
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && filteredUsers.length === 0 && (
          <div className="p-20 text-center">
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">Aucun utilisateur trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}