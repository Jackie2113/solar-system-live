import * as THREE from 'three';

export class Planet {
    constructor(data) {
        this.pivot = new THREE.Group(); 
        
        const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(data.texture);

        const material = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.6
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.x = data.distance; 
        
        this.mesh.name = data.name;
        this.mesh.userData = { info: data.info };

        this.pivot.add(this.mesh);

        // --- ATMOSPHERE LOGIC ---
        if (data.hasAtmosphere && data.atmosphereTexture) {
            const atmosGeo = new THREE.SphereGeometry(data.radius * 1.02, 32, 32); 
            const atmosTex = textureLoader.load(data.atmosphereTexture);
            
            const atmosMat = new THREE.MeshBasicMaterial({
                map: atmosTex,
                transparent: true,
                opacity: 0.5, 
                blending: THREE.AdditiveBlending, 
                depthWrite: false
            });
            this.atmosphereMesh = new THREE.Mesh(atmosGeo, atmosMat);
            this.mesh.add(this.atmosphereMesh); 
        }

        // --- RINGS LOGIC ---
        if (data.hasRings) {
            const ringGeo = new THREE.RingGeometry(data.ringInner, data.ringOuter, 64);
            const ringTex = textureLoader.load(data.ringTexture);
            const ringMat = new THREE.MeshStandardMaterial({
                map: ringTex,
                side: THREE.DoubleSide, 
                transparent: true
            });
            this.ringMesh = new THREE.Mesh(ringGeo, ringMat);
            
            this.ringMesh.rotation.x = Math.PI / 2;
            this.ringMesh.rotation.y = 0.2; 
            
            this.mesh.add(this.ringMesh); 
        }

        const daysPerRotation = data.rotationPeriod / 24;
        this.rotationSpeed = (Math.PI * 2) / daysPerRotation; 
    }

    update(timeDelta) {
        this.mesh.rotation.y += this.rotationSpeed * timeDelta;
        
        if (this.atmosphereMesh) {
            this.atmosphereMesh.rotation.y += (this.rotationSpeed * 1.1) * timeDelta; 
        }
    }
}