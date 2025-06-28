import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Main Application Class
class VirtualArtGallery {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.raycaster = null;
        this.mouse = null;
        this.artPieces = [];
        this.animationId = null;
        this.arrowTargets = [
            { name: 'Back', position: { x: 0, y: 4, z: -7 }, lookAt: { x: 0, y: 4, z: -15 } },
            { name: 'Front', position: { x: 0, y: 4, z: 7 }, lookAt: { x: 0, y: 4, z: 15 } },
            { name: 'Left', position: { x: -12, y: 4, z: 0 }, lookAt: { x: -20, y: 4, z: 0 } },
            { name: 'Right', position: { x: 12, y: 4, z: 0 }, lookAt: { x: 20, y: 4, z: 0 } }
        ];
        
        this.init();
    }

    init() {
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupControls();
        this.setupLighting();
        this.setupGallery();
        this.setupEventListeners();
        this.setupUI();
        this.animate();

        // Hide loading screen since no assets are loaded
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a1a);
        this.scene.fog = new THREE.Fog(0x1a1a1a, 10, 100);
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 5, 10);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        const container = document.getElementById('canvas-container');
        container.appendChild(this.renderer.domElement);
    }

    setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 50;
    }

    setupLighting() {
        // Ambient Light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);

        // Directional Light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // Spot Lights
        const spotLight1 = new THREE.SpotLight(0xffffff, 0.5);
        spotLight1.position.set(-5, 8, 0);
        spotLight1.castShadow = true;
        this.scene.add(spotLight1);

        const spotLight2 = new THREE.SpotLight(0xffffff, 0.5);
        spotLight2.position.set(5, 8, 0);
        spotLight2.castShadow = true;
        this.scene.add(spotLight2);
    }

    setupGallery() {
        // Floor with checkerboard texture (now 40x30)
        const width = 40;
        const depth = 30;
        const floorGeometry = new THREE.PlaneGeometry(width, depth);
        const checkerboardTexture = this.createCheckerboardTexture(10, 10, 1024, 768);
        checkerboardTexture.wrapS = THREE.RepeatWrapping;
        checkerboardTexture.wrapT = THREE.RepeatWrapping;
        checkerboardTexture.repeat.set(1, 1);
        const floorMaterial = new THREE.MeshLambertMaterial({ 
            map: checkerboardTexture,
            side: THREE.DoubleSide
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);

        // Walls
        this.createWalls(width, depth);
        
        // Art Pieces
        this.createArtPieces();
        
        // Decorative Elements
        this.createDecorations();
    }

    createCheckerboardTexture(rows, cols, width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        const cellWidth = width / cols;
        const cellHeight = height / rows;
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                ctx.fillStyle = (x + y) % 2 === 0 ? '#fff' : '#000';
                ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
            }
        }
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    createArtPieces() {
        const depth = 30;
        const wallZ = -depth / 2 + 0.1; // Slightly in front of the wall
        const wallY = 4;
        const artData = [
            {
                title: "Abstract Harmony",
                artist: "Maria Rodriguez",
                year: "2023",
                description: "A vibrant exploration of color and form.",
                position: [-12, wallY, wallZ],
                image: "/art/1.jpg"
            },
            {
                title: "Digital Dreams",
                artist: "Alex Chen",
                year: "2024",
                description: "A digital artwork exploring technology and emotion.",
                position: [-4, wallY, wallZ],
                image: "/art/2.jpg"
            },
            {
                title: "Urban Landscape",
                artist: "Sarah Johnson",
                year: "2023",
                description: "A contemporary take on city life.",
                position: [4, wallY, wallZ],
                image: "/art/3.png"
            },
            {
                title: "Nature's Symphony",
                artist: "David Kim",
                year: "2024",
                description: "An organic composition inspired by nature.",
                position: [12, wallY, wallZ],
                image: "/art/4.jpg"
            }
        ];

        const textureLoader = new THREE.TextureLoader();

        artData.forEach(art => {
            const geometry = new THREE.PlaneGeometry(2, 3);
            let material;
            if (art.image) {
                const texture = textureLoader.load(art.image);
                material = new THREE.MeshLambertMaterial({ map: texture });
            } else {
                material = new THREE.MeshLambertMaterial({ color: art.color || 0xffffff });
            }
            const artPiece = new THREE.Mesh(geometry, material);
            artPiece.position.set(...art.position);
            artPiece.castShadow = true;
            artPiece.receiveShadow = true;
            artPiece.userData = art;
            this.scene.add(artPiece);
            this.artPieces.push(artPiece);
        });

        // --- Add 3D art objects on pedestals ---
        this.sculptures = [];
        const pedestalData = [
            { pos: [-10, 1, 0], color: 0xffffff, artType: 'torusKnot', artColor: 0x8e44ad },
            { pos: [0, 1, 8], color: 0xffffff, artType: 'dodecahedron', artColor: 0xe67e22 },
            { pos: [10, 1, -5], color: 0xffffff, artType: 'icosahedron', artColor: 0x16a085 }
        ];
        pedestalData.forEach((ped, i) => {
            // Pedestal (rectangular cube)
            const pedestalGeo = new THREE.BoxGeometry(2, 2, 2);
            const pedestalMat = new THREE.MeshLambertMaterial({ color: ped.color });
            const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
            pedestal.position.set(...ped.pos);
            pedestal.castShadow = true;
            pedestal.receiveShadow = true;
            this.scene.add(pedestal);

            // Artistic 3D Art Object
            let artGeo, artMat;
            if (ped.artType === 'torusKnot') {
                artGeo = new THREE.TorusKnotGeometry(1, 0.35, 128, 16);
            } else if (ped.artType === 'dodecahedron') {
                artGeo = new THREE.DodecahedronGeometry(1.1);
            } else if (ped.artType === 'icosahedron') {
                artGeo = new THREE.IcosahedronGeometry(1.1, 1);
            } else {
                artGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
            }
            artMat = new THREE.MeshPhysicalMaterial({
                color: ped.artColor,
                roughness: 0.25,
                metalness: 0.7,
                clearcoat: 0.5,
                clearcoatRoughness: 0.15,
                reflectivity: 0.6,
                sheen: 1.0,
                sheenColor: new THREE.Color(0xffffff)
            });
            const artObj = new THREE.Mesh(artGeo, artMat);
            artObj.position.set(ped.pos[0], ped.pos[1] + 1.7, ped.pos[2]);
            artObj.castShadow = true;
            artObj.receiveShadow = true;
            artObj.userData.isSculpture = true;
            this.scene.add(artObj);
            this.sculptures.push(artObj);

            // Add a spotlight above each sculpture
            const spot = new THREE.SpotLight(ped.artColor, 1.2, 10, Math.PI / 6, 0.3, 1);
            spot.position.set(ped.pos[0], ped.pos[1] + 7, ped.pos[2]);
            spot.target = artObj;
            spot.castShadow = true;
            this.scene.add(spot);
        });
    }

    setupEventListeners() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            this.handleMouseMove();
        });

        window.addEventListener('click', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            this.handleClick();
        });

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    setupUI() {
        document.getElementById('reset-camera').addEventListener('click', () => {
            this.camera.position.set(0, 5, 10);
            this.controls.reset();
        });

        document.getElementById('toggle-lights').addEventListener('click', () => {
            this.toggleLights();
        });

        document.getElementById('close-info').addEventListener('click', () => {
            this.hideArtInfo();
        });

        // Add navigation button listeners
        const navIds = [
            { id: 'nav-back', target: 0 },
            { id: 'nav-front', target: 1 },
            { id: 'nav-left', target: 2 },
            { id: 'nav-right', target: 3 }
        ];
        navIds.forEach(nav => {
            const btn = document.getElementById(nav.id);
            if (btn) {
                btn.addEventListener('click', () => {
                    const target = this.arrowTargets[nav.target];
                    this.animateCameraTo(target.position, target.lookAt);
                });
            }
        });
    }

    handleMouseMove() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.artPieces);

        // Only reset scale for art pieces
        this.artPieces.forEach(piece => {
            piece.scale.set(1, 1, 1);
        });

        if (intersects.length > 0) {
            const hovered = intersects[0].object;
            hovered.scale.set(1.05, 1.05, 1.05);
            document.body.style.cursor = 'pointer';
        } else {
            document.body.style.cursor = 'default';
        }
    }

    handleClick() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects([...this.artPieces, ...(this.sculptures || [])]);

        if (intersects.length > 0) {
            const clicked = intersects[0].object;
            if (clicked.userData && clicked.userData.isSculpture) {
                // Animate camera to a close-up view of the sculpture
                const objPos = clicked.position;
                // Camera offset: 3 units in front of the object, based on camera's current position
                const camDir = new THREE.Vector3().subVectors(this.camera.position, objPos).normalize();
                const closePos = objPos.clone().add(camDir.multiplyScalar(3));
                this.animateCameraTo(closePos, objPos);
            } else {
                this.showArtInfo(clicked.userData);
            }
        }
    }

    showArtInfo(artData) {
        document.getElementById('art-title').textContent = artData.title;
        document.getElementById('art-description').textContent = artData.description;
        document.getElementById('art-artist').textContent = `Artist: ${artData.artist}`;
        document.getElementById('art-year').textContent = `Year: ${artData.year}`;
        
        const artInfo = document.getElementById('art-info');
        artInfo.classList.remove('hidden');
    }

    hideArtInfo() {
        const artInfo = document.getElementById('art-info');
        artInfo.classList.add('hidden');
    }

    toggleLights() {
        const lights = this.scene.children.filter(child => child.isLight);
        lights.forEach(light => {
            light.intensity = light.intensity > 0 ? 0 : 0.8;
        });
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    createWalls(width = 40, depth = 30) {
        // Generate a rough noise texture
        const wallTexture = this.createRoughTexture(512, 128, '#b8860b', '#8b5c00');
        wallTexture.wrapS = THREE.RepeatWrapping;
        wallTexture.wrapT = THREE.RepeatWrapping;
        wallTexture.repeat.set(4, 1);
        const wallMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xb8860b, 
            map: wallTexture
        });
        const wallHeight = 8;
        // Back Wall
        const backWall = new THREE.Mesh(
            new THREE.PlaneGeometry(width, wallHeight),
            wallMaterial
        );
        backWall.position.set(0, wallHeight / 2, -depth / 2);
        backWall.receiveShadow = true;
        this.scene.add(backWall);

        // Front Wall
        const frontWall = new THREE.Mesh(
            new THREE.PlaneGeometry(width, wallHeight),
            wallMaterial
        );
        frontWall.position.set(0, wallHeight / 2, depth / 2);
        frontWall.rotation.y = Math.PI;
        frontWall.receiveShadow = true;
        this.scene.add(frontWall);

        // Left Wall
        const leftWall = new THREE.Mesh(
            new THREE.PlaneGeometry(depth, wallHeight),
            wallMaterial
        );
        leftWall.position.set(-width / 2, wallHeight / 2, 0);
        leftWall.rotation.y = Math.PI / 2;
        leftWall.receiveShadow = true;
        this.scene.add(leftWall);

        // Right Wall
        const rightWall = new THREE.Mesh(
            new THREE.PlaneGeometry(depth, wallHeight),
            wallMaterial
        );
        rightWall.position.set(width / 2, wallHeight / 2, 0);
        rightWall.rotation.y = -Math.PI / 2;
        rightWall.receiveShadow = true;
        this.scene.add(rightWall);
    }

    createRoughTexture(width, height, color1, color2) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        // Fill with base color
        ctx.fillStyle = color1;
        ctx.fillRect(0, 0, width, height);
        // Add random noise
        for (let i = 0; i < 10000; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            ctx.fillStyle = Math.random() > 0.5 ? color2 : color1;
            ctx.globalAlpha = 0.15 + Math.random() * 0.15;
            ctx.beginPath();
            ctx.arc(x, y, Math.random() * 2 + 1, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1.0;
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    createDecorations() {
        // Ceiling lights
        for (let i = -8; i <= 8; i += 4) {
            const lightGeometry = new THREE.SphereGeometry(0.2, 16, 16);
            const lightMaterial = new THREE.MeshBasicMaterial({ 
                color: 0xffffcc,
                transparent: true,
                opacity: 0.6
            });
            const light = new THREE.Mesh(lightGeometry, lightMaterial);
            light.position.set(i, 7.5, 0);
            this.scene.add(light);
        }
        // Floor carpet (optional, can be commented out if not needed)
        // const carpetGeometry = new THREE.PlaneGeometry(16, 12);
        // const carpetMaterial = new THREE.MeshLambertMaterial({ 
        //     color: 0x2c3e50,
        //     transparent: true,
        //     opacity: 0.3
        // });
        // const carpet = new THREE.Mesh(carpetGeometry, carpetMaterial);
        // carpet.rotation.x = -Math.PI / 2;
        // carpet.position.y = 0.01;
        // this.scene.add(carpet);
    }

    animateCameraTo(targetPos, lookAt) {
        // Simple linear interpolation for camera movement
        const duration = 1000; // ms
        const start = { x: this.camera.position.x, y: this.camera.position.y, z: this.camera.position.z };
        const end = targetPos;
        const startTime = performance.now();
        const animate = (now) => {
            const elapsed = now - startTime;
            const t = Math.min(elapsed / duration, 1);
            this.camera.position.x = start.x + (end.x - start.x) * t;
            this.camera.position.y = start.y + (end.y - start.y) * t;
            this.camera.position.z = start.z + (end.z - start.z) * t;
            this.camera.lookAt(lookAt.x, lookAt.y, lookAt.z);
            if (t < 1) {
                requestAnimationFrame(animate);
            } else {
                this.controls.target.set(lookAt.x, lookAt.y, lookAt.z);
                this.controls.update();
            }
        };
        requestAnimationFrame(animate);
    }
}

// Initialize the application
const gallery = new VirtualArtGallery();
