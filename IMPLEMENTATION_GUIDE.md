# KitaNime - Implementation & Usage Guide

## Quick Start

### For Developers

1. **Review Documentation**
   ```bash
   # Read the improvements made
   cat IMPROVEMENTS.md
   
   # Check the design system
   cat DESIGN_SYSTEM.md
   
   # See the final report
   cat FINAL_REPORT.md
   ```

2. **Check CSS Files**
   - `public/css/responsive.css` - Responsive design system
   - `public/css/accessibility.css` - Accessibility features
   - `public/css/theme.css` - Main theme with animations
   - `public/css/dark-mode-enhanced.css` - Dark mode styles

3. **Check JavaScript Files**
   - `public/js/ui-enhancements.js` - UI interactions and performance

### For Designers

1. **Use the Design System**
   - Reference `DESIGN_SYSTEM.md` for all variables
   - Use CSS custom properties for consistency
   - Follow responsive breakpoints

2. **Creating New Components**
   ```html
   <!-- Responsive grid layout -->
   <div class="anime-grid">
     <div class="anime-card">
       <img src="..." alt="..." class="animate-fade-in-up">
     </div>
   </div>
   
   <!-- With spacing -->
   <section class="space-y-4 sm:space-y-6 lg:space-y-8">
     <!-- content -->
   </section>
   ```

## Responsive Grid Usage

### Basic Grid
```html
<div class="anime-grid">
  <!-- 2 cols mobile → 3 cols tablet → 4 cols desktop → 5 cols large → 6 cols xl -->
  <div class="anime-card">Card content</div>
  <div class="anime-card">Card content</div>
  <div class="anime-card">Card content</div>
</div>
```

### With Custom Spacing
```html
<div class="anime-grid gap-2 sm:gap-3 lg:gap-4">
  <!-- Custom gaps at different breakpoints -->
</div>
```

## CSS Custom Properties

### Colors
```css
:root {
  --color-bg: #f8fafc;           /* Background color */
  --color-surface: #ffffff;      /* Surface/card background */
  --color-text: #0f172a;         /* Primary text */
  --color-text-muted: #64748b;   /* Secondary text */
  --color-primary: #7c3aed;      /* Primary action color */
}
```

### Spacing
```css
--spacing-sm: 0.5rem;   /* 8px */
--spacing-md: 1rem;     /* 16px */
--spacing-lg: 1.5rem;   /* 24px */
--spacing-xl: 2rem;     /* 32px */
--spacing-2xl: 3rem;    /* 48px */
```

### Transitions
```css
--transition-fast: 150ms ease;    /* Quick animations */
--transition-normal: 300ms ease;  /* Standard animations */
--transition-slow: 500ms ease;    /* Slow animations */
```

## Animation Classes

### Basic Animations
```html
<!-- Fade in with slide up -->
<div class="animate-fade-in-up"></div>

<!-- Scale in -->
<div class="animate-scale-in"></div>

<!-- Slide down -->
<div class="animate-slide-down"></div>

<!-- Shimmer loading -->
<div class="animate-shimmer"></div>
```

### Animation Delays
```html
<!-- Add staggered animations -->
<div class="animate-fade-in-up animate-delay-100"></div>
<div class="animate-fade-in-up animate-delay-200"></div>
<div class="animate-fade-in-up animate-delay-300"></div>
```

## Accessibility Implementation

### Keyboard Navigation
```html
<!-- Skip to main content -->
<a href="#main-content" class="skip-to-main">Skip to main content</a>

<!-- Focusable element -->
<button class="keyboard-focus">Click me</button>

<!-- Form with label -->
<label for="username">Username:</label>
<input id="username" type="text" required>
```

### Screen Reader Support
```html
<!-- Hide from screen readers -->
<span aria-hidden="true">→</span>

<!-- Screen reader only text -->
<span class="sr-only">Additional context for screen readers</span>

<!-- Image alt text -->
<img src="anime.jpg" alt="Description of anime content">
```

### ARIA Attributes
```html
<!-- Expandable section -->
<button aria-expanded="false" aria-controls="menu">Menu</button>
<div id="menu" role="region">Menu content</div>

<!-- Loading state -->
<div aria-busy="true">Loading...</div>

<!-- Error message -->
<input aria-invalid="true" aria-describedby="error">
<div id="error">This field is required</div>
```

## Dark Mode Implementation

### Using Dark Mode
```html
<!-- Dark mode is automatically applied based on system preference -->
<!-- Users can toggle with the dark mode button in header -->

<!-- Override in specific cases -->
<div class="dark">
  <!-- Content in dark mode -->
  <p class="text-gray-100">Light text in dark mode</p>
</div>
```

### Dark Mode Classes
```css
/* Light mode (default) */
.light-mode-only {
  display: block;
}

.dark .light-mode-only {
  display: none;
}

/* Dark mode specific */
.dark {
  background: #0f172a;
}

.dark .text-gray-900 {
  color: #e5e7eb;
}
```

## Performance Optimization

### Lazy Loading Images
```html
<!-- Use data-src for lazy loading -->
<img data-src="image.jpg" alt="Description" class="blur-sm">
```

### Script Loading
```html
<!-- Deferred scripts load after page render -->
<script defer src="/js/ui-enhancements.js"></script>

<!-- Critical scripts load immediately -->
<script src="/js/critical.js"></script>
```

### CSS Loading
```html
<!-- Preload CSS -->
<link rel="preload" href="/css/theme.css" as="style">

<!-- Lazy load with noscript fallback -->
<link rel="preload" href="/css/responsive.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript>
  <link rel="stylesheet" href="/css/responsive.css">
</noscript>
```

## Testing Guidelines

### Mobile Testing Dimensions
```
iPhone SE:    375 × 667
iPhone 12:    390 × 844
iPad:         768 × 1024
Android:      360 × 800
```

### Desktop Testing Dimensions
```
HD:           1366 × 768
Full HD:      1920 × 1080
2K:           2560 × 1440
4K:           3840 × 2160
```

### Accessibility Testing
```bash
# Test keyboard navigation
# - Tab through all elements
# - Use arrow keys in lists
# - Press Escape for modals
# - Check focus indicators

# Test with screen reader
# - NVDA (Windows)
# - JAWS (Windows)
# - VoiceOver (macOS/iOS)

# Test color contrast
# - Use WebAIM Contrast Checker
# - Check WCAG AA (4.5:1) minimum
# - Test in both light and dark modes
```

## Common Issues & Solutions

### Grid Not Responsive
**Issue**: Grid not changing columns at breakpoints
**Solution**: Make sure you're using `.anime-grid` class, not hardcoded grid classes

### Dark Mode Not Working
**Issue**: Dark mode not toggling
**Solution**: Check that JavaScript is loaded and HTML has proper dark class

### Animations Stuttering
**Issue**: Animations are not smooth
**Solution**: Check for heavy JavaScript on main thread, use DevTools Performance tab

### Images Not Lazy Loading
**Issue**: All images loading at once
**Solution**: Use `data-src` attribute and ensure ui-enhancements.js is loaded

## Debugging Tips

### Console Utilities (Development Only)
```javascript
// Access UI utilities
window.UIUtils.initScrollToTopButton();
window.UIUtils.initLazyLoading();
window.UIUtils.initAnimationObserver();
```

### Check Loaded CSS Files
```javascript
// In browser console
Array.from(document.styleSheets).map(s => s.href);
```

### Monitor Performance
```javascript
// Page load time
performance.measure('page-load');
```

## Code Examples

### Create a New Responsive Section
```pug
section(class="space-y-4 sm:space-y-6 lg:space-y-8")
  div(class="container mx-auto px-3 sm:px-4 lg:px-6")
    h2(class="text-2xl md:text-3xl lg:text-4xl font-bold") Section Title
    div(class="anime-grid")
      each item in items
        div(class="anime-card animate-fade-in-up")
          img(src=item.image alt=item.title)
          h3(class="text-lg font-semibold")= item.title
```

### Create an Accessible Form
```pug
form(class="space-y-4")
  div
    label(for="email" class="block mb-2 font-medium") Email Address
    input(
      id="email"
      type="email"
      required
      aria-describedby="email-help"
      class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
    )
    p(id="email-help" class="text-sm text-gray-600 mt-1") We'll never share your email
  
  button(type="submit" class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors")
    | Submit
```

## Deployment Checklist

- [ ] All CSS files minified
- [ ] JavaScript files tested
- [ ] Accessibility audit passed
- [ ] Performance metrics acceptable
- [ ] Cross-browser testing done
- [ ] Mobile testing completed
- [ ] Documentation updated
- [ ] Git commit created
- [ ] No console errors
- [ ] Images optimized

## Getting Help

1. **Documentation**: See IMPROVEMENTS.md, DESIGN_SYSTEM.md
2. **Code Comments**: Check inline comments in CSS/JS files
3. **Git History**: Use `git log` to see what changed
4. **Pull Requests**: Review code review comments

## Version Info

- **Version**: 1.0.0
- **Last Updated**: November 30, 2025
- **Status**: Production Ready
- **Breaking Changes**: None
- **Deprecated**: None

---

**Need help?** Check the documentation files or review the source code comments.
