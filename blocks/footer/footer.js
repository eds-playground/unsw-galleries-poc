import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Replace a leading <p><strong>Heading</strong></p> in a column with an <h2>.
 * @param {Element} col The nav column wrapper
 */
function promoteColumnHeading(col) {
  const firstP = col.querySelector(':scope > p');
  if (!firstP) return;
  const strong = firstP.querySelector('strong');
  if (!strong || firstP.textContent.trim() !== strong.textContent.trim()) return;
  const heading = document.createElement('h2');
  heading.className = 'footer-col-title';
  heading.textContent = strong.textContent;
  firstP.replaceWith(heading);
}

/**
 * Strip button styling from the Uluru Statement link and unwrap its button-wrapper paragraph.
 * @param {Element} container The acknowledgement container
 */
function plainifyUluruLink(container) {
  const wrapper = container.querySelector('p.button-wrapper');
  if (!wrapper) return;
  const link = wrapper.querySelector('a');
  if (!link) {
    wrapper.remove();
    return;
  }
  link.classList.remove('button', 'primary');
  if (!link.classList.length) link.removeAttribute('class');
  wrapper.replaceWith(link);
}

/**
 * Wrap the given child elements inside a full-bleed <section> band.
 * @param {string} bandClass The class name for the outer section
 * @param {Element[]} children The elements to nest inside the inner wrapper
 * @returns {HTMLElement} The created section element
 */
function buildBand(bandClass, children) {
  const section = document.createElement('section');
  section.className = bandClass;
  const inner = document.createElement('div');
  inner.className = `${bandClass}-inner`;
  children.forEach((child) => inner.append(child));
  section.append(inner);
  return section;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) {
    footer.append(fragment.firstElementChild);
  }

  const footerSections = footer.querySelectorAll(':scope > div > div');
  const [logo, columnLinks, supportLogos, acknowledgement, policyLinks] = footerSections;

  // Top band: a logo row above a 5-column grid (address + 4 nav columns)
  // so the address aligns with the nav-column headings.
  const navColumns = [...columnLinks.querySelectorAll(':scope .columns > div > div')];
  const addressColumn = navColumns.shift();

  const brandTop = document.createElement('div');
  brandTop.className = 'footer-brand-top';
  [...logo.children].forEach((child) => brandTop.append(child));

  const topGrid = document.createElement('div');
  topGrid.className = 'footer-top-grid';
  if (addressColumn) {
    addressColumn.classList.add('footer-address');
    topGrid.append(addressColumn);
  }
  navColumns.forEach((col) => {
    col.classList.add('footer-nav-col');
    promoteColumnHeading(col);
    topGrid.append(col);
  });

  const topBand = buildBand('footer-top', [brandTop, topGrid]);

  // Partner logos band.
  const logosBand = buildBand('footer-logos', [...supportLogos.children]);

  // Acknowledgement band: flags on the left, text on the right.
  plainifyUluruLink(acknowledgement);
  const flags = document.createElement('div');
  flags.className = 'footer-flags';
  const text = document.createElement('div');
  text.className = 'footer-acknowledgement-text';
  [...acknowledgement.children].forEach((child) => {
    if (child.tagName === 'P' && child.querySelector('picture, img')) {
      flags.append(child);
    } else {
      text.append(child);
    }
  });
  const acknowledgementBand = buildBand('footer-acknowledgement', [flags, text]);

  // Policy links band.
  const policiesBand = buildBand('footer-policies', [...policyLinks.children]);

  footer.textContent = '';
  footer.append(topBand, logosBand, acknowledgementBand, policiesBand);

  block.append(footer);
}
