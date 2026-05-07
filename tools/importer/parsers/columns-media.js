/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-media
 * Base block: columns
 * Source: https://www.holmesglen.edu.au/
 * Instances:
 *   - .container__embed3item__layout .cmp-embed (video embeds)
 *   - .teaser__v1--image-right (teaser with image)
 * Generated: 2026-05-07
 *
 * Target structure (from library example):
 *   Row 1: [media (image/video)] | [text content + link]
 */
export default function parse(element, { document }) {
  const cells = [];

  // Detect which pattern we are dealing with
  const iframe = element.querySelector('iframe');
  const teaserImage = element.querySelector('.cmp-teaser__image img, img');
  const teaserTitle = element.querySelector('.cmp-teaser__title, h2, h3, h4');
  const teaserDescription = element.querySelector('.cmp-teaser__description, p');
  const teaserLink = element.querySelector('.cmp-teaser__action-link, a.cmp-button, a');

  if (iframe) {
    // Video embed pattern: .container__embed3item__layout .cmp-embed
    // Extract video URL and title from iframe
    const videoSrc = iframe.getAttribute('src') || '';
    const videoTitle = iframe.getAttribute('title') || '';

    // Create a link element representing the video embed
    const videoLink = document.createElement('a');
    videoLink.href = videoSrc;
    videoLink.textContent = videoTitle || videoSrc;

    // Build text column content
    const textContent = [];
    if (videoTitle) {
      const titleEl = document.createElement('p');
      titleEl.textContent = videoTitle;
      textContent.push(titleEl);
    }

    // Single row: [video link | text description]
    cells.push([videoLink, textContent.length > 0 ? textContent : '']);
  } else if (teaserImage || teaserTitle) {
    // Teaser pattern: .teaser__v1--image-right
    // Single row: [image | title + description + link]
    const mediaContent = [];
    const textContent = [];

    if (teaserImage) mediaContent.push(teaserImage);

    if (teaserTitle) textContent.push(teaserTitle);
    if (teaserDescription) textContent.push(teaserDescription);
    if (teaserLink && teaserLink !== teaserTitle) textContent.push(teaserLink);

    // Single row: [media | text]
    cells.push([
      mediaContent.length > 0 ? mediaContent : '',
      textContent.length > 0 ? textContent : '',
    ]);
  } else {
    // Fallback: try to extract any meaningful content
    const images = element.querySelectorAll('img');
    const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const paragraphs = element.querySelectorAll('p');
    const links = element.querySelectorAll('a');

    const mediaContent = [];
    const textContent = [];

    if (images.length > 0) mediaContent.push(images[0]);
    if (headings.length > 0) textContent.push(headings[0]);
    if (paragraphs.length > 0) textContent.push(paragraphs[0]);
    if (links.length > 0) textContent.push(links[0]);

    // Single row: [media | text]
    cells.push([
      mediaContent.length > 0 ? mediaContent : '',
      textContent.length > 0 ? textContent : '',
    ]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-media', cells });
  element.replaceWith(block);
}
