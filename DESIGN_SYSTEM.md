# KitaNime Design System - Quick Reference Guide

## Color Palette

### Light Mode
- **Background**: #f8fafc (Slate 50)
- **Surface**: #ffffff (White)
- **Text Primary**: #0f172a (Slate 900)
- **Text Secondary**: #64748b (Slate 500)
- **Primary**: #7c3aed (Purple 600)
- **Success**: #16a34a (Green 600)
- **Warning**: #ea580c (Orange 600)
- **Danger**: #dc2626 (Red 600)

### Dark Mode
- **Background**: #0f172a (Slate 950)
- **Surface**: #1f2937 (Gray 800)
- **Text Primary**: #f3f4f6 (Gray 100)
- **Text Secondary**: #9ca3af (Gray 400)
- **Primary**: #a78bfa (Purple 400)
- **Success**: #86efac (Green 300)
- **Warning**: #fdba74 (Orange 300)
- **Danger**: #f87171 (Red 400)

## Typography System

### Font Family
- Primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- Code: 'Courier New', monospace

### Font Sizes
- h1: 2rem (32px) - Desktop: 3rem
- h2: 1.5rem (24px) - Desktop: 2.25rem
- h3: 1.25rem (20px)
- h4: 1.125rem (18px)
- h5: 1rem (16px)
- h6: 0.875rem (14px)
- Body: 1rem (16px)
- Small: 0.875rem (14px)

### Line Heights
- Headings: 1.2 - 1.4
- Body: 1.5 - 1.6
- Code: 1.6

## Spacing System

| Size | Mobile | Tablet | Desktop |
|------|--------|--------|---------|
| xs   | 0.25rem (4px) | - | - |
| sm   | 0.5rem (8px) | - | - |
| md   | 1rem (16px) | 1rem | 1rem |
| lg   | 1.5rem (24px) | 1.5rem | 2rem |
| xl   | 2rem (32px) | 2rem | 3rem |
| 2xl  | 3rem (48px) | 3rem | 4rem |

## Border Radius

| Size | Value |
|------|-------|
| sm   | 6px   |
| md   | 10px  |
| lg   | 14px  |
| xl   | 18px  |
| 2xl  | 22px  |

## Shadow System

| Level | Value |
|-------|-------|
| sm    | 0 1px 2px rgba(0,0,0,0.06) |
| md    | 0 6px 16px rgba(2, 6, 23, 0.08) |
| lg    | 0 10px 25px rgba(0, 0, 0, 0.1) |
| xl    | 0 20px 40px rgba(0, 0, 0, 0.15) |
| 2xl   | 0 25px 50px rgba(0, 0, 0, 0.25) |

## Animation System

### Durations
- Fast: 150ms
- Normal: 300ms
- Slow: 500ms
- Bounce: 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)

### Keyframe Animations
- `fadeInUp` - Fade in with slide up
- `fadeInScale` - Fade in with scale
- `slideInRight` - Slide in from right
- `slideDown` - Slide down from top
- `scaleIn` - Scale in effect
- `pulse` - Pulsing opacity
- `float` - Floating animation
- `shimmerLoading` - Skeleton loading shimmer

### Utility Classes
```html
<!-- Fade in up animation -->
<div class="animate-fade-in-up"></div>

<!-- Slide down animation -->
<div class="animate-slide-down"></div>

<!-- Scale in animation -->
<div class="animate-scale-in"></div>

<!-- Shimmer loading -->
<div class="animate-shimmer"></div>

<!-- With animation delays -->
<div class="animate-fade-in-up animate-delay-100"></div>
<div class="animate-fade-in-up animate-delay-200"></div>
```

## Responsive Grid System

### Grid Breakpoints
- **Mobile** (< 640px): 2 columns, 1rem gap
- **Small** (640px+): 3 columns, 1.25rem gap
- **Medium** (768px+): 4 columns, 1.5rem gap
- **Large** (1024px+): 5 columns, 1.75rem gap
- **Extra Large** (1280px+): 6 columns, 2rem gap

### Usage
```html
<!-- Responsive grid -->
<div class="anime-grid">
  <div class="anime-card"></div>
  <!-- Cards automatically adjust -->
</div>
```

## Component Sizes

### Button Sizes
- Minimum Height: 40px (44px on mobile)
- Minimum Width: 40px
- Padding: 0.625rem 1rem (0.75rem 1.25rem on mobile)

### Touch Targets
- Minimum: 44px × 44px
- Recommended: 48px × 48px

## Interactive States

### Focus State
- Outline: 3px solid #7c3aed
- Outline Offset: 2-3px
- Box Shadow: 0 0 0 4px rgba(124, 58, 237, 0.1)

### Hover State
- Transform: translateY(-2px)
- Shadow: Increase to next level
- Opacity: May increase to 1

### Active State
- Transform: translateY(0)
- Box Shadow: Inset shadow
- Opacity: Decrease to 0.9

### Disabled State
- Opacity: 0.5
- Cursor: not-allowed
- No hover effects

## Accessibility Features

### Keyboard Navigation
- Tab: Focus next element
- Shift+Tab: Focus previous element
- Enter: Activate button/link
- Escape: Close modal/dropdown
- Arrow Keys: Navigate lists

### Screen Reader Support
- All images have alt text
- Buttons have clear labels
- Form inputs have associated labels
- Skip to main content link available
- Proper heading hierarchy

### Color Contrast Ratios
- Normal Text: 4.5:1 minimum (WCAG AA)
- Large Text: 3:1 minimum (WCAG AA)
- UI Components: 3:1 minimum

## CSS Custom Properties

```css
/* Colors */
--color-bg: #f8fafc;
--color-surface: #ffffff;
--color-text: #0f172a;
--color-primary: #7c3aed;

/* Glassmorphism */
--glass-bg: rgba(255, 255, 255, 0.8);
--glass-border: rgba(255, 255, 255, 0.2);
--glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

/* Spacing */
--spacing-sm: 0.5rem;
--spacing-md: 1rem;
--spacing-lg: 1.5rem;

/* Transitions */
--transition-fast: 150ms ease;
--transition-normal: 300ms ease;
```

## Best Practices

### Mobile First
1. Design for mobile first
2. Add features at larger breakpoints
3. Test on real devices

### Performance
1. Lazy load images
2. Defer non-critical CSS
3. Use hardware acceleration for animations
4. Minimize main thread work

### Accessibility
1. Use semantic HTML
2. Add proper ARIA labels
3. Test with keyboard
4. Support reduced motion
5. Maintain color contrast

### Dark Mode
1. Use CSS custom properties
2. Test colors in both modes
3. Ensure sufficient contrast
4. Don't rely on color alone

## Common Classes

### Utility Classes
```html
<!-- Responsive padding -->
<div class="px-3 sm:px-4 lg:px-6"></div>

<!-- Responsive typography -->
<h1 class="text-2xl md:text-3xl lg:text-4xl"></h1>

<!-- Responsive spacing -->
<section class="space-y-4 sm:space-y-6 lg:space-y-8"></section>

<!-- Glass morphism -->
<div class="glass"></div>
<div class="glass-card"></div>

<!-- Animations -->
<div class="animate-fade-in-up"></div>
<div class="animate-slide-down"></div>

<!-- Accessibility -->
<div class="sr-only">Screen reader only</div>
```

## Testing Checklist

- [ ] Desktop (1920px, 1440px, 1024px)
- [ ] Tablet (768px, 810px)
- [ ] Mobile (375px, 390px, 480px)
- [ ] Dark mode toggle
- [ ] All animations smooth
- [ ] Touch interactions responsive
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast meets WCAG AA
- [ ] Images load responsively
- [ ] Form inputs accessible
- [ ] No layout shifts (CLS)
- [ ] Fast load times (LCP)
- [ ] Smooth interactions (FID)

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Accessibility Guidelines](https://www.a11y-101.com/)
- [Web Vitals](https://web.dev/vitals/)
