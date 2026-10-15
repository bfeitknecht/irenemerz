import * as home from "./home.ts";
import * as meineArbeiten from "./meine-arbeiten.ts";
import * as ausstellungen from "./ausstellungen.ts";
import * as biografie from "./biografie.ts";
import * as links from "./links.ts";
import * as kontakt from "./kontakt.ts";
import * as impressum from "./impressum.ts";

export interface PageModule {
  meta: import("../components/Layout.ts").PageMeta;
  body: unknown;
}

/** Nav order defines the sitemap order. */
export const pages: PageModule[] = [
  home,
  meineArbeiten,
  ausstellungen,
  biografie,
  links,
  kontakt,
  impressum,
];
