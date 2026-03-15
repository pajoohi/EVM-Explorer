# TI EVM Explorer

A highly modular, premium-designed web application for browsing and inspecting Texas Instruments Hardware Development Kits (EVMs). 

## Features
- **Filterable/Searchable Directory**: Quickly locate evaluation modules by Processor or Board Family.
- **Detailed EVM Pages**: Dynamic specs, integrated interactive BOMs, OS downloads, and rich 3D STL visualizations.
- **Responsive & Accessible**: Native Light/Dark modes, mobile-friendly navigation, and CSS-driven component animations.

## Local Development
1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`

## Deployment (GitHub Pages)
This project is configured for seamless deployment to GitHub pages using Vite and `gh-pages`.

1. Ensure the `base` property in `vite.config.js` matches your repository name (e.g., `'/EVM-Explorer/'`).
2. Run the deployment script: `npm run deploy`
   - This automatically builds the production output to the `dist/` folder and pushes it to the `gh-pages` branch.
