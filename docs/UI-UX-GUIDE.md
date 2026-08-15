# UI and UX guide

This guide covers the public portfolio layout, interaction patterns, and
writing style. It keeps the page roomy on large screens without letting text
lines become difficult to read.

## Layout rules

- Use the shared `.container` for page-level alignment.
- Let the canvas expand on wide screens, but keep paragraphs near 65 characters
  per line with a local `max-width`.
- Use CSS Grid for the hero, project collection, topology inspector, and
  philosophy steps.
- Let cards respond to the space they have. Collapse columns before text or
  controls become cramped.
- Keep section spacing consistent. Do not stack large bottom padding on one
  section with large top padding on the next.
- Keep the project grid broad on desktop and single-column on narrow screens.

The current layout uses a wide page canvas, fluid gutters, and a smaller text
measure. This follows the CSS Grid and responsive design guidance from [MDN's
responsive web design guide](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design).
If a component is reused in different parent layouts, prefer a container
query over a viewport-only breakpoint. See [MDN's container query
guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries).

## Writing style

Public copy uses English (US). Keep it professional, conversational, and easy
to scan.

- Prefer short sentences and concrete verbs.
- Say what the system does before describing the technology behind it.
- Use sentence case for headings and labels.
- Keep project descriptions focused on the workflow, constraint, and design
  choice.
- Keep names, locations, hosts, private paths, credentials, and identifying
  project details out of public copy.
- Avoid inflated claims, vague authority, filler, and repeated qualifiers.
- Proofread new copy aloud. Remove wording that sounds like a pitch or a
  generated summary.

Use the [humanizer skill](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)
as an editing checklist. Preserve facts and technical names, but rewrite the
sentence around them when the wording feels stiff.

## Interaction rules

- Use real buttons and links for actions.
- Keep `aria-pressed` accurate on project filters.
- Keep project cards keyboard-operable and dialogs labeled with a title and
  description.
- Return focus to the element that opened a dialog.
- Keep Escape and backdrop dismissal available for dialogs.
- Keep visible focus styles and avoid controls that are too close together.
- Honor `prefers-reduced-motion` for decorative motion and transitions.

Use [WCAG 2.2](https://www.w3.org/TR/WCAG22/) as the accessibility baseline.
The site should reflow without two-dimensional scrolling at narrow widths, and
interactive targets should meet the [minimum target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum).

## Motion and visual language

The site uses small opacity, transform, and border transitions. Motion should
explain state changes or provide feedback, not delay access to content.

SmoothUI is a useful reference for restrained motion, responsive components,
and accessible interaction. The portfolio remains a vanilla TypeScript and CSS
site, so it uses the reference ideas without adding SmoothUI or a new runtime
dependency. See the [SmoothUI project](https://github.com/educlopez/smoothui).

## Review checklist

- [ ] The page uses the shared container and does not create a narrower desktop
      island without a reason.
- [ ] Section spacing is measured from content, not from stacked spacer values.
- [ ] Paragraphs remain readable at wide widths.
- [ ] Layout reflows at narrow widths without horizontal overflow.
- [ ] New copy is English (US), short, concrete, and proofread.
- [ ] Public project copy contains no client, company, location, or private
      infrastructure identifiers.
- [ ] Keyboard, dialog, filter, focus, and reduced-motion behavior still work.
- [ ] The Podman production build passes before release.
