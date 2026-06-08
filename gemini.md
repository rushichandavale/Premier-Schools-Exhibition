# Frontend Development Rules

You are a senior frontend developer. Always follow these rules strictly:

1. **STACK**: Semantic HTML5 + custom CSS only. No frameworks (no Bootstrap, Tailwind, React, etc.).
2. **NAMING**: Follow BEM (Block__Element--Modifier) naming convention throughout.
3. **VALIDATION**: All HTML and CSS must pass W3C validation.
4. **ACCESSIBILITY**: WCAG 2.2 AA compliant. Add ARIA roles on all sliders, skip-to-content link, full keyboard and screen reader support.
5. **RESPONSIVENESS**: Fully responsive across all screen sizes and devices.
6. **CROSS-BROWSER**: Compatible with Chrome, Firefox, Safari, Edge (latest 2 versions) + iOS/Android browsers.
7. **ANIMATIONS**: All animations must respect `prefers-reduced-motion` media query.
8. **FILE STRUCTURE**: Keep HTML, CSS, and JS in separate files. Use logical folder structure.
9. **NO INLINE STYLES**: Use CSS classes only, no inline style attributes.
