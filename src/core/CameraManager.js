import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class CameraManager {
    constructor(camera, domElement) {
        this.camera = camera;
        this.controls = new OrbitControls(camera, domElement);
        
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        
        // Limits how close/far you can scroll zoom
        this.controls.minDistance = 10; 
        this.controls.maxDistance = 500; 
        
        // Enable Right-Click Panning
        this.controls.enablePan = true;
    }

    update() {
        // Limit the panning distance. If the target drifts further than 200 units 
        // from the Sun (0,0,0), we clamp it back.
        if (this.controls.target.length() > 200) {
            this.controls.target.setLength(200);
        }
        
        this.controls.update(); 
    }
}