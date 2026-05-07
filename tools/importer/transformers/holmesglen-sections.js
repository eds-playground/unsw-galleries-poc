/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Holmesglen section breaks and section metadata.
 * Inserts <hr> section breaks and Section Metadata blocks based on template sections.
 * Runs only in afterTransform. All selectors from page-templates.json validated against cleaned.html.
 *
 * Section selectors (from page-templates.json, validated in migration-work/cleaned.html):
 *   section-1: .carousel__heroBanner (line 769)
 *   section-2: .container__browseByStudyArea (line 815)
 *   section-3: .container__browseby:nth-of-type(2) — secondary browseby container (line 944)
 *   section-4: .container__embed3item__layout (line 1011)
 *   section-5: .container__study-in-demand (line 1102)
 *   section-6: .container__pt-xl-80:has(.container__3-col-grid) — feature cards (line 1836)
 *   section-7: .container__pt-xl-40:has(.teaser__v1--image-right) — international student (line 1932)
 *   section-8: .container__bg-primary:has(.multiSlideCarousel__course-detail) — campus carousel (line 1964)
 *
 * Expected: 7 section breaks (<hr>), 4 Section Metadata blocks (sections 1, 5, 7, 8 have styles).
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    const document = element.ownerDocument;

    // Process sections in reverse order to avoid DOM position shifts
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue;

      // Add Section Metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(sectionMetadata);
      }

      // Insert <hr> before each section except the first to create section breaks
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
