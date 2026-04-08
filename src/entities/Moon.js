import * as THREE from 'three';

export class Moon {
    constructor() {
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const textureLoader = new THREE.TextureLoader();
        const BASE = import.meta.env.BASE_URL || '/';
        const moonTexture = textureLoader.load(BASE + 'textures/moon.jpg');

        const material = new THREE.MeshStandardMaterial({
            map: moonTexture,
            roughness: 1.0,
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.x = 4; 
        
        this.mesh.name = "Luna (The Moon)";
        this.mesh.userData = { 
            info: "CLASS: Natural Satellite<br>GRAVITY: 1.6 m/s²<br>ORBIT: 27.3 Earth Days<br><br>Earth's only natural satellite. It is in synchronous rotation, meaning it always shows the same face to Earth." 
        };
    }
}