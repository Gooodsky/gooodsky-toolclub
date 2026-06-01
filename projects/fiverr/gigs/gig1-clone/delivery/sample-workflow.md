# Sample Workflow — Website Clone & Redesign

A step-by-step walkthrough of a real project, from order to delivery.

---

## Project Overview

**Client:** Acme SaaS (fictional startup)
**Package:** Standard ($300)
**Target URL:** `acme-competitor.com` (reference site)
**Goal:** Rebuild competitor's marketing site in modern tech, with Acme's brand

---

## Phase 1: Order & Discovery (Day 1)

### 1.1 Order Received
Client places order with Standard package. Immediately send the client information request template.

### 1.2 Client Response
```
Target: acme-competitor.com
Business: Acme SaaS — AI workflow automation platform
Colors: #4F46E5 (indigo primary), #0F172A (dark), #FFFFFF
Fonts: Inter (headings), system-ui (body)
Changes: Replace pricing section, add dark mode toggle
Content: Ready-to-use text provided via Google Doc
Deployment: Has Vercel account (acme-saas)
```

### 1.3 Site Analysis
Run full inspection of `acme-competitor.com` using inspection tools.

**Captured:**
- Screenshots: desktop (1440px), tablet (768px), mobile (375px) — all 5 pages
- Design tokens: colors, spacing scale, typography system
- Component inventory: nav, hero, features grid, pricing cards, CTA, footer
- Interactions: scroll-triggered fade-ins, magnetic button hovers

**Reference Screenshot — "Before":**
```
┌──────────────────────────────────────────┐
│  [REFERENCE SITE: acme-competitor.com]   │
│                                           │
│  ┌────────────────────────────────────┐  │
│  │  Logo    Features  Pricing  About  │  │
│  │                          [Sign In] │  │
│  ├────────────────────────────────────┤  │
│  │                                    │  │
│  │     Automate Your Workflows        │  │
│  │  AI-powered automation platform    │  │
│  │  [Start Free]  [Book Demo]        │  │
│  │                                    │  │
│  ├────────────────────────────────────┤  │
│  │  [Feature 1] [Feature 2] [Feat 3] │  │
│  ├────────────────────────────────────┤  │
│  │         Pricing Tiers              │  │
│  ├────────────────────────────────────┤  │
│  │            Footer                  │  │
│  └────────────────────────────────────┘  │
│                                           │
│  Tech: React, styled-components          │
│  Issues: No TypeScript, slow load (4.2s) │
└──────────────────────────────────────────┘
```

---

## Phase 2: Development (Day 2–4)

### 2.1 Project Scaffold
```bash
npx create-next-app@latest acme-landing --typescript --tailwind --eslint
```

### 2.2 Design Token Extraction
Extract all design values from inspection into Tailwind config:

```css
/* Extracted from reference + client brand overlay */
:root {
  --primary: #4F46E5;
  --bg-dark: #0F172A;
  --text-primary: #F8FAFC;
  --text-secondary: #94A3B8;
  --spacing-unit: 4px; /* 4, 8, 12, 16, 24, 32, 48, 64, 96 */
  --radius: 12px;
}
```

### 2.3 Component Build (In Order)
1. **Layout shell** — Navbar + Footer (shared across all pages)
2. **Homepage sections:** Hero → Features Grid → Testimonials → CTA
3. **Sub-pages:** Features detail, Pricing (redesigned), About, Blog index
4. **Contact form** — name, email, company size, message + validation
5. **Dark mode** — toggle with system preference detection

### 2.4 Responsive Testing

| Breakpoint | Width | Status |
|---|---|---|
| Mobile | 375px | [x] Pass |
| Mobile Large | 414px | [x] Pass |
| Tablet | 768px | [x] Pass |
| Tablet Landscape | 1024px | [x] Pass |
| Desktop | 1440px | [x] Pass |
| Ultra-wide | 1920px | [x] Pass |

### 2.5 First Deploy Preview
Every day, push to Vercel preview branch. Client sees live progress:
```
https://acme-landing-git-dev-acme-saas.vercel.app
```

**Progress Screenshot — "During Development":**
```
┌──────────────────────────────────────────┐
│  [BUILD PREVIEW: acme-landing.vercel]    │
│                                           │
│  ┌────────────────────────────────────┐  │
│  │  Acme      Features  Pricing  About│  │
│  │                          [Sign In] │  │
│  ├────────────────────────────────────┤  │
│  │                                    │  │
│  │     Automate Your Workflows        │  │
│  │  AI-powered automation platform    │  │
│  │  [Start Free]  [Book Demo]        │  │
│  │                                    │  │
│  │  (Indigo accent, Inter font)       │  │
│  │  (Cleaner spacing, dark mode)      │  │
│  └────────────────────────────────────┘  │
│                                           │
│  Tech: Next.js 15, TypeScript, Tailwind  │
│  Perf: 1.2s load (3.5x improvement)      │
│  Status: In progress — Pricing WIP       │
└──────────────────────────────────────────┘
```

---

## Phase 3: Review & Revision (Day 5)

### 3.1 Client Review
Client reviews the preview, provides feedback:
- "Make CTA button larger on mobile"
- "Swap testimonials section to 2-column grid"
- "Add animation to the hero heading"

### 3.2 Revision Round
All 3 changes applied within 4 hours. Updated preview pushed.

### 3.3 Final Approval
Client approves the final build. All checks pass:
- [x] TypeScript strict mode — 0 errors
- [x] ESLint — 0 warnings
- [x] Lighthouse: Performance 94, Accessibility 100, Best Practices 100, SEO 100
- [x] Responsive on all 6 breakpoints
- [x] Contact form sends to client's email
- [x] Dark mode works + respects system preference

---

## Phase 4: Delivery (Day 5)

### 4.1 Deliverable Package

```
delivery/
├── source-code.zip          # Full Next.js project
├── README.md                # Setup, run, deploy instructions
├── DEPLOYMENT.md            # Vercel step-by-step guide
└── PREVIEW.md               # Screenshot comparisons
```

**Final Screenshot — "After" (Delivered):**
```
┌──────────────────────────────────────────┐
│  [DELIVERED SITE: acme-landing.vercel]   │
│                                           │
│  ┌────────────────────────────────────┐  │
│  │  Acme      Features  Pricing  About│  │
│  │                          [Sign In] │  │
│  ├────────────────────────────────────┤  │
│  │        ┌─── Dark Mode: ON ───┐    │  │
│  │        │                     │     │  │
│  │        │  Automate Your      │     │  │
│  │        │  Workflows          │     │  │
│  │        │  AI-powered auto-   │     │  │
│  │        │  mation platform    │     │  │
│  │        │  [Start Free]       │     │  │
│  │        │  [Book Demo]        │     │  │
│  │        │                     │     │  │
│  │        └─────────────────────┘     │  │
│  ├────────────────────────────────────┤  │
│  │  [2-col Feature Grid — redesigned] │  │
│  ├────────────────────────────────────┤  │
│  │  [New Pricing Section]             │  │
│  ├────────────────────────────────────┤  │
│  │  Footer with dark mode             │  │
│  └────────────────────────────────────┘  │
│                                           │
│  Result: Modern tech stack, client brand  │
│  Perf: Lighthouse 94, load 1.1s          │
└──────────────────────────────────────────┘
```

---

## Before vs After Comparison

| Metric | Reference Site | Delivered Site |
|---|---|---|
| **Framework** | React (CRA) | Next.js 15+ |
| **Type Safety** | JavaScript | TypeScript (strict) |
| **Styling** | styled-components | Tailwind CSS 4 |
| **Load Time** | 4.2 seconds | 1.1 seconds |
| **Lighthouse** | 62 | 94 |
| **Dark Mode** | None | Full support |
| **Responsive** | Desktop + Mobile | All 6 breakpoints |
| **SEO** | Basic meta | Meta + OG + Schema + Sitemap |
| **Contact Form** | Broken on mobile | Fully functional + validated |

---

## Timeline Summary

| Day | Activity | Output |
|---|---|---|
| **Day 1** | Discovery, client intake, site analysis | Design tokens doc, component inventory |
| **Day 2** | Scaffold, layout shell, hero section | Live preview link shared |
| **Day 3** | All pages + components built | Feature-complete preview |
| **Day 4** | Responsive polish, form, dark mode | QA checklist passed |
| **Day 5** | Client review, 1 revision round, final delivery | Source code + docs delivered |

Total: **5 days** from order to delivery (as promised in Standard package).

---

*This is a representative workflow. Actual timelines may vary based on project complexity and client responsiveness.*
