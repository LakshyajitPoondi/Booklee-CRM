---
name: Serene Productivity
colors:
  surface: '#fbf9fa'
  surface-dim: '#dbd9db'
  surface-bright: '#fbf9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f5'
  surface-container: '#efedef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#44474c'
  inverse-surface: '#303032'
  inverse-on-surface: '#f2f0f2'
  outline: '#74777d'
  outline-variant: '#c4c6cd'
  surface-tint: '#505f76'
  primary: '#4c5b71'
  on-primary: '#ffffff'
  primary-container: '#64748b'
  on-primary-container: '#f9f9ff'
  inverse-primary: '#b7c8e1'
  secondary: '#516072'
  on-secondary: '#ffffff'
  secondary-container: '#d2e1f7'
  on-secondary-container: '#556477'
  tertiary: '#416059'
  on-tertiary: '#ffffff'
  tertiary-container: '#597972'
  on-tertiary-container: '#e6fff8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d3e4fe'
  primary-fixed-dim: '#b7c8e1'
  on-primary-fixed: '#0b1c30'
  on-primary-fixed-variant: '#38485d'
  secondary-fixed: '#d4e4fa'
  secondary-fixed-dim: '#b9c8de'
  on-secondary-fixed: '#0d1c2d'
  on-secondary-fixed-variant: '#39485a'
  tertiary-fixed: '#c7eae1'
  tertiary-fixed-dim: '#accec5'
  on-tertiary-fixed: '#00201b'
  on-tertiary-fixed-variant: '#2d4c46'
  background: '#fbf9fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e4'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  headline-sm:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
---

## Brand & Style
This design system is anchored in a philosophy of "quiet efficiency." It targets professional users in SaaS, finance, or administrative sectors who require deep focus and clarity. The aesthetic is a refined **Minimalism** blended with **Modern Corporate** sensibilities, emphasizing clarity through generous negative space and a restrained color palette.

The emotional response should be one of calm, reliability, and precision. By removing visual noise—such as heavy borders or high-saturation backgrounds—the UI allows content to take precedence. The visual language conveys a premium feel not through decoration, but through the careful balance of typography and subtle depth.

## Colors
The palette is built on a foundation of "off-white" layers to reduce eye strain and establish a premium, editorial feel.
- **Surface Foundations:** We use `#FFFFFF` for primary content cards to make them "pop" against the `#F8FAFC` background. 
- **Accents:** Muted, low-saturation tones are used sparingly for semantic meaning (e.g., status indicators, active states). These are never aggressive; they are "tinted neutrals."
- **Neutrals:** Typography and iconography primarily utilize the Slate scale (`#1E293B` to `#64748B`) to maintain high legibility without the harshness of pure black.

## Typography
We utilize **Geist** for its technical precision and modern, grotesque character. The type system relies on subtle weight changes rather than extreme size shifts to denote hierarchy.
- **Headlines:** Use Semi-Bold (`600`) with tight letter-spacing for a modern, compact feel.
- **Body Text:** Standardized at `14px` and `16px` with generous line heights to ensure readability in data-heavy environments.
- **Labels:** Always in Medium (`500`) to differentiate from body text, often used for metadata or secondary navigation elements.

## Layout & Spacing
The layout uses a **Fluid Grid** approach within a fixed maximum container width of 1440px. 
- **Grid:** 12-column layout for desktop with 24px gutters.
- **Rhythm:** An 8px linear scale (with 4px increments for micro-adjustments) governs all internal component padding.
- **White Space:** Aim for "generous" internal margins (minimum 24px) within cards to maintain the calm, premium feel. Content should never feel cramped against a border.
- **Adaptive Rules:** On tablet, gutters reduce to 16px. On mobile, margins reduce to 16px and multi-column layouts stack vertically.

## Elevation & Depth
Hierarchy is established through **Tonal Layers** and **Ambient Shadows** rather than high-contrast borders.
- **Level 0 (Background):** `#F8FAFC` - The base canvas.
- **Level 1 (Cards/Surfaces):** `#FFFFFF` - Used for all primary content containers. These feature a soft shadow: `0px 4px 12px rgba(0, 0, 0, 0.03)`.
- **Level 2 (Overlays/Modals):** High-elevation surfaces with a more pronounced shadow: `0px 12px 32px rgba(0, 0, 0, 0.08)`.
- **Outlines:** Use a very subtle 1px border (`#F1F5F9`) on Level 1 elements to provide structure on low-quality displays without adding visual weight.

## Shapes
The design system employs a **Rounded** aesthetic to soften the technical nature of the typography. 
- **Standard UI (Buttons, Inputs):** 8px (`0.5rem`) corner radius.
- **Large Containers (Cards, Modals):** 16px (`1rem`) corner radius to emphasize the "object-like" feel of content blocks.
- **Interactive Elements:** Active states may use a slightly more pronounced radius to indicate focus.

## Components
- **Buttons:** Primary buttons use a soft slate (`#475569`) with white text. Secondary buttons are ghost-style with a `#F1F5F9` background on hover.
- **Input Fields:** Use `#FFFFFF` background with a 1px `#E2E8F0` border. On focus, the border transitions to the soft blue accent with a subtle outer glow.
- **Cards:** The workhorse of the system. Cards must have `24px` internal padding. Titles should be `Headline-SM`.
- **Chips/Badges:** Use the muted accent palette (Sage, Dusty Pink, Soft Blue) with extremely low opacity backgrounds (10-15%) and slightly darker text for the label.
- **Navigation:** The sidebar should utilize the `#F8FAFC` background to blend into the application frame, using active indicators with a 4px vertical pill on the left side of the menu item.
- **Lists:** Clean rows separated by 1px `#F1F5F9` lines, omitting the border on the first and last items for a "borderless" feel.