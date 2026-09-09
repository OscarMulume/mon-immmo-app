'use client';

import Link from 'next/link';

export default function AboutPage() {
  const MON_EMAIL = "oscarmulume1612@gmail.com";
  const MON_WHATSAPP = "243975585150";

  return (
    <main className="min-h-screen bg-white font-sans">
      
      {/* HERO SECTION : L'ancrage à Kinshasa */}
      <section className="py-24 px-6 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-5xl mx-auto relative z-10">
          <span className="text-blue-400 font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">
            Expertise Immobilière Locale
          </span>
          <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] uppercase italic">
            Basés à <br/> <span className="text-blue-500 underline decoration-8 underline-offset-8">Kinshasa</span>.
          </h1>
          <p className="text-slate-400 text-xl md:text-2xl max-w-2xl font-medium leading-relaxed italic">
            IMMO-CI simplifie la <span className="text-white font-bold">Location</span> et la <span className="text-white font-bold">Vente</span> de biens immobiliers en RD Congo.
          </p>
        </div>
        {/* Décoration subtile */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] -mr-64 -mt-64"></div>
      </section>

      {/* NOS SERVICES : Vente & Location */}
      <section className="max-w-6xl mx-auto py-24 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          <div className="p-10 bg-slate-50 rounded-[40px] border border-slate-100 hover:border-blue-200 transition-colors group">
            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">🏠</div>
            <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 mb-4">Location Facilitée</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Nous aidons les familles et les professionnels à trouver leur futur foyer à Kinshasa (Gombe, Ngaliema, Limete...). Finies les visites inutiles, nous sélectionnons le meilleur pour vous.
            </p>
          </div>
          <div className="p-10 bg-blue-600 text-white rounded-[40px] shadow-2xl shadow-blue-100 group">
            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">🏗️</div>
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Vente Sécurisée</h3>
            <p className="text-blue-100 font-medium leading-relaxed opacity-90">
              Vendez ou achetez votre patrimoine en toute sérénité. Nous agissons comme intermédiaire unique pour garantir la transparence des prix et la sécurité des transactions foncières.
            </p>
          </div>
        </div>

        {/* ENGAGEMENTS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center border-t border-slate-100 pt-24">
          <div className="space-y-4">
            <div className="text-3xl text-blue-600">🛡️</div>
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Vérification</h4>
            <p className="text-xs text-slate-400 font-bold uppercase leading-loose">Chaque bien est inspecté avant mise en ligne.</p>
          </div>
          <div className="space-y-4">
            <div className="text-3xl text-blue-600">🤝</div>
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Proximité</h4>
            <p className="text-xs text-slate-400 font-bold uppercase leading-loose">Une connaissance parfaite des quartiers de Kin.</p>
          </div>
          <div className="space-y-4">
            <div className="text-3xl text-blue-600">⚡</div>
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Réactivité</h4>
            <p className="text-xs text-slate-400 font-bold uppercase leading-loose">Contact direct WhatsApp pour un gain de temps.</p>
          </div>
        </div>
      </section>

      {/* LE FONDATEUR : Oscar Mulume */}
      <section className="bg-slate-50 py-24 px-6">
        <div className="max-w-5xl mx-auto bg-white rounded-[48px] p-8 md:p-16 shadow-2xl border border-white flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
          
          {/* Badge Local */}
          <div className="absolute top-8 right-8 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
            📍 Kinshasa, RDC
          </div>

          <div className="w-40 h-40 bg-slate-900 rounded-[32px] flex items-center justify-center text-white text-5xl font-black rotate-3 shadow-2xl flex-shrink-0">
            OM
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-900 uppercase mb-2 italic">Oscar Mulume</h2>
            <p className="text-blue-600 font-bold uppercase text-xs tracking-[0.3em] mb-8">Fondateur & Expert Immobilier</p>
            <p className="text-slate-500 font-medium leading-relaxed text-lg mb-10">
              &quot;Mon objectif est de moderniser le marché immobilier congolais. 
              Que vous cherchiez un appartement à louer ou une concession à acheter, 
              IMMO-CI est là pour vous éviter le stress et les intermédiaires multiples.&quot;
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <a 
                href={`https://wa.me/${MON_WHATSAPP}`} 
                className="bg-[#25D366] text-white px-10 py-5 rounded-[24px] font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-slate-900 transition-all active:scale-95"
              >
                WhatsApp Direct
              </a>
              <a 
                href={`mailto:${MON_EMAIL}`} 
                className="bg-white border-2 border-slate-100 text-slate-800 px-10 py-5 rounded-[24px] font-black uppercase text-[10px] tracking-[0.2em] hover:bg-slate-50 transition-all active:scale-95"
              >
                Envoyer un Email
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 text-center">
        <div className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">
          IMMO-CI © 2026 — Kinshasa Digital Real Estate
        </div>
      </footer>
    </main>
  );
}