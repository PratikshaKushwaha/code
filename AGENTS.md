# ProjectGrim — Agent Instructions

## 1. Frontend Design Skill

For frontend creation, UI redesign, visual reviews, responsive layouts, animations, and interaction design, read and apply:

`.agents/skills/design-taste-frontend/SKILL.md`

Treat this skill as design guidance, not permission to replace the existing application architecture or violate the constraints in this document.

## 2. Non-Negotiable Canvas Protocol Constraints

ProjectGrim must comply with the CODE VARIANT — BUILD 01 surprise challenge, **THE CANVAS PROTOCOL**.

These restrictions apply to all existing and new features, components, routes, interactions, and state-changing operations.

### Prohibited Primary-Action Interactions

- NEVER use conventional buttons to execute primary actions.
- NEVER execute primary actions through clicks on text, icons, cards, links, menus, context menus, or other disguised click-based controls.
- NEVER provide an alternative click-based execution path for an action that is required to use drag-and-drop.
- NEVER bypass the required interaction through keyboard shortcuts, automatic triggers, background handlers, or other alternative execution mechanisms.
- NEVER implement drag-and-drop as decorative functionality while retaining prohibited click-based primary actions.
- NEVER treat visual appearance as evidence of Canvas Protocol compliance.

Primary actions include, but are not limited to, creating, submitting, saving, updating, deleting, restarting, continuing, reimagining, repurposing, and archiving projects.

**All primary actions must be executed exclusively by dragging the appropriate data card into a designated Action Zone.**

Non-mutating controls, such as navigation, search, filters, view switching, opening details, and editing text fields, are not prohibited merely because they use clicks.

### Core Product Requirements

- NEVER change ProjectGrim's fundamental purpose: helping users document abandoned projects and decide what to do with them.
- NEVER omit the following project information: what the project was, its original vision, completed work, unfinished work, and why development stopped.
- NEVER remove any of the five project outcomes: Revive/Restart, Continue, Reimagine/Change Idea, Repurpose, and Let Go/Archive.
- NEVER conflate archiving with permanent deletion.
- NEVER destroy project history when changing its status, direction, or intended purpose.
- NEVER replace working application functionality with static mockups, fake interactions, or hardcoded demonstration data presented as real user data.

## 3. Project Preservation

- Inspect the existing codebase before making changes.
- Read `package.json`, existing project instructions, and relevant components before proposing or implementing code.
- Preserve existing functionality, routes, APIs, data models, and working components.
- Use the existing framework, JavaScript/TypeScript choice, styling system, and installed dependencies.
- Do not migrate to Next.js, Tailwind, Framer Motion, or another library merely because the design skill recommends it.
- Never overwrite unrelated work or discard existing user changes.
- Ask before adding dependencies, changing architecture, or making destructive changes.
- Do not rebuild the application from scratch when the existing codebase can be adapted.
- Do not remove working features or existing assets merely to simplify implementation.
- Do not assume a file, component, API, package, or feature exists without inspecting the repository.

## 4. Data Integrity and Security

- NEVER report a successful operation before its success has been established.
- NEVER silently discard project drafts, unsaved edits, or user-entered information.
- NEVER bypass validation, persistence, authorization, or existing security controls.
- NEVER allow incompatible cards or invalid drop targets to trigger unrelated operations.
- NEVER introduce duplicate records or mutations through repeated drop events.
- NEVER perform destructive operations accidentally or without appropriate safeguards.
- NEVER treat a failed persistence operation as a successful state change.
- NEVER introduce insecure handling of user data to simplify an interaction.

## 5. ProjectGrim Visual Direction

ProjectGrim is an immersive home for unfinished projects: **whimsical on the surface, slightly haunting underneath.**

Aim for a distinctive, atmospheric, polished interface. Use the existing project's visual identity as the starting point.

- Avoid generic SaaS dashboards, repetitive three-card feature sections, stock AI gradients, and unnecessary glassmorphism.
- Use atmosphere, typography, composition, subtle texture, meaningful project details, and deliberate motion.
- Keep the interface mature rather than childish.
- Treat the graveyard, archive, revival, and letting-go concepts as product storytelling, not decorative gimmicks.
- Make navigation and project interactions understandable and accessible.
- Keep animation performant, respect reduced-motion preferences, and ensure the interface remains usable on mobile.
- NEVER sacrifice functional correctness or usability for visual polish.
- NEVER make essential information inaccessible solely because a user cannot use a mouse.
- NEVER use color as the sole indicator of interaction state.
- NEVER introduce visual effects that materially obstruct usability or performance.

## 6. Implementation Workflow

1. Audit the existing implementation and relevant project instructions.
2. Identify the highest-impact improvements and any conflicts with the mandatory constraints.
3. Explain proposed changes before large or risky edits.
4. Implement incrementally and reuse existing components where appropriate.
5. Check responsive layouts, keyboard accessibility, loading, empty, and error states.
6. Verify that primary actions comply with the Canvas Protocol and that prohibited click-based execution paths do not remain.
7. Run the project's existing validation scripts where available.
8. Summarize files changed, checks performed, actual results, and anything not verified.

Do not claim that tests, builds, or validations passed unless they were actually executed and passed.

## 7. Accessibility and Interaction Integrity

- Preserve keyboard accessibility and visible focus indicators.
- Support touch interaction on mobile devices.
- Provide understandable feedback for valid and invalid drag-and-drop operations.
- Do not rely on color alone to communicate drop validity or interaction states.
- NEVER use accessibility as a justification for restoring prohibited click-based primary-action buttons.
- Keyboard and assistive-technology support must not introduce an alternative mechanism that violates the required primary-action interaction model.

## 8. Conflict Resolution

When requirements conflict, follow this priority order:

1. Mandatory CODE VARIANT Canvas Protocol constraints.
2. Data integrity, security, and preservation of existing user work.
3. ProjectGrim's core purpose and required functionality.
4. Existing architecture and established project conventions.
5. Frontend design skill recommendations and visual preferences.
6. Implementation convenience.

The restrictions in this document apply to all agent-generated code, edits, refactors, components, interaction handlers, and design changes.

**No agent may silently waive, reinterpret, or bypass these constraints.** Ask the user before making a decision that would require relaxing a restriction.
