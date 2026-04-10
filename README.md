# Live Solar System

A fully interactive, mathematically synchronized 3D simulation of our solar system, built entirely in vanilla JavaScript and **Three.js**. 

This project evolved from a basic 3D sandbox into a high-performance astronomical engine featuring true orbital mechanics, instanced mesh rendering, and a retro-futuristic telemetry dashboard.

## Live Simulation Features

* **True Keplerian Orbits:** Planets do not move in simple circles. The engine calculates elliptical paths (semi-major/minor axes) and applies real-world orbital inclination and eccentricity to every celestial body.
* **J2000 Epoch Positioning:** Calculates exact planetary coordinates upon launch, dropping the planets exactly where they are in the real solar system today.
* **The Universal Law (Math vs. Cinematic):** The underlying engine math dictates that 1 real second = 1 simulated day. Orbital paths strictly follow this law, while a cinematic dampener slows internal planetary rotation by 98% to prevent visual blurring.
* **10,000-Particle Asteroid Belt:** Utilizes `THREE.InstancedMesh` to render 10,000 uniquely scaled and rotated low-poly asteroids in a single GPU draw call, forming a dense, rotating torus between Mars and Jupiter.
* **Retro-Futuristic HUD & Raycasting:** A custom HTML/CSS overlay seamlessly integrated with the 3D canvas. Click planets for a glowing wireframe target lock, or hover over the Main Belt to trigger a cursor-tracking radar scanner.

## Screenshot

<img width="1800" height="859" alt="image" src="https://github.com/user-attachments/assets/a7d0c682-4fff-4126-9f6c-bd8a02df63b1" />

## Technology Stack

* **Core Engine:** [Three.js](https://threejs.org/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Languages:** Vanilla JavaScript (ES6+), HTML5, CSS3, GLSL (Shaders)
* **Textures:** Solar System Scope (High-res 2k/4k maps)

## Running the Engine Locally

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YourUsername/solar-system-live.git](https://github.com/YourUsername/solar-system-live.git)
   cd solar-system-live

2. **How to view**
  https://jackie2113.github.io/solar-system-live/
