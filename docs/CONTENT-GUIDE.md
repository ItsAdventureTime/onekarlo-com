# Public Content Guide

This guide is the source of truth for the public **Active Projects & Systems**
section and related portfolio copy.

## Goal

Describe the work clearly enough to communicate engineering judgment while
keeping client, company, location, and infrastructure identity private.

Public entries should explain the capability, workflow, technical pattern,
operating constraint, or observable outcome. They should not function as client
case studies or as an inventory of live systems.

## Required privacy boundary

Do not publish any of the following:

- client or company names, logos, domains, or recognizable brand references;
- office, city, country, region, or other geographic locations;
- IP addresses, hostnames, SSH aliases, usernames, email addresses, or private
  filesystem paths;
- private repository names, ticket numbers, account identifiers, credentials,
  API keys, tokens, database names, or internal network names;
- screenshots, metrics, dates, or combinations of details that identify a
  specific engagement without explicit approval.

Framework and platform names may be used when they communicate a technical
pattern and do not identify a client or private deployment. Prefer the generic
description when a named tool adds no useful context.

## Language and tone

Write in English (US) with a professional, conversational voice. Keep copy
short, direct, and easy to read.

- Prefer concrete verbs such as `build`, `connect`, `track`, `check`, and
  `deploy`.
- Put the workflow or user need before the framework list.
- Use sentence case for headings and labels.
- Cut filler, vague praise, inflated claims, and repeated qualifiers.
- Keep technical names when they add useful context, but do not let them carry
  the sentence.
- Read new copy aloud and proofread it before publishing.

Apply the [UI and UX guide](UI-UX-GUIDE.md) for the broader layout, interaction,
motion, and content review.

## Project entry model

Project data lives in src/data.ts as PROJECTS_DATA. Each entry should keep
the existing typed shape:

| Field | Guidance |
| --- | --- |
| id | Stable internal identifier such as p9; never encode a client name |
| title | Capability-focused title; avoid product or organization names |
| category | Existing typed filter category |
| categoryLabel | Short user-facing category label |
| description | One concise statement of the system's value |
| tags | Frameworks, patterns, or capabilities that are safe to share |
| metrics | Verifiable build signals; avoid identifying volume or dates |
| caseStudy.overview | Anonymized scope and workflow |
| caseStudy.challenge | The generalized operational problem |
| caseStudy.solution | The architectural response |
| caseStudy.architectureHighlights | Four or fewer concrete patterns |
| caseStudy.techStack | Grouped technologies without private endpoints |

Use the existing category before adding a new one. If a new category is
necessary, update the ProjectItem type, the filter list, styles, and this
guide in the same change.

## Writing pattern

Use this sequence:

1. **Capability**: what the system enables.
2. **Workflow**: who or what process it supports, stated generically.
3. **Constraint**: the reliability, audit, performance, or privacy concern.
4. **Pattern**: the design or technology used to address it.
5. **Signal**: the verifiable result, without sensitive scale or identity.

Prefer:

~~~text
A role-aware operations system connects intake, approvals, purchasing, and
billing around one traceable work record.
~~~

Avoid:

~~~text
The system for [named company] in [location] processes [identifying volume].
~~~

## Interaction and accessibility expectations

When changing project cards or dialogs:

- keep filters as real buttons with an accurate aria-pressed state;
- keep cards keyboard-operable and preserve visible focus;
- keep the dialog labeled, modal, dismissible with Escape, and focus-restoring;
- preserve readable contrast and narrow-screen layout;
- keep decorative motion nonessential and honor prefers-reduced-motion.

Use [WCAG 2.2](https://www.w3.org/TR/WCAG22/) and [MDN's reduced-motion
guidance](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
as the baseline references.

## Review checklist

Before committing content:

- [ ] Title and copy contain no client, company, or location identifiers.
- [ ] No address, IP, hostname, username, private path, or credential appears.
- [ ] Claims are current, defensible, and written as generalized capability.
- [ ] Metrics are signals, not identifying operational data.
- [ ] Tags and technical details do not reveal private infrastructure.
- [ ] The page still works with keyboard navigation and reduced motion.
- [ ] Production build passes in Podman.

If a detail is useful only because it proves identity, remove it. Clarity is
more valuable than unnecessary specificity.
