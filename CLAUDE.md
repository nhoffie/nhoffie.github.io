# CLAUDE.md - AI Assistant Guide for nhoffie.github.io

## Repository Overview

**Repository**: nhoffie.github.io
**Type**: GitHub Pages Personal Website
**Purpose**: Collection of interactive web applets
**Deployment**: Automatically deployed to https://nhoffie.github.io via GitHub Pages
**Current State**: Initial setup phase

## Repository Structure

This repository follows a flat structure optimized for GitHub Pages hosting:

```
nhoffie.github.io/
├── README.md           # Repository description
├── CLAUDE.md          # This file - AI assistant guidelines
├── index.html         # Main landing page (to be created)
├── applets/           # Directory for individual applets (to be created)
│   ├── applet-name-1/
│   │   ├── index.html
│   │   ├── style.css
│   │   └── script.js
│   └── applet-name-2/
│       └── ...
├── assets/            # Shared assets (to be created)
│   ├── css/
│   ├── js/
│   └── images/
└── common/            # Shared utilities and components (optional)
    ├── common.css
    └── common.js
```

## Development Guidelines for AI Assistants

### General Principles

1. **Keep It Simple**: This is a static site. Avoid over-engineering. Use vanilla HTML, CSS, and JavaScript unless there's a compelling reason for frameworks.

2. **Self-Contained Applets**: Each applet should be independent and self-contained within its own directory.

3. **Mobile-First**: All applets should be responsive and work well on mobile devices.

4. **Performance**: Minimize dependencies. Prefer native browser APIs over libraries when possible.

5. **Accessibility**: Follow WCAG 2.1 AA standards. Include proper ARIA labels, semantic HTML, and keyboard navigation.

### File Naming Conventions

- Use **lowercase** with **hyphens** for directories and files: `my-applet-name/`
- HTML files: `index.html` for main page, descriptive names for others
- CSS files: `style.css` or `{applet-name}.css`
- JavaScript files: `script.js` or `{applet-name}.js`
- Assets: descriptive names like `background-image.png`, `icon-home.svg`

### Code Style

#### HTML
- Use semantic HTML5 elements (`<header>`, `<main>`, `<nav>`, `<article>`, etc.)
- Include proper DOCTYPE: `<!DOCTYPE html>`
- Set viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- Use meaningful `alt` text for images
- Include `<title>` and meta description

#### CSS
- Use modern CSS features (Grid, Flexbox, Custom Properties)
- Follow BEM naming convention for classes when beneficial
- Group related properties together
- Use CSS custom properties for theming: `--primary-color`, `--spacing-unit`, etc.
- Prefer `rem` and `em` for sizing, `%` and `vw/vh` for responsive layouts

#### JavaScript
- Use ES6+ features (arrow functions, const/let, template literals, etc.)
- Avoid global namespace pollution - wrap in IIFE or use modules
- Add comments for complex logic
- Use descriptive variable and function names
- Handle errors gracefully
- No `var` - use `const` by default, `let` when reassignment is needed

### Creating New Applets

When asked to create a new applet:

1. **Create Directory Structure**:
   ```
   applets/{applet-name}/
   ├── index.html
   ├── style.css
   └── script.js
   ```

2. **Update Main Index**: Add link to the new applet in the main `index.html`

3. **Include Standard Metadata**:
   - Page title
   - Meta description
   - Open Graph tags for social sharing
   - Favicon link

4. **Add README**: Create `applets/{applet-name}/README.md` with:
   - Applet description
   - Features
   - Usage instructions
   - Any special notes

### Common Patterns

#### Basic Applet Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Brief description of applet">
    <title>Applet Name | nhoffie.github.io</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Applet Name</h1>
        <nav>
            <a href="../../index.html">← Back to Home</a>
        </nav>
    </header>

    <main>
        <!-- Applet content here -->
    </main>

    <footer>
        <p>Part of <a href="../../index.html">nhoffie.github.io</a></p>
    </footer>

    <script src="script.js"></script>
</body>
</html>
```

#### CSS Reset/Base (optional common.css)

Consider creating a minimal reset in `assets/css/common.css`:
```css
:root {
    --primary-color: #007bff;
    --background-color: #ffffff;
    --text-color: #333333;
    --spacing-unit: 1rem;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    line-height: 1.6;
    color: var(--text-color);
    background: var(--background-color);
}
```

### Git Workflow

1. **Branch Naming**:
   - Feature branches: `feature/applet-name` or `feature/description`
   - Bug fixes: `fix/issue-description`
   - AI assistant branches: Already provided (format: `claude/claude-md-{session-id}`)

2. **Commits**:
   - Use clear, descriptive commit messages
   - Follow conventional commits format:
     - `feat: add calculator applet`
     - `fix: resolve responsive layout issue in navigation`
     - `docs: update CLAUDE.md with new guidelines`
     - `style: improve CSS formatting in main page`
     - `refactor: simplify event handlers in timer applet`

3. **Before Pushing**:
   - Test all applets locally if possible
   - Validate HTML/CSS if validators are available
   - Ensure all links work (especially relative paths)
   - Check responsive behavior at different screen sizes

### Testing Considerations

Since this is a static site:

1. **Manual Testing**: Open HTML files in browser to verify functionality
2. **Cross-Browser**: Mention if an applet uses newer APIs that may need polyfills
3. **Responsive Testing**: Check at mobile (320px), tablet (768px), and desktop (1024px+) widths
4. **Accessibility**: Run basic checks (keyboard navigation, screen reader compatibility)

### Deployment

- **Automatic**: GitHub Pages automatically deploys from the default branch
- **URL Pattern**:
  - Main site: `https://nhoffie.github.io/`
  - Applets: `https://nhoffie.github.io/applets/{applet-name}/`
- **Propagation**: Changes may take 1-10 minutes to appear live

### External Dependencies

- **Minimize**: Prefer vanilla JS over libraries
- **When Needed**: Use CDN links for libraries (jsdelivr, unpkg, cdnjs)
- **Document**: Always document why a dependency is needed
- **Version Pin**: Use specific versions in CDN URLs, not `@latest`

### Security Considerations

- No server-side code - client-side only
- Be cautious with user input - sanitize before rendering to DOM
- Avoid `eval()` and `innerHTML` with user data
- Use `textContent` or sanitization libraries when displaying user input
- No sensitive data should be stored (all client-side)

### Accessibility Checklist

- [ ] Semantic HTML elements used appropriately
- [ ] All images have meaningful `alt` text
- [ ] Color contrast meets WCAG AA standards (4.5:1 for normal text)
- [ ] Interactive elements are keyboard accessible
- [ ] Focus indicators are visible
- [ ] ARIA labels used where needed
- [ ] Content is readable without CSS
- [ ] No flashing content (accessibility hazard)

### Performance Best Practices

- Optimize images (use appropriate formats, compress)
- Minify CSS/JS for production (if beneficial)
- Lazy load images below the fold
- Use CSS transforms for animations (GPU acceleration)
- Avoid layout thrashing in JavaScript
- Use event delegation for multiple similar elements

### Common Tasks

#### Adding a New Applet

1. Create directory: `applets/{applet-name}/`
2. Create `index.html`, `style.css`, `script.js`
3. Implement the applet
4. Update main `index.html` with link to new applet
5. Create applet `README.md`
6. Test thoroughly
7. Commit and push

#### Updating Main Landing Page

1. Edit `index.html` in root
2. Maintain consistent styling with existing design
3. Add new applets to navigation/grid
4. Update any descriptions or metadata
5. Test all links

#### Creating Shared Utilities

1. Place in `common/` or `assets/js/`
2. Document usage clearly
3. Update this CLAUDE.md with information about the utility
4. Ensure it doesn't break existing applets

### Project-Specific Notes

- **Current State**: Repository is in initial setup phase with only README.md
- **First Steps**: Need to create main `index.html` landing page before adding applets
- **Design**: No specific design system yet - establish consistent look/feel with first few applets
- **User**: nhoffie - refer to user preferences for design choices when available

### Resources

- GitHub Pages Documentation: https://docs.github.com/en/pages
- MDN Web Docs: https://developer.mozilla.org/
- Can I Use (browser compatibility): https://caniuse.com/
- WAVE Accessibility Checker: https://wave.webaim.org/
- HTML Validator: https://validator.w3.org/
- CSS Validator: https://jigsaw.w3.org/css-validator/

### Questions to Ask User

When starting new work:

1. **For New Applets**:
   - What functionality should the applet provide?
   - Any specific design preferences (colors, layout)?
   - Target audience or use case?
   - Any specific browser/device requirements?

2. **For Main Page**:
   - Preferred visual style (minimalist, colorful, dark/light mode)?
   - How should applets be displayed (grid, list, categories)?
   - Any personal branding (logo, tagline, about section)?

3. **General**:
   - Should analytics be added (e.g., Google Analytics)?
   - Any specific accessibility requirements beyond WCAG AA?
   - License preference for code (MIT, Apache, etc.)?

### Anti-Patterns to Avoid

❌ Don't add build processes unless absolutely necessary (keep it simple)
❌ Don't use frameworks for simple applets (React/Vue overkill)
❌ Don't break existing applets when adding new ones
❌ Don't add backend dependencies (this is static hosting)
❌ Don't ignore mobile users (mobile-first approach)
❌ Don't create tight coupling between applets
❌ Don't forget to update main index when adding applets
❌ Don't use absolute URLs for internal links (use relative paths)
❌ Don't commit sensitive information or API keys
❌ Don't add large binary files (optimize images first)

### Version History

- **2025-11-29**: Initial CLAUDE.md created during repository setup phase

---

**Last Updated**: 2025-11-29
**Maintained by**: AI assistants working with nhoffie
**Status**: Living document - update as repository evolves
