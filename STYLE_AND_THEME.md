# Frontend Styles and Theme Reference

This document captures the actual visual system implemented in the frontend as of the current codebase.

## Theme Summary

The application uses a dark, premium dashboard aesthetic with gold/yellow as the primary accent. The design language is built around glassmorphism, soft glows, rounded cards, uppercase section labels, and motion-driven panels. The main shell is optimized for society administration workflows across admin, resident, and guard roles.

## Design Tokens

### Core Colors

The theme tokens are defined in [tailwind.config.ts](tailwind.config.ts) and reinforced in [src/app/globals.css](src/app/globals.css).

| Token | Value | Usage |
| --- | --- | --- |
| `background` | `#080B14` | Global page background, deep charcoal/slate |
| `foreground` | `#F8FAFC` | Primary text on dark surfaces |
| `primary` | `#FACC15` | Brand accent, buttons, highlights, active states |
| `primary.dark` | `#EAB308` | Hover and deeper accent tone |
| `primary.light` | `#FEF08A` | Lighter accent tone |
| `primary.foreground` | `#000000` | Text/icon color on primary surfaces |
| `secondary` | `#0F172A` | Dashboard chrome, sidebars, headers |
| `secondary.dark` | `#080B14` | Deeper dark tone for nested surfaces |
| `secondary.foreground` | `#F8FAFC` | Text on secondary surfaces |
| `sidebar.DEFAULT` | `#0F172A` | Sidebar base color |
| `sidebar.active` | `rgba(250, 204, 21, 0.1)` | Active sidebar item highlight |
| `sidebar.text` | `#94A3B8` | Inactive sidebar text |
| `sidebar.hover` | `#1E293B` | Sidebar hover surface |
| `accent.success` | `#10B981` | Success states and positive indicators |
| `accent.error` | `#EF4444` | Errors and destructive states |
| `accent.info` | `#3B82F6` | Informational states |

### Typography

The app uses two Google fonts loaded in [src/app/layout.tsx](src/app/layout.tsx):

| Role | Font | CSS Variable | Where Used |
| --- | --- | --- | --- |
| Body / UI text | Inter | `--font-inter` | Default app text, form labels, body copy |
| Headings / display text | Poppins | `--font-poppins` | Large titles, section headers, dashboard labels |

Implementation details:
- The root layout applies `font-sans` and binds `Inter` to the body.
- Heading-style elements consistently use `font-heading`.
- Dashboard copy often uses `font-black`, `uppercase`, and `tracking-widest` for a tactical control-panel feel.

## Visual Style

### Shell and Background

The app shell is intentionally dark and layered:

- The root HTML uses `className="dark"`.
- The base body background is `#080B14`.
- The global background includes subtle radial glows from the top-left and bottom-right corners.
- The dashboard shell uses `bg-background` with `overflow-x-hidden` and fixed decorative blur blobs.

### Surface System

The codebase relies on a small set of reusable visual surface patterns:

| Class | Effect |
| --- | --- |
| `glass` | Semi-transparent white overlay with blur and an inset stroke |
| `glass-card` | Frosted card surface with rounded corners, glass gradient, and premium shadowing |
| `premium-gradient` | Gold-forward gradient from primary yellow into amber |
| `text-glow` | Soft yellow text glow |

These are defined in [src/app/globals.css](src/app/globals.css).

### Borders, Shadows, and Glow

The theme intentionally avoids flat surfaces. Common effects include:

- Thin white borders at low opacity, usually `border-white/5` or `border-white/10`.
- Premium glow shadows such as `shadow-premium` and `shadow-glow-primary`.
- Hover states that brighten borders or shift icon/text colors rather than dramatically changing layout.
- Large-radius cards and controls, typically `rounded-2xl`, `rounded-3xl`, or custom rounded values.

## Layout Language

### Global App Layout

The main layout in [src/components/layout/DashboardLayout.tsx](src/components/layout/DashboardLayout.tsx) establishes the primary interaction frame:

- Fixed background glow layers sit behind the content.
- A persistent sidebar is pinned to the left on desktop.
- The main content area uses a `max-w-7xl` centered column with generous spacing.
- The topbar is sticky and keeps context controls visible while scrolling.
- The footer is minimal and utility-like, using small uppercase text with low opacity.

### Sidebar

The sidebar is a dark, vertical navigation rail with:

- A brand block at the top.
- Role-specific navigation sets for `admin`, `resident`, and `guard`.
- Active item highlighting with a gold fill and animated layout transitions.
- Compact, uppercase role labeling in small text.
- A bottom status block that reinforces the current operator identity.

The active item style uses gold, dark gold, and a slim left indicator bar.

### Topbar

The topbar follows a control-console pattern:

- Sticky header with dark secondary background.
- Mobile menu button on smaller screens.
- Role switcher dropdown in a glassy dark panel.
- Notification icon with a gold status dot.
- User identity block aligned to the right.

## Component Style Rules

### Buttons

The shared [Button](src/components/ui/Button.tsx) component uses motion and a compact control style:

- Default shape: `rounded-xl`.
- Default sizes: `sm`, `md`, and `lg`.
- Primary button styling: gold fill with white text in the shared component, though many page-level buttons override to black text on gold surfaces for a sharper premium look.
- Motion: subtle hover lift and tap scale.
- Variants available: `primary`, `secondary`, `outline`, `ghost`, `danger`, `success`.

### Inputs

The shared [Input](src/components/ui/Input.tsx) component follows a light field style that is mainly used on lighter surfaces such as login/setup forms:

- Height: `h-11`.
- Shape: `rounded-xl`.
- Border: light gray border with translucent white background.
- Focus: primary ring.
- Error state: accent error border and ring.

### Cards

The shared [Card](src/components/ui/Card.tsx) component is the main content container throughout the app:

- Motion entrance: fades in and slides up slightly.
- Default surface: `glass-card`.
- Optional hover effect can be disabled.
- Used for dashboard statistics, content panels, alerts, modal bodies, and action surfaces.

### Modals

The shared [Modal](src/components/ui/Modal.tsx) uses a high-contrast dark overlay and a glass card container:

- Backdrop: `bg-black/90` with blur.
- Content: centered, max-width `xl`, glass card.
- Header: uppercase heading with wide tracking.
- Close control: small rounded icon button.

## Page-Level Visual Patterns

### Login and Setup Pages

The login page is visually lighter than the dashboard shell:

- Background uses a full-screen pattern image.
- The card uses a translucent white background with dark-mode fallback.
- Form controls use lighter, neutral surfaces.
- The page still preserves the gold accent and heading font pairing.

### Dashboard Pages

Admin, resident, and guard dashboards share a common structure:

- Large bold heading with a highlighted keyword in gold.
- Uppercase section labels with wide letter spacing.
- Glass cards for content blocks.
- Strong use of iconography from Lucide React.
- Animated entrance states from Framer Motion.
- Large rounded call-to-action buttons with gold glow treatment.

### Role-Specific Tone

Each role has a slightly different visual flavor while staying inside the same theme:

- Admin: control-center and operations feel, with summary metrics and action shortcuts.
- Resident: service dashboard with announcements, bookings, and personal status cards.
- Guard: tactical scanner style, stronger uppercase treatment, and verification-focused UI.

## Motion and Interaction

The frontend uses Framer Motion to keep interactions tactile but restrained:

- Page sections fade or slide into view on load.
- Sidebar active states animate using shared layout IDs.
- Dropdowns and drawers animate with small spring transitions.
- Buttons use slight hover lift and tap compression.
- Scanner and status indicators use pulse or moving-line effects where appropriate.

The motion system supports the premium dashboard feel without becoming visually noisy.

## Visual Identity Rules

The current UI consistently follows these rules:

- Dark first, with gold as the hero accent.
- High contrast text on deep backgrounds.
- Rounded, elevated, glass-like surfaces.
- Uppercase labels for control and status areas.
- Minimal decorative color outside the accent system.
- Role-based navigation and context switching are always visible in the shell.

## Practical Notes

- The implementation currently mixes dark dashboard surfaces with lighter form pages for login/setup.
- The dashboard theme is the strongest and most consistent visual identity across the app.
- The theme depends on Tailwind tokens plus utility classes, not on a separate design system package.

## Source Files

- [src/app/layout.tsx](src/app/layout.tsx)
- [src/app/globals.css](src/app/globals.css)
- [tailwind.config.ts](tailwind.config.ts)
- [src/components/layout/DashboardLayout.tsx](src/components/layout/DashboardLayout.tsx)
- [src/components/layout/Sidebar.tsx](src/components/layout/Sidebar.tsx)
- [src/components/layout/Topbar.tsx](src/components/layout/Topbar.tsx)
- [src/components/ui/Button.tsx](src/components/ui/Button.tsx)
- [src/components/ui/Card.tsx](src/components/ui/Card.tsx)
- [src/components/ui/Input.tsx](src/components/ui/Input.tsx)
- [src/components/ui/Modal.tsx](src/components/ui/Modal.tsx)
