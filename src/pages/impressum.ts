import { html } from "../html.ts";
import type { PageMeta } from "../components/Layout.ts";
import { site } from "../site.ts";

export const meta: PageMeta = {
  path: "/impressum/",
  title: "Impressum",
  description: "Impressum und Datenschutzerklärung des Ateliers Irène Merz.",
};

export const body = html`
  <div class="impressum">
    <h2>Impressum</h2>
    <p>
      Firmenname: atelier irène merz<br />
      Adresse: bärengasse 6, CH-8750 Glarus<br />
      Telefon <a href="tel:+41799278895">${site.phoneMobile}</a>
    </p>
    <p>Geschäftsführerin und für den Inhalt Verantwortliche: Irène Merz</p>

    <h2>Datenschutzerklärung</h2>
    <p>
      Wir freuen uns über Ihr Interesse an unserer Website. Für externe Links
      zu fremden Inhalten können wir trotz sorgfältiger inhaltlicher Kontrolle
      keine Haftung übernehmen. Der Schutz Ihrer personenbezogenen Daten ist
      uns ein wichtiges Anliegen. Ihre Daten werden im Rahmen der gesetzlichen
      Vorschriften geschützt.
    </p>

    <h3>1. Erhebung und Verarbeitung von Daten</h3>
    <p>
      Diese Website ist eine statische Website und setzt keine Cookies und
      keine Tracking-Werkzeuge ein. Beim Aufruf der Website werden durch den
      Hosting-Anbieter (GitHub Pages) technisch notwendige Zugriffsdaten
      protokolliert: abgerufene Datei, Datum und Uhrzeit des Abrufs,
      übertragene Datenmenge, Meldung über erfolgreichen Abruf, Webbrowser und
      anfragende Domain. Weitergehende personenbezogene Daten werden nur
      erfasst, wenn Sie diese Angaben freiwillig machen, etwa im Rahmen einer
      Anfrage per E-Mail.
    </p>

    <h3>2. Nutzung und Weitergabe personenbezogener Daten</h3>
    <p>
      Soweit Sie uns personenbezogene Daten zur Verfügung gestellt haben,
      verwenden wir diese nur zur Beantwortung Ihrer Anfragen und für die
      technische Administration. Ihre personenbezogenen Daten werden an Dritte
      nicht weitergegeben.
    </p>

    <h3>3. Auskunftsrecht</h3>
    <p>
      Auf schriftliche Anfrage werden wir Sie gern über die zu Ihrer Person
      gespeicherten Daten informieren. Sicherheitshinweis: Bei der
      Kommunikation per E-Mail kann die vollständige Datensicherheit nicht
      gewährleistet werden, so dass wir Ihnen bei vertraulichen Informationen
      den Postweg empfehlen.
    </p>
  </div>
`;
