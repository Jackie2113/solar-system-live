import * as THREE from 'three';

export class AsteroidBelt {
    constructor(count = 10000) {
        // A low-poly geometry makes for great-looking, performant rocks
        const geometry = new THREE.DodecahedronGeometry(0.5, 0); 
        
        const textureLoader = new THREE.TextureLoader();
        const BASE = import.meta.env.BASE_URL || '/';
        
        // We'll use the moon texture to make them look like cratered gray rock
        const material = new THREE.MeshStandardMaterial({
            map: textureLoader.load(BASE + 'textures/moon.jpg'),
            roughness: 0.9
        });

        // The magic class: InstancedMesh(geometry, material, count)
        this.mesh = new THREE.InstancedMesh(geometry, material, count);
        
        // A dummy object to help calculate the matrix (position, rotation, scale) for each rock
        const dummy = new THREE.Object3D();

        for (let i = 0; i < count; i++) {
            // Randomly scatter between Mars (45) and Jupiter (85)
            const radius = THREE.MathUtils.randFloat(50, 75);
            const angle = THREE.MathUtils.randFloat(0, Math.PI * 2);
            
            // Randomly scatter height (y) to give the belt thickness
            const y = THREE.MathUtils.randFloatSpread(4); 

            // Calculate exact position based on angle and radius
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            dummy.position.set(x, y, z);
            
            // Randomize rock rotation and size so they don't look identical
            dummy.rotation.set(
                THREE.MathUtils.randFloat(0, Math.PI * 2),
                THREE.MathUtils.randFloat(0, Math.PI * 2),
                THREE.MathUtils.randFloat(0, Math.PI * 2)
            );
            
            const scale = THREE.MathUtils.randFloat(0.2, 1.2);
            dummy.scale.set(scale, scale, scale);

            // Bake these transformations into the dummy
            dummy.updateMatrix();
            
            // Assign the baked matrix to the current instance in the loop
            this.mesh.setMatrixAt(i, dummy.matrix);
        }

        // Calculate an average orbital speed for the whole belt
        // (Between Mars's 687 days and Jupiter's 4333 days)
        this.orbitalSpeed = (Math.PI * 2) / 1500; 
    }

    update(timeDelta) {
        // The entire instanced mesh rotates as one single giant object
        this.mesh.rotation.y += this.orbitalSpeed * timeDelta;
    }
}