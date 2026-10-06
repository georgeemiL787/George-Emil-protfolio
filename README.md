# George Emil Sadek - Portfolio

Personal portfolio for George Emil Sadek, a Computer Engineering graduate focused on applied AI, computer vision, machine learning backends, and autonomous perception systems.

Live site: https://georgeemil787.github.io/George-Emil-protfolio/

## Featured work

- Research Agent with LangGraph, Ollama, FastAPI, and React
- REHELPER smart-glove tele-rehabilitation platform
- Cellula computer-vision internship portfolio
- MTC-AIC4 aerial single-object tracking
- George Job Agent desktop application
- NailedIT healthcare platform
- Collaborative ASP.NET Core learning-management system
- Paper Piano with computer vision
- Catherine AI study partner
- Face-mask detection
- ASL sign recognition
- Email spam detection
- Supermarket sales analysis
- IMDb movie analysis

Projects include category filters, technology tags, and direct repository links. Descriptions are grounded in the linked public repositories. The sign-recognition repository has an Arabic-named folder but documents and implements ASL; the portfolio uses that supported label.

## Experience

- NTI Hire Ready program, Agentic AI track (Jun–Sep 2026)
- Cellula Technologies computer-vision internship
- Elevvo machine-learning internship
- MCV MVC architecture and development internship
- Shell Eco-marathon autonomous perception
- NTI data-analysis training (2024)

## Frontend design

The editorial design is inspired by [Superdesign's Bold Editorial Design Style](https://superdesign.dev/library?selected=bold-editorial-design-style&category=style), with an original navy/sage palette, large condensed headings, a live particle sphere, and SVG project diagrams. All 14 projects and the NTI Agentic AI training entry are retained.

This remains a static HTML/CSS/JavaScript site suitable for GitHub Pages. No build step is required. Run `python -m http.server 8765` from this folder to preview it locally. Fonts load from Google Fonts, with local font fallbacks.

Publishing uses `.github/workflows/pages.yml`: pushes to `main` or a manual run of **Deploy portfolio** upload the static files directly to GitHub Pages. In repository Settings → Pages, the source is **GitHub Actions**. The workflow includes the site assets, logos, and certificate PDFs and does not run Jekyll.

Features include responsive project filters, a saved theme preference, native accessible project/certificate dialogs, reduced-motion support, and the existing Formspree contact form. Project artwork is illustrative, not a product screenshot.

`motion.css` and `motion.js` add staggered headline entrances, a pointer-responsive particle network, orbiting rings, a continuous discipline marquee, scroll reveals, animated project filtering, artwork tilt and category-specific animation, and a rotating accent on the portrait. The canvas pauses outside the viewport and when the tab is hidden. The floating motion control saves a pause preference; the system reduced-motion setting disables movement automatically. Content remains available without JavaScript, with the original SVG sphere as a fallback.
