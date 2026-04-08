import * as THREE from 'three';

export class RaycastManager {
    constructor(camera, scene, domElement) {
        this.camera = camera;
        this.scene = scene;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.panel = document.getElementById('data-panel');
        this.title = document.getElementById('planet-name');
        this.info = document.getElementById('planet-info');
        this.closeBtn = document.getElementById('close-btn');

        // --- NEW: HUD Target Lock ---
        const highlightGeo = new THREE.SphereGeometry(1, 32, 32);
        const highlightMat = new THREE.MeshBasicMaterial({ 
            color: 0xff4444, // Red accent matching your UI
            wireframe: true, 
            transparent: true, 
            opacity: 0.4 
        });
        this.targetLock = new THREE.Mesh(highlightGeo, highlightMat);
        this.targetLock.visible = false;

        domElement.addEventListener('pointerdown', (event) => this.onClick(event));
        
        this.closeBtn.addEventListener('click', () => {
            this.panel.classList.add('hidden');
            this.targetLock.visible = false; // Hide lock on close
        });
    }

    onClick(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);

        if (intersects.length > 0) {
            const validHit = intersects.find(hit => hit.object.name && hit.object.userData.info);

            if (validHit) {
                this.showDataPanel(validHit.object);
                
                // Snap the target lock to the clicked object
                const radius = validHit.object.geometry.parameters.radius || 1;
                this.targetLock.scale.set(radius * 1.05, radius * 1.05, radius * 1.05);
                validHit.object.add(this.targetLock); 
                this.targetLock.visible = true;
            } else {
                this.panel.classList.add('hidden');
                this.targetLock.visible = false;
            }
        } else {
            this.panel.classList.add('hidden');
            this.targetLock.visible = false;
        }
    }

    showDataPanel(object) {
        this.title.innerText = object.name;
        this.info.innerHTML = object.userData.info; // Use innerHTML to render <br> tags
        this.panel.classList.remove('hidden');
    }
}