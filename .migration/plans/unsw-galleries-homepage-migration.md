Let me explore the current project state and analyze the source page before creating the plan.# UNSW Galleries Homepage Migration Plan

## Source
- **URL**: https://www.galleries.unsw.edu.au
- **Target**: AEM Edge Delivery Services (this project)

## Current Project State
- Standard AEM boilerplate with existing blocks: `hero`, `columns`, `cards`, `header`, `footer`, `fragment`
- No import tooling exists yet — needs to be created from scratch
- Content directory has only the default boilerplate `index.plain.html`

## Migration Approach

This migration will use the site migration orchestration workflow, which coordinates:

1. **Site Analysis** — Scrape the homepage, identify URL patterns, and create page template skeletons
2. **Page Analysis** — Deep analysis of the homepage to identify sections, content structure, block variants, and authoring decisions
3. **Block Mapping** — Map discovered DOM patterns to EDS blocks (reusing existing blocks where possible, creating new ones as needed)
4. **Import Infrastructure** — Generate block parsers and page transformers to convert source HTML into EDS-compatible markup
5. **Content Import** — Build and run the import script to produce the migrated `index.plain.html`
6. **Design Migration** — Extract and apply the site's design system (colors, typography, spacing, layout) to EDS styles
7. **Verification & Critique** — Preview the migrated page, compare against the original, and iterate on fixes

## Key Decisions
- **Scope**: Homepage only (single page migration)
- **Priority**: Both content accuracy and visual fidelity
- **Block strategy**: Reuse boilerplate blocks where possible; create new block variants for unique patterns on the source page

## Checklist

- [ ] Run site analysis on `https://www.galleries.unsw.edu.au` to scrape content and identify page structure
- [ ] Run page analysis on the homepage to identify sections, blocks, and content patterns
- [ ] Map discovered block variants to EDS blocks (existing or new)
- [ ] Generate import infrastructure (block parsers + page transformers)
- [ ] Generate and execute the content import script to produce migrated HTML
- [ ] Migrate site design system (global styles, colors, typography, spacing)
- [ ] Migrate block-level styles for each identified block
- [ ] Preview the migrated page and verify content accuracy
- [ ] Compare migrated page visually against the original and apply fixes
- [ ] Run linting to ensure code quality

## Execution

This plan requires **Execute mode** to proceed. Switch out of Plan mode to begin the migration workflow.
