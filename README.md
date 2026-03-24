# Book Scale Visualizer

A 3D visualization tool for understanding the physical size of a book based on its line count. Compare your book against classics like *War and Peace* and *The Hobbit* to get a sense of scale.

**Live demo:** https://johnbradley.github.io/book-scale/

## Features

- Enter a line count and book title to render a 3D book with realistic proportions
- Toggle reference books (*War and Peace*, *The Hobbit*) for scale comparison
- Drag to rotate, scroll to zoom
- URL parameters (`?lines=&title=`) are updated automatically for easy sharing

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```
   npm install
   ```
2. Run the app:
   ```
   npm run dev
   ```

## Deploy

Pushes to `main` automatically deploy to GitHub Pages via the included workflow.
