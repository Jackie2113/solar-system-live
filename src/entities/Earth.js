import * as THREE from 'three';
import vertexShader from '../shaders/earth.vert.glsl?raw';
import fragmentShader from '../shaders/earth.frag.glsl?raw';
import { Moon } from './Moon.js';

export class Earth {
    constructor(data) {
        this.orbitGroup = new THREE.Group(); 
        this.orbitGroup.rotation.z = (data.inclination || 0) * (Math.PI / 180);

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

        const geometry = new THREE.SphereGeometry(2, 64, 64);
        const textureLoader = new THREE.TextureLoader();
        const BASE = import.meta.env.BASE_URL || '/';

        this.uniforms = {
            dayTexture: { value: textureLoader.load(BASE + 'textures/earth_day.jpg') },
            nightTexture: { value: textureLoader.load(BASE + 'textures/earth_night.jpg') },
            sunDirection: { value: new THREE.Vector3(1, 0, 0) } 
        };

        this.earthMesh = new THREE.Mesh(geometry, new THREE.ShaderMaterial({
            uniforms: this.uniforms, vertexShader: vertexShader, fragmentShader: fragmentShader
        }));
        this.earthMesh.name = data.name;
        this.earthMesh.userData = { info: data.info };
        this.container.add(this.earthMesh);

        this.cloudMesh = new THREE.Mesh(new THREE.SphereGeometry(2.02, 64, 64), new THREE.MeshBasicMaterial({
            map: textureLoader.load(BASE + 'textures/earth_clouds.jpg'),
            transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false
        }));
        this.container.add(this.cloudMesh);

        this.moonPivot = new THREE.Group(); 
        this.container.add(this.moonPivot);
        
        this.moon = new Moon();
        this.moonPivot.add(this.moon.mesh);
    }

    update(timeDelta) {
        this.angle += this.orbitalSpeed * timeDelta;
        this.container.position.x = (this.a * Math.cos(this.angle)) - this.c;
        this.container.position.z = this.b * Math.sin(this.angle);

        const earthSpin = (Math.PI * 2) * 0.02; 
        this.earthMesh.rotation.y += earthSpin * timeDelta;
        this.cloudMesh.rotation.y += (earthSpin * 1.05) * timeDelta; 
        
        const moonOrbitSpeed = (Math.PI * 2) / 27.3; 
        this.moonPivot.rotation.y += moonOrbitSpeed * timeDelta;
        this.moon.mesh.rotation.y += moonOrbitSpeed * timeDelta; 
    }
}