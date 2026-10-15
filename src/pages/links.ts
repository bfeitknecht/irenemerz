import { html } from "../html.ts";
import type { PageMeta } from "../components/Layout.ts";

export const meta: PageMeta = {
  path: "/links/",
  title: "Links",
  description:
    "Netzwerke und Partnerschaften von Irène Merz — SGBK, Raum 4, Scuola di Scultura und mehr.",
};

const links = [
  {
    label: "Schweizerische Gesellschaft Bildender Künstlerinnen",
    href: "https://www.sgbk.ch/index.php?id=15",
  },
  { label: "Raum 4", href: "http://www.raum4.ch/objekte/raum4_objekte.htm" },
  {
    label: "Martin Hufschmid, Werkstatt für Metallgestaltung und Skulpturen",
    href: "https://www.martinhufschmid.ch/",
  },
  {
    label: "Scuola di Scultura, Bildhauerschule in Peccia TI",
    href: "https://www.marmo.ch/",
  },
  { label: "Lukretia Florin", href: "http://www.florintextil.ch/" },
  { label: "Beer Merz Architekten", href: "http://www.beermerz.ch/" },
];

export const body = html`
  <div class="links">
    <h2>Diese Netzwerke und Partnerschaften sind mir wichtig</h2>
    <ul>
      ${links.map((l) =>
        html`<li>
          ${l.label} → <a href=${l.href} target="_blank" rel="noopener">www</a>
        </li>`
      )}
    </ul>
  </div>
`;
