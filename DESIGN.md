---
name: Arrival Design System
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#3d4946'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#6d7a77'
  outline-variant: '#bcc9c5'
  surface-tint: '#006b5f'
  primary: '#00685d'
  on-primary: '#ffffff'
  primary-container: '#008376'
  on-primary-container: '#f4fffb'
  inverse-primary: '#70d8c8'
  secondary: '#296767'
  on-secondary: '#ffffff'
  secondary-container: '#b0eeed'
  on-secondary-container: '#306e6d'
  tertiary: '#4f5f5f'
  on-tertiary: '#ffffff'
  tertiary-container: '#677877'
  on-tertiary-container: '#f3fffe'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#8df5e4'
  primary-fixed-dim: '#70d8c8'
  on-primary-fixed: '#00201c'
  on-primary-fixed-variant: '#005048'
  secondary-fixed: '#b0eeed'
  secondary-fixed-dim: '#94d1d1'
  on-secondary-fixed: '#002020'
  on-secondary-fixed-variant: '#044f4f'
  tertiary-fixed: '#d4e6e5'
  tertiary-fixed-dim: '#b8cac9'
  on-tertiary-fixed: '#0e1e1e'
  on-tertiary-fixed-variant: '#3a4a49'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

The brand personality is professional, local, and transparent, specifically tailored for the rental market in Valdivia. It balances the reliability of a property management service with the natural, fluid energy of the region's river-based geography. 

The design style follows a **Modern / Corporate** aesthetic with a strong emphasis on clarity and whitespace. It avoids unnecessary decorative elements, favoring structural precision and high-quality typography to build trust with both property owners and tenants. The visual language is inspired by the logo's intersection of architecture and nature, using clean lines and a disciplined color application to evoke a sense of "home" and "destination."

## Colors

The palette is derived directly from the Valdivian landscape and the brand’s visual identity. 

- **Primary Action (#00897B):** A vibrant teal used for call-to-action buttons, active states, and highlights. It represents the vitality of the local environment.
- **High Contrast (#004D4D):** A deep, dark teal reserved for primary headings and critical UI elements. It provides the "anchor" for the brand, ensuring legibility and a premium feel.
- **Backgrounds:** The primary surface is pure white (#FFFFFF) to ensure maximum "transparency" and cleanliness, with soft gray (#F9FAFB) used for secondary containers and background sections to create subtle depth.
- **Functional Tones:** Tertiary teal (#E0F2F1) is used for low-impact backgrounds, such as badge fills or light hover states, maintaining color harmony without overwhelming the user.

## Typography

This design system utilizes **Hanken Grotesk** across all levels. This typeface offers a clean, contemporary feel with geometric foundations that mirror the logo's typography.

- **Headlines:** Use Dark Teal (#004D4D) for all headings to ensure strong hierarchy and brand presence. Display and Large headings use a tighter letter-spacing for a more impactful, modern editorial look.
- **Body:** Content is rendered in a dark neutral-gray (#374151) rather than pure black to reduce eye strain while maintaining accessibility.
- **Labels:** Used for navigation items, tags, and form headers. Medium and Small labels utilize slightly heavier weights (600/500) to stand out clearly against surrounding content.

## Layout & Spacing

The design system employs a **12-column fluid grid** for desktop and a **4-column grid** for mobile. The layout model relies on a strict 8px baseline rhythm to ensure vertical consistency across components.

- **Desktop (1280px+):** Centered container with 40px outer margins. Content spans are typically 3, 4, or 6 columns for property cards and forms.
- **Tablet (768px - 1024px):** Margins reduce to 24px. Grid remains fluid.
- **Mobile (<768px):** 16px margins. Most components (cards, inputs) expand to full-width (4 columns) to prioritize readability and touch targets.

Spacing between related items (e.g., label to input) should be 8px (1 unit). Spacing between sections or distinct components should be 32px or 48px (4-6 units) to maintain the "clean and airy" brand promise.

## Elevation & Depth

To reinforce the sense of transparency and modern professionalism, the design system uses **Tonal Layers** combined with **Ambient Shadows**.

- **Level 0 (Flat):** Primary background (#FFFFFF).
- **Level 1 (Subtle Elevation):** Used for cards and navigation bars. Defined by a very soft, diffused shadow: `0px 4px 20px rgba(0, 77, 77, 0.05)`. This uses a Dark Teal tint in the shadow to keep the depth feeling "on-brand."
- **Level 2 (Active/Floating):** Used for modals and dropdown menus. Defined by a more pronounced shadow: `0px 8px 30px rgba(0, 77, 77, 0.12)`.
- **Outlines:** In lieu of heavy shadows, low-contrast borders (1px solid #E5E7EB) are used to define input fields and list items, keeping the UI looking crisp and lightweight.

## Shapes

The shape language is **Rounded**, reflecting the circular motif of the logo. 

- **Standard (0.5rem):** Applied to buttons, input fields, and small cards.
- **Large (1rem):** Applied to property image containers and main content modules.
- **Extra Large (1.5rem):** Reserved for decorative elements or search bars that serve as focal points.

This soft rounding mitigates the "corporate" stiffness, making the platform feel approachable and welcoming for travelers and residents.

## Components

### Buttons
- **Primary:** Solid Vibrant Teal (#00897B) with white text. High-contrast hover state (#00695C).
- **Secondary:** Ghost style with Dark Teal (#004D4D) border and text. 
- **Icons:** Use Lucide icons (20px for buttons). Ensure stroke width is consistent (2px).

### Input Fields
- White background with a 1px border (#D1D5DB). On focus, the border shifts to Vibrant Teal with a subtle 2px glow. Labels are always placed above the field in `label-md` style.

### Cards (Property Listings)
- Use `rounded-lg` (1rem) for the overall container.
- Images should have top-only rounding to sit flush against the container edges.
- Use a soft Level 1 shadow to separate the card from the #F9FAFB background.

### Chips & Badges
- Used for property status (e.g., "Available", "Reserved").
- Use light background tints of functional colors (Success Green, Error Red, or Tertiary Teal) with dark-toned text for high legibility.

### Lists & Navigation
- Navigation items use `label-md`. The active state is indicated by a 2px bottom bar in Vibrant Teal rather than a background change, maintaining a "minimalist" look.