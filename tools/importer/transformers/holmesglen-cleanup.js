/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Holmesglen site-wide cleanup.
 * Removes non-authorable content (header, footer, modals, search widgets, tracking).
 * All selectors validated against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove video embed modal overlay (blocks content parsing)
    // Found: <div class="embed-modal aem-GridColumn ..."> containing .embed__modal with modal backdrop
    WebImporter.DOMUtils.remove(element, ['.embed-modal']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove header experience fragment (nav, search, login dropdown)
    // Found: <div class="cmp-experiencefragment cmp-experiencefragment--header-version-2">
    WebImporter.DOMUtils.remove(element, ['.cmp-experiencefragment--header-version-2']);

    // Remove footer experience fragment (footer nav, social links, legal)
    // Found: <div class="cmp-experiencefragment cmp-experiencefragment--new-footer">
    WebImporter.DOMUtils.remove(element, ['.cmp-experiencefragment--new-footer']);

    // Remove find-course-search widget (interactive search form, not authorable)
    // Found: <div class="find-course-search aem-GridColumn ...">
    WebImporter.DOMUtils.remove(element, ['.find-course-search']);

    // Remove tracking iframes (Adobe Audience Manager, DoubleClick)
    // Found: <iframe id="destination_publishing_iframe_holmesglen_0" class="aamIframeLoaded">
    // Found: <iframe src="https://10869343.fls.doubleclick.net/...">
    WebImporter.DOMUtils.remove(element, ['.aamIframeLoaded', 'iframe[src*="doubleclick.net"]']);

    // Remove remaining iframes not part of authorable content (tracking pixels)
    // Keep video iframes handled by block parsers; remove only tracking/syncing ones
    const trackingIframes = element.querySelectorAll('iframe[src*="demdex.net"]');
    trackingIframes.forEach((iframe) => iframe.remove());

    // Remove stray meta tags outside head
    // Found: <meta> tags interspersed in body content
    const strayMetas = element.querySelectorAll('meta');
    strayMetas.forEach((meta) => meta.remove());
  }
}
