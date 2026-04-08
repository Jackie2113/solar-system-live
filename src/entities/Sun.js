import * as THREE from 'three';

export class Sun {
    constructor() {
        const geometry = new THREE.SphereGeometry(6, 64, 64);
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('/textures/sun.jpg');

        const material = new THREE.MeshBasicMaterial({ map: texture });
        this.mesh = new THREE.Mesh(geometry, material);
        
        this.mesh.name = "The Sun";
        this.mesh.userData = { info: "CLASS: Yellow Dwarf Star<br>MASS: 99.8% of System<br>TEMP: 5,500°C<br><br>The heart of our solar system. A nearly perfect sphere of hot plasma." };
    }

    update(timeDelta) {
        const sunSpinSpeed = (Math.PI * 2) / 27; // Sun rotates every 27 days
        this.mesh.rotation.y += sunSpinSpeed * timeDelta;
    }
}