import { html } from "../html.ts";
import type { PageMeta } from "../components/Layout.ts";
import { ArtworkGrid } from "../components/ArtworkGrid.ts";
import artworksJson from "../data/artworks.json" with { type: "json" };
import type { Artwork } from "../types.ts";

const artworks = artworksJson as Artwork[];

export const meta: PageMeta = {
  path: "/meine-arbeiten/",
  title: "Meine Arbeiten",
  description:
    "Skulpturen und Objekte von Irène Merz — Stein, Holz, Metall und Weberei. Bei Interesse an einem Werk kontaktieren Sie mich gerne.",
};

export const body = html`
  <div class="intro">
    <h2>Meine Arbeiten sind meist namenlos.</h2>
    <p>Den Assoziationen dürfen freien Lauf gelassen werden.</p>
    <p>
      Kontaktieren Sie mich gerne bei Fragen oder Interesse.<br />
      → <a href="mailto:mail@irenemerz.ch">mail@irenemerz.ch</a>.
    </p>
  </div>
  <${ArtworkGrid} artworks=${artworks} />
`;
