/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-banner
 * Base block: hero
 * Source: https://www.holmesglen.edu.au/
 * Selector: .carousel__heroBanner .teaser__hero-banner
 * Generated: 2026-05-07
 */
export default function parse(element, { document }) {
  // Extract background image from the teaser image area
  const bgImage = element.querySelector('.cmp-image__image, .cmp-teaser__image img');

  // Extract pretitle (used as a smaller heading/subtitle)
  const pretitle = element.querySelector('.cmp-teaser__pretitle');

  // Extract main heading (h1 or h2)
  const heading = element.querySelector('h1.cmp-teaser__title, h2.cmp-teaser__title, .cmp-teaser__title');

  // Extract description paragraph
  const description = element.querySelector('.cmp-teaser__description p, .cmp-teaser__description');

  // Extract CTA action links
  const ctaLinks = Array.from(element.querySelectorAll('.cmp-teaser__action-link, .cmp-teaser__action-container a'));

  // Build cells array matching block library structure:
  // Row 1: Background image
  // Row 2: Title + subheading + paragraph + CTAs (all in one cell)
  const cells = [];

  // Row 1: Background image
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Content cell with heading, pretitle, description, and CTAs (single cell)
  const contentWrapper = document.createElement('div');

  if (heading) {
    contentWrapper.append(heading);
  }

  if (pretitle && pretitle.textContent.trim()) {
    // Render pretitle as a secondary heading
    const subHeading = document.createElement('h2');
    subHeading.textContent = pretitle.textContent.trim();
    contentWrapper.append(subHeading);
  }

  if (description) {
    contentWrapper.append(description);
  }

  if (ctaLinks.length > 0) {
    ctaLinks.forEach((link) => contentWrapper.append(link));
  }

  if (contentWrapper.children.length > 0) {
    cells.push([contentWrapper]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
