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

  // tools/importer/parsers/hero-gallery.js
  function parse(element, { document }) {
    const bgImage = element.querySelector("img");
    const heading = element.querySelector("h1, h2");
    const subheadings = [];
    const h2Elements = element.querySelectorAll("h2, h3");
    h2Elements.forEach((h) => {
      if (h !== heading) {
        subheadings.push(h);
      }
    });
    const descriptions = Array.from(element.querySelectorAll("p")).filter(
      (p) => !p.closest("a")
    );
    const ctaLinks = Array.from(
      element.querySelectorAll("a.btn, a.button, a.cta, .field--type-link a, a[href]")
    ).filter((a) => {
      const text = a.textContent.trim();
      return text.length > 0 && !a.querySelector("img");
    });
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (heading) {
      contentCell.push(heading);
    }
    subheadings.forEach((sub) => {
      contentCell.push(sub);
    });
    descriptions.forEach((desc) => {
      contentCell.push(desc);
    });
    ctaLinks.forEach((cta) => {
      contentCell.push(cta);
    });
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-exhibition.js
  function parse2(element, { document }) {
    const teaserItems = element.querySelectorAll(".teaser-item article.teaser-card, .views-row article.teaser-card");
    const cells = [];
    teaserItems.forEach((card) => {
      const link = card.querySelector("a[href]");
      const href = link ? link.getAttribute("href") : null;
      const img = card.querySelector(".teaser-image img, img.img-fluid");
      const title = card.querySelector("h3.teaser-title, .teaser-content-inner h3");
      const dateField = card.querySelector(".field--name-field-dates .field__item, .field__item");
      const contentCell = [];
      if (title) {
        const h3 = document.createElement("h3");
        h3.textContent = title.textContent.trim();
        contentCell.push(h3);
      }
      if (dateField) {
        const p = document.createElement("p");
        p.textContent = dateField.textContent.trim();
        contentCell.push(p);
      }
      if (href) {
        const a = document.createElement("a");
        a.href = href;
        a.textContent = title ? title.textContent.trim() : "View Exhibition";
        contentCell.push(a);
      }
      const imageCell = [];
      if (img) {
        const imgEl = document.createElement("img");
        imgEl.src = img.getAttribute("src") || "";
        imgEl.alt = img.getAttribute("alt") || "";
        imageCell.push(imgEl);
      }
      if (imageCell.length > 0 || contentCell.length > 0) {
        cells.push([imageCell, contentCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-exhibition", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-info.js
  function parse3(element, { document }) {
    const tileColumns = element.querySelectorAll(".mb-4 a.icon-tile-item");
    const row = [];
    tileColumns.forEach((tile) => {
      const cellContent = [];
      const heading = tile.querySelector(".tile-heading h3");
      const href = tile.getAttribute("href");
      if (heading) {
        const link = document.createElement("a");
        link.setAttribute("href", href || "#");
        link.textContent = heading.textContent.trim();
        const h3 = document.createElement("h3");
        h3.appendChild(link);
        cellContent.push(h3);
      }
      const bodyParagraphs = tile.querySelectorAll(".tile-body p");
      bodyParagraphs.forEach((p) => {
        const text = p.textContent.trim();
        if (text && text !== "\xA0") {
          cellContent.push(p);
        }
      });
      if (cellContent.length > 0) {
        row.push(cellContent);
      }
    });
    const cells = [];
    if (row.length > 0) {
      cells.push(row);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-info", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/galleries-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#galleriesCountryAcknowledgement",
        ".modal-backdrop",
        "#drupal-live-announce",
        ".skip-link"
      ]);
      if (element.style && element.style.overflow === "hidden") {
        element.style.overflow = "auto";
      }
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header#header-wrapper",
        "footer.layout-footer",
        ".social-media-links-mobile-wrapper",
        "iframe",
        "link",
        "noscript"
      ]);
    }
  }

  // tools/importer/transformers/galleries-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = payload;
      const sections = payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const reversedSections = [...sections].reverse();
      for (const section of reversedSections) {
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        if (section.style) {
          const metadataBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metadataBlock);
        }
        if (section.id !== sections[0].id) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-gallery": parse,
    "cards-exhibition": parse2,
    "columns-info": parse3
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "UNSW Galleries homepage with hero imagery, exhibition listings, and gallery information",
    urls: [
      "https://www.galleries.unsw.edu.au"
    ],
    blocks: [
      {
        name: "hero-gallery",
        instances: [
          ".section-wrapper.hero_section"
        ]
      },
      {
        name: "cards-exhibition",
        instances: [
          ".view-display-id-block_1 .teaser-items.grid",
          ".view-display-id-block_2 .teaser-items.grid"
        ]
      },
      {
        name: "columns-info",
        instances: [
          ".cta-tile"
        ]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero",
        selector: ".section-wrapper.hero_section",
        style: "dark",
        blocks: ["hero-gallery"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Current & Upcoming Exhibitions",
        selector: ".section-wrapper.onecolumn_section.bg-alternative:has(.view-display-id-block_1)",
        style: "grey",
        blocks: ["cards-exhibition"],
        defaultContent: [
          ".section-wrapper.onecolumn_section.bg-alternative:has(.view-display-id-block_1) .bs_grid h3",
          ".section-wrapper.onecolumn_section.bg-alternative:has(.view-display-id-block_1) .bs_grid .btn"
        ]
      },
      {
        id: "section-3",
        name: "Upcoming Programs",
        selector: ".section-wrapper.onecolumn_section:not(.bg-alternative):has(.view-display-id-block_2)",
        style: null,
        blocks: ["cards-exhibition"],
        defaultContent: [
          ".section-wrapper.onecolumn_section:not(.bg-alternative):has(.view-display-id-block_2) .bs_grid h3",
          ".section-wrapper.onecolumn_section:not(.bg-alternative):has(.view-display-id-block_2) .bs_grid .btn"
        ]
      },
      {
        id: "section-4",
        name: "About Us",
        selector: ".section-wrapper.onecolumn_section.bg-alternative:has(.cta-tile)",
        style: "grey",
        blocks: ["columns-info"],
        defaultContent: [
          ".section-wrapper.onecolumn_section.bg-alternative:has(.cta-tile) .bs_grid h3",
          ".section-wrapper.onecolumn_section.bg-alternative:has(.cta-tile) .bs_grid .btn"
        ]
      }
    ]
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
