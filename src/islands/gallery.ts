/**
 * Client island for the artwork gallery (bundled to js/gallery.js).
 *
 * Progressive enhancement over the server-rendered grid:
 *  - category filter buttons (e.g. Alle / Holz / Stein / Metall / Weben)
 *  - lightbox with prev/next navigation and keyboard support
 *  - "inquire" button that opens a prefilled mailto containing the artwork id
 *
 * Without JavaScript the grid still works: every image links to its full-size
 * file and the contact page lists the same email address.
 */

import { site } from "../site.ts";
import { strings } from "../i18n.ts";

interface ArtworkEl extends HTMLElement {
  dataset: {
    id: string;
    category: string;
    description: string;
    image: string;
    width: string;
    height: string;
  };
}

const EMAIL = site.email;

const root = document.querySelector<HTMLElement>("[data-gallery]");
if (root) init(root);

function init(root: HTMLElement) {
  const items = [...root.querySelectorAll<ArtworkEl>(".artwork")];
  if (!items.length) return;

  const filterBox = root.querySelector<HTMLElement>("[data-gallery-filter]");
  if (filterBox) initFilter(filterBox, items);

  let current = -1;
  let lightbox: HTMLElement | null = null;

  function open(index: number) {
    current = (index + items.length) % items.length;
    show();
  }

  function show() {
    const item = items[current];
    const { id, category, description, image, width, height } = item.dataset;
    const w = Number(width) || 0;
    const h = Number(height) || 0;
    const subject = strings.inquireSubject(id, description);
    const body = strings.inquireBody({
      id,
      description,
      category,
      imageUrl: `https://${location.host}${image}`,
    });
    const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    if (!lightbox) {
      lightbox = buildLightbox();
      document.body.appendChild(lightbox);
      document.documentElement.classList.add("has-lightbox");
      document.addEventListener("keydown", onKey);
    }

    const img = lightbox.querySelector<HTMLImageElement>(".lightbox-img")!;
    img.src = image;
    img.alt = `${description} (${category})`;
    if (w && h) {
      img.width = w;
      img.height = h;
    }
    lightbox.querySelector<HTMLElement>(".lightbox-desc")!.textContent =
      description;
    lightbox.querySelector<HTMLElement>(".lightbox-meta")!.textContent =
      category;
    const inquire = lightbox.querySelector<HTMLAnchorElement>(
      ".lightbox-inquire",
    )!;
    inquire.href = mailto;
    const counter = lightbox.querySelector<HTMLElement>(".lightbox-counter")!;
    counter.textContent = `${current + 1} / ${items.length}`;
  }

  function close() {
    lightbox?.remove();
    lightbox = null;
    document.documentElement.classList.remove("has-lightbox");
    document.removeEventListener("keydown", onKey);
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight") open(current + 1);
    else if (e.key === "ArrowLeft") open(current - 1);
  }

  items.forEach((item, i) => {
    item.querySelector(".artwork-link")?.addEventListener("click", (e) => {
      e.preventDefault();
      open(i);
    });
  });

  function buildLightbox(): HTMLElement {
    const el = document.createElement("div");
    el.className = "lightbox";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-label", strings.lightboxLabel);
    el.innerHTML = `
      <div class="lightbox-backdrop"></div>
      <figure class="lightbox-panel">
        <button class="lightbox-close" type="button" aria-label="${strings.lightboxClose}">×</button>
        <button class="lightbox-nav lightbox-prev" type="button" aria-label="${strings.lightboxPrev}">‹</button>
        <button class="lightbox-nav lightbox-next" type="button" aria-label="${strings.lightboxNext}">›</button>
        <img class="lightbox-img" alt="" />
        <figcaption class="lightbox-caption">
          <span class="lightbox-desc"></span>
          <span class="lightbox-meta"></span>
          <span class="lightbox-counter"></span>
          <a class="lightbox-inquire button" href="#">${strings.inquireButton}</a>
        </figcaption>
      </figure>`;
    el.querySelector(".lightbox-backdrop")!.addEventListener("click", close);
    el.querySelector(".lightbox-close")!.addEventListener("click", close);
    el.querySelector(".lightbox-prev")!.addEventListener(
      "click",
      () => open(current - 1),
    );
    el.querySelector(".lightbox-next")!.addEventListener(
      "click",
      () => open(current + 1),
    );
    return el;
  }

  function initFilter(box: HTMLElement, list: ArtworkEl[]) {
    const categories = [...new Set(list.map((i) => i.dataset.category))];
    const buttons = [strings.filterAll, ...categories].map((cat) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "filter-button";
      b.textContent = cat;
      b.setAttribute(
        "aria-pressed",
        cat === strings.filterAll ? "true" : "false",
      );
      b.addEventListener("click", () => {
        for (const other of box.querySelectorAll(".filter-button")) {
          other.setAttribute("aria-pressed", other === b ? "true" : "false");
        }
        for (const item of list) {
          item.hidden = cat !== strings.filterAll &&
            item.dataset.category !== cat;
        }
      });
      return b;
    });
    box.append(...buttons);
    box.hidden = false;
  }
}
