---
name: Serene Productivity
colors:
  surface: '#fbf9fa'
  surface-dim: '#dbd9db'
  surface-bright: '#fbf9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f5'
  surface-container: '#efeeef'
  surface-container-high: '#e9e8e9'
  surface-container-highest: '#e3e2e3'
  on-surface: '#1c1b1c'
  on-surface-variant: '#484648'
  outline: '#797679'
  outline-variant: '#c9c5c9'
  primary: '#64748b'
  on-primary: '#ffffff'
  primary-container: '#eaddff'
  on-primary-container: '#21005d'
  secondary: '#625b71'
  on-secondary: '#ffffff'
  secondary-container: '#e8def8'
  on-secondary-container: '#1d192b'
  tertiary: '#7d5260'
  on-tertiary: '#ffffff'
  tertiary-container: '#ffd8e4'
  on-tertiary-container: '#31111d'
  error: '#b3261e'
  on-error: '#ffffff'
  error-container: '#f9dedc'
  on-error-container: '#410e0b'
typography:
  font-family: Geist, sans-serif
  scales:
    display-lg:
      size: 57px
      line-height: 64px
      weight: 400
    headline-lg:
      size: 32px
      line-height: 40px
      weight: 400
    headline-md:
      size: 28px
      line-height: 36px
      weight: 400
    title-lg:
      size: 22px
      line-height: 28px
      weight: 500
    body-lg:
      size: 16px
      line-height: 24px
      weight: 400
    label-md:
      size: 12px
      line-height: 16px
      weight: 500
spacing:
  base: 4px
  scale:
    xs: 4px
    sm: 8px
    md: 16px
    lg: 24px
    xl: 32px
    xxl: 48px
roundness:
  default: 8px
  full: 9999px
---

# Serene Productivity - Design System

## Overview
A premium, AI-native visual system designed for clarity, focus, and modern professional workflows. Inspired by the clean aesthetics of Linear and Attio, this system prioritizes generous whitespace, subtle depth, and a calm color palette to reduce cognitive load in data-dense environments.

## Visual Principles
- **Quiet Interface:** Use low-contrast surfaces and muted borders to keep the focus on content and data.
- **Layered Surfaces:** Depth is communicated through soft shadows and subtle background shifts rather than heavy lines.
- **Intentional Typography:** High legibility via Geist for a modern, startup feel.
- **Micro-interactivity:** Smooth transitions and scale-based active states provide tactile feedback.

## Usage
Apply the `surface` and `surface-container` tokens for background hierarchy. Use `primary` (#64748B) sparingly for call-to-action elements and brand identifiers. Status colors should use the muted tertiary and error palettes to signal information without visual noise.