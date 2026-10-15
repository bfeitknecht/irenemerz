import { html } from "../html.ts";
import type { PageMeta } from "../components/Layout.ts";

export const meta: PageMeta = {
  path: "/ausstellungen/",
  title: "Ausstellungen",
  heading: "Vergangene Ausstellungen",
  description:
    "Vergangene Ausstellungen von Irène Merz — eine Übersicht von 2008 bis heute.",
};

const exhibitions: {
  year: string;
  entries: { title: string; detail?: string; href?: string }[];
}[] = [
  {
    year: "2025",
    entries: [{ title: "Kunstausstellung Kornhaus Frick" }],
  },
  {
    year: "2024",
    entries: [{
      title: "Weltgeschichte",
      detail: "Kulturraum Waldenburg, SGBK",
    }],
  },
  {
    year: "2023",
    entries: [
      {
        title: "KulturNacht Laufenburg",
        detail: "kulturnachtlaufenburg.com",
        href: "https://kulturnachtlaufenburg.com",
      },
      { title: "Galerie HautArt" },
      {
        title: "Vom Bundeshaus nach Waldenburg",
        detail: "Eröffnung des Kulturraum Waldenburg, SGBK",
      },
    ],
  },
  {
    year: "2022",
    entries: [
      {
        title: "Canobbio espone",
        detail: "Skulpturenweg im Dorf, Scuola di Scultura di Peccia",
      },
      {
        title: "Spazio alle donne",
        detail: "Museo Casorella, via Bartolomeo Rusca 5, 6600 Locarno",
      },
      {
        title: "Galerie Carzaniga",
        detail:
          "120 Jahre SGBK Gruppenausstellung, Galerie Carzaniga, Gemsberg 10, 4051 Basel",
      },
    ],
  },
  {
    year: "2021",
    entries: [
      {
        title: "Frauen im Bundeshaus",
        detail: "Bern",
        href: "https://sgbk-kunst-im-bundeshaus.ch",
      },
      {
        title: "SGBK museum design collection",
        detail: "Basel, Spalenvorstadt 18, 11. bis 27. November 2021",
      },
    ],
  },
  {
    year: "2020",
    entries: [{ title: "Theodorshofweg 22", detail: "4310 Rheinfelden" }],
  },
  {
    year: "2019",
    entries: [{
      title: "ArteTEMPORIS 4",
      detail: "4310 Rheinfelden, Marktgasse 25/27",
    }],
  },
  {
    year: "2018",
    entries: [{
      title: "Galerie Kunst.part",
      detail: "Spalenberg 30, 4051 Basel, mit Elke Höylä-Vogt",
    }],
  },
  {
    year: "2017",
    entries: [{
      title: "Praxiseröffnung von Dr. med. Petra Ellgehausen",
      detail:
        "Dermatologie & Ästhetik, Marktgasse 1, 4310 Rheinfelden, mit Ursula Püschel",
    }],
  },
  {
    year: "2016",
    entries: [
      {
        title: "Galerie Magidunum",
        detail: "Adlerstr. 1, 4312 Maden, Gruppenausstellung",
      },
      {
        title: "50 Jahre Frauenstimmrecht in Basel",
        detail: "Rathaus Innenhof, Veranstalterin: SGBK (Gruppenausstellung)",
      },
    ],
  },
  {
    year: "2015",
    entries: [
      { title: "Hotel Eden Rheinfelden", detail: "Jahresausstellung im Park" },
      {
        title: "Galerie pot-au-feu",
        detail: "Gruppenausstellung in Fischbach/Göslikon",
      },
    ],
  },
  {
    year: "2014",
    entries: [
      { title: "SGBK Kulturkraftwerk Augst", detail: "Gruppenausstellung" },
      { title: "raum 4", detail: "Gruppenausstellung in Herrliberg" },
      {
        title: "Galerie Artune arichitektur & art",
        detail: "Panoramaweg 29, 5070 Frick, mit Heinke Torpus, Sissach",
      },
    ],
  },
  {
    year: "2013",
    entries: [
      {
        title: "Galerie Burgwerk Riehen",
        detail: "Jubiläumsausstellung 111 Jahre SGBK, Gruppenausstellung",
      },
      {
        title: "Galerie Artworks",
        detail: "Gerberstr. 11, 4410 Liestal, Gruppenausstellung SGBK",
      },
    ],
  },
  {
    year: "2012",
    entries: [
      {
        title: "Orangerie im Peter Merian Park",
        detail: "Basel, mit Elke Höylä-Vogt, Maisprach",
      },
      { title: "Galerie Art Poster", detail: "Zürich, Holzobjekt" },
    ],
  },
  {
    year: "2011",
    entries: [
      { title: "raum 4", detail: "Wädenswil" },
      { title: "Offenes Atelier", detail: "Maisprach" },
    ],
  },
  {
    year: "2010",
    entries: [{
      title: "Missa de Maria a Magdala",
      detail:
        "Ausstellung anlässlich der Welturaufführung, komponiert von Paul Lukaszewski, Bremgarten AG, Gruppenausstellung",
    }],
  },
  {
    year: "2009",
    entries: [
      { title: "Museum Cevio", detail: "Tessin" },
      {
        title: "Diplomfeier der Scuola di Scultura di Peccia",
        detail: "Gruppenausstellung",
      },
    ],
  },
  {
    year: "2008",
    entries: [{
      title: "Objekte im Licht",
      detail:
        "Maisprach, Gruppenausstellung mit Martin Hufschmid, Fischbach/Göslikon und Margrit Leuthold, Wegenstetten",
    }],
  },
];

export const body = html`
  <div class="exhibitions">
    ${exhibitions.map((ex) =>
      html`<section class="exhibition-year">
        <h2>${ex.year}</h2>
        ${
        ex.entries.map((e) =>
          html`<div class="exhibition-entry">
            <p class="exhibition-title">
              ${
            e.href
              ? html`<em><a href=${e.href} target="_blank" rel="noopener">«${e.title}»</a></em>`
              : html`<em>«${e.title}»</em>`
          }
            </p>
            ${e.detail && html`<p class="exhibition-detail">${e.detail}</p>`}
          </div>`
        )
      }
      </section>`
    )}
  </div>
`;
