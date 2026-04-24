/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-exhibition
 * Base block: cards
 * Source: https://www.galleries.unsw.edu.au
 * Generated: 2026-04-24
 *
 * Source structure: div.teaser-items.grid containing div.teaser-item.views-row children.
 * Each teaser-item has: article.teaser-card > a[href] wrapping:
 *   - div.teaser-image > img (exhibition image)
 *   - div.teaser-content > h3.teaser-title (title) + div.field__item (dates)
 *
 * Target structure (Cards block): 2-column rows.
 *   Column 1: Image
 *   Column 2: Title (as heading) + date range (as description) + link (as CTA)
 */
export default function parse(element, { document }) {
  // Select all teaser card items within the grid
  const teaserItems = element.querySelectorAll('.teaser-item article.teaser-card, .views-row article.teaser-card');

  const cells = [];

  teaserItems.forEach((card) => {
    // Extract the wrapping link for href
    const link = card.querySelector('a[href]');
    const href = link ? link.getAttribute('href') : null;

    // Column 1: Image
    const img = card.querySelector('.teaser-image img, img.img-fluid');

    // Column 2: Title + Dates + CTA link
    const title = card.querySelector('h3.teaser-title, .teaser-content-inner h3');
    const dateField = card.querySelector('.field--name-field-dates .field__item, .field__item');

    // Build the content cell (column 2)
    const contentCell = [];

    // Add title as a heading element
    if (title) {
      const h3 = document.createElement('h3');
      h3.textContent = title.textContent.trim();
      contentCell.push(h3);
    }

    // Add date range as description paragraph
    if (dateField) {
      const p = document.createElement('p');
      p.textContent = dateField.textContent.trim();
      contentCell.push(p);
    }

    // Add CTA link to the exhibition detail page
    if (href) {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = title ? title.textContent.trim() : 'View Exhibition';
      contentCell.push(a);
    }

    // Build the image cell (column 1)
    const imageCell = [];
    if (img) {
      const imgEl = document.createElement('img');
      imgEl.src = img.getAttribute('src') || '';
      imgEl.alt = img.getAttribute('alt') || '';
      imageCell.push(imgEl);
    }

    // Add row: [image cell, content cell]
    if (imageCell.length > 0 || contentCell.length > 0) {
      cells.push([imageCell, contentCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-exhibition', cells });
  element.replaceWith(block);
}
