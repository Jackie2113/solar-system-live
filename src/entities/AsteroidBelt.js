import * as THREE from 'three';

export class AsteroidBelt {
    constructor(count = 10000) {
        const geometry = new THREE.DodecahedronGeometry(0.5, 0); 
        const textureLoader = new THREE.TextureLoader();
        const BASE = import.meta.env.BASE_URL || '/';
        
        const material = new THREE.MeshStandardMaterial({
            map: textureLoader.load(BASE + 'textures/moon.jpg'),
            roughness: 0.9
        });

        this.mesh = new THREE.InstancedMesh(geometry, material, count);
        
        // --- HUD DATA ---
        this.mesh.name = "Main Asteroid Belt";
        this.mesh.userData = { 
            isBelt: true, // Unique flag to prevent target locking
            info: "CLASS: Circumstellar Disc<br>COMPOSITION: Rock & Dust<br><br>A torus-shaped region located between the orbits of Mars and Jupiter, containing millions of irregularly shaped bodies." 
        };

        const dummy = new THREE.Object3D();

        for (let i = 0; i < count; i++) {
            // THINNER RADIUS: 52 to 62 (Previously 50 to 75)
            const radius = THREE.MathUtils.randFloat(52, 62);
            const angle = THREE.MathUtils.randFloat(0, Math.PI * 2);
            
            // FLATTER Y SPREAD: 1.0 (Previously 4.0)
            const y = THREE.MathUtils.randFloatSpread(1.0); 

            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            dummy.position.set(x, y, z);
            
            dummy.rotation.set(
                THREE.MathUtils.randFloat(0, Math.PI * 2),
                THREE.MathUtils.randFloat(0, Math.PI * 2),
                THREE.MathUtils.randFloat(0, Math.PI * 2)
            );
            
            const scale = THREE.MathUtils.randFloat(0.2, 1.2);
            dummy.scale.set(scale, scale, scale);

            dummy.updateMatrix();
            this.mesh.setMatrixAt(i, dummy.matrix);
        }
        this.mesh.computeBoundingSphere();

        this.orbitalSpeed = (Math.PI * 2) / 1500; 
    }

    update(timeDelta) {
        this.mesh.rotation.y += this.orbitalSpeed * timeDelta;
    }
}