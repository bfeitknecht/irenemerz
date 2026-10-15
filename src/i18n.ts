/**
 * Visitor-facing UI strings (i18n).
 *
 * The site's audience is German-speaking, so `de` is the default locale used
 * across the components and the client island. The prose content in
 * `src/pages/` is part of the content itself and stays in the page components.
 *
 * To add a locale (e.g. English), add another object to `locales` — the
 * `UiStrings` type guarantees every key is implemented, and switch
 * `strings` to it (per-locale selection can later be wired to the URL).
 */
export interface UiStrings {
  /** aria-label for the main navigation. */
  navLabel: string;
  footerHeading: string;
  footerPhone: string;
  footerEmail: string;
  footerImprint: string;
  /** Hint below the artwork grid. */
  galleryHint: string;
  /** Label of the filter button that shows every category. */
  filterAll: string;
  lightboxLabel: string;
  lightboxClose: string;
  lightboxPrev: string;
  lightboxNext: string;
  /** Lightbox button that opens the prefaced inquiry email. */
  inquireButton: string;
  inquireSubject: (id: string, description: string) => string;
  inquireBody: (artwork: {
    id: string;
    description: string;
    category: string;
    imageUrl: string;
  }) => string;
}

const de: UiStrings = {
  navLabel: "Hauptnavigation",
  footerHeading: "Kontakt",
  footerPhone: "Telefon",
  footerEmail: "E-Mail",
  footerImprint: "Impressum",
  galleryHint:
    "Ein Werk anklicken für Details — Interesse an einem Werk? Ein Klick auf «Kaufanfrage» öffnet eine vorbereitete E-Mail.",
  filterAll: "Alle",
  lightboxLabel: "Werkansicht",
  lightboxClose: "Schliessen",
  lightboxPrev: "Vorheriges Werk",
  lightboxNext: "Nächstes Werk",
  inquireButton: "Kaufanfrage senden",
  inquireSubject: (id, description) =>
    `Kaufanfrage Werk ${id} (${description})`,
  inquireBody: ({ id, description, category, imageUrl }) =>
    [
      "Ich interessiere mich für folgendes Werk:",
      "",
      `Werk-ID: ${id}`,
      `Beschreibung: ${description}`,
      `Kategorie: ${category}`,
      `Bild: ${imageUrl}`,
      "",
      "Name:",
      "Adresse:",
      "Telefon:",
      "",
      "Nachricht:",
    ].join("\n"),
};

const locales: Record<string, UiStrings> = { de };

/** Active locale. Swap this once multi-locale routing exists. */
export const strings: UiStrings = locales.de;
