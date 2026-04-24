/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-gallery
 * Base block: hero
 * Source: https://www.galleries.unsw.edu.au
 * Selector: .section-wrapper.hero_section
 * Generated: 2026-04-24
 *
 * Source HTML structure:
 *   .section-wrapper.hero_section > .container > .indented-container >
 *     .hero-banner-content.row > div > .section-block-item
 *       - h1 (main heading, e.g. "UNSW Galleries")
 *       - Optional: h2, h3 (subheadings)
 *       - Optional: p (description text)
 *       - Optional: a (CTA links)
 *       - Optional: img (background image)
 *
 * Target table (from block library):
 *   Row 1: block name "hero-gallery"
 *   Row 2 (optional): background image
 *   Row 3: heading + optional subheading + optional CTA
 */
export default function parse(element, { document }) {
  // Extract background image if present (could be an img tag or a picture element)
  const bgImage = element.querySelector('img');

  // Extract headings - primary heading is h1, fallback to h2
  const heading = element.querySelector('h1, h2');

  // Extract subheadings - h2 or h3 that follow the primary heading
  const subheadings = [];
  const h2Elements = element.querySelectorAll('h2, h3');
  h2Elements.forEach((h) => {
    // Only include as subheading if it is not the primary heading
    if (h !== heading) {
      subheadings.push(h);
    }
  });

  // Extract description paragraphs (exclude paragraphs inside links/buttons)
  const descriptions = Array.from(element.querySelectorAll('p')).filter(
    (p) => !p.closest('a'),
  );

  // Extract CTA links/buttons
  const ctaLinks = Array.from(
    element.querySelectorAll('a.btn, a.button, a.cta, .field--type-link a, a[href]'),
  ).filter((a) => {
    // Filter out links that are wrapping images or non-CTA anchors
    const text = a.textContent.trim();
    return text.length > 0 && !a.querySelector('img');
  });

  const cells = [];

  // Row 2 (optional): Background image
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 3: Content cell - heading, subheadings, descriptions, CTAs
  const contentCell = [];

  if (heading) {
    contentCell.push(heading);
  }

  subheadings.forEach((sub) => {
    contentCell.push(sub);
  });

  descriptions.forEach((desc) => {
    contentCell.push(desc);
  });

  ctaLinks.forEach((cta) => {
    contentCell.push(cta);
  });

  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-gallery', cells });
  element.replaceWith(block);
}
