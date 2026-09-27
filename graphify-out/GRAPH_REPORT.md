# Graph Report - anbar  (2026-09-27)

## Corpus Check
- 171 files · ~273,383 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3064 nodes · 6889 edges · 163 communities (148 shown, 15 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 131 edges (avg confidence: 0.69)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `516668a5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- live-browser.js
- checks.mjs
- detect-antipatterns.mjs
- index.mjs
- setLiveState
- resumeSession
- modern-screenshot.umd.js
- initPageChat
- design-system.mjs
- css-cascade.mjs
- live-inject.mjs
- live-commit-manual-edits.mjs
- detect-antipatterns-browser.js
- impeccable-config.mjs
- hook-lib.mjs
- el
- live-server.mjs
- svelte-component.mjs
- manual-apply.mjs
- hook-admin.mjs
- hook-before-edit.mjs
- live-wrap.mjs
- renderDesignVisual
- design-parser.mjs
- colorize.md
- live-accept.mjs
- live-copy-edit-agent.mjs
- devDependencies
- compilerOptions
- Anbar Project Requirements & Specification Document (PRD)
- live-manual-edit-evidence.mjs
- Responsive Design
- parseRgb
- live-poll.mjs
- document.md
- manual-edit-routes.mjs
- impeccable/SKILL.md
- initGlobalBar
- handleManualEditActivity
- insert-ui.mjs
- onboard.md
- context.mjs
- The Toolkit
- runHook
- onAnnotDown
- animate.md
- Polish Systematically
- discoverTargetCandidates
- readLiveServerInfo
- Delight Techniques
- impeccable-paths.mjs
- collectBrowserFindings
- parseAnyColor
- GENERIC_FONTS
- ThemeProvider.tsx
- Interaction Design
- resolveContext
- dependencies
- Improve Copy Systematically
- UX Writing
- Phase 1: Discovery Interview
- Typography
- refreshParamsPanel
- index.ts
- Generate Report
- SAFE_TAGS
- admin/page.tsx
- formatNumber
- Brand register
- layout.md
- live.md
- optimize.md
- context-signals.mjs
- live.mjs
- scheduleLazyVisualContrast
- analyzeVisualContrastCandidate
- resolveLengthPx
- sampleCssBackground
- event-validation.mjs
- critique-storage.mjs
- bolder.md
- Simplify the Design
- Hardening Dimensions
- ui-core.mjs
- session-store.mjs
- Rules for all projects
- critique.md
- Nielsen's 10 Heuristics
- Handle `generate`
- quieter.md
- palette.mjs
- pin.mjs
- General rules
- Craft Flow
- Generate Combined Critique Report
- Product register
- inline-ignores.mjs
- normalizeIgnoreValueEntries
- Design Engineering
- Codex: Visual Direction & Asset Production
- Common Cognitive Load Violations
- Component Building Principles
- Flutter Architecture & Best Practices for StoryForge
- Persona-Based Design Testing
- Init Flow
- readWorkspacePatterns
- expandScanTargets
- InventoryModule.tsx
- Cognitive Load Assessment
- $impeccable hooks
- Step 3: Ask strategic questions (for PRODUCT.md)
- CSP detection (first-time only)
- live-target.mjs
- Interactive Fiction & AI Narrative Architecture
- The Animation Decision Framework
- clip-path for Animation
- Performance Rules
- Gesture and Drag Interactions
- Improve Typography Systematically
- StoryForge AI Engine & Oracle Debug Guide
- CSS Transform Mastery
- The Sonner Principles (Building Loved Components)
- Spring Animations
- 4. Plan three variants: identity first, then mode, then axes
- Handle fallback
- checkElementQuality
- isGeneratedFile
- Agentation Setup
- Core Philosophy
- Debugging Animations
- Heuristics Scoring Guide
- detect.mjs
- captureVisualContrastCandidate
- writeAuditLog
- rules/graphify.md
- workflows/graphify.md
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- README.md
- prisma.ts
- Classic Typography Principles
- Modern Web Typography
- Phase 2: Client State Management & Cache Synchronization (TanStack Query v5)
- Phase 4: Concurrency, Inventory Race Conditions & Atomic Transactions
- Phase 5: Scalability, Virtualization & Database Performance
- Phase 6: Edge Security, Abuse Prevention & Rate Limiting
- Phase 7: Document Engine & PDF Generation
- live-target.mjs
- createManualEditRoutes
- writeAuditLog
- pg
- @prisma/client
- react-dom
- @tailwindcss/postcss
- @prisma/adapter-pg
- tailwind-merge
- tailwindcss
- pg
- react
- @tanstack/react-query
- @tailwindcss/postcss

## God Nodes (most connected - your core abstractions)
1. `el()` - 55 edges
2. `runHook()` - 32 edges
3. `setLiveState()` - 29 edges
4. `detectHtml()` - 28 edges
5. `initGlobalBar()` - 28 edges
6. `apiSuccess()` - 27 edges
7. `collectBrowserFindings()` - 26 edges
8. `buildInsertConfigureRow()` - 26 edges
9. `handleKeyDown()` - 26 edges
10. `showToast()` - 25 edges

## Surprising Connections (you probably didn't know these)
- `ClientCatalogPage()` --references--> `react`  [EXTRACTED]
  src/app/c/[token]/page.tsx → package.json
- `latestCritique()` --indirect_call--> `v()`  [INFERRED]
  .agents/skills/impeccable/scripts/context-signals.mjs → .agents/skills/impeccable/scripts/modern-screenshot.umd.js
- `collectVisualContrastReasons()` --indirect_call--> `x()`  [INFERRED]
  .agents/skills/impeccable/scripts/detector/browser/injected/index.mjs → .agents/skills/impeccable/scripts/modern-screenshot.umd.js
- `collectVisualContrastCandidates()` --indirect_call--> `el()`  [INFERRED]
  .agents/skills/impeccable/scripts/detector/browser/injected/index.mjs → .agents/skills/impeccable/scripts/live-browser.js
- `textSamplePoints()` --indirect_call--> `x()`  [INFERRED]
  .agents/skills/impeccable/scripts/detector/browser/injected/index.mjs → .agents/skills/impeccable/scripts/modern-screenshot.umd.js

## Import Cycles
- None detected.

## Communities (163 total, 15 thin omitted)

### Community 0 - "live-browser.js"
Cohesion: 0.03
Nodes (138): acceptedDomAlreadyClean(), addManualContextText(), applyGlobalBarLabelState(), applyOriginalAttrsToSvelteAnchor(), applyPlaceholderSizingStyles(), applySvelteComponentVariantStyle(), averageRgb01(), bindEditBadgeProxy() (+130 more)

### Community 1 - "checks.mjs"
Cohesion: 0.05
Nodes (92): borderColorsFromStyle(), borderWidthsFromStyle(), checkClippedOverflow(), checkColors(), checkCreamPalette(), checkElementAIPaletteDOM(), checkElementClippedOverflow(), checkElementClippedOverflowDOM() (+84 more)

### Community 2 - "detect-antipatterns.mjs"
Cohesion: 0.40
Nodes (9): addRules(), applyInlineIgnores(), getSet(), hasDirectives(), isInlineIgnored(), normalizeRule(), parseInlineIgnores(), parseRuleList() (+1 more)

### Community 3 - "index.mjs"
Cohesion: 0.06
Nodes (68): addBrowserFindings(), addVisualContrastFindings(), addVisualContrastResult(), analyzeVisualContrast(), analyzeVisualContrastCandidate(), blendRgba(), browserColorsClose(), browserDesignSystemConfig() (+60 more)

### Community 4 - "setLiveState"
Cohesion: 0.07
Nodes (62): barPaletteForTheme(), brandMarkSvg(), buildSteerProcessingDots(), cancelInsertConfigure(), clearAnnotations(), clearInsertPicking(), closeTunePopover(), cursorForInsertAxis() (+54 more)

### Community 5 - "resumeSession"
Cohesion: 0.07
Nodes (81): abortSvelteComponentInjection(), applyConfigureBarChrome(), applySavedSessionMeta(), buildConfirmedRow(), buildCyclingRow(), buildDots(), buildGeneratingRow(), cancelEditing() (+73 more)

### Community 6 - "modern-screenshot.umd.js"
Cohesion: 0.09
Nodes (52): ae(), be(), bt(), Ce(), Ct(), de(), dt(), _e() (+44 more)

### Community 7 - "initPageChat"
Cohesion: 0.09
Nodes (46): armPageChatForTyping(), attachSteerFocusDebug(), attachSteerFocusGuard(), clearSteerAwaitTimer(), clearSteerFocusRecoverTimer(), collapsePageChat(), expandPageChat(), finishVoiceSession() (+38 more)

### Community 8 - "design-system.mjs"
Cohesion: 0.10
Nodes (48): addColorObject(), addDesignColor(), addRoundedScale(), addRoundedToken(), addSidecarColors(), addSidecarRadii(), addTypographyFonts(), canonicalDesignFindingKey() (+40 more)

### Community 9 - "css-cascade.mjs"
Cohesion: 0.10
Nodes (29): applyStaticDeclaration(), buildBorderOverrideMap(), buildStaticStyleMap(), collectStaticCssRules(), compareStaticPriority(), cssPropToCamel(), expandStaticBoxValues(), expandStaticDeclaration() (+21 more)

### Community 10 - "live-inject.mjs"
Cohesion: 0.07
Nodes (50): detectCsp(), INLINE_HEADER_SIGNALS, LAYOUT_EXTS, MONOREPO_HELPER_SIGNALS, NUXT_ROUTE_RULES_SIGNALS, NUXT_SECURITY_SIGNALS, SCAN_EXTS, SKIP_DIRS (+42 more)

### Community 11 - "live-commit-manual-edits.mjs"
Cohesion: 0.11
Nodes (48): allEntryIds(), argVal(), buildRepairBatch(), candidatesForEntry(), changedFilesSinceSnapshot(), collectApplyOwnedFiles(), collectRollbackFiles(), commitManualEdits() (+40 more)

### Community 12 - "detect-antipatterns-browser.js"
Cohesion: 0.09
Nodes (31): checkBorders(), checkClippedOverflow(), checkElementBorders(), checkElementBordersDOM(), checkElementClippedOverflow(), checkElementClippedOverflowDOM(), checkElementItalicSerif(), checkElementItalicSerifDOM() (+23 more)

### Community 13 - "impeccable-config.mjs"
Cohesion: 0.10
Nodes (47): applyDetectionConfigSource(), clampByte(), cleanIgnoreValueDisplay(), cloneDetectionConfig(), cloneRawDetectionConfig(), colorIgnoreKey(), DEFAULT_DETECTION_CONFIG, DETECTOR_CONFIG_KEYS (+39 more)

### Community 14 - "hook-lib.mjs"
Cohesion: 0.07
Nodes (45): ACK_EXTS, applyConfigSource(), applyDetectorConfigSource(), applyPatchText(), clampByte(), cloneDefaultConfig(), CO_SCAN_STYLE_NAMES, colorIgnoreKey() (+37 more)

### Community 15 - "el"
Cohesion: 0.10
Nodes (36): actionLabel(), bindConfigureCountPillTooltip(), bindConfigureInlineControlHover(), bindConfigureModifierPillHover(), buildConfigureActionControl(), buildConfigureCountControl(), buildConfigureRow(), buildConfigureSubmitButton() (+28 more)

### Community 16 - "live-server.mjs"
Cohesion: 0.09
Nodes (43): assembleLiveBrowserScript(), assertLiveBrowserScriptParts(), LIVE_BROWSER_SCRIPT_PARTS, readLiveBrowserScriptParts(), resolveLiveBrowserScriptParts(), acknowledgePendingEvent(), activeSessionSummaries(), agentPollingConnected() (+35 more)

### Community 17 - "svelte-component.mjs"
Cohesion: 0.12
Nodes (37): appendCssToSvelteStyle(), appendSanitizedCssRule(), bakeParamValuesInCss(), buildInsertVariantStub(), buildPropContract(), buildPropsScript(), buildVariantStub(), componentSessionDir() (+29 more)

### Community 18 - "manual-apply.mjs"
Cohesion: 0.10
Nodes (36): addOpToManualApplyChunk(), APPLY_EVENT_HARD_TIMEOUT_MS, APPLY_EVENT_SOFT_DEADLINE_MS, buildManualApplyAgentAction(), clearManualApplyTransaction(), collectManualApplyFiles(), compactManualApplyBatch(), compactManualApplyCandidates() (+28 more)

### Community 19 - "hook-admin.mjs"
Cohesion: 0.14
Nodes (39): ACTIONS, addIgnoreFile(), addIgnoreRule(), addIgnoreValue(), DETECTOR_CONFIG_KEYS, detectorSection(), fileHasImpeccableHookMarker(), HOOK_MANIFEST_TARGETS (+31 more)

### Community 20 - "hook-before-edit.mjs"
Cohesion: 0.11
Nodes (39): allow(), bumpCursorDenial(), cursorBlockMessage(), deny(), done(), escapeRegExp(), findingSignature(), firstMatch() (+31 more)

### Community 21 - "live-wrap.mjs"
Cohesion: 0.13
Nodes (35): argVal(), buildInsertWrapperLines(), computeInsertLine(), INSERT_POSITIONS, insertCli(), isInsertPosition(), resolveElementMatch(), buildSvelteComponentCssAuthoring() (+27 more)

### Community 22 - "renderDesignVisual"
Cohesion: 0.09
Nodes (33): buildCollapsible(), buildDesignHeader(), buildListHtml(), buildRadiiModels(), copyToClipboard(), cssSafe(), escapeHtml(), fetchDesignSystem() (+25 more)

### Community 23 - "design-parser.mjs"
Cohesion: 0.15
Nodes (33): buildColor(), CANONICAL_SECTIONS, collectBullets(), collectColorValues(), collectParagraphs(), detectFormat(), extractColors(), extractComponents() (+25 more)

### Community 24 - "colorize.md"
Cohesion: 0.06
Nodes (32): Accent Color Application, Accessibility, Alpha Is A Design Smell, Assess Color Opportunity, Background & Surfaces, Balance & Refinement, Borders & Accents, Building Functional Palettes (+24 more)

### Community 25 - "live-accept.mjs"
Cohesion: 0.14
Nodes (32): acceptCli(), argVal(), buildCarbonizeReplacement(), decodeHtmlAttr(), deindentContent(), detectCommentSyntax(), escapeRegExp(), expandReplaceRange() (+24 more)

### Community 26 - "live-copy-edit-agent.mjs"
Cohesion: 0.14
Nodes (31): applyMockWrites(), buildCopyEditBatchPrompt(), checkFrameworkSourceSyntax(), chooseCopyEditAgent(), COMMAND_AUTH_CACHE, commandAuthed(), commandExists(), compactBatchForPrompt() (+23 more)

### Community 27 - "devDependencies"
Cohesion: 0.10
Nodes (21): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, @prisma/config, @tailwindcss/postcss, @types/bcryptjs (+13 more)

### Community 28 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 29 - "Anbar Project Requirements & Specification Document (PRD)"
Cohesion: 0.18
Nodes (11): 1. Project Overview & Vision, 2. Core Stakeholders & Access Patterns, 4.1 Mobile-First Philosophy, 4.2 Premium Visual Aesthetic & Usability, 4. UI / UX & Design Principles, 5.1 Infrastructure & Services, 5. Deployment & Technical Architecture, 6. Implementation Roadmap (+3 more)

### Community 30 - "live-manual-edit-evidence.mjs"
Cohesion: 0.16
Nodes (26): analyzeSourceHint(), buildCandidatesForOp(), buildContextHintsByRef(), buildManualEditEvidence(), collectSearchFiles(), countOps(), decodeBasicHtml(), escapeRegExp() (+18 more)

### Community 31 - "Responsive Design"
Cohesion: 0.12
Nodes (15): Assess Adaptation Challenge, Content Adaptation, Desktop Adaptation (Mobile → Desktop), Email Adaptation (Web → Email), Implement Adaptations, Layout Adaptation Techniques, Mobile Adaptation (Desktop → Mobile), Navigation Adaptation (+7 more)

### Community 32 - "parseRgb"
Cohesion: 0.18
Nodes (23): checkColors(), checkElementAIPaletteDOM(), checkElementColors(), checkElementColorsDOM(), checkElementGlow(), checkElementGlowDOM(), checkElementIconTile(), checkElementIconTileDOM() (+15 more)

### Community 33 - "live-poll.mjs"
Cohesion: 0.18
Nodes (24): completionAckForAcceptResult(), completionTypeForAcceptResult(), augmentEventWithAcceptHandling(), buildAcceptScriptArgs(), buildPollReplyPayload(), EVENT_TYPES_NEEDING_AGENT_REPLY, fetchNextEvent(), fetchServerStatus() (+16 more)

### Community 34 - "document.md"
Cohesion: 0.08
Nodes (24): Component translation rules, Narrative mapping, Pitfalls, Scan mode (approach C: auto-extract, then confirm descriptive language), Schema, Seed mode, Step 1: Confirm seed mode, Step 1: Find the design assets (+16 more)

### Community 35 - "manual-edit-routes.mjs"
Cohesion: 0.18
Nodes (21): clearAppliedEntries(), args, cwd, pageUrlFilter, remaining, compactManualLogText(), summarizeManualApplyFailures(), summarizeManualDiagnostics() (+13 more)

### Community 36 - "impeccable/SKILL.md"
Cohesion: 0.25
Nodes (7): Extract Flow, Step 1: Discover the Design System, Step 2: Identify Patterns, Step 3: Plan Extraction, Step 4: Extract & Enrich, Step 5: Migrate, Step 6: Document

### Community 37 - "initGlobalBar"
Cohesion: 0.14
Nodes (20): applyEditing(), buildLocatorForLeaf(), buildPlaceholderResizeHandles(), copyEditContainerContext(), copyEditLeafContext(), cursorForPlaceholderEdge(), documentRefForElement(), extractContext() (+12 more)

### Community 38 - "handleManualEditActivity"
Cohesion: 0.19
Nodes (24): clearStoredManualApplyState(), fetchPendingCount(), handleManualEditActivity(), hidePendingApplyDock(), manualApplyLoadingText(), manualApplyStateKey(), manualEditEventForCurrentPage(), numberOrNull() (+16 more)

### Community 39 - "insert-ui.mjs"
Cohesion: 0.11
Nodes (10): canCreateInsert(), clampPlaceholderSize(), computeInsertPosition(), groupSiblingRows(), hitSiblingInsertGap(), horizontalOverlap(), insertCreateDisabledReason(), insertLineCoords() (+2 more)

### Community 40 - "onboard.md"
Cohesion: 0.09
Nodes (22): Assess Onboarding Needs, Context Over Ceremony, Contextual Help, Design Onboarding Experiences, Documentation & Help, Empty State Design, Feature Discovery & Adoption, Guided Tours & Walkthroughs (+14 more)

### Community 41 - "context.mjs"
Cohesion: 0.16
Nodes (20): buildMissingTargetDirective(), buildResolvedContextDirective(), buildTargetSelectionDirective(), buildUpdateDirective(), cli(), compareSemver(), computeUpdateDirective(), DESIGN_NAMES (+12 more)

### Community 42 - "The Toolkit"
Cohesion: 0.10
Nodes (20): Animate complex properties, Assess What "Extraordinary" Means Here, For data-heavy interfaces, For functional UI, For performance-critical UI, For visual/marketing surfaces, Implement with Discipline, Interact with the device (+12 more)

### Community 43 - "runHook"
Cohesion: 0.15
Nodes (21): bumpEditCount(), clampGroupedToBudget(), clampToBudget(), dedupeAgainstCache(), depthIsSet(), directiveFooter(), ensureFile(), ensureSession() (+13 more)

### Community 44 - "onAnnotDown"
Cohesion: 0.15
Nodes (21): applyPlaceholderDimensions(), beginEditPin(), buildAnnotationsForCapture(), buildPinElement(), cancelEditingPin(), clampPlaceholderSize(), finalizeEditingPin(), initAnnotOverlay() (+13 more)

### Community 45 - "animate.md"
Cohesion: 0.10
Nodes (19): Accessibility, Assess Animation Opportunities, CSS Animations, Delight Moments, Entrance Animations, Feedback & Guidance, Implement Animations, JavaScript Animation (+11 more)

### Community 46 - "Polish Systematically"
Cohesion: 0.10
Nodes (19): Clean Up, Code Quality, Color & Contrast, Content & Copy, Design System Discovery, Edge Cases & Error States, Final Verification, Forms & Inputs (+11 more)

### Community 47 - "discoverTargetCandidates"
Cohesion: 0.12
Nodes (15): ClientLinkItem, ClientLinksModule(), ClientLinksModuleProps, ClientLinkItem, useCreateClientLink(), OrderRequestItem, queryKeys, CreateClientLinkInput (+7 more)

### Community 48 - "readLiveServerInfo"
Cohesion: 0.21
Nodes (17): isLiveServerPidReachable(), readLiveServerInfo(), completeCli(), completeThroughServer(), parseArgs(), readServerInfo(), collectManualApplyFiles(), manualApplyReplyCommand() (+9 more)

### Community 49 - "Delight Techniques"
Cohesion: 0.11
Nodes (18): Appropriate to Context, Assess Delight Opportunities, Celebration Moments, Compound Over Time, Delight Amplifies, Never Blocks, Delight Principles, Delight Techniques, Easter Eggs & Hidden Delights (+10 more)

### Community 50 - "impeccable-paths.mjs"
Cohesion: 0.22
Nodes (18): resolveProjectRoot(), firstExisting(), getDesignSidecarCandidates(), getDesignSidecarPath(), getImpeccableDir(), getLegacyLiveAnnotationsDir(), getLegacyLiveConfigPath(), getLegacyLiveServerPath() (+10 more)

### Community 51 - "collectBrowserFindings"
Cohesion: 0.16
Nodes (15): browserColorsClose(), browserDesignSystemConfig(), browserFindingsFromMap(), browserHasDirectText(), browserPrimaryFont(), browserRadiusTokens(), browserSampleText(), checkBrowserDesignSystemSources() (+7 more)

### Community 52 - "parseAnyColor"
Cohesion: 0.13
Nodes (22): borderColorsFromStyle(), borderWidthsFromStyle(), checkCreamPalette(), checkElementGptBorderShadow(), checkElementGptBorderShadowDOM(), checkGptThinBorderWideShadow(), checkQuality(), colorsNearlyMatch() (+14 more)

### Community 53 - "GENERIC_FONTS"
Cohesion: 0.20
Nodes (16): checkPageTypography(), checkTypography(), isBrandFontOnOwnDomain(), checkStaticPageTypography(), checkPageTypography(), checkTypography(), resolveSerif(), BRAND_FONT_DOMAINS (+8 more)

### Community 54 - "ThemeProvider.tsx"
Cohesion: 0.10
Nodes (20): metadata, vazir, DEFAULT_SETTINGS, SettingsModule(), WarehouseSettings, QueryProvider(), Theme, ThemeContext (+12 more)

### Community 55 - "Interaction Design"
Cohesion: 0.12
Nodes (17): CSS Anchor Positioning, Destructive Actions: Undo > Confirm, Dropdown & Overlay Positioning, Fixed Positioning Fallback, Focus Rings: Do Them Right, Form Design: The Non-Obvious, Gesture Discoverability, Interaction Design (+9 more)

### Community 56 - "resolveContext"
Cohesion: 0.25
Nodes (9): buildSelectorSegment(), generateSelector(), isElementHidden(), isLikelyHashedClass(), postSerializedFindings(), renderBrowserFindings(), scanResultMeta(), serializeFindings() (+1 more)

### Community 57 - "dependencies"
Cohesion: 0.11
Nodes (19): bcryptjs, clsx, lucide-react, dependencies, bcryptjs, clsx, lucide-react, pg (+11 more)

### Community 58 - "Improve Copy Systematically"
Cohesion: 0.12
Nodes (16): Avoid Redundant Copy, Confirmation Dialogs: Use Sparingly, Consistency: The Terminology Problem, Don't Blame the User, Empty States Are Opportunities, Error Message Templates, Error Messages: The Formula, Form Instructions (+8 more)

### Community 59 - "UX Writing"
Cohesion: 0.14
Nodes (29): confirm(), detectCli(), formatFindings(), formatFindingSummary(), handleStdin(), printUsage(), loadDesignSystemForCwd(), resolveDesignSidecarPath() (+21 more)

### Community 60 - "Phase 1: Discovery Interview"
Cohesion: 0.12
Nodes (15): Anti-Goals, Brief Structure, Constraints, Content & Data, Design Direction, How to use the probes, Important limits, Interview cadence (+7 more)

### Community 61 - "Typography"
Cohesion: 0.12
Nodes (16): Accessibility Considerations, Anti-reflexes worth defending against, Classic Typography Principles, Fluid Type, Font Selection & Pairing, Modern Web Typography, Modular Scale & Hierarchy, OpenType Features (+8 more)

### Community 62 - "refreshParamsPanel"
Cohesion: 0.24
Nodes (14): applyParamDefaults(), applyParamValue(), buildParamsPanel(), closedClipPath(), formatRangeValue(), getVisibleVariantEl(), hideParamsPanel(), openTunePopover() (+6 more)

### Community 64 - "Generate Report"
Cohesion: 0.13
Nodes (14): 1. Accessibility (A11y), 2. Performance, 3. Theming, 4. Responsive Design, 5. Anti-Patterns (CRITICAL), Anti-Patterns Verdict, Audit Health Score, Detailed Findings by Severity (+6 more)

### Community 65 - "SAFE_TAGS"
Cohesion: 0.09
Nodes (46): mergeDesignSystemFindings(), detectUrl(), runVisualContrastFallback(), serializeDesignSystemForBrowser(), CSS_IN_JS_EXTENSIONS, detectText(), extFromFilePath(), extractCSSinJS() (+38 more)

### Community 66 - "admin/page.tsx"
Cohesion: 0.14
Nodes (19): LoginPage(), AdminBottomNav(), AdminBottomNavProps, AdminHeader(), AdminSidebar(), AdminSidebarProps, AdminTab, AuthContext (+11 more)

### Community 67 - "formatNumber"
Cohesion: 0.17
Nodes (19): AdminDashboardPage(), ClientCatalogPage(), AdminKpiCards(), AdminKpiCardsProps, OrderRequestItem, OrderRequestsModule(), InvoicePrintModal(), InvoicePrintModalProps (+11 more)

### Community 68 - "Brand register"
Cohesion: 0.14
Nodes (14): Brand bans (on top of the shared absolute bans), Brand permissions, Brand register, Color, Font selection procedure, Imagery, Layout, Motion (+6 more)

### Community 69 - "layout.md"
Cohesion: 0.14
Nodes (13): Assess Current Layout, Break Card Grid Monotony, Choose the Right Layout Tool, Create Visual Rhythm, Establish a Spacing System, Improve Layout Systematically, Live-mode signature params, Manage Depth & Elevation (+5 more)

### Community 70 - "live.md"
Cohesion: 0.08
Nodes (25): append-arrays, append-string, Cleanup, Consent prompt template, CSP detection (first-time only), Drift-heal warning, Exit, First-time setup (config missing or invalid) (+17 more)

### Community 71 - "optimize.md"
Cohesion: 0.14
Nodes (13): Animation Performance, Assess Performance Issues, Core Web Vitals Optimization, Cumulative Layout Shift (CLS < 0.1), First Input Delay (FID < 100ms) / INP (< 200ms), Largest Contentful Paint (LCP < 2.5s), Loading Performance, Network Optimization (+5 more)

### Community 72 - "context-signals.mjs"
Cohesion: 0.25
Nodes (11): directChildDirs(), discoverRootsForPattern(), discoverTargetCandidates(), expandSimplePattern(), findTargetExample(), hasFallbackWorkspaceChildren(), isIgnoredWorkspaceDiscoveryDir(), isMonorepoRoot() (+3 more)

### Community 73 - "live.mjs"
Cohesion: 0.32
Nodes (11): loadContext(), resolveTargetSelection(), safeRead(), __dirname, ensureServerRunning(), globToRegex(), liveCli(), missingLiveContext() (+3 more)

### Community 74 - "scheduleLazyVisualContrast"
Cohesion: 0.18
Nodes (14): addBrowserFindings(), addVisualContrastFindings(), addVisualContrastResult(), analyzeVisualContrast(), clearOverlays(), detachOverlay(), disconnectLazyVisualContrastObserver(), postExtensionError() (+6 more)

### Community 75 - "analyzeVisualContrastCandidate"
Cohesion: 0.47
Nodes (6): clippedByInset(), clippedByRect(), expandBoxShorthand(), firstMetricLengthPx(), isScreenReaderOnlyTextStyle(), metricLengthPx()

### Community 76 - "resolveLengthPx"
Cohesion: 0.15
Nodes (15): checkElementHeroEyebrow(), checkElementHeroEyebrowDOM(), checkElementQualityDOM(), checkHeroEyebrow(), checkRepeatedSectionKickers(), checkRepeatedSectionKickersDOM(), checkRepeatedSectionKickersFromDoc(), cleanInlineText() (+7 more)

### Community 77 - "sampleCssBackground"
Cohesion: 0.24
Nodes (13): firstCssUrl(), getLayerValue(), loadVisualContrastImage(), parseObjectPosition(), parsePositionPair(), parsePositionToken(), pointToImageSource(), resolveObjectImageRect() (+5 more)

### Community 78 - "event-validation.mjs"
Cohesion: 0.17
Nodes (11): Amplify the Design, Assess Current State, Color Intensification, Composition Boldness, Motion & Animation, Plan Amplification, Register, Spatial Drama (+3 more)

### Community 79 - "critique-storage.mjs"
Cohesion: 0.32
Nodes (11): kebab(), listSnapshotsForSlug(), main(), nowFilenameStamp(), parseFrontmatter(), readLatestSnapshot(), readTrend(), serializeFrontmatter() (+3 more)

### Community 80 - "bolder.md"
Cohesion: 0.09
Nodes (16): Constraints, Failure modes, Flow, $impeccable hooks, Intentional findings, Routing, Assess Current Typography, Live-mode signature params (+8 more)

### Community 81 - "Simplify the Design"
Cohesion: 0.17
Nodes (11): Assess Current State, Code Simplification, Content Simplification, Document Removed Complexity, Information Architecture, Interaction Simplification, Layout Simplification, Plan Simplification (+3 more)

### Community 82 - "Hardening Dimensions"
Cohesion: 0.17
Nodes (11): Accessibility Resilience, Assess Hardening Needs, Edge Cases & Boundary Conditions, Error Handling, Hardening Dimensions, Input Validation & Sanitization, Internationalization (i18n), Performance Resilience (+3 more)

### Community 83 - "ui-core.mjs"
Cohesion: 0.23
Nodes (10): createLiveBrowserDomHelpers(), activeElementDeep(), appendStyleToLiveUiRoot(), appendToLiveUiRoot(), escapeCssIdent(), getLiveUiElementById(), LIVE_CHROME_MOUNT_CONTRACT, LIVE_UI_COMPONENT_IDS (+2 more)

### Community 84 - "session-store.mjs"
Cohesion: 0.27
Nodes (9): applyEvent(), baseSnapshot(), COMPLETED_PHASES, getJournalPath(), getSnapshotPath(), rebuildSnapshotFromJournal(), safeSessionId(), toPendingEvent() (+1 more)

### Community 85 - "Rules for all projects"
Cohesion: 0.18
Nodes (10): Choice Options UI Rule, Database Integrity & No In-Code Fallbacks, Database Migration Rules, Git Commit Rule (No Auto-Push), Language and Communication, Large File Downloads (> 30MB), Prisma 7 Configuration Rules, RTL Text & Number/Symbol Formatting Rules (+2 more)

### Community 86 - "critique.md"
Cohesion: 0.18
Nodes (10): Action Summary, Ask the User, Assessment A: Design Review, Assessment B: Detector + Browser Evidence, Assessment Orchestration, Hard Invariants, Persist the Snapshot, Purpose (+2 more)

### Community 87 - "Nielsen's 10 Heuristics"
Cohesion: 0.18
Nodes (11): 10. Help and Documentation, 1. Visibility of System Status, 2. Match Between System and Real World, 3. User Control and Freedom, 4. Consistency and Standards, 5. Error Prevention, 6. Recognition Rather Than Recall, 7. Flexibility and Efficiency of Use (+3 more)

### Community 88 - "Handle `generate`"
Cohesion: 0.12
Nodes (16): 1. Read the screenshot (if present), 2. Wrap the element, 3. Load the action's reference, 4. Plan three variants: identity first, then mode, then axes, 5. Apply the freeform prompt (if present), 6. Write all variants in a single edit, 7. Parameters (composition-sized, 0–4 per variant), 8. Signal done (+8 more)

### Community 89 - "quieter.md"
Cohesion: 0.18
Nodes (10): Assess Current State, Color Refinement, Composition Refinement, Motion Reduction, Plan Refinement, Refine the Design, Register, Simplification (+2 more)

### Community 90 - "palette.mjs"
Cohesion: 0.24
Nodes (7): args, buildWeights(), hashUnit(), pickSeed(), seed, SEEDS, weightedPick()

### Community 91 - "pin.mjs"
Cohesion: 0.25
Nodes (9): __dirname, findHarnessDirs(), generatePinnedSkill(), HARNESS_DIRS, loadCommandMetadata(), pin(), root, unpin() (+1 more)

### Community 92 - "General rules"
Cohesion: 0.18
Nodes (11): Absolute bans, Color, Color & Theme, Design guidance, General rules, Interaction, Layout, Motion (+3 more)

### Community 93 - "Craft Flow"
Cohesion: 0.25
Nodes (12): extractRegister(), cli(), COMMON_DEV_PORTS, devServerSignals(), gatherSignals(), gitSignals(), hasCode(), latestCritique() (+4 more)

### Community 94 - "Generate Combined Critique Report"
Cohesion: 0.20
Nodes (10): Anti-Patterns Verdict, Design Health Score, Generate Combined Critique Report, Minor Observations, Overall Impression, Persona Red Flags, Priority Issues, Questions to Consider (+2 more)

### Community 95 - "Product register"
Cohesion: 0.20
Nodes (9): Color, Components, Layout, Motion, Product bans (on top of the shared absolute bans), Product permissions, Product register, The product slop test (+1 more)

### Community 96 - "inline-ignores.mjs"
Cohesion: 0.20
Nodes (10): Breakpoints: Content-Driven, Detect Input Method, Not Just Screen Size, Layout Adaptation Patterns, Mobile-First: Write It Right, Picture Element for Art Direction, Responsive Design, Responsive Images: Get It Right, Safe Areas: Handle the Notch (+2 more)

### Community 97 - "normalizeIgnoreValueEntries"
Cohesion: 0.36
Nodes (10): cleanIgnoreValueDisplay(), extractFindingIgnoreValue(), extractFindingIgnoreValueRaw(), extractMotionIgnoreValue(), filterFindings(), formatFindingIgnoreCommand(), isIgnoredFindingValue(), normalizeIgnoreRule() (+2 more)

### Community 98 - "Design Engineering"
Cohesion: 0.22
Nodes (8): Accessibility, Design Engineering, Initial Response, prefers-reduced-motion, Review Checklist, Review Format (Required), Stagger Animations, Touch device hover states

### Community 99 - "Codex: Visual Direction & Asset Production"
Cohesion: 0.19
Nodes (14): checkElementMotion(), checkElementMotionDOM(), checkLayout(), checkMotion(), checkPageLayout(), isCardLike(), isCardLikeDOM(), isCardLikeFromProps() (+6 more)

### Community 100 - "Common Cognitive Load Violations"
Cohesion: 0.22
Nodes (9): 1. The Wall of Options, 2. The Memory Bridge, 3. The Hidden Navigation, 4. The Jargon Barrier, 5. The Visual Noise Floor, 6. The Inconsistent Pattern, 7. The Multi-Task Demand, 8. The Context Switch (+1 more)

### Community 101 - "Component Building Principles"
Cohesion: 0.25
Nodes (8): Animate enter states with @starting-style, Buttons must feel responsive, Component Building Principles, Make popovers origin-aware, Never animate from scale(0), Tooltips: skip delay on subsequent hovers, Use blur to mask imperfect transitions, Use CSS transitions over keyframes for interruptible UI

### Community 102 - "Flutter Architecture & Best Practices for StoryForge"
Cohesion: 0.25
Nodes (7): 1. Core Architecture (Feature-First), 2. State Management (Riverpod), 3. Reader Typography & UX Principles, 4. Choice & Action Interface, 5. Modern Dart & Widget Construction Idioms, Flutter Architecture & Best Practices for StoryForge, Null-Aware Collection Elements (Dart 3.8+)

### Community 103 - "Persona-Based Design Testing"
Cohesion: 0.25
Nodes (8): 1. Impatient Power User: "Alex", 2. Confused First-Timer: "Jordan", 3. Accessibility-Dependent User: "Sam", 4. Deliberate Stress Tester: "Riley", 5. Distracted Mobile User: "Casey", Persona-Based Design Testing, Project-Specific Personas, Selecting Personas

### Community 104 - "Init Flow"
Cohesion: 0.13
Nodes (14): Accessibility & Inclusion, Brand & Personality, Init Flow, Interview mode, not confirmation mode, Minimum viable interview, Register (ask first; it shapes everything below), Step 1: Load current state, Step 2: Explore the codebase (+6 more)

### Community 105 - "readWorkspacePatterns"
Cohesion: 0.20
Nodes (10): Craft Flow, Gates: do not compress, Production bar, Step 0: Project Foundation, Step 1: Shape the Design, Step 2: Load References, Step 3: Visual Direction & Assets (Harness-Gated), Step 4: Build to Production Quality (+2 more)

### Community 106 - "expandScanTargets"
Cohesion: 0.08
Nodes (35): xlsx, InventoryModule(), InventoryModuleProps, OrderRequestsModuleProps, AdjustMode, PRESET_REASONS, StockAdjustModal(), StockAdjustModalProps (+27 more)

### Community 107 - "InventoryModule.tsx"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, postinstall, start (+1 more)

### Community 108 - "Cognitive Load Assessment"
Cohesion: 0.29
Nodes (7): Cognitive Load Assessment, Cognitive Load Checklist, Extraneous Load: Bad Design, Germane Load: Learning Effort, Intrinsic Load: The Task Itself, The Working Memory Rule, Three Types of Cognitive Load

### Community 109 - "$impeccable hooks"
Cohesion: 0.22
Nodes (11): analyzeVisualContrastCandidate(), blendRgba(), checkElementTextOverflowDOM(), clampByte(), classSelector(), collectVisualContrastCandidates(), collectVisualContrastReasons(), getDirectText() (+3 more)

### Community 111 - "CSP detection (first-time only)"
Cohesion: 0.29
Nodes (10): escapeRegExp(), isExcludedByWorkspacePattern(), MONOREPO_FALLBACK_PROJECT_DIRS, nearestProjectLikeRoot(), normalizeWorkspacePattern(), projectRootFromDoubleStarPattern(), projectRootFromWorkspacePattern(), resolveWorkspaceProjectRoot() (+2 more)

### Community 112 - "live-target.mjs"
Cohesion: 0.14
Nodes (16): contextSourcePath(), contextSourceStatus(), findMonorepoRoot(), firstExisting(), hasGitBoundary(), isCandidateProjectRoot(), isPathInside(), isPathInsideOrEqual() (+8 more)

### Community 113 - "Interactive Fiction & AI Narrative Architecture"
Cohesion: 0.29
Nodes (6): 1. Golden Law: AI Is Narrator, Not Game Engine, 2. Action Validation Guardrail Pipeline, 3. Hierarchical Memory Management (0–10 Scoring), 4. Structured Output Format, Importance Scoring Rules:, Interactive Fiction & AI Narrative Architecture

### Community 114 - "The Animation Decision Framework"
Cohesion: 0.33
Nodes (6): 1. Should this animate at all?, 2. What is the purpose?, 3. What easing should it use?, 4. How fast should it be?, Perceived performance, The Animation Decision Framework

### Community 115 - "clip-path for Animation"
Cohesion: 0.33
Nodes (6): clip-path for Animation, Comparison sliders, Hold-to-delete pattern, Image reveals on scroll, Tabs with perfect color transitions, The inset shape

### Community 116 - "Performance Rules"
Cohesion: 0.33
Nodes (6): CSS animations beat JS under load, CSS variables are inheritable, Framer Motion hardware acceleration caveat, Only animate transform and opacity, Performance Rules, Use WAAPI for programmatic CSS animations

### Community 117 - "Gesture and Drag Interactions"
Cohesion: 0.33
Nodes (6): Damping at boundaries, Friction instead of hard stops, Gesture and Drag Interactions, Momentum-based dismissal, Multi-touch protection, Pointer capture for drag

### Community 118 - "Improve Typography Systematically"
Cohesion: 0.36
Nodes (8): coLocatedStylesheets(), expandScanTargets(), hasPathTraversal(), isInsideProject(), normalizeScanTargets(), parseStaticStyleImports(), STYLE_EXTS, UI_CODE_EXTS

### Community 119 - "StoryForge AI Engine & Oracle Debug Guide"
Cohesion: 0.33
Nodes (5): 1. End-to-End Ingestion Pipeline Map, 2. Instant Triage Matrix (What File to Check), 3. Ultra-Fast Micro Test Commands, 4. Live Action Debugging in Studio UI, StoryForge AI Engine & Oracle Debug Guide

### Community 120 - "CSS Transform Mastery"
Cohesion: 0.40
Nodes (5): 3D transforms for depth, CSS Transform Mastery, scale() scales children too, transform-origin, translateY with percentages

### Community 121 - "The Sonner Principles (Building Loved Components)"
Cohesion: 0.40
Nodes (5): Asymmetric enter/exit timing, Cohesion matters, Review your work the next day, The opacity + height combination, The Sonner Principles (Building Loved Components)

### Community 122 - "Spring Animations"
Cohesion: 0.40
Nodes (5): Interruptibility advantage, Spring Animations, Spring-based mouse interactions, Spring configuration, When to use springs

### Community 123 - "4. Plan three variants: identity first, then mode, then axes"
Cohesion: 0.26
Nodes (12): FORBIDDEN_MANUAL_EDIT_TEXT_CHARS, INSERT_POSITIONS, isValidId(), isValidVariantId(), validateAnnotationFields(), validateEvent(), validateInsertGenerate(), validateManualEditEvent() (+4 more)

### Community 124 - "Handle fallback"
Cohesion: 0.62
Nodes (7): elementMatchesOriginalMarkup(), findLiveElementForOriginalMarkup(), findLiveElementFromAnchorSnapshot(), isUsableInjectionAnchor(), normalizeElementClassName(), parseOriginalMarkupElement(), resolveLiveInjectionAnchor()

### Community 125 - "checkElementQuality"
Cohesion: 0.20
Nodes (6): 1. System Vision & Architecture Target, 3. Technology Stack & External Tool Matrix, 4. Prioritized Execution Checklist, Anbar Comprehensive Engineering & Architecture Plan, Anbar Documentation, Documents Index

### Community 126 - "isGeneratedFile"
Cohesion: 0.70
Nodes (4): hasGeneratedHeader(), HEADER_MARKERS, isGeneratedFile(), isGitIgnored()

### Community 127 - "Agentation Setup"
Cohesion: 0.50
Nodes (3): Agentation Setup, Notes, Steps

### Community 128 - "Core Philosophy"
Cohesion: 0.50
Nodes (4): Beauty is leverage, Core Philosophy, Taste is trained, not innate, Unseen details compound

### Community 129 - "Debugging Animations"
Cohesion: 0.50
Nodes (4): Debugging Animations, Frame-by-frame inspection, Slow motion testing, Test on real devices

### Community 130 - "Heuristics Scoring Guide"
Cohesion: 0.50
Nodes (4): Heuristics Scoring Guide, Issue Severity (P0–P3), Reference Material, Score Summary

### Community 131 - "detect.mjs"
Cohesion: 0.50
Nodes (3): candidates, detectorPath, __dirname

### Community 132 - "captureVisualContrastCandidate"
Cohesion: 0.20
Nodes (10): 2. Phase-by-Phase Engineering Roadmap, Architecture & Implementation, Architecture & Implementation, Architecture & Implementation, Objective, Objective, Objective, Phase 1: End-to-End Type Safety & Data Validation (Zod) (+2 more)

### Community 133 - "writeAuditLog"
Cohesion: 0.32
Nodes (8): parseYamlFlowList(), readJson(), readLernaWorkspaces(), readPackageWorkspaces(), readPnpmWorkspaces(), readWorkspacePatterns(), stripYamlInlineComment(), unquoteYamlValue()

### Community 140 - "prisma.ts"
Cohesion: 0.15
Nodes (33): LoginSchema, POST(), POST(), GET(), GET(), POST(), POST(), GET() (+25 more)

### Community 142 - "Classic Typography Principles"
Cohesion: 0.33
Nodes (6): 1. System Architecture Overview, 2. Technology Stack, 3. Data Model Draft, 4. Key Application Routes, 5. UI / UX Principles for Mobile & Persian (RTL), Anbar Architecture & Technical Design

### Community 143 - "Modern Web Typography"
Cohesion: 0.33
Nodes (6): 3.1 Inventory & Warehouse Management (`انبارداری`), 3.2 Dedicated Client Links & Self-Service Ordering (`لینک‌های اختصاصی و ثبت سفارش`), 3.3 Invoicing & Proforma Management (`پیش‌فاکتور و فاکتور`), 3.4 Excel Integration (`ورود و خروج اکسل`), 3.5 PDF Document Generation (`ساخت فایل پی‌دی‌اف`), 3. Functional Requirements & Feature Breakdown

### Community 144 - "Phase 2: Client State Management & Cache Synchronization (TanStack Query v5)"
Cohesion: 0.67
Nodes (3): Architecture & Implementation, Objective, Phase 2: Client State Management & Cache Synchronization (TanStack Query v5)

### Community 145 - "Phase 4: Concurrency, Inventory Race Conditions & Atomic Transactions"
Cohesion: 0.67
Nodes (3): Architecture & Implementation, Objective, Phase 4: Concurrency, Inventory Race Conditions & Atomic Transactions

### Community 146 - "Phase 5: Scalability, Virtualization & Database Performance"
Cohesion: 0.67
Nodes (3): Architecture & Implementation, Objective, Phase 5: Scalability, Virtualization & Database Performance

### Community 147 - "Phase 6: Edge Security, Abuse Prevention & Rate Limiting"
Cohesion: 0.12
Nodes (15): Apply Clarity Principles, Assess Current Copy, Button & CTA Text, Confirmation Dialogs, Empty States, Error Messages, Form Labels & Instructions, Help Text & Tooltips (+7 more)

### Community 148 - "Phase 7: Document Engine & PDF Generation"
Cohesion: 0.67
Nodes (3): Architecture & Implementation, Objective, Phase 7: Document Engine & PDF Generation

### Community 149 - "live-target.mjs"
Cohesion: 0.43
Nodes (4): parseTargetOptions(), parseTargetPath(), TargetArgError, resolveLiveTarget()

### Community 150 - "createManualEditRoutes"
Cohesion: 0.38
Nodes (7): applyLegacyDeferredAcceptsOnStartup(), applyDeferredSvelteComponentAccepts(), deferredAcceptsPath(), findSvelteComponentManifest(), readDeferredAccepts(), readManifest(), writeDeferredAccept()

### Community 151 - "writeAuditLog"
Cohesion: 0.83
Nodes (3): writeAuditLog(), main(), readStdin()

### Community 152 - "pg"
Cohesion: 0.33
Nodes (6): Establish Hierarchy, Fix Readability, Font Selection, Improve Typography Systematically, Refine Details, Weight Consistency

### Community 155 - "@tailwindcss/postcss"
Cohesion: 0.22
Nodes (9): After This File, Codex: Visual Direction & Asset Production, Four stop points before code, Step A: Explore Directions with the User, Step B: Generate the Brand Palette First, Step C: Generate 1-3 Visual Mocks Against the Palette, Step D: Approval Loop, Step E: Mock Fidelity Inventory (+1 more)

### Community 156 - "@prisma/adapter-pg"
Cohesion: 0.40
Nodes (3): config, JWT_SECRET, PUBLIC_PATHS

### Community 158 - "tailwindcss"
Cohesion: 0.67
Nodes (3): Architecture & Implementation, Objective, Phase 6: Edge Security, Abuse Prevention & Rate Limiting

## Knowledge Gaps
- **757 isolated node(s):** `COMMON_DEV_PORTS`, `SOURCE_DIRS`, `PRODUCT_NAMES`, `DESIGN_NAMES`, `FALLBACK_DIRS` (+752 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `el()` connect `GENERIC_FONTS` to `live-browser.js`, `SAFE_TAGS`, `checks.mjs`, `index.mjs`, `Codex: Visual Direction & Asset Production`, `resumeSession`, `initGlobalBar`, `setLiveState`, `design-system.mjs`, `css-cascade.mjs`, `initPageChat`, `resolveLengthPx`, `$impeccable hooks`, `el`, `collectBrowserFindings`, `parseAnyColor`, `resolveContext`, `refreshParamsPanel`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **Why does `createRequestHandler()` connect `live-server.mjs` to `css-cascade.mjs`, `live-inject.mjs`, `prisma.ts`, `impeccable-paths.mjs`, `design-parser.mjs`, `4. Plan three variants: identity first, then mode, then axes`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Why does `createManualEditRoutes()` connect `manual-edit-routes.mjs` to `css-cascade.mjs`, `live-commit-manual-edits.mjs`, `prisma.ts`, `live-server.mjs`, `4. Plan three variants: identity first, then mode, then axes`, `live-manual-edit-evidence.mjs`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Are the 29 inferred relationships involving `el()` (e.g. with `browserFindingsFromMap()` and `collectVisualContrastCandidates()`) actually correct?**
  _`el()` has 29 INFERRED edges - model-reasoned connections that need verification._
- **Are the 7 inferred relationships involving `initGlobalBar()` (e.g. with `hideAgentPollTooltip()` and `onDetectMessage()`) actually correct?**
  _`initGlobalBar()` has 7 INFERRED edges - model-reasoned connections that need verification._
- **What connects `COMMON_DEV_PORTS`, `SOURCE_DIRS`, `PRODUCT_NAMES` to the rest of the system?**
  _757 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `live-browser.js` be split into smaller, more focused modules?**
  _Cohesion score 0.02725430597771023 - nodes in this community are weakly interconnected._