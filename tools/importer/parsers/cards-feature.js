/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-feature
 * Base block: cards
 * Source: https://www.holmesglen.edu.au/
 * Generated: 2026-05-07
 *
 * Handles three source patterns:
 * 1. Browse by Study Area: colored button links (.coloredButton a.cmp-button)
 * 2. In-Demand Skills carousel: (.multiSlideCarousel__demand-skills) slide items
 * 3. 3-col grid teasers: (.teaser__v2--image-left-aligned) image + title + description + CTA
 *    Note: element may be the teaser itself (single item matched by selector)
 *
 * Target: 2-column table, each row = [image | title + description + CTA]
 */
export default function parse(element, { document }) {
  const cells = [];

  // Detect if the element itself is a single teaser card
  const isSingleTeaser = element.classList.contains('teaser__v2--image-left-aligned')
    || element.querySelector(':scope > .cmp-teaser')
    || element.classList.contains('cmp-teaser');

  // Pattern 1: Colored button links (browse by study area)
  const coloredButtons = element.querySelectorAll('.coloredButton a.cmp-button, a.coloredButtonCmp');

  // Pattern 2: Carousel slides (demand skills)
  // Slick carousels may contain multiple .slick-slider instances for responsive breakpoints.
  // Only take slides from the FIRST .slick-track to avoid duplicates.
  const firstTrack = element.querySelector('.slick-track');
  const carouselSlides = firstTrack
    ? Array.from(firstTrack.querySelectorAll(':scope > .slick-slide:not(.slick-cloned)')).filter((s) => {
      const idx = parseInt(s.getAttribute('data-slick-index'), 10);
      return !Number.isNaN(idx) && idx >= 0;
    })
    : [];

  // Pattern 3: Multiple teaser cards in a container
  const teaserCards = !isSingleTeaser
    ? element.querySelectorAll('.teaser__v2--image-left-aligned, [class*="teaser__v2"]')
    : [];

  if (isSingleTeaser) {
    // The element itself is a teaser - extract content directly
    const source = element.querySelector('.cmp-teaser') || element;
    const image = source.querySelector('.cmp-teaser__image img, img');
    const title = source.querySelector('.cmp-teaser__pretitle, .cmp-teaser__title, h2, h3, h4');
    const description = source.querySelector('.cmp-teaser__description p, .cmp-teaser__description');
    const cta = source.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a');

    const imageCell = image ? [image] : '';
    const contentCell = [];
    if (title) contentCell.push(title);
    if (description && description !== title) contentCell.push(description);
    if (cta) contentCell.push(cta);

    if (imageCell || contentCell.length > 0) {
      cells.push([imageCell, contentCell.length > 0 ? contentCell : '']);
    }
  } else if (teaserCards.length > 0) {
    // Handle multiple teaser cards in a container
    teaserCards.forEach((teaser) => {
      const source = teaser.querySelector('.cmp-teaser') || teaser;
      const image = source.querySelector('.cmp-teaser__image img, img');
      const title = source.querySelector('.cmp-teaser__pretitle, .cmp-teaser__title, h2, h3, h4');
      const description = source.querySelector('.cmp-teaser__description p, .cmp-teaser__description');
      const cta = source.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a');

      const imageCell = image ? [image] : '';
      const contentCell = [];
      if (title) contentCell.push(title);
      if (description && description !== title) contentCell.push(description);
      if (cta) contentCell.push(cta);

      if (imageCell || contentCell.length > 0) {
        cells.push([imageCell, contentCell.length > 0 ? contentCell : '']);
      }
    });
  } else if (carouselSlides.length > 0) {
    // Handle carousel item pattern - each non-cloned slide is one card
    // Slick may duplicate items in the track. Deduplicate by normalized title.
    const seenTitles = [];
    for (let i = 0; i < carouselSlides.length; i += 1) {
      const slide = carouselSlides[i];
      const titleEl = slide.querySelector('h3, h4');
      if (!titleEl) continue;

      // Normalize title for dedup comparison
      const normalizedTitle = titleEl.textContent.replace(/\s+/g, ' ').trim().toLowerCase();
      if (seenTitles.indexOf(normalizedTitle) !== -1) continue;
      seenTitles.push(normalizedTitle);

      const image = slide.querySelector('.cmp-teaser__image img, .cmp-image__image, img');
      const title = titleEl;

      // Gather description content (job openings, salary info)
      const descParts = slide.querySelectorAll('li, .cmp-teaser__description p, p:not(:empty)');
      const cta = slide.querySelector('.cmp-teaser__action-link, a[class*="action"], a[class*="button"]');

      const imageCell = image ? [image] : '';
      const contentCell = [];
      contentCell.push(title);
      descParts.forEach((part) => {
        if (part.textContent.trim()) contentCell.push(part);
      });
      if (cta) contentCell.push(cta);

      cells.push([imageCell, contentCell]);
    }
  } else if (coloredButtons.length > 0) {
    // Handle colored button link pattern - no images, just link text as cards
    coloredButtons.forEach((button) => {
      const text = button.querySelector('.cmp-button__text');
      const href = button.getAttribute('href');

      const contentCell = [];

      if (text) {
        const titleEl = document.createElement('strong');
        titleEl.textContent = text.textContent.trim();
        contentCell.push(titleEl);
      }

      if (href) {
        const link = document.createElement('a');
        link.href = href;
        link.textContent = text ? text.textContent.trim() : href;
        contentCell.push(link);
      }

      if (contentCell.length > 0) {
        cells.push(['', contentCell]);
      }
    });
  }

  // Fallback: if no patterns matched, try generic extraction
  if (cells.length === 0) {
    const image = element.querySelector('img');
    const heading = element.querySelector('h2, h3, h4, strong, .cmp-title__text, [class*="pretitle"], [class*="title"]');
    const desc = element.querySelector('p, .cmp-text, [class*="description"]');
    const link = element.querySelector('a[class*="action"], a[class*="button"], a');

    const imageCell = image ? [image] : '';
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (desc && desc !== heading) contentCell.push(desc);
    if (link && link !== heading && link !== desc) contentCell.push(link);

    if (contentCell.length > 0) {
      cells.push([imageCell, contentCell]);
    }
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
  element.replaceWith(block);
}
