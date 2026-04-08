import * as THREE from 'three';

export class Planet {
    constructor(data) {
        this.orbitGroup = new THREE.Group(); 
        const inclinationRads = (data.inclination || 0) * (Math.PI / 180);
        this.orbitGroup.rotation.z = inclinationRads;

        this.a = data.distance; 
        this.e = data.eccentricity || 0;
        this.b = this.a * Math.sqrt(1 - Math.pow(this.e, 2)); 
        this.c = this.a * this.e; 
        
        this.orbitalSpeed = (Math.PI * 2) / data.period;
        this.angle = 0; 

        const curve = new THREE.EllipseCurve(-this.c, 0, this.a, this.b, 0, 2 * Math.PI, false, 0);
        const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 });
        this.orbitLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(128)), lineMat);
        this.orbitLine.rotation.x = Math.PI / 2; 
        this.orbitGroup.add(this.orbitLine);

        this.container = new THREE.Group();
        this.orbitGroup.add(this.container);

        const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
        const textureLoader = new THREE.TextureLoader();
        
        this.planetMesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
            map: textureLoader.load(data.texture), roughness: 0.6
        }));
        this.planetMesh.name = data.name;
        this.planetMesh.userData = { info: data.info };
        this.container.add(this.planetMesh);

        if (data.hasAtmosphere && data.atmosphereTexture) {
            const atmosGeo = new THREE.SphereGeometry(data.radius * 1.02, 32, 32); 
            this.atmosphereMesh = new THREE.Mesh(atmosGeo, new THREE.MeshBasicMaterial({
                map: textureLoader.load(data.atmosphereTexture),
                transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false
            }));
            this.container.add(this.atmosphereMesh); 
        }

        if (data.hasRings) {
            const ringGeo = new THREE.RingGeometry(data.ringInner, data.ringOuter, 64);
            this.ringMesh = new THREE.Mesh(ringGeo, new THREE.MeshStandardMaterial({
                map: textureLoader.load(data.ringTexture),
                side: THREE.DoubleSide, transparent: true, depthWrite: false
            }));
            this.ringMesh.rotation.x = Math.PI / 2;
            this.ringMesh.rotation.y = 0.2; 
            this.container.add(this.ringMesh); 
        }

        const daysPerRotation = data.rotationPeriod / 24;
        this.rotationSpeed = (Math.PI * 2) / daysPerRotation; 
    }

    update(timeDelta) {
        this.angle += this.orbitalSpeed * timeDelta;
        this.container.position.x = (this.a * Math.cos(this.angle)) - this.c;
        this.container.position.z = this.b * Math.sin(this.angle);

        const cinematicSpin = this.rotationSpeed * 0.02; 
        this.planetMesh.rotation.y += cinematicSpin * timeDelta;
        
        if (this.atmosphereMesh) {
            this.atmosphereMesh.rotation.y += (cinematicSpin * 1.1) * timeDelta; 
        }
    }
}