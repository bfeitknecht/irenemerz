import { html } from "../html.ts";
import type { PageMeta } from "../components/Layout.ts";

export const meta: PageMeta = {
  path: "/biografie/",
  title: "Biografie",
  description:
    "Biografie von Irène Merz — Keramik, Steinbildhauen und Weben. Mitglied der SGBK.",
};

const atelierPhotos = [1, 2, 3, 4, 5, 6].map((n) => ({
  src: `/img/biografie/atelier-${n}.jpg`,
  alt: `Atelier-Eindruck ${n}`,
}));

export const body = html`
  <div class="bio">
    <section class="bio-block">
      <h2>Schön, dass Sie sich für meine Kunst interessieren!</h2>
      <p>
        <strong>1944</strong> geboren in Basel, wo ich auch die Schulen inkl.
        Kunstgewerbeschule Basel Vorkurs A besuchte. Danach folgte die
        Ausbildung zur Krankenschwester und später zur Arbeits-Agogin.
      </p>
      <p><strong>2016</strong> haben wir unseren Wohnsitz nach Glarus verlegt.</p>
      <p>
        → <a href="https://www.sgbk.ch/index.php?id=15" target="_blank" rel="noopener">
          Mitglied SGBK: Schweizerische Gesellschaft Bildender Künstlerinnen
        </a>
      </p>
    </section>

    <section class="bio-block">
      <h2>Mein Werdegang</h2>
      <p>
        Das Gestalten ist eine Leidenschaft, die mich seit meiner frühsten
        Kindheit begleitet, mich nicht mehr loslässt, die Zeit vergessen lässt
        und mich erfüllt.
      </p>
      <p>
        Abwechslungsweise bearbeite ich mal das eine, mal das andere Material.
        Gerne vertiefe ich mich in die Arbeiten mit einem Material. Zuerst war
        es die Keramik die mich fesselte, später kam das Arbeiten am Webstuhl
        dazu. Diese Leidenschaft musste ich jedoch mangels Zeit wieder etwas
        zurück stecken. Nach vielen Kursen und Weiterbildungen arbeitete ich ab
        1984 in meiner eigenen Keramikwerkstatt. Mein Know-how gab ich mit
        Freude weiter und nahm gelegentlich in der Region an
        Keramik-Ausstellungen teil. Die Suche nach weiteren
        Ausdrucksmöglichkeiten führte mich zu einem Steinbildhauerkurs bei
        Margrit Leuthold in Wegenstetten und zurück an die Schule für
        Gestaltung, wo ich die Fächer drei-dimensionales Gestalten und
        Aktzeichnen belegte. Ab 2005 folgte die Weiterbildung an der Scuola di
        Scultura in Peccia für Steinbildhauen und dreidimensionales Gestalten,
        die ich 2009 mit dem Zertifikat abschloss. In weiteren Kursen bei
        Daniel Eggli und Martin Hufschmid lernte ich den Umgang mit der
        Kettensäge und anderen Werkzeugen, die sich für die Holzbearbeitung
        eignen. Seit dem Wohnungswechsel intensiviere ich wieder das alte
        Handwerk WEBEN.
      </p>
    </section>

    <ul class="bio-gallery" aria-label="Atelier-Eindrücke">
      ${atelierPhotos.map((p) =>
        html`<li><img src=${p.src} alt=${p.alt} loading="lazy" decoding="async" /></li>`
      )}
    </ul>
  </div>
`;
