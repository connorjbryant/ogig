# OGIG Factory Direct Theme

A custom WordPress theme built for OGIG Factory Direct.  
This theme uses **Dart Sass** for styles and **esbuild** for JavaScript bundling — two modern, fast compilers that generate optimized assets in a `/build` folder for better performance.

## Folder Structure

```text
ogig/
├── build/
│   ├── css/
│   │   ├── style.min.css       # Compiled & minified frontend CSS
│   │   └── editor.min.css      # Compiled & minified editor CSS (optional)
│   └── js/
│       └── main.min.js         # Compiled & minified JS
├── scss/
│   ├── style.scss              # Main Sass entrypoint (frontend)
│   └── editor.scss             # Optional Sass entrypoint (block editor)
├── src/
│   └── js/
│       └── main.js             # Authoring JS
├── blocks/
│   └── hero/
│       ├── block.json
│       ├── editor.js
│       └── render.php
├── functions.php
└── style.css                   # Theme header only

All source files live in scss/ and src/js/

All compiled files live in build/ (what WordPress enqueues)

Development Setup
Make sure you have Node.js installed (v18+ recommended)

Helpful Commands:
npm install 
Will install dependencies (run in theme directory)

npm run build 
Recompiles Sass and JS

npm run watch
Watch for changes during development
This watches scss/*.scss and src/js/*.js for changes and automatically re-compiles into build/

Design Philosophy:
This theme emphasizes simplicity, speed, and modularity in both design and development.

Explanation of folder structure:
In frameworks like React, Vue, or Node, all source code typically lives inside a /src folder 
because those projects compile into bundled applications. WordPress, however, doesn’t follow 
that model — the theme itself is the “source,” running directly from the root directory. 
JavaScript files live in /src/js/ to mimic modern build systems that bundle ES modules with 
esbuild, while Sass lives in /scss/ since it’s a styling asset rather than application logic. 
This separation keeps the build lightweight and intuitive: Dart Sass compiles styles, 
esbuild bundles scripts, and both output to /build/ for WordPress to enqueue. Each block is 
modular and self-contained within /blocks/, and asset versioning via filemtime() ensures 
browsers always load the latest minified files without cache issues — resulting in a fast, 
maintainable, and WordPress-native development workflow.
