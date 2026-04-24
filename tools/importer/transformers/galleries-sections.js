/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: UNSW Galleries section breaks and section metadata.
 * Inserts <hr> section breaks and Section Metadata blocks based on template sections.
 * Only runs in afterTransform. Processes sections in reverse order.
 *
 * Template sections (from page-templates.json):
 *   1. Hero: .section-wrapper.hero_section (style: "dark")
 *   2. Current & Upcoming Exhibitions: .section-wrapper.onecolumn_section.bg-alternative with view-display-id-block_1 (style: "grey")
 *   3. Upcoming Programs: .section-wrapper.onecolumn_section (no bg-alternative) with view-display-id-block_2 (style: null)
 *   4. About Us: .section-wrapper.onecolumn_section.bg-alternative with .cta-tile (style: "grey")
 *
 * All selectors validated against captured DOM in migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { document } = payload;
    const sections = payload.template && payload.template.sections;

    if (!sections || sections.length < 2) return;

    // Process sections in reverse order to avoid shifting DOM positions
    const reversedSections = [...sections].reverse();

    for (const section of reversedSections) {
      // Find the first element matching this section's selector
      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue;

      // Add Section Metadata block after the section element if it has a style
      if (section.style) {
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(metadataBlock);
      }

      // Insert <hr> before this section if it is not the first section
      if (section.id !== sections[0].id) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
