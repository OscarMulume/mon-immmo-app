'use client';

import { useState } from 'react';

export default function ContactPage() {
  const MON_WHATSAPP = "243975585150";
  const [status, setStatus] = useState<'IDLE' | 'SENDING' | 'SUCCESS'>('IDLE');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('SENDING');
    // Simulation d'envoi
    setTimeout(() => setStatus('SUCCESS'), 1500);
  };

  return (
    <main className="min-h-screen bg-slate-50/50 py-12 lg:py-24 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* EN-TÊTE */}
        <header className="mb-16 text-center lg:text-left">
          <h2 className="text-blue-600 font-black uppercase text-[10px] tracking-[0.4em] mb-4">Contactez IMMO-CI</h2>
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-tight">
            Parlons de <br/> <span className="text-blue-600 italic">votre projet.</span>
          </h1>
          <p className="mt-6 text-slate-500 font-medium text-lg max-w-xl">
            Que vous cherchiez une location à Gombe ou une vente à Ngaliema, notre équipe est basée à Kinshasa pour vous répondre.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLONNE GAUCHE : INFOS DE CONTACT */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 italic">Nos coordonnées</h3>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl shrink-0">📍</div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-1">Siège Social</p>
                      <p className="font-bold text-sm leading-relaxed text-slate-200 uppercase">Kinshasa, RD Congo</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl shrink-0">💬</div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-1">WhatsApp Business</p>
                      <p className="font-bold text-sm leading-relaxed text-slate-200">+{MON_WHATSAPP}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-12 border-t border-white/10">
                  <a 
                    href={`https://wa.me/${MON_WHATSAPP}`}
                    className="flex items-center justify-center gap-3 w-full bg-[#25D366] py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl shadow-green-900/20"
                  >
                    Lancer une discussion
                  </a>
                </div>
              </div>
              {/* Déco fond */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-slate-100 flex items-center gap-6 shadow-sm">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl shrink-0 font-black">?</div>
              <p className="text-[10px] font-black uppercase text-slate-400 leading-relaxed tracking-widest">
                Besoin d'un accompagnement personnalisé pour une visite ? Écrivez-nous.
              </p>
            </div>
          </div>

          {/* COLONNE DROITE : FORMULAIRE */}
          <div className="lg:col-span-7">
            <div className="bg-white p-10 lg:p-16 rounded-[48px] shadow-sm border border-slate-100">
              {status === 'SUCCESS' ? (
                <div className="text-center py-20 space-y-6 animate-in fade-in zoom-in">
                  <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-4xl mx-auto shadow-sm">✓</div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter">Message envoyé !</h3>
                  <p className="text-slate-400 font-medium">Oscar ou un membre de l'équipe vous recontactera sous 24h.</p>
                  <button onClick={() => setStatus('IDLE')} className="text-blue-600 font-black uppercase text-[10px] tracking-widest underline underline-offset-4">Envoyer un autre message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Nom complet</label>
                      <input required type="text" className="w-full p-5 bg-slate-50 rounded-[24px] outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all border border-transparent" placeholder="Ex: Jean Mukendi" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Type de projet</label>
                      <select className="w-full p-5 bg-slate-50 rounded-[24px] outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all border border-transparent appearance-none">
                        <option>Je cherche à louer</option>
                        <option>Je cherche à acheter</option>
                        <option>Je veux vendre un bien</option>
                        <option>Autre demande</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Votre Message</label>
                    <textarea required rows={5} className="w-full p-5 bg-slate-50 rounded-[24px] outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all border border-transparent" placeholder="Décrivez le quartier et le type de bien que vous recherchez..."></textarea>
                  </div>

                  <button 
                    disabled={status === 'SENDING'}
                    className="w-full bg-slate-900 text-white py-6 rounded-[24px] font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {status === 'SENDING' ? 'Envoi en cours...' : 'Envoyer ma demande'}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}