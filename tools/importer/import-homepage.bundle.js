/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document }) {
    const bgImage = element.querySelector(".cmp-image__image, .cmp-teaser__image img");
    const pretitle = element.querySelector(".cmp-teaser__pretitle");
    const heading = element.querySelector("h1.cmp-teaser__title, h2.cmp-teaser__title, .cmp-teaser__title");
    const description = element.querySelector(".cmp-teaser__description p, .cmp-teaser__description");
    const ctaLinks = Array.from(element.querySelectorAll(".cmp-teaser__action-link, .cmp-teaser__action-container a"));
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentWrapper = document.createElement("div");
    if (heading) {
      contentWrapper.append(heading);
    }
    if (pretitle && pretitle.textContent.trim()) {
      const subHeading = document.createElement("h2");
      subHeading.textContent = pretitle.textContent.trim();
      contentWrapper.append(subHeading);
    }
    if (description) {
      contentWrapper.append(description);
    }
    if (ctaLinks.length > 0) {
      ctaLinks.forEach((link) => contentWrapper.append(link));
    }
    if (contentWrapper.children.length > 0) {
      cells.push([contentWrapper]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse2(element, { document }) {
    const cells = [];
    const isSingleTeaser = element.classList.contains("teaser__v2--image-left-aligned") || element.querySelector(":scope > .cmp-teaser") || element.classList.contains("cmp-teaser");
    const coloredButtons = element.querySelectorAll(".coloredButton a.cmp-button, a.coloredButtonCmp");
    const firstTrack = element.querySelector(".slick-track");
    const carouselSlides = firstTrack ? Array.from(firstTrack.querySelectorAll(":scope > .slick-slide:not(.slick-cloned)")).filter((s) => {
      const idx = parseInt(s.getAttribute("data-slick-index"), 10);
      return !Number.isNaN(idx) && idx >= 0;
    }) : [];
    const teaserCards = !isSingleTeaser ? element.querySelectorAll('.teaser__v2--image-left-aligned, [class*="teaser__v2"]') : [];
    if (isSingleTeaser) {
      const source = element.querySelector(".cmp-teaser") || element;
      const image = source.querySelector(".cmp-teaser__image img, img");
      const title = source.querySelector(".cmp-teaser__pretitle, .cmp-teaser__title, h2, h3, h4");
      const description = source.querySelector(".cmp-teaser__description p, .cmp-teaser__description");
      const cta = source.querySelector(".cmp-teaser__action-link, .cmp-teaser__action-container a");
      const imageCell = image ? [image] : "";
      const contentCell = [];
      if (title) contentCell.push(title);
      if (description && description !== title) contentCell.push(description);
      if (cta) contentCell.push(cta);
      if (imageCell || contentCell.length > 0) {
        cells.push([imageCell, contentCell.length > 0 ? contentCell : ""]);
      }
    } else if (teaserCards.length > 0) {
      teaserCards.forEach((teaser) => {
        const source = teaser.querySelector(".cmp-teaser") || teaser;
        const image = source.querySelector(".cmp-teaser__image img, img");
        const title = source.querySelector(".cmp-teaser__pretitle, .cmp-teaser__title, h2, h3, h4");
        const description = source.querySelector(".cmp-teaser__description p, .cmp-teaser__description");
        const cta = source.querySelector(".cmp-teaser__action-link, .cmp-teaser__action-container a");
        const imageCell = image ? [image] : "";
        const contentCell = [];
        if (title) contentCell.push(title);
        if (description && description !== title) contentCell.push(description);
        if (cta) contentCell.push(cta);
        if (imageCell || contentCell.length > 0) {
          cells.push([imageCell, contentCell.length > 0 ? contentCell : ""]);
        }
      });
    } else if (carouselSlides.length > 0) {
      const seenTitles = [];
      for (let i = 0; i < carouselSlides.length; i += 1) {
        const slide = carouselSlides[i];
        const titleEl = slide.querySelector("h3, h4");
        if (!titleEl) continue;
        const normalizedTitle = titleEl.textContent.replace(/\s+/g, " ").trim().toLowerCase();
        if (seenTitles.indexOf(normalizedTitle) !== -1) continue;
        seenTitles.push(normalizedTitle);
        const image = slide.querySelector(".cmp-teaser__image img, .cmp-image__image, img");
        const title = titleEl;
        const descParts = slide.querySelectorAll("li, .cmp-teaser__description p, p:not(:empty)");
        const cta = slide.querySelector('.cmp-teaser__action-link, a[class*="action"], a[class*="button"]');
        const imageCell = image ? [image] : "";
        const contentCell = [];
        contentCell.push(title);
        descParts.forEach((part) => {
          if (part.textContent.trim()) contentCell.push(part);
        });
        if (cta) contentCell.push(cta);
        cells.push([imageCell, contentCell]);
      }
    } else if (coloredButtons.length > 0) {
      coloredButtons.forEach((button) => {
        const text = button.querySelector(".cmp-button__text");
        const href = button.getAttribute("href");
        const contentCell = [];
        if (text) {
          const titleEl = document.createElement("strong");
          titleEl.textContent = text.textContent.trim();
          contentCell.push(titleEl);
        }
        if (href) {
          const link = document.createElement("a");
          link.href = href;
          link.textContent = text ? text.textContent.trim() : href;
          contentCell.push(link);
        }
        if (contentCell.length > 0) {
          cells.push(["", contentCell]);
        }
      });
    }
    if (cells.length === 0) {
      const image = element.querySelector("img");
      const heading = element.querySelector('h2, h3, h4, strong, .cmp-title__text, [class*="pretitle"], [class*="title"]');
      const desc = element.querySelector('p, .cmp-text, [class*="description"]');
      const link = element.querySelector('a[class*="action"], a[class*="button"], a');
      const imageCell = image ? [image] : "";
      const contentCell = [];
      if (heading) contentCell.push(heading);
      if (desc && desc !== heading) contentCell.push(desc);
      if (link && link !== heading && link !== desc) contentCell.push(link);
      if (contentCell.length > 0) {
        cells.push([imageCell, contentCell]);
      }
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-media.js
  function parse3(element, { document }) {
    const cells = [];
    const iframe = element.querySelector("iframe");
    const teaserImage = element.querySelector(".cmp-teaser__image img, img");
    const teaserTitle = element.querySelector(".cmp-teaser__title, h2, h3, h4");
    const teaserDescription = element.querySelector(".cmp-teaser__description, p");
    const teaserLink = element.querySelector(".cmp-teaser__action-link, a.cmp-button, a");
    if (iframe) {
      const videoSrc = iframe.getAttribute("src") || "";
      const videoTitle = iframe.getAttribute("title") || "";
      const videoLink = document.createElement("a");
      videoLink.href = videoSrc;
      videoLink.textContent = videoTitle || videoSrc;
      const textContent = [];
      if (videoTitle) {
        const titleEl = document.createElement("p");
        titleEl.textContent = videoTitle;
        textContent.push(titleEl);
      }
      cells.push([videoLink, textContent.length > 0 ? textContent : ""]);
    } else if (teaserImage || teaserTitle) {
      const mediaContent = [];
      const textContent = [];
      if (teaserImage) mediaContent.push(teaserImage);
      if (teaserTitle) textContent.push(teaserTitle);
      if (teaserDescription) textContent.push(teaserDescription);
      if (teaserLink && teaserLink !== teaserTitle) textContent.push(teaserLink);
      cells.push([
        mediaContent.length > 0 ? mediaContent : "",
        textContent.length > 0 ? textContent : ""
      ]);
    } else {
      const images = element.querySelectorAll("img");
      const headings = element.querySelectorAll("h1, h2, h3, h4, h5, h6");
      const paragraphs = element.querySelectorAll("p");
      const links = element.querySelectorAll("a");
      const mediaContent = [];
      const textContent = [];
      if (images.length > 0) mediaContent.push(images[0]);
      if (headings.length > 0) textContent.push(headings[0]);
      if (paragraphs.length > 0) textContent.push(paragraphs[0]);
      if (links.length > 0) textContent.push(links[0]);
      cells.push([
        mediaContent.length > 0 ? mediaContent : "",
        textContent.length > 0 ? textContent : ""
      ]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-media", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-campus.js
  function parse4(element, { document }) {
    const slides = element.querySelectorAll(".slick-slide:not(.slick-cloned) .cmp-carousel__item");
    const cells = [];
    slides.forEach((slide) => {
      const imageContainer = slide.querySelector(".cmp-image");
      if (!imageContainer) return;
      const img = imageContainer.querySelector("img.cmp-image__image");
      const link = imageContainer.querySelector("a.cmp-image__link");
      const captionSpan = imageContainer.querySelector("span.caption-text, .caption-text");
      if (!img) return;
      let imageCell;
      if (link) {
        const newLink = document.createElement("a");
        newLink.href = link.getAttribute("href");
        const newImg = img.cloneNode(true);
        newLink.appendChild(newImg);
        imageCell = newLink;
      } else {
        imageCell = img.cloneNode(true);
      }
      const contentCell = [];
      const captionText = captionSpan ? captionSpan.textContent.trim() : img.getAttribute("alt") || "";
      if (captionText) {
        const heading = document.createElement("h2");
        heading.textContent = captionText;
        contentCell.push(heading);
      }
      cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-campus", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/holmesglen-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [".embed-modal"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [".cmp-experiencefragment--header-version-2"]);
      WebImporter.DOMUtils.remove(element, [".cmp-experiencefragment--new-footer"]);
      WebImporter.DOMUtils.remove(element, [".find-course-search"]);
      WebImporter.DOMUtils.remove(element, [".aamIframeLoaded", 'iframe[src*="doubleclick.net"]']);
      const trackingIframes = element.querySelectorAll('iframe[src*="demdex.net"]');
      trackingIframes.forEach((iframe) => iframe.remove());
      const strayMetas = element.querySelectorAll("meta");
      strayMetas.forEach((meta) => meta.remove());
    }
  }

  // tools/importer/transformers/holmesglen-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const sections = payload && payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const document = element.ownerDocument;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Holmesglen Institute homepage with hero banner, course categories, news, and campus information",
    urls: [
      "https://www.holmesglen.edu.au/"
    ],
    blocks: [
      {
        name: "hero-banner",
        instances: [
          ".carousel__heroBanner .teaser__hero-banner"
        ]
      },
      {
        name: "cards-feature",
        instances: [
          ".container__browseByStudyArea .container__browseby",
          ".multiSlideCarousel__demand-skills",
          ".container__3-col-grid .teaser__v2--image-left-aligned"
        ]
      },
      {
        name: "columns-media",
        instances: [
          ".container__embed3item__layout .cmp-embed",
          ".teaser__v1--image-right"
        ]
      },
      {
        name: "carousel-campus",
        instances: [
          ".multiSlideCarousel__course-detail"
        ]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Banner",
        selector: ".carousel__heroBanner",
        style: "dark",
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Browse by Study Area",
        selector: ".container__browseByStudyArea",
        style: null,
        blocks: ["cards-feature"],
        defaultContent: [".container__browseByStudyArea .cmp-title__text"]
      },
      {
        id: "section-3",
        name: "Study Levels",
        selector: ".container__browseby:nth-of-type(2)",
        style: null,
        blocks: [],
        defaultContent: [".container__browseby .cmp-title__text"]
      },
      {
        id: "section-4",
        name: "Student Testimonials",
        selector: ".container__embed3item__layout",
        style: null,
        blocks: ["columns-media"],
        defaultContent: [".container__embed3item__layout .cmp-title__text"]
      },
      {
        id: "section-5",
        name: "Study In-Demand Skills",
        selector: ".container__study-in-demand",
        style: "brand-primary",
        blocks: ["cards-feature"],
        defaultContent: [".teaser__studydemand .cmp-teaser__title", ".teaser__studydemand .cmp-teaser__description"]
      },
      {
        id: "section-6",
        name: "Feature Cards",
        selector: ".container__pt-xl-80:has(.container__3-col-grid)",
        style: null,
        blocks: ["cards-feature"],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "International Student",
        selector: ".container__pt-xl-40:has(.teaser__v1--image-right)",
        style: "grey",
        blocks: ["columns-media"],
        defaultContent: []
      },
      {
        id: "section-8",
        name: "Campus Carousel",
        selector: ".container__bg-primary:has(.multiSlideCarousel__course-detail)",
        style: "dark",
        blocks: ["carousel-campus"],
        defaultContent: []
      }
    ]
  };
  var parsers = {
    "hero-banner": parse,
    "cards-feature": parse2,
    "columns-media": parse3,
    "carousel-campus": parse4
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path: path || "/index",
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
