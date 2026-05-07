/* eslint-disable */
/* global WebImporter */

import heroBannerParser from './parsers/hero-banner.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import columnsMediaParser from './parsers/columns-media.js';
import carouselCampusParser from './parsers/carousel-campus.js';

import holmesglenCleanupTransformer from './transformers/holmesglen-cleanup.js';
import holmesglenSectionsTransformer from './transformers/holmesglen-sections.js';

const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Holmesglen Institute homepage with hero banner, course categories, news, and campus information',
  urls: [
    'https://www.holmesglen.edu.au/',
  ],
  blocks: [
    {
      name: 'hero-banner',
      instances: [
        '.carousel__heroBanner .teaser__hero-banner',
      ],
    },
    {
      name: 'cards-feature',
      instances: [
        '.container__browseByStudyArea .container__browseby',
        '.multiSlideCarousel__demand-skills',
        '.container__3-col-grid .teaser__v2--image-left-aligned',
      ],
    },
    {
      name: 'columns-media',
      instances: [
        '.container__embed3item__layout .cmp-embed',
        '.teaser__v1--image-right',
      ],
    },
    {
      name: 'carousel-campus',
      instances: [
        '.multiSlideCarousel__course-detail',
      ],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Banner',
      selector: '.carousel__heroBanner',
      style: 'dark',
      blocks: ['hero-banner'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Browse by Study Area',
      selector: '.container__browseByStudyArea',
      style: null,
      blocks: ['cards-feature'],
      defaultContent: ['.container__browseByStudyArea .cmp-title__text'],
    },
    {
      id: 'section-3',
      name: 'Study Levels',
      selector: '.container__browseby:nth-of-type(2)',
      style: null,
      blocks: [],
      defaultContent: ['.container__browseby .cmp-title__text'],
    },
    {
      id: 'section-4',
      name: 'Student Testimonials',
      selector: '.container__embed3item__layout',
      style: null,
      blocks: ['columns-media'],
      defaultContent: ['.container__embed3item__layout .cmp-title__text'],
    },
    {
      id: 'section-5',
      name: 'Study In-Demand Skills',
      selector: '.container__study-in-demand',
      style: 'brand-primary',
      blocks: ['cards-feature'],
      defaultContent: ['.teaser__studydemand .cmp-teaser__title', '.teaser__studydemand .cmp-teaser__description'],
    },
    {
      id: 'section-6',
      name: 'Feature Cards',
      selector: '.container__pt-xl-80:has(.container__3-col-grid)',
      style: null,
      blocks: ['cards-feature'],
      defaultContent: [],
    },
    {
      id: 'section-7',
      name: 'International Student',
      selector: '.container__pt-xl-40:has(.teaser__v1--image-right)',
      style: 'grey',
      blocks: ['columns-media'],
      defaultContent: [],
    },
    {
      id: 'section-8',
      name: 'Campus Carousel',
      selector: '.container__bg-primary:has(.multiSlideCarousel__course-detail)',
      style: 'dark',
      blocks: ['carousel-campus'],
      defaultContent: [],
    },
  ],
};

const parsers = {
  'hero-banner': heroBannerParser,
  'cards-feature': cardsFeatureParser,
  'columns-media': columnsMediaParser,
  'carousel-campus': carouselCampusParser,
};

const transformers = [
  holmesglenCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [holmesglenSectionsTransformer] : []),
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
