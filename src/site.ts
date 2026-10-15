/** Global site configuration. */
export const site = {
  title: "atelier irène merz",
  description:
    "Atelier Irène Merz, Glarus — Skulpturen und Objekte aus Stein, Holz, Metall und gewebten Materialien.",
  logo: "/img/logo.png",
  favicon: "/favicon.ico",
  email: "mail@irenemerz.ch",
  phone: "061 841 17 51",
  phoneHref: "tel:+41618411751",
  phoneMobile: "079 927 88 95",
  address: ["atelier irène merz", "bärengasse 6 | 8750 Glarus"],
  nav: [
    { label: "Aktuelles", href: "/" },
    { label: "Meine Arbeiten", href: "/meine-arbeiten/" },
    { label: "Ausstellungen", href: "/ausstellungen/" },
    { label: "Biografie", href: "/biografie/" },
    { label: "Links", href: "/links/" },
    { label: "Kontakt", href: "/kontakt/" },
  ],
  /** Canonical host, used for absolute URLs (canonical, og:, sitemap). */
  host: "irenemerz.ch",
} as const;
