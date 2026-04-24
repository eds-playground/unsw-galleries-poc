/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: UNSW Galleries site-wide cleanup.
 * Removes non-authorable content (header, footer, cookie consent, modals, etc.).
 * All selectors validated against captured DOM in migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // OneTrust cookie consent banner and preference center (line 1735 in cleaned.html)
    // Acknowledgement of Country modal dialog (line 325 in cleaned.html)
    // Bootstrap modal backdrop overlay (line 2018 in cleaned.html)
    // Drupal live announce region for screen readers (line 1733 in cleaned.html)
    // Skip-to-content link (line 2 in cleaned.html)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#galleriesCountryAcknowledgement',
      '.modal-backdrop',
      '#drupal-live-announce',
      '.skip-link',
    ]);

    // Fix body overflow hidden that blocks parsing (body style="overflow: hidden" on line 1)
    if (element.style && element.style.overflow === 'hidden') {
      element.style.overflow = 'auto';
    }
  }

  if (hookName === TransformHook.afterTransform) {
    // Site header with global nav, branding, search (line 32 in cleaned.html)
    // Site footer with global footer links (line 1418 in cleaned.html)
    // Mobile social media links wrapper (line 320 in cleaned.html)
    // Safe element removal: iframes, link tags, noscript, form elements
    WebImporter.DOMUtils.remove(element, [
      'header#header-wrapper',
      'footer.layout-footer',
      '.social-media-links-mobile-wrapper',
      'iframe',
      'link',
      'noscript',
    ]);
  }
}
