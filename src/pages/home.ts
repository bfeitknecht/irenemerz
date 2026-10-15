import { html } from "../html.ts";
import type { PageMeta } from "../components/Layout.ts";

export const meta: PageMeta = {
  path: "/",
  title: "Aktuelles",
  description: "Aktuelles aus dem Atelier von Irène Merz, Glarus.",
};

export const body = html`
  <div class="home-intro">
    <h1 class="home-heading">Aktuelles</h1>
  </div>
  <figure class="home-banner">
    <img
      src="/img/banner-sw.jpg"
      alt="Schwarzwald-Banner über dem Atelier"
      width="2200"
      height="458"
      decoding="async"
    />
  </figure>
`;
