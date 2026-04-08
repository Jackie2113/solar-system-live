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
        
        // New Tooltip elements
        this.tooltip = document.getElementById('hover-tooltip');
        this.ttName = document.getElementById('tt-name');
        this.ttInfo = document.getElementById('tt-info');

        const highlightGeo = new THREE.SphereGeometry(1, 32, 32);
        const highlightMat = new THREE.MeshBasicMaterial({ 
            color: 0xff4444, wireframe: true, transparent: true, opacity: 0.4 
        });
        this.targetLock = new THREE.Mesh(highlightGeo, highlightMat);
        this.targetLock.visible = false;

        // Listen for both clicks and hovers
        domElement.addEventListener('pointerdown', (event) => this.onClick(event));
        domElement.addEventListener('pointermove', (event) => this.onHover(event));
        
        this.closeBtn.addEventListener('click', () => {
            this.panel.classList.add('hidden');
            this.targetLock.visible = false; 
        });
    }

    onHover(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);

        const validHit = intersects.find(hit => hit.object.name && hit.object.userData.info);

        // Ignore the red target lock wireframe itself
        if (validHit && validHit.object !== this.targetLock) {
            
            // Change cursor to crosshair when looking at valid objects
            document.body.style.cursor = 'crosshair';

            // If hovering over the asteroid belt, show the floating scanner tooltip
            if (validHit.object.userData.isBelt) {
                this.ttName.innerText = validHit.object.name;
                this.ttInfo.innerHTML = validHit.object.userData.info;
                
                this.tooltip.style.left = `${event.clientX}px`;
                this.tooltip.style.top = `${event.clientY}px`;
                this.tooltip.classList.remove('hidden');
            } else {
                this.tooltip.classList.add('hidden'); // Hide if hovering a normal planet
            }

        } else {
            document.body.style.cursor = 'default';
            this.tooltip.classList.add('hidden');
        }
    }

    onClick(event) {
        // Raycasting logic is identical to hover
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        const validHit = intersects.find(hit => hit.object.name && hit.object.userData.info);

        // ONLY trigger Target Lock if it is NOT the Asteroid Belt
        if (validHit && !validHit.object.userData.isBelt) {
            this.showDataPanel(validHit.object);
            
            const radius = validHit.object.geometry.parameters.radius || 1;
            this.targetLock.scale.set(radius * 1.05, radius * 1.05, radius * 1.05);
            validHit.object.add(this.targetLock); 
            this.targetLock.visible = true;
        } else {
            // Clicked empty space or the belt -> hide the main panel
            this.panel.classList.add('hidden');
            this.targetLock.visible = false;
        }
    }

    showDataPanel(object) {
        this.title.innerText = object.name;
        this.info.innerHTML = object.userData.info; 
        this.panel.classList.remove('hidden');
    }
}