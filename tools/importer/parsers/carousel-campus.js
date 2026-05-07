/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-campus
 * Base block: carousel
 * Source: https://www.holmesglen.edu.au/
 * Selector: .multiSlideCarousel__course-detail
 * Generated: 2026-05-07
 *
 * Extracts campus image carousel slides. Each non-cloned slide becomes a row
 * with the linked image in cell 1 and the campus name as a heading in cell 2.
 */
export default function parse(element, { document }) {
  // Get all carousel items, excluding cloned slides (slick duplicates for infinite scroll)
  const slides = element.querySelectorAll('.slick-slide:not(.slick-cloned) .cmp-carousel__item');

  const cells = [];

  slides.forEach((slide) => {
    const imageContainer = slide.querySelector('.cmp-image');
    if (!imageContainer) return;

    const img = imageContainer.querySelector('img.cmp-image__image');
    const link = imageContainer.querySelector('a.cmp-image__link');
    const captionSpan = imageContainer.querySelector('span.caption-text, .caption-text');

    if (!img) return;

    // Cell 1: Image (wrapped in link if available)
    let imageCell;
    if (link) {
      const newLink = document.createElement('a');
      newLink.href = link.getAttribute('href');
      const newImg = img.cloneNode(true);
      newLink.appendChild(newImg);
      imageCell = newLink;
    } else {
      imageCell = img.cloneNode(true);
    }

    // Cell 2: Campus name as heading + optional description
    const contentCell = [];
    const captionText = captionSpan ? captionSpan.textContent.trim() : (img.getAttribute('alt') || '');

    if (captionText) {
      const heading = document.createElement('h2');
      heading.textContent = captionText;
      contentCell.push(heading);
    }

    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-campus', cells });
  element.replaceWith(block);
}
