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

        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 2000);
        this.camera.position.set(0, 150, 300); 

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        this.cameraManager = new CameraManager(this.camera, this.renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0x333333);
        this.scene.add(ambientLight);

        const sunLight = new THREE.PointLight(0xffffff, 3.0, 0, 0);
        sunLight.position.set(0, 0, 0);
        this.scene.add(sunLight);

        const textureLoader = new THREE.TextureLoader();
        const BASE = import.meta.env.BASE_URL || '/';
        const bgTexture = textureLoader.load(BASE + 'textures/stars_milky_way.jpg');
        const bgGeometry = new THREE.SphereGeometry(600, 64, 64);
        const bgMaterial = new THREE.MeshBasicMaterial({ 
            map: bgTexture, 
            side: THREE.BackSide,
            color: 0x444444 
        });
        this.backgroundSphere = new THREE.Mesh(bgGeometry, bgMaterial);
        this.scene.add(this.backgroundSphere);

        this.sun = new Sun();
        this.scene.add(this.sun.mesh);

        const J2000 = Date.UTC(2000, 0, 1, 12, 0, 0);
        const daysSinceJ2000 = (Date.now() - J2000) / (1000 * 60 * 60 * 24);

        this.planets = [];
        this.orbitLines = []; 
        
        PLANETS_DATA.forEach(data => {
            let planetEntity;

            if (data.name === "Earth") {
                planetEntity = new Earth(data);
            } else {
                planetEntity = new Planet(data);
            }

            const currentAngle = data.basePhase + (daysSinceJ2000 / data.period) * (Math.PI * 2);
            planetEntity.angle = currentAngle;
            planetEntity.update(0); 

            this.scene.add(planetEntity.orbitGroup);
            
            this.planets.push({ entity: planetEntity, period: data.period });
            this.orbitLines.push(planetEntity.orbitLine);
        });

        this.raycastManager = new RaycastManager(this.camera, this.scene, this.renderer.domElement);
        this.setupUI();

        window.addEventListener('resize', () => this.onWindowResize(), false);

        this.animate();
    }

    setupUI() {
        this.timeScale = 1; 

        const clockDisplay = document.getElementById('clock-display');
        setInterval(() => {
            const now = new Date();
            clockDisplay.innerText = now.toLocaleTimeString('en-US', { hour12: false });
        }, 1000);

        document.getElementById('toggle-orbits').addEventListener('change', (e) => {
            const show = e.target.checked;
            this.orbitLines.forEach(line => line.visible = show);
        });

        const buttons = document.querySelectorAll('.speed-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                buttons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.timeScale = parseFloat(e.target.dataset.speed);
            });
        });

        document.getElementById('btn-reset').addEventListener('click', () => {
            this.resetPositions();
            buttons.forEach(b => b.classList.remove('active'));
            document.querySelector('.speed-btn[data-speed="1"]').classList.add('active');
            this.timeScale = 1;
        });
    }

    resetPositions() {
        const J2000 = Date.UTC(2000, 0, 1, 12, 0, 0);
        const daysSinceJ2000 = (Date.now() - J2000) / (1000 * 60 * 60 * 24);

        this.planets.forEach(p => {
            const planetData = PLANETS_DATA.find(d => d.period === p.period);
            if (planetData) {
                const currentAngle = planetData.basePhase + (daysSinceJ2000 / planetData.period) * (Math.PI * 2);
                p.entity.angle = currentAngle;
                p.entity.update(0); 
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
        const simTimeElapsed = delta * this.timeScale; 

        this.sun.update(simTimeElapsed);

        this.planets.forEach(p => {
            p.entity.update(simTimeElapsed); 
        });

        this.cameraManager.update();
        this.renderer.render(this.scene, this.camera);
    }
}