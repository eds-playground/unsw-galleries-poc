/* eslint-disable */
/* global WebImporter */

import heroGalleryParser from './parsers/hero-gallery.js';
import cardsExhibitionParser from './parsers/cards-exhibition.js';
import columnsInfoParser from './parsers/columns-info.js';

import galleriesCleanupTransformer from './transformers/galleries-cleanup.js';
import galleriesSectionsTransformer from './transformers/galleries-sections.js';

const parsers = {
  'hero-gallery': heroGalleryParser,
  'cards-exhibition': cardsExhibitionParser,
  'columns-info': columnsInfoParser,
};

const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'UNSW Galleries homepage with hero imagery, exhibition listings, and gallery information',
  urls: [
    'https://www.galleries.unsw.edu.au',
  ],
  blocks: [
    {
      name: 'hero-gallery',
      instances: [
        '.section-wrapper.hero_section',
      ],
    },
    {
      name: 'cards-exhibition',
      instances: [
        '.view-display-id-block_1 .teaser-items.grid',
        '.view-display-id-block_2 .teaser-items.grid',
      ],
    },
    {
      name: 'columns-info',
      instances: [
        '.cta-tile',
      ],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: '.section-wrapper.hero_section',
      style: 'dark',
      blocks: ['hero-gallery'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Current & Upcoming Exhibitions',
      selector: '.section-wrapper.onecolumn_section.bg-alternative:has(.view-display-id-block_1)',
      style: 'grey',
      blocks: ['cards-exhibition'],
      defaultContent: [
        '.section-wrapper.onecolumn_section.bg-alternative:has(.view-display-id-block_1) .bs_grid h3',
        '.section-wrapper.onecolumn_section.bg-alternative:has(.view-display-id-block_1) .bs_grid .btn',
      ],
    },
    {
      id: 'section-3',
      name: 'Upcoming Programs',
      selector: '.section-wrapper.onecolumn_section:not(.bg-alternative):has(.view-display-id-block_2)',
      style: null,
      blocks: ['cards-exhibition'],
      defaultContent: [
        '.section-wrapper.onecolumn_section:not(.bg-alternative):has(.view-display-id-block_2) .bs_grid h3',
        '.section-wrapper.onecolumn_section:not(.bg-alternative):has(.view-display-id-block_2) .bs_grid .btn',
      ],
    },
    {
      id: 'section-4',
      name: 'About Us',
      selector: '.section-wrapper.onecolumn_section.bg-alternative:has(.cta-tile)',
      style: 'grey',
      blocks: ['columns-info'],
      defaultContent: [
        '.section-wrapper.onecolumn_section.bg-alternative:has(.cta-tile) .bs_grid h3',
        '.section-wrapper.onecolumn_section.bg-alternative:has(.cta-tile) .bs_grid .btn',
      ],
    },
  ],
};

const transformers = [
  galleriesCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [galleriesSectionsTransformer] : []),
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path: path || '/index',
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
