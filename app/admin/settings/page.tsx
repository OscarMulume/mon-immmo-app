'use client';

import { useState } from 'react';

export default function SettingsPage() {
  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic">Paramètres</h1>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Configuration globale de la plateforme</p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {/* Section Sécurité */}
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <h3 className="font-black text-slate-900 uppercase mb-6 flex items-center gap-2">
            <span className="text-blue-600 text-xl">🛡️</span> Sécurité de l'accès
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
              <div>
                <p className="font-bold text-slate-900">Mode Maintenance</p>
                <p className="text-xs text-slate-500">Rendre le site inaccessible aux clients</p>
              </div>
              <input type="checkbox" className="w-6 h-6 accent-blue-600" />
            </div>
          </div>
        </div>

        {/* Section Contact / Kinshasa */}
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <h3 className="font-black text-slate-900 uppercase mb-6 flex items-center gap-2">
            <span className="text-blue-600 text-xl">📞</span> Contact Plateforme
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Numéro WhatsApp (ex: +243...)" className="p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-blue-500 transition-all font-medium" />
            <input type="email" placeholder="Email de support" className="p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-blue-500 transition-all font-medium" />
          </div>
        </div>
      </div>
    </div>
  );
}