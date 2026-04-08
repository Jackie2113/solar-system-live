import * as THREE from 'three';
import vertexShader from '../shaders/earth.vert.glsl?raw';
import fragmentShader from '../shaders/earth.frag.glsl?raw';
import { Moon } from './Moon.js';

export class Earth {
    constructor(data) {
        this.mesh = new THREE.Group(); 

        const geometry = new THREE.SphereGeometry(2, 64, 64);
        const textureLoader = new THREE.TextureLoader();

        const dayMap = textureLoader.load('./textures/earth_day.jpg');
        const nightMap = textureLoader.load('./textures/earth_night.jpg');
        const cloudMap = textureLoader.load('./textures/earth_clouds.jpg');

        this.uniforms = {
            dayTexture: { value: dayMap },
            nightTexture: { value: nightMap },
            sunDirection: { value: new THREE.Vector3(1, 0, 0) } 
        };

        const earthMaterial = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        });

        this.earthMesh = new THREE.Mesh(geometry, earthMaterial);
        
        // --- HUD Target Lock Data ---
        this.earthMesh.name = data.name;
        this.earthMesh.userData = { info: data.info };
        
        this.mesh.add(this.earthMesh);

        // --- CLOUD LAYER ---
        const cloudGeometry = new THREE.SphereGeometry(2.02, 64, 64);
        const cloudMaterial = new THREE.MeshBasicMaterial({
            map: cloudMap,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        this.cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
        this.mesh.add(this.cloudMesh);

        // --- MOON SYSTEM ---
        this.moonPivot = new THREE.Group(); 
        this.mesh.add(this.moonPivot);
        
        this.moon = new Moon();
        this.moonPivot.add(this.moon.mesh);
    }

    update(timeDelta) {
        const earthSpin = Math.PI * 2; // Earth spins 1 full time per day
        this.earthMesh.rotation.y += earthSpin * timeDelta;
        this.cloudMesh.rotation.y += (earthSpin * 1.05) * timeDelta; 
        
        const moonOrbitSpeed = (Math.PI * 2) / 27.3; // Moon orbits every 27.3 days
        this.moonPivot.rotation.y += moonOrbitSpeed * timeDelta;
        
        // Moon is tidally locked
        this.moon.mesh.rotation.y += moonOrbitSpeed * timeDelta; 
    }
}