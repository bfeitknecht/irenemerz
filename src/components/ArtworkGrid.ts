import type { Artwork } from "../types.ts";
import { strings } from "../i18n.ts";
import { html } from "../html.ts";

/**
 * Server-rendered artwork grid. Without JavaScript every image links straight
 * to its full-size file; the gallery island upgrades this to a filterable grid
 * with a lightbox and an inquiry mailto.
 */
export function ArtworkGrid({ artworks }: { artworks: readonly Artwork[] }) {
  return html`
    <div class="gallery" data-gallery>
      <div class="gallery-filter" data-gallery-filter hidden></div>
      <ul class="gallery-grid">
        ${artworks.map((a) =>
          html`
            <li
              class="artwork"
              data-id=${a.id}
              data-category=${a.category}
              data-description=${a.description}
              data-image=${a.image}
              data-width=${a.width}
              data-height=${a.height}
            >
              <a href=${a.image} class="artwork-link">
                <img
                  src=${a.thumb}
                  alt=${`${a.description} (${a.category})`}
                  width=${a.thumbWidth}
                  height=${a.thumbHeight}
                  loading="lazy"
                  decoding="async"
                />
                <span class="artwork-caption">${a.description}</span>
              </a>
            </li>
          `
        )}
      </ul>
      <p class="gallery-hint">${strings.galleryHint}</p>
    </div>
  `;
}
