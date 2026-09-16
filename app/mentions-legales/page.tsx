import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales | IMMO-CI",
  description:
    "Informations légales de IMMO-CI, plateforme immobilière éditée par Mulume Izuba Oscar.",
};

export default function MentionsLegalesPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14 text-slate-700">
      <h1 className="text-3xl font-bold text-slate-900">Mentions légales</h1>
      <p className="mt-2 text-sm text-slate-500">Dernière mise à jour : 16/09/2026</p>

      <section className="mt-10 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">1. Éditeur du site</h2>
          <p className="mt-2 leading-relaxed">
            Le site <strong>IMMO-CI</strong> (plateforme de mise en relation immobilière pour
            Kinshasa et la RDC) est édité par :
          </p>
          <p className="mt-2 leading-relaxed">
            <strong>Mulume Izuba Oscar</strong>
            <br />
            Développeur indépendant et éditeur de solutions logicielles.
          </p>
          <p className="mt-2 leading-relaxed">
            Contact : la demande doit être adressée via la page de contact du site ou l&apos;adresse
            électronique communiquée lors de la création du compte.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-900">2. Hébergement et données</h2>
          <p className="mt-2 leading-relaxed">
            Le site est hébergé sur une infrastructure cloud sécurisée (Vercel). Les annonces et
            comptes utilisateurs sont stockés sur un service d&apos;hébergement de données cloud
            (Supabase) dans des emplacements respectant la législation applicable.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-900">3. Propriété intellectuelle</h2>
          <p className="mt-2 leading-relaxed">
            L&apos;ensemble des éléments du site (structure, textes, interfaces, logo, code
            source, photographies) est la propriété exclusive de <strong>Mulume Izuba Oscar</strong>{" "}
            ou de ses ayants droit. Toute reproduction, représentation ou exploitation, totale ou
            partielle, sans autorisation préalable écrite est interdite.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-900">4. Données personnelles et cookies</h2>
          <p className="mt-2 leading-relaxed">
            Le site utilise le stockage local de l&apos;appareil (localStorage) pour le
            fonctionnement de l&apos;application. Les données personnelles collectées ne sont
            jamais revendues à des tiers.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-900">5. Droit applicable et juridiction</h2>
          <p className="mt-2 leading-relaxed">
            Le présent site et son utilisation sont régis par le droit applicable au lieu
            d&apos;établissement de l&apos;éditeur. En cas de litige, une solution amiable sera
            recherchée préalablement à toute action judiciaire devant la juridiction compétente.
          </p>
        </div>
      </section>
    </main>
  );
}