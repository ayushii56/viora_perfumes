# V I O R A &nbsp;&bull;&nbsp; Haute Perfume House

> *“Far Enough to Feel. Close Enough to Linger.”*

VIORA is an ultra-premium, cinematic niche fragrance house website designed to represent emotion, memory, attraction, and lingering presence. Combining the aesthetics of editorial luxury campaigns (inspired by Tom Ford Beauty, Byredo, Maison Francis Kurkdjian, and Dior Privé) with Apple-style fluid micro-interactions, the boutique delivers an immersive, sensory-driven digital experience.

---

## 💎 Premium Cinematic Features

* 💨 **Canvas Smoke Simulation:** A high-performance HTML5 Canvas engine generating slow-moving, sensual wisps of fog that float and expand over deep gradients.
* 🌌 **Fluid Cursor Glow:** An elegant custom cursor with an elastic outer gold ring that expands, blends, and morphs when hovering over luxury interactive triggers.
* 📈 **Trigonometric Soundwave Visualizer:** Beautiful, mathematical sine-wave curves drawn in real-time on canvas, dynamically responding to mouse speeds and scent selections.
* 🔦 **Best Seller Spotlight Lens:** An interactive showcase on the signature *Midnight* bottle, tracking cursor movements to cast a radial spotlight over the dark borosilicate glass vial.
* 🧪 **Bespoke Fragrance Finder:** An AI-inspired, multi-step sensory quiz calibrating personal aura queries to recommend the exact signature VIORA scent.
* 🛒 **Integrated E-Commerce Drawers:** Fully reactive, slide-out Shopping Bag and Wishlist drawers synced with `localStorage`, computing subtotals and enabling secure simulated checkouts.
* 🌓 **Luxury Theme Switcher:** Flips custom CSS properties instantly from a mysterious deep espresso-black default palette to an ivory-sand and matte charcoal setup.
* 📦 **Unboxing Revelations:** A horizontal layout illustrating steps of the unboxing ritual—from the magnetic silhouette to the gold silk ribbon and fine-mist compression.
* 🎬 **GSAP-style reveals:** Smooth viewport intersection observers that fade and shift layout sections into position as the client scrolls.

---

## 🛠️ Tech Stack & Architecture

* **Core Structure:** Semantic HTML5 & Responsive layouts.
* **Styling System:** Vanilla CSS3 Custom Properties (zero framework bloat) with backdrop filters, smoke gradients, and a subtle film grain noise filter.
* **Dynamic Logic:** Vanilla ES6 Javascript divided into clean, decoupled modules.
* **Build System:** [Vite](https://vitejs.dev/) for modular asset bundling, hot-reloading, and optimal production compiles.
* **Vector Graphics:** [Lucide Icons](https://lucide.dev/) for crisp luxury navigation maps.

---

## 📂 Directory Layout

```
viora-perfumes/
├── index.html                  # Main entry point & HTML structure
├── package.json                # Project dependencies & bundle scripts
├── vite.config.js              # Vite server & port configuration
├── README.md                   # Brand documentation
├── src/
│   ├── main.js                 # Central Application Coordinator (preloader, toggles)
│   ├── styles/
│   │   └── main.css            # Cinematic layout variables & keyframes
│   ├── assets/
│   │   ├── viora_midnight.png  # AI-generated: Midnight Scent silhouette
│   │   ├── viora_velvet.png    # AI-generated: Velvet Scent silhouette
│   │   └── viora_packaging.png # AI-generated: Unboxing packaging render
│   └── scripts/
│       ├── particles.js        # Canvas background smoke particle loop
│       ├── store.js            # Shopping Cart, Wishlist, database & LocalStorage
│       ├── interactions.js     # Fluid cursors, 3D tilts, spotlights, sinus waves
│       └── quiz.js             # Fragrance finder questionnaire calculations
```

---

## 🚀 Setup & Launching the Boutique

Ensure you have [Node.js](https://nodejs.org/) installed.

### 1. Clone & Scaffolding
Navigate to the project root and install the dependencies:
```bash
npm install
```

### 2. Launch Development Server
Boot up the local hot-reloading boutique server:
```bash
npm run dev
```
Open **http://localhost:3000** in your browser to experience the website.

### 3. Production Build
To bundle the assets into a highly optimized, minified production build (dist/ folder):
```bash
npm run build
```
To preview the compiled production build:
```bash
npm run preview
```

---

## 🕯️ Scent Sourcing & Ethics

Every VIORA essence is sustainably sourced. We collaborate directly with independent farms in Grasse and Calabria to secure premium botanical extracts, which are hand-poured in heavy-weight borosilicate glass silhouettes designed to feel expensive and stay indefinitely on the skin.
