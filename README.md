# SYS.OP // ORBITAL_TRACKER (Live Solar System)

A fully interactive, mathematically synchronized 3D simulation of our solar system, built entirely in vanilla JavaScript and **Three.js**. 

This project started as a sandbox to understand the core concepts of WebGL and 3D rendering. It quickly evolved into a passion project exploring orbital mechanics, shader programming, and UI integration, styled as a retro-futuristic telemetry dashboard.

## 🌌 Live Simulation Features

* **Real-Time Astronomical Positioning:** Calculates exact planetary coordinates upon launch using the **J2000 epoch**, dropping the planets exactly where they are in the real solar system today.
* **Synchronized Physics:** Built on a universal engine rule where 1 real second = 1 simulated day. Planetary orbits and internal rotations are mathematically derived from their real-world periods (e.g., Venus slowly spinning backward while Jupiter rotates at extreme speed).
* **Retro-Futuristic HUD:** A custom HTML/CSS overlay seamlessly integrated with the 3D canvas using Raycasting.
* **Target Locking System:** Click on any celestial body to trigger an interactive wireframe highlight and pull up rich, dynamic telemetry data.
* **Advanced Material Rendering:** * Custom GLSL shaders for Earth's Day/Night terminator transition.
  * Additive Blending for independent, rotating atmospheric cloud layers (Earth and Venus).
  * Double-sided transparent geometries for ring systems (Saturn).
* **Cinematic Camera Controls:** Fully orbitable and pannable camera with heavy damping for a premium, heavy-machinery feel.

## 🛠️ Technology Stack

* **Core Engine:** [Three.js](https://threejs.org/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Languages:** Vanilla JavaScript (ES6+), HTML5, CSS3, GLSL (Shaders)
* **Textures:** Solar System Scope (High-res 2k/4k maps)

## 🚀 Running the Engine Locally

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YourUsername/solar-system-live.git](https://github.com/YourUsername/solar-system-live.git)
   cd solar-system-live