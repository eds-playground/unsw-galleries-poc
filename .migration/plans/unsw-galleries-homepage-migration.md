# Holmesglen Homepage Migration Plan

## Source
- **URL**: https://www.holmesglen.edu.au/
- **Target**: AEM Edge Delivery Services project at `https://main--holmesglen-edu--eds-playground.aem.page/`

## Current Project State
- Clean AEM boilerplate with standard blocks: `hero`, `columns`, `cards`, `header`, `footer`, `fragment`
- No import tooling exists — will be created from scratch
- Content directory has only the default boilerplate `index.plain.html`
- Styles and fonts are at boilerplate defaults (Roboto/Roboto Condensed)

## Migration Approach

This migration will use the site migration orchestration workflow:

1. **Site Analysis** — Scrape the Holmesglen homepage, identify page structure, and create template skeleton
2. **Page Analysis** — Deep analysis to identify sections, content structure, block variants, and authoring decisions
3. **Block Mapping** — Map discovered DOM patterns to EDS blocks (reusing existing blocks where possible, creating new variants for Holmesglen-specific patterns)
4. **Import Infrastructure** — Generate block parsers and page transformers to convert source HTML into EDS-compatible markup
5. **Content Import** — Build and run the import script to produce the migrated `index.plain.html`
6. **Design Migration** — Extract and apply Holmesglen's design system (brand colors, typography, spacing) to EDS styles
7. **Verification & Critique** — Preview the migrated page, compare against the original, and iterate on fixes

## Key Decisions
- **Scope**: Homepage only (single page migration)
- **Priority**: Both content accuracy and visual fidelity equally important
- **Block strategy**: Reuse boilerplate blocks where possible; create new block variants for unique Holmesglen patterns
- **Design**: Full design system extraction including Holmesglen brand colors, fonts, button styles, and section backgrounds
- **Target repo**: `holmesglen-edu--eds-playground` (already set up with AEM Code Sync)

## Checklist

- [ ] Run site analysis on `https://www.holmesglen.edu.au/` to scrape content and identify page structure
- [ ] Run page analysis on the homepage to identify sections, blocks, and content patterns
- [ ] Map discovered block variants to EDS blocks (existing or new)
- [ ] Generate import infrastructure (block parsers + page transformers)
- [ ] Generate and execute the content import script to produce migrated HTML
- [ ] Migrate site design system (global styles, colors, typography, spacing)
- [ ] Migrate block-level styles for each identified block
- [ ] Set up navigation (header/footer)
- [ ] Preview the migrated page and verify content accuracy
- [ ] Compare migrated page visually against the original and apply fixes
- [ ] Run linting to ensure code quality

## Execution

This plan requires **Execute mode** to proceed. Switch out of Plan mode to begin the Holmesglen migration workflow.
