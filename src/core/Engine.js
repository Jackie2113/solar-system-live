import * as THREE from 'three';
import { CameraManager } from './CameraManager.js';
import { RaycastManager } from './RaycastManager.js';
import { Sun } from '../entities/Sun.js';
import { Planet } from '../entities/Planet.js';
import { Earth } from '../entities/Earth.js';
import { PLANETS_DATA } from '../utils/Constants.js';

export class Engine {
    constructor() {
        this.container = document.querySelector('#app');
        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();

        // 1. Camera Setup
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.camera.position.set(0, 150, 300); 

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        this.cameraManager = new CameraManager(this.camera, this.renderer.domElement);

        // 2. Lighting & Dimmed Background
        const ambientLight = new THREE.AmbientLight(0x333333);
        this.scene.add(ambientLight);

        const sunLight = new THREE.PointLight(0xffffff, 3.0, 0, 0);
        sunLight.position.set(0, 0, 0);
        this.scene.add(sunLight);

        const textureLoader = new THREE.TextureLoader();
        const bgTexture = textureLoader.load('/textures/stars_milky_way.jpg');
        const bgGeometry = new THREE.SphereGeometry(600, 64, 64);
        const bgMaterial = new THREE.MeshBasicMaterial({ 
            map: bgTexture, 
            side: THREE.BackSide,
            color: 0x444444 
        });
        this.backgroundSphere = new THREE.Mesh(bgGeometry, bgMaterial);
        this.scene.add(this.backgroundSphere);

        // 3. The Sun
        this.sun = new Sun();
        this.scene.add(this.sun.mesh);

        // 4. Planets, Earth, and Initial J2000 Real-Time Placement
        // Calculate exact days passed since Jan 1, 2000
        const J2000 = Date.UTC(2000, 0, 1, 12, 0, 0);
        const daysSinceJ2000 = (Date.now() - J2000) / (1000 * 60 * 60 * 24);

        this.planets = [];
        this.orbitLines = []; 
        
        PLANETS_DATA.forEach(data => {
            let planetEntity;
            let pivot;

            // Handle our custom Earth class separately from the generic planets
            if (data.name === "Earth") {
                planetEntity = new Earth(data);
                planetEntity.mesh.position.x = data.distance; 
                pivot = new THREE.Group();
                pivot.add(planetEntity.mesh);
            } else {
                planetEntity = new Planet(data);
                pivot = planetEntity.pivot;
            }

            // Snap to current real-world orbital position
            const currentAngle = data.basePhase + (daysSinceJ2000 / data.period) * (Math.PI * 2);
            pivot.rotation.y = currentAngle;

            this.scene.add(pivot);

            // Create Orbit Line
            const curve = new THREE.EllipseCurve(0, 0, data.distance, data.distance, 0, 2 * Math.PI, false, 0);
            const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 });
            const orbitLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(128)), lineMat);
            orbitLine.rotation.x = Math.PI / 2;
            this.scene.add(orbitLine);
            
            // Store them uniformly so animate() can handle them all identically
            this.planets.push({ entity: planetEntity, pivot: pivot, period: data.period });
            this.orbitLines.push(orbitLine);
        });

        // 5. UI Interaction
        this.raycastManager = new RaycastManager(this.camera, this.scene, this.renderer.domElement);
        this.setupUI();

        window.addEventListener('resize', () => this.onWindowResize(), false);

        this.animate();
    }

	setupUI() {
        this.timeScale = 1; 

        // 1. Live Clock Updater
        const clockDisplay = document.getElementById('clock-display');
        setInterval(() => {
            const now = new Date();
            clockDisplay.innerText = now.toLocaleTimeString('en-US', { hour12: false });
        }, 1000);

        // 2. Orbits Toggle
        document.getElementById('toggle-orbits').addEventListener('change', (e) => {
            const show = e.target.checked;
            this.orbitLines.forEach(line => line.visible = show);
        });

        // 3. Speed Buttons
        const buttons = document.querySelectorAll('.speed-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                buttons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.timeScale = parseFloat(e.target.dataset.speed);
            });
        });

        // 4. Reset Button Logic
        document.getElementById('btn-reset').addEventListener('click', () => {
            this.resetPositions();
            
            // Revert UI buttons back to 1X speed
            buttons.forEach(b => b.classList.remove('active'));
            document.querySelector('.speed-btn[data-speed="1"]').classList.add('active');
            this.timeScale = 1;
        });
    }

    resetPositions() {
        // Recalculate exactly how many days have passed right NOW
        const J2000 = Date.UTC(2000, 0, 1, 12, 0, 0);
        const daysSinceJ2000 = (Date.now() - J2000) / (1000 * 60 * 60 * 24);

        // Loop through all generated planets and overwrite their rotation
        this.planets.forEach(p => {
            // Find the original basePhase from our Constants using the period
            // (Since period is unique in our array, we can map back to it)
            const planetData = PLANETS_DATA.find(d => d.period === p.period);
            if (planetData) {
                const currentAngle = planetData.basePhase + (daysSinceJ2000 / planetData.period) * (Math.PI * 2);
                p.pivot.rotation.y = currentAngle;
            }
        });
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

	animate() {
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta(); 
        
        // UNIVERSAL LAW: 1 real second = 1 simulated day
        const simTimeElapsed = delta * this.timeScale; 

        this.sun.update(simTimeElapsed);

        this.planets.forEach(p => {
            // Orbital Speed = 1 full circle (2PI) divided by its period (in days)
            const orbitalSpeed = (Math.PI * 2) / p.period;
            
            p.pivot.rotation.y += orbitalSpeed * simTimeElapsed;
            p.entity.update(simTimeElapsed); 
        });

        this.cameraManager.update();
        this.renderer.render(this.scene, this.camera);
    }
}