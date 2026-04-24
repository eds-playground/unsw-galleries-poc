/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-info
 * Base block: columns
 * Source: https://www.galleries.unsw.edu.au
 * Selector: .cta-tile
 * Generated: 2026-04-24
 *
 * Source structure:
 *   .cta-tile > .row > .mb-4.col-md-6.col-xl-3 (x4)
 *     Each column contains: a.icon-tile-item[href] > .tile-content
 *       .tile-heading > h3 (title)
 *       .tile-body > p (description text)
 *
 * Target: Columns block with one content row, each tile becomes a cell
 * containing heading (as link) + body text.
 */
export default function parse(element, { document }) {
  // Select all tile items within the cta-tile container
  const tileColumns = element.querySelectorAll('.mb-4 a.icon-tile-item');

  // Build a single row with one cell per tile
  const row = [];

  tileColumns.forEach((tile) => {
    const cellContent = [];

    // Extract heading
    const heading = tile.querySelector('.tile-heading h3');
    const href = tile.getAttribute('href');

    if (heading) {
      // Create a linked heading to preserve the tile's link destination
      const link = document.createElement('a');
      link.setAttribute('href', href || '#');
      link.textContent = heading.textContent.trim();

      const h3 = document.createElement('h3');
      h3.appendChild(link);
      cellContent.push(h3);
    }

    // Extract body paragraphs
    const bodyParagraphs = tile.querySelectorAll('.tile-body p');
    bodyParagraphs.forEach((p) => {
      // Skip empty or non-breaking-space-only paragraphs
      const text = p.textContent.trim();
      if (text && text !== ' ') {
        cellContent.push(p);
      }
    });

    if (cellContent.length > 0) {
      row.push(cellContent);
    }
  });

  const cells = [];
  if (row.length > 0) {
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-info', cells });
  element.replaceWith(block);
}
