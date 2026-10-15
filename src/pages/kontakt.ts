import { html } from "../html.ts";
import type { PageMeta } from "../components/Layout.ts";
import { site } from "../site.ts";

export const meta: PageMeta = {
  path: "/kontakt/",
  title: "Kontakt",
  heading: "So erreichen Sie mich",
  description:
    "Kontakt zum Atelier Irène Merz in Glarus — Telefon, E-Mail, Adresse.",
};

export const body = html`
  <div class="contact">
    <h2>Ich freue mich auf Ihre Nachricht</h2>
    <p>
      Telefon <a href=${site.phoneHref}>${site.phone}</a> oder
      <a href=${`mailto:${site.email}`}>${site.email}</a>
    </p>
    <p class="contact-address">
      ${site.address[0]}<br />${site.address[1]}
    </p>
    <figure class="contact-banner">
      <img
        src="/img/banner-webstuhl.jpg"
        alt="Webstuhl im Atelier"
        width="920"
        height="293"
        loading="lazy"
        decoding="async"
      />
    </figure>
  </div>
`;
