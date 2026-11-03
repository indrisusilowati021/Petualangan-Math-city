import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { AreaId } from '../types/game';
import { soundManager } from '../audio/soundManager';

export interface WorldCallbacks {
  onNearNPC: (areaId: AreaId | null) => void;
  onCoinCollected: (coinId: number, totalCoins: number) => void;
  onPlayerPositionUpdate?: (pos: { x: number; z: number; heading: number }) => void;
}

export class CityWorld {
  public container: HTMLElement;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  private isSoftwareGl: boolean;
  private clock: THREE.Clock;
  private frameId: number = 0;

  // Player Character & Movement
  public playerGroup: THREE.Group;
  public playerVelocity: THREE.Vector3 = new THREE.Vector3();
  public isGrounded: boolean = true;
  private playerSpeed: number = 8;
  private runMultiplier: number = 1.6;
  public isRunning: boolean = false;
  private limbAngle: number = 0;
  private leftLeg!: THREE.Mesh;
  private rightLeg!: THREE.Mesh;
  private leftArm!: THREE.Mesh;
  private rightArm!: THREE.Mesh;
  private magnifyingGlass!: THREE.Group;

  // Camera Orbit
  public cameraYaw: number = 0;
  public cameraPitch: number = 0.35;
  public cameraDistance: number = 7.5;
  private targetCameraYaw: number = 0;
  private targetCameraPitch: number = 0.35;
  public isPointerLocked: boolean = false;
  private isMouseDown: boolean = false;
  private prevMouseX: number = 0;
  private prevMouseY: number = 0;

  // Inputs
  public moveForward: boolean = false;
  public moveBackward: boolean = false;
  public moveLeft: boolean = false;
  public moveRight: boolean = false;
  public requestJump: boolean = false;

  // World Elements
  private npcs: { areaId: AreaId; group: THREE.Group; initialY: number; labelMesh: THREE.Sprite }[] = [];
  private coins: { id: number; mesh: THREE.Group; collected: boolean }[] = [];
  private ferrisWheelGroup: THREE.Group | null = null;
  private colliders: THREE.Box3[] = [];
  private footstepTimer: number = 0;

  // Callbacks
  private callbacks: WorldCallbacks;
  private currentNearArea: AreaId | null = null;

  constructor(container: HTMLElement, callbacks: WorldCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
    this.clock = new THREE.Clock();

    // 1. Detect Software GL
    this.isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Setup Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.container.appendChild(this.renderer.domElement);

    // 3. Scene & Fog (Soft pleasant sky blue fog)
    this.scene = new THREE.Scene();
    const skyColor = new THREE.Color(0xa7d8ff);
    this.scene.background = skyColor;
    this.scene.fog = new THREE.FogExp2(0xa7d8ff, 0.012);

    // 4. Camera
    this.camera = new THREE.PerspectiveCamera(
      55,
      this.container.clientWidth / this.container.clientHeight,
      0.2,
      250
    );

    // 5. Studio Environment Reflection
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // 6. Lighting
    this.setupLighting();

    // 7. Build World (Ground, Roads, 5 Buildings, Details, Coins)
    this.setupGroundAndRoads();
    this.setupBuildings();
    this.setupTownSquareAndProps();
    this.setupCoins();
    this.setupNPCs();

    // 8. Player Character
    this.playerGroup = this.createDetectiveCharacter();
    this.playerGroup.position.set(0, 0, 10);
    this.scene.add(this.playerGroup);

    // 9. Event Listeners
    this.setupInputs();
    window.addEventListener('resize', this.onResize);

    // 10. Start Loop
    this.animate();
  }

  // --- Lighting Rig ---
  private setupLighting() {
    const hemiLight = new THREE.HemisphereLight(0xfff7e6, 0x5a7894, 0.85);
    hemiLight.position.set(0, 50, 0);
    this.scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, 1.4);
    dirLight.position.set(40, 60, 30);
    if (!this.isSoftwareGl) {
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.width = 2048;
      dirLight.shadow.mapSize.height = 2048;
      dirLight.shadow.camera.near = 10;
      dirLight.shadow.camera.far = 160;
      const d = 55;
      dirLight.shadow.camera.left = -d;
      dirLight.shadow.camera.right = d;
      dirLight.shadow.camera.top = d;
      dirLight.shadow.camera.bottom = -d;
      dirLight.shadow.bias = -0.0005;
      dirLight.shadow.normalBias = 0.02;
    }
    this.scene.add(dirLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    this.scene.add(ambientLight);
  }

  // --- Procedural Canvas Textures ---
  private createFaceTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    // Skin base
    ctx.fillStyle = '#ffdfba';
    ctx.fillRect(0, 0, 128, 128);

    // Eyes
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(32, 44, 16, 20);
    ctx.fillRect(80, 44, 16, 20);

    // Eye highlights
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(34, 46, 6, 6);
    ctx.fillRect(82, 46, 6, 6);

    // Eyebrows
    ctx.fillStyle = '#475569';
    ctx.fillRect(28, 34, 24, 6);
    ctx.fillRect(76, 34, 24, 6);

    // Cheeks
    ctx.fillStyle = 'rgba(244, 63, 94, 0.35)';
    ctx.beginPath();
    ctx.arc(28, 74, 10, 0, Math.PI * 2);
    ctx.arc(100, 74, 10, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(64, 80, 16, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  private createTrenchCoatTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    // Beige trench coat
    ctx.fillStyle = '#c89658';
    ctx.fillRect(0, 0, 128, 128);

    // White shirt collar
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(44, 0);
    ctx.lineTo(64, 30);
    ctx.lineTo(84, 0);
    ctx.fill();

    // Red necktie
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(60, 20);
    ctx.lineTo(68, 20);
    ctx.lineTo(70, 75);
    ctx.lineTo(64, 85);
    ctx.lineTo(58, 75);
    ctx.fill();

    // Golden Detective Star Badge
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(36, 42, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★', 36, 45);

    // Coat lapels and buttons
    ctx.strokeStyle = '#926027';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(40, 0);
    ctx.lineTo(54, 70);
    ctx.moveTo(88, 0);
    ctx.lineTo(74, 70);
    ctx.stroke();

    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.arc(74, 85, 3.5, 0, Math.PI * 2);
    ctx.arc(74, 105, 3.5, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  private createTextSprite(text: string, subtitle?: string): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 100;
    const ctx = canvas.getContext('2d')!;

    // Background pill
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.beginPath();
    ctx.roundRect(10, 10, 300, 80, 20);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Main text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 160, subtitle ? 38 : 50);

    // Subtitle
    if (subtitle) {
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(subtitle, 160, 68);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    const spriteMat = new THREE.SpriteMaterial({ map: tex, depthTest: false });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(4, 1.25, 1);
    return sprite;
  }

  // --- Character Creation (Roblox-style blocky detective) ---
  private createDetectiveCharacter(): THREE.Group {
    const player = new THREE.Group();

    const skinMat = new THREE.MeshStandardMaterial({
      roughness: 0.5,
      metalness: 0.1,
      map: this.createFaceTexture(),
    });
    const plainSkinMat = new THREE.MeshStandardMaterial({ color: 0xffdfba, roughness: 0.6 });
    const coatMat = new THREE.MeshStandardMaterial({
      roughness: 0.7,
      metalness: 0.1,
      map: this.createTrenchCoatTexture(),
    });
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const hatMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
    const ribbonMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.5 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 });

    // Torso (center: y=1.2)
    const torsoGeo = new THREE.BoxGeometry(1.0, 1.2, 0.55);
    const torso = new THREE.Mesh(torsoGeo, coatMat);
    torso.position.y = 1.3;
    torso.castShadow = !this.isSoftwareGl;
    player.add(torso);

    // Head (center: y=2.25)
    const headGeo = new THREE.BoxGeometry(0.85, 0.85, 0.85);
    const headMaterials = [
      plainSkinMat, // right
      plainSkinMat, // left
      plainSkinMat, // top
      plainSkinMat, // bottom
      skinMat,      // front face
      plainSkinMat, // back
    ];
    const head = new THREE.Mesh(headGeo, headMaterials);
    head.position.y = 2.32;
    head.castShadow = !this.isSoftwareGl;
    player.add(head);

    // Detective Fedora Hat (Brim + Crown + Ribbon)
    const hatGroup = new THREE.Group();
    const brimGeo = new THREE.BoxGeometry(1.35, 0.1, 1.35);
    const brim = new THREE.Mesh(brimGeo, hatMat);
    brim.position.y = 2.76;
    brim.castShadow = !this.isSoftwareGl;
    hatGroup.add(brim);

    const crownGeo = new THREE.BoxGeometry(0.82, 0.5, 0.82);
    const crown = new THREE.Mesh(crownGeo, hatMat);
    crown.position.y = 3.02;
    crown.castShadow = !this.isSoftwareGl;
    hatGroup.add(crown);

    const ribbonGeo = new THREE.BoxGeometry(0.85, 0.12, 0.85);
    const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
    ribbon.position.y = 2.85;
    hatGroup.add(ribbon);
    player.add(hatGroup);

    // Left Arm (pivot at shoulder y=1.8)
    const armGeo = new THREE.BoxGeometry(0.4, 1.1, 0.4);
    armGeo.translate(0, -0.45, 0);
    this.leftArm = new THREE.Mesh(armGeo, coatMat);
    this.leftArm.position.set(-0.75, 1.8, 0);
    this.leftArm.castShadow = !this.isSoftwareGl;
    player.add(this.leftArm);

    // Right Arm (pivot at shoulder y=1.8)
    this.rightArm = new THREE.Mesh(armGeo, coatMat);
    this.rightArm.position.set(0.75, 1.8, 0);
    this.rightArm.castShadow = !this.isSoftwareGl;
    player.add(this.rightArm);

    // Magnifying Glass attached to right arm
    this.magnifyingGlass = new THREE.Group();
    const handleGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.45, 8);
    const handle = new THREE.Mesh(handleGeo, hatMat);
    handle.rotation.x = Math.PI / 2;
    this.magnifyingGlass.add(handle);

    const ringGeo = new THREE.TorusGeometry(0.18, 0.035, 8, 16);
    const ring = new THREE.Mesh(ringGeo, goldMat);
    ring.position.z = 0.28;
    this.magnifyingGlass.add(ring);

    const lensGeo = new THREE.CircleGeometry(0.16, 16);
    const lensMat = new THREE.MeshBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
    });
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.position.z = 0.28;
    this.magnifyingGlass.add(lens);

    this.magnifyingGlass.position.set(0, -0.9, 0.2);
    this.rightArm.add(this.magnifyingGlass);

    // Left Leg (pivot at hip y=0.8)
    const legGeo = new THREE.BoxGeometry(0.42, 0.85, 0.45);
    legGeo.translate(0, -0.4, 0);
    this.leftLeg = new THREE.Mesh(legGeo, pantsMat);
    this.leftLeg.position.set(-0.26, 0.8, 0);
    this.leftLeg.castShadow = !this.isSoftwareGl;
    player.add(this.leftLeg);

    // Right Leg (pivot at hip y=0.8)
    this.rightLeg = new THREE.Mesh(legGeo, pantsMat);
    this.rightLeg.position.set(0.26, 0.8, 0);
    this.rightLeg.castShadow = !this.isSoftwareGl;
    player.add(this.rightLeg);

    // Contact shadow
    const shadowGeo = new THREE.PlaneGeometry(1.6, 1.6);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.35,
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.02;
    player.add(shadow);

    return player;
  }

  // --- Ground & Roads ---
  private setupGroundAndRoads() {
    // Vast outer green terrain
    const groundGeo = new THREE.PlaneGeometry(260, 260);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x4ade80,
      roughness: 0.85,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = !this.isSoftwareGl;
    this.scene.add(ground);

    // Central City Plaza (Cobblestone / Concrete)
    const plazaGeo = new THREE.PlaneGeometry(110, 110);
    const plazaMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.6,
    });
    const plaza = new THREE.Mesh(plazaGeo, plazaMat);
    plaza.rotation.x = -Math.PI / 2;
    plaza.position.y = 0.02;
    plaza.receiveShadow = !this.isSoftwareGl;
    this.scene.add(plaza);

    // Cross roads (North-South & East-West asphalt)
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.7,
    });

    const nsRoad = new THREE.Mesh(new THREE.PlaneGeometry(12, 110), roadMat);
    nsRoad.rotation.x = -Math.PI / 2;
    nsRoad.position.set(0, 0.03, 0);
    nsRoad.receiveShadow = !this.isSoftwareGl;
    this.scene.add(nsRoad);

    const ewRoad = new THREE.Mesh(new THREE.PlaneGeometry(110, 12), roadMat);
    ewRoad.rotation.x = -Math.PI / 2;
    ewRoad.position.set(0, 0.03, 0);
    ewRoad.receiveShadow = !this.isSoftwareGl;
    this.scene.add(ewRoad);

    // Road Stripes
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (let i = -50; i <= 50; i += 8) {
      if (Math.abs(i) < 10) continue; // Leave central intersection clean
      // NS stripes
      const nsStripe = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 4), stripeMat);
      nsStripe.rotation.x = -Math.PI / 2;
      nsStripe.position.set(0, 0.04, i);
      this.scene.add(nsStripe);

      // EW stripes
      const ewStripe = new THREE.Mesh(new THREE.PlaneGeometry(4, 0.8), stripeMat);
      ewStripe.rotation.x = -Math.PI / 2;
      ewStripe.position.set(i, 0.04, 0);
      this.scene.add(ewStripe);
    }

    // Pedestrian Zebra Crossings
    for (let offset of [-10, 10]) {
      for (let s = -4.5; s <= 4.5; s += 1.5) {
        const zebra1 = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 2.5), stripeMat);
        zebra1.rotation.x = -Math.PI / 2;
        zebra1.position.set(s, 0.04, offset);
        this.scene.add(zebra1);

        const zebra2 = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 0.8), stripeMat);
        zebra2.rotation.x = -Math.PI / 2;
        zebra2.position.set(offset, 0.04, s);
        this.scene.add(zebra2);
      }
    }

    // Outer Perimeter Barriers & Hills (blocky hills)
    const hillMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.9 });
    for (let angle = 0; angle < Math.PI * 2; angle += 0.35) {
      const dist = 80 + Math.sin(angle * 3) * 12;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;
      const scaleH = 6 + Math.cos(angle * 5) * 3;
      const hill = new THREE.Mesh(new THREE.BoxGeometry(16, scaleH, 16), hillMat);
      hill.position.set(x, scaleH / 2, z);
      hill.rotation.y = angle;
      this.scene.add(hill);
    }
  }

  // --- 5 Rich Interactive Procedural Buildings ---
  private setupBuildings() {
    // 1. SUPERMARKET (x: -35, z: -35)
    this.createSupermarket(-35, -35);

    // 2. RESTAURANT (x: 35, z: -35)
    this.createRestaurant(35, -35);

    // 3. TRANSPORTATION CENTER (x: -35, z: 35)
    this.createTransportCenter(-35, 35);

    // 4. AMUSEMENT PARK (x: 35, z: 35)
    this.createAmusementPark(35, 35);

    // 5. DETECTIVE HEADQUARTERS (x: 0, z: -40)
    this.createDetectiveHeadquarters(0, -42);
  }

  // Building 1: Supermarket
  private createSupermarket(x: number, z: number) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Main hall
    const mainGeo = new THREE.BoxGeometry(22, 10, 18);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.6 });
    const main = new THREE.Mesh(mainGeo, wallMat);
    main.position.y = 5;
    main.castShadow = !this.isSoftwareGl;
    main.receiveShadow = !this.isSoftwareGl;
    group.add(main);

    // Roof
    const roofGeo = new THREE.BoxGeometry(23.5, 1.2, 19.5);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 10.6;
    group.add(roof);

    // Green/Orange grocery striped awning above entrance
    const awningMat1 = new THREE.MeshStandardMaterial({ color: 0x16a34a });
    const awningMat2 = new THREE.MeshStandardMaterial({ color: 0xffffff });
    for (let i = 0; i < 8; i++) {
      const awnSeg = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 0.4, 3.5),
        i % 2 === 0 ? awningMat1 : awningMat2
      );
      awnSeg.position.set(-5.25 + i * 1.5, 4.5, 9.8);
      awnSeg.rotation.x = 0.2;
      group.add(awnSeg);
    }

    // Supermarket Signboard
    const signSprite = this.createTextSprite('🛒 SUPERMARKET', 'Pak Joko – Bahan Pokok');
    signSprite.position.set(0, 12.2, 8);
    group.add(signSprite);

    // Glass Windows
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.6,
    });
    const win1 = new THREE.Mesh(new THREE.BoxGeometry(6, 4, 0.2), glassMat);
    win1.position.set(-6, 3, 9.1);
    group.add(win1);

    const win2 = new THREE.Mesh(new THREE.BoxGeometry(6, 4, 0.2), glassMat);
    win2.position.set(6, 3, 9.1);
    group.add(win2);

    // Open entrance doorway frame
    const doorFrame = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 5, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x0f172a })
    );
    doorFrame.position.set(0, 2.5, 9.05);
    group.add(doorFrame);

    // Shopping Carts on porch
    const cartMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 });
    for (let c = 0; c < 3; c++) {
      const cart = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.6), cartMat);
      cart.position.set(7.5 + c * 1.6, 0.6, 10.5);
      group.add(cart);
    }

    this.scene.add(group);
    this.colliders.push(new THREE.Box3().setFromObject(main));
  }

  // Building 2: Restaurant
  private createRestaurant(x: number, z: number) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Main cafe building
    const mainGeo = new THREE.BoxGeometry(20, 9, 18);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.5 });
    const main = new THREE.Mesh(mainGeo, wallMat);
    main.position.y = 4.5;
    main.castShadow = !this.isSoftwareGl;
    group.add(main);

    // Red roof
    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(21.5, 1.4, 19.5),
      new THREE.MeshStandardMaterial({ color: 0xbe123c, roughness: 0.4 })
    );
    roof.position.y = 9.7;
    group.add(roof);

    // Giant 3D Burger mascot on the roof!
    const burgerGroup = new THREE.Group();
    burgerGroup.position.set(0, 12, 0);

    const bunMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });
    const pattyMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.8 });
    const lettuceMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.7 });
    const cheeseMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.5 });

    const bottomBun = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.3, 0.7, 16), bunMat);
    bottomBun.position.y = 0.35;
    burgerGroup.add(bottomBun);

    const patty = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.6, 0.6, 16), pattyMat);
    patty.position.y = 0.95;
    burgerGroup.add(patty);

    const cheese = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.15, 3.6), cheeseMat);
    cheese.position.y = 1.35;
    cheese.rotation.y = 0.4;
    burgerGroup.add(cheese);

    const lettuce = new THREE.Mesh(new THREE.CylinderGeometry(2.7, 2.7, 0.25, 16), lettuceMat);
    lettuce.position.y = 1.55;
    burgerGroup.add(lettuce);

    const topBun = new THREE.Mesh(new THREE.SphereGeometry(2.5, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), bunMat);
    topBun.position.y = 1.65;
    burgerGroup.add(topBun);

    group.add(burgerGroup);

    // Signboard
    const signSprite = this.createTextSprite('🍔 RESTORAN MATH', 'Chef Sarah – Kuliner SPLDV');
    signSprite.position.set(0, 16.5, 5);
    group.add(signSprite);

    // Outdoor dining tables with parasols
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
    const parasolMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e });
    for (let t = -1; t <= 1; t += 2) {
      const tableGroup = new THREE.Group();
      tableGroup.position.set(t * 5.5, 0, 12);

      const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.15, 12), tableMat);
      tableTop.position.y = 1.1;
      tableGroup.add(tableTop);

      const tableLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.1, 8), tableMat);
      tableLeg.position.y = 0.55;
      tableGroup.add(tableLeg);

      // Parasol
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.2, 8), tableMat);
      pole.position.y = 1.6;
      tableGroup.add(pole);

      const umbrella = new THREE.Mesh(new THREE.ConeGeometry(2.4, 1.0, 12), parasolMat);
      umbrella.position.y = 3.2;
      tableGroup.add(umbrella);

      group.add(tableGroup);
    }

    this.scene.add(group);
    this.colliders.push(new THREE.Box3().setFromObject(main));
  }

  // Building 3: Transportation Center
  private createTransportCenter(x: number, z: number) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Terminal Building (Blue glass & sleek white concrete)
    const mainGeo = new THREE.BoxGeometry(24, 10, 16);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xe0f2fe, roughness: 0.3 });
    const main = new THREE.Mesh(mainGeo, wallMat);
    main.position.y = 5;
    main.castShadow = !this.isSoftwareGl;
    group.add(main);

    // Clock tower on top
    const tower = new THREE.Mesh(
      new THREE.BoxGeometry(5, 7, 5),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 })
    );
    tower.position.set(0, 13, 0);
    group.add(tower);

    // Big clock face
    const clockFace = new THREE.Mesh(
      new THREE.CylinderGeometry(1.6, 1.6, 0.2, 16),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    clockFace.rotation.x = Math.PI / 2;
    clockFace.position.set(0, 14, 2.6);
    group.add(clockFace);

    // Train track on the side
    const railMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });
    for (let r = -12; r <= 12; r += 2) {
      const sleeper = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.2, 0.6), new THREE.MeshStandardMaterial({ color: 0x78350f }));
      sleeper.position.set(r, 0.1, -11);
      group.add(sleeper);
    }
    const leftRail = new THREE.Mesh(new THREE.BoxGeometry(26, 0.2, 0.2), railMat);
    leftRail.position.set(0, 0.3, -12);
    group.add(leftRail);

    const rightRail = new THREE.Mesh(new THREE.BoxGeometry(26, 0.2, 0.2), railMat);
    rightRail.position.set(0, 0.3, -10);
    group.add(rightRail);

    // Blocky Mini Train Locomotive parked on tracks!
    const trainGroup = new THREE.Group();
    trainGroup.position.set(-2, 0, -11);
    const trainBody = new THREE.Mesh(new THREE.BoxGeometry(8, 2.8, 2.4), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
    trainBody.position.y = 1.8;
    trainGroup.add(trainBody);
    const trainCab = new THREE.Mesh(new THREE.BoxGeometry(3, 3.8, 2.5), new THREE.MeshStandardMaterial({ color: 0x1e3a8a }));
    trainCab.position.set(-2.5, 2.3, 0);
    trainGroup.add(trainCab);
    group.add(trainGroup);

    // Signboard
    const signSprite = this.createTextSprite('🚆 TERMINAL TRANSIT', 'Mas Budi – Bus & Kereta');
    signSprite.position.set(0, 18, 4);
    group.add(signSprite);

    this.scene.add(group);
    this.colliders.push(new THREE.Box3().setFromObject(main));
  }

  // Building 4: Amusement Park
  private createAmusementPark(x: number, z: number) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Archway entrance with flags
    const archMat = new THREE.MeshStandardMaterial({ color: 0x7c3aed, roughness: 0.5 });
    const leftPillar = new THREE.Mesh(new THREE.BoxGeometry(2.5, 9, 2.5), archMat);
    leftPillar.position.set(-6, 4.5, 8);
    group.add(leftPillar);

    const rightPillar = new THREE.Mesh(new THREE.BoxGeometry(2.5, 9, 2.5), archMat);
    rightPillar.position.set(6, 4.5, 8);
    group.add(rightPillar);

    const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(15, 2.5, 2.5), archMat);
    crossBeam.position.set(0, 9.5, 8);
    group.add(crossBeam);

    // Colorful balloons on the archway
    const balloonColors = [0xef4444, 0x3b82f6, 0xfacc15, 0x10b981, 0xec4899];
    balloonColors.forEach((color, idx) => {
      const balloon = new THREE.Mesh(
        new THREE.SphereGeometry(0.7, 12, 12),
        new THREE.MeshStandardMaterial({ color, roughness: 0.3 })
      );
      balloon.position.set(-5 + idx * 2.5, 11.5 + Math.sin(idx) * 0.5, 8);
      group.add(balloon);
    });

    // FULLY ANIMATED ROTATING FERRIS WHEEL!
    this.ferrisWheelGroup = new THREE.Group();
    this.ferrisWheelGroup.position.set(0, 12, -8);

    const wheelHubMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.7 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.4 });
    const wheelRadius = 8;

    // Center hub
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 1.5, 16), wheelHubMat);
    hub.rotation.x = Math.PI / 2;
    this.ferrisWheelGroup.add(hub);

    // Spokes & Gondolas
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      // Spoke
      const spoke = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, wheelRadius * 2, 8),
        wheelHubMat
      );
      spoke.position.set(0, 0, 0);
      spoke.rotation.z = angle;
      this.ferrisWheelGroup.add(spoke);

      // Gondola cabin
      const gondola = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 1.8, 1.8),
        new THREE.MeshStandardMaterial({ color: balloonColors[i % balloonColors.length], roughness: 0.4 })
      );
      gondola.position.set(Math.cos(angle) * wheelRadius, Math.sin(angle) * wheelRadius, 0);
      this.ferrisWheelGroup.add(gondola);
    }

    group.add(this.ferrisWheelGroup);

    // Support legs for Ferris Wheel
    const legMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.6 });
    const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 14, 8), legMat);
    legL.position.set(-5, 6, -8);
    legL.rotation.z = -0.4;
    group.add(legL);

    const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 14, 8), legMat);
    legR.position.set(5, 6, -8);
    legR.rotation.z = 0.4;
    group.add(legR);

    // Signboard
    const signSprite = this.createTextSprite('🎡 TAMAN HIBURAN', 'Pak Doni – Wahana & Tiket');
    signSprite.position.set(0, 14, 8);
    group.add(signSprite);

    this.scene.add(group);
    this.colliders.push(new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(x, 5, z - 8), new THREE.Vector3(18, 12, 12)));
  }

  // Building 5: Detective Headquarters (Central North)
  private createDetectiveHeadquarters(x: number, z: number) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Neoclassical Building base & hall
    const mainGeo = new THREE.BoxGeometry(26, 12, 18);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.5 });
    const main = new THREE.Mesh(mainGeo, wallMat);
    main.position.y = 6;
    main.castShadow = !this.isSoftwareGl;
    group.add(main);

    // Front Pillars
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    for (let p = -8; p <= 8; p += 4) {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.8, 10, 16), pillarMat);
      pillar.position.set(p, 5, 9.8);
      pillar.castShadow = !this.isSoftwareGl;
      group.add(pillar);
    }

    // Pediment triangle roof
    const pedimentGeo = new THREE.ConeGeometry(15, 4, 4);
    const pedimentMat = new THREE.MeshStandardMaterial({ color: 0x047857, roughness: 0.4 });
    const pediment = new THREE.Mesh(pedimentGeo, pedimentMat);
    pediment.rotation.y = Math.PI / 4;
    pediment.position.set(0, 14, 9.8);
    group.add(pediment);

    // Giant Golden Magnifying Glass Emblem
    const emblemGroup = new THREE.Group();
    emblemGroup.position.set(0, 13.5, 11);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.6, 0.25, 12, 24),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.9, roughness: 0.2 })
    );
    emblemGroup.add(ring);
    const emblemHandle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 2.0, 8),
      new THREE.MeshStandardMaterial({ color: 0x78350f })
    );
    emblemHandle.position.set(1.5, -1.5, 0);
    emblemHandle.rotation.z = -Math.PI / 4;
    emblemGroup.add(emblemHandle);
    group.add(emblemGroup);

    // Signboard
    const signSprite = this.createTextSprite('🏆 MARKAS DETEKTIF', 'Inspektur Hendra – Kasus Final');
    signSprite.position.set(0, 18, 9);
    group.add(signSprite);

    this.scene.add(group);
    this.colliders.push(new THREE.Box3().setFromObject(main));
  }

  // --- Town Square & Props (Trees, Streetlamps, Fountain) ---
  private setupTownSquareAndProps() {
    // Center Fountain
    const fountainGroup = new THREE.Group();
    fountainGroup.position.set(0, 0, 0);

    const basinMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.6 });
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.8,
      roughness: 0.1,
      transparent: true,
      opacity: 0.75,
    });

    const basin = new THREE.Mesh(new THREE.CylinderGeometry(5, 5.5, 1.2, 20), basinMat);
    basin.position.y = 0.6;
    fountainGroup.add(basin);

    const water = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 4.6, 0.2, 20), waterMat);
    water.position.y = 1.1;
    fountainGroup.add(water);

    // Center Golden Pi (π) statue
    const statueStem = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 2.5, 12), basinMat);
    statueStem.position.y = 2.45;
    fountainGroup.add(statueStem);

    const piMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9, roughness: 0.2 });
    const piTop = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.4, 0.6), piMat);
    piTop.position.set(0, 4.4, 0);
    fountainGroup.add(piTop);

    const piLeg1 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.4, 0.5), piMat);
    piLeg1.position.set(-0.7, 3.5, 0);
    fountainGroup.add(piLeg1);

    const piLeg2 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.4, 0.5), piMat);
    piLeg2.position.set(0.7, 3.5, 0);
    fountainGroup.add(piLeg2);

    this.scene.add(fountainGroup);
    this.colliders.push(new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(0, 1.5, 0), new THREE.Vector3(10, 3, 10)));

    // Trees around sidewalks
    const treePositions = [
      { x: -18, z: -18 }, { x: 18, z: -18 }, { x: -18, z: 18 }, { x: 18, z: 18 },
      { x: -18, z: 0 }, { x: 18, z: 0 }, { x: 0, z: 18 }, { x: -35, z: 0 }, { x: 35, z: 0 },
      { x: -12, z: -48 }, { x: 12, z: -48 }, { x: -48, z: -20 }, { x: 48, z: -20 },
      { x: -48, z: 20 }, { x: 48, z: 20 },
    ];

    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    const leavesMat1 = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 });
    const leavesMat2 = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.7 });

    treePositions.forEach((pos, idx) => {
      const tree = new THREE.Group();
      tree.position.set(pos.x, 0, pos.z);

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 3.5, 8), trunkMat);
      trunk.position.y = 1.75;
      trunk.castShadow = !this.isSoftwareGl;
      tree.add(trunk);

      // Blocky layered leaves
      const foliage1 = new THREE.Mesh(
        new THREE.BoxGeometry(3.6, 2.2, 3.6),
        idx % 2 === 0 ? leavesMat1 : leavesMat2
      );
      foliage1.position.y = 4.2;
      foliage1.castShadow = !this.isSoftwareGl;
      tree.add(foliage1);

      const foliage2 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.0, 2.4), leavesMat2);
      foliage2.position.y = 5.8;
      foliage2.castShadow = !this.isSoftwareGl;
      tree.add(foliage2);

      this.scene.add(tree);
      this.colliders.push(new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(pos.x, 2, pos.z), new THREE.Vector3(1.2, 4, 1.2)));
    });

    // Street Lamps along roads
    const lampPositions = [
      { x: -7, z: -15 }, { x: 7, z: -15 }, { x: -7, z: 15 }, { x: 7, z: 15 },
      { x: -15, z: -7 }, { x: 15, z: -7 }, { x: -15, z: 7 }, { x: 15, z: 7 },
    ];
    const lampPostMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

    lampPositions.forEach((pos) => {
      const lamp = new THREE.Group();
      lamp.position.set(pos.x, 0, pos.z);

      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 5, 8), lampPostMat);
      post.position.y = 2.5;
      lamp.add(post);

      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.4, 12, 12), bulbMat);
      bulb.position.y = 5.1;
      lamp.add(bulb);

      this.scene.add(lamp);
    });
  }

  // --- Collectible Coins (30+ coins) ---
  private setupCoins() {
    const coinGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.12, 16);
    const coinMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      metalness: 0.95,
      roughness: 0.2,
    });

    const positions: [number, number][] = [
      // Along main plaza
      [0, 16], [0, 22], [0, 28], [0, -16], [0, -22], [0, -28],
      [16, 0], [22, 0], [28, 0], [-16, 0], [-22, 0], [-28, 0],
      // Corners
      [-12, -12], [12, -12], [-12, 12], [12, 12],
      // Near Supermarket
      [-26, -35], [-35, -25], [-28, -28],
      // Near Restaurant
      [26, -35], [35, -25], [28, -28],
      // Near Transport
      [-26, 35], [-35, 25], [-28, 28],
      // Near Amusement Park
      [26, 35], [35, 25], [28, 28],
      // Near Fountain
      [-6, -6], [6, -6], [-6, 6], [6, 6],
    ];

    positions.forEach((p, idx) => {
      const coinGroup = new THREE.Group();
      coinGroup.position.set(p[0], 1.2, p[1]);

      const coinMesh = new THREE.Mesh(coinGeo, coinMat);
      coinMesh.rotation.x = Math.PI / 2;
      coinMesh.castShadow = !this.isSoftwareGl;
      coinGroup.add(coinMesh);

      this.scene.add(coinGroup);
      this.coins.push({
        id: idx + 1,
        mesh: coinGroup,
        collected: false,
      });
    });
  }

  // --- 5 NPCs (Each stands in front of their location) ---
  private setupNPCs() {
    const npcConfigs: { areaId: AreaId; name: string; title: string; x: number; z: number; color: number; hatColor: number }[] = [
      { areaId: 'supermarket', name: 'Pak Joko', title: 'Pemilik Supermarket', x: -35, z: -23, color: 0xf59e0b, hatColor: 0x16a34a },
      { areaId: 'restaurant', name: 'Chef Sarah', title: 'Pemilik Restoran', x: 35, z: -23, color: 0xef4444, hatColor: 0xffffff },
      { areaId: 'transport', name: 'Mas Budi', title: 'Petugas Transportasi', x: -35, z: 24, color: 0x0284c7, hatColor: 0x1e3a8a },
      { areaId: 'amusement', name: 'Pak Doni', title: 'Pengelola Wahana', x: 35, z: 23, color: 0x8b5cf6, hatColor: 0xec4899 },
      { areaId: 'headquarters', name: 'Inspektur Hendra', title: 'Kepala Detektif', x: 0, z: -30, color: 0x10b981, hatColor: 0x064e3b },
    ];

    npcConfigs.forEach((cfg) => {
      const npcGroup = new THREE.Group();
      npcGroup.position.set(cfg.x, 0, cfg.z);

      const skinMat = new THREE.MeshStandardMaterial({ color: 0xffdfba, roughness: 0.6 });
      const bodyMat = new THREE.MeshStandardMaterial({ color: cfg.color, roughness: 0.7 });
      const pantsMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
      const hatMat = new THREE.MeshStandardMaterial({ color: cfg.hatColor, roughness: 0.5 });

      // Torso
      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.2, 0.5), bodyMat);
      torso.position.y = 1.3;
      npcGroup.add(torso);

      // Head
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), skinMat);
      head.position.y = 2.3;
      npcGroup.add(head);

      // Cap
      const cap = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.35, 1.0), hatMat);
      cap.position.y = 2.8;
      npcGroup.add(cap);

      // Legs
      const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.8, 0.4), pantsMat);
      leg1.position.set(-0.24, 0.4, 0);
      npcGroup.add(leg1);

      const leg2 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.8, 0.4), pantsMat);
      leg2.position.set(0.24, 0.4, 0);
      npcGroup.add(leg2);

      // Floating Name/Interact prompt
      const labelSprite = this.createTextSprite(`[E] ${cfg.name}`, cfg.title);
      labelSprite.position.set(0, 3.8, 0);
      npcGroup.add(labelSprite);

      this.scene.add(npcGroup);
      this.npcs.push({
        areaId: cfg.areaId,
        group: npcGroup,
        initialY: 0,
        labelMesh: labelSprite,
      });

      this.colliders.push(new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(cfg.x, 1.5, cfg.z), new THREE.Vector3(1.5, 3, 1.5)));
    });
  }

  // --- Input & Controls ---
  private setupInputs() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);

    // Mouse drag orbit controls on canvas
    this.renderer.domElement.addEventListener('mousedown', (e) => {
      this.isMouseDown = true;
      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      this.isMouseDown = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isMouseDown && !this.isPointerLocked) return;

      const deltaX = this.isPointerLocked ? e.movementX : e.clientX - this.prevMouseX;
      const deltaY = this.isPointerLocked ? e.movementY : e.clientY - this.prevMouseY;

      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;

      const sensitivity = 0.0035;
      this.targetCameraYaw -= deltaX * sensitivity;
      this.targetCameraPitch = Math.max(0.08, Math.min(Math.PI / 2.3, this.targetCameraPitch + deltaY * sensitivity));
    });

    // Touch controls for camera rotation on canvas
    let touchStartX = 0;
    let touchStartY = 0;
    this.renderer.domElement.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    this.renderer.domElement.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        const dx = e.touches[0].clientX - touchStartX;
        const dy = e.touches[0].clientY - touchStartY;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;

        const sensitivity = 0.005;
        this.targetCameraYaw -= dx * sensitivity;
        this.targetCameraPitch = Math.max(0.08, Math.min(Math.PI / 2.3, this.targetCameraPitch + dy * sensitivity));
      }
    }, { passive: true });

    // Scroll wheel zoom
    this.renderer.domElement.addEventListener('wheel', (e) => {
      this.cameraDistance = Math.max(4, Math.min(14, this.cameraDistance + e.deltaY * 0.005));
    }, { passive: true });
  }

  private onKeyDown = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.moveForward = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.moveBackward = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.moveLeft = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.moveRight = true;
        break;
      case 'Space':
        if (this.isGrounded) {
          this.requestJump = true;
        }
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.isRunning = true;
        break;
      case 'KeyE':
        if (this.currentNearArea) {
          this.callbacks.onNearNPC(this.currentNearArea);
          soundManager.playInteract();
        }
        break;
    }
  };

  private onKeyUp = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.moveForward = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.moveBackward = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.moveLeft = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.moveRight = false;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.isRunning = false;
        break;
    }
  };

  public triggerInteractKey() {
    if (this.currentNearArea) {
      this.callbacks.onNearNPC(this.currentNearArea);
      soundManager.playInteract();
    }
  }

  public teleportToArea(areaId: AreaId) {
    const coords: Record<AreaId, [number, number]> = {
      supermarket: [-35, -20],
      restaurant: [35, -20],
      transport: [-35, 20],
      amusement: [35, 20],
      headquarters: [0, -25],
    };
    const c = coords[areaId];
    if (c) {
      this.playerGroup.position.set(c[0], 0, c[1]);
      this.playerVelocity.set(0, 0, 0);
      soundManager.playJump();
    }
  }

  // --- Collision helper ---
  private checkCollision(newPos: THREE.Vector3): boolean {
    const playerRadius = 0.6;
    for (const box of this.colliders) {
      // Expand box by player radius
      if (
        newPos.x >= box.min.x - playerRadius &&
        newPos.x <= box.max.x + playerRadius &&
        newPos.z >= box.min.z - playerRadius &&
        newPos.z <= box.max.z + playerRadius
      ) {
        return true;
      }
    }
    return false;
  }

  // --- Animation & Physics Loop ---
  private animate = () => {
    this.frameId = requestAnimationFrame(this.animate);
    const delta = Math.min(this.clock.getDelta(), 0.1);

    // 1. Smooth Camera Damping
    this.cameraYaw = THREE.MathUtils.damp(this.cameraYaw, this.targetCameraYaw, 12, delta);
    this.cameraPitch = THREE.MathUtils.damp(this.cameraPitch, this.targetCameraPitch, 12, delta);

    // 2. Player Input Vector relative to camera yaw
    const forward = new THREE.Vector3(-Math.sin(this.cameraYaw), 0, -Math.cos(this.cameraYaw));
    const right = new THREE.Vector3(Math.cos(this.cameraYaw), 0, -Math.sin(this.cameraYaw));

    const moveDir = new THREE.Vector3();
    if (this.moveForward) moveDir.add(forward);
    if (this.moveBackward) moveDir.sub(forward);
    if (this.moveLeft) moveDir.sub(right);
    if (this.moveRight) moveDir.add(right);

    const isMoving = moveDir.lengthSq() > 0.001;
    if (isMoving) {
      moveDir.normalize();
      const currentSpeed = (this.isRunning ? this.playerSpeed * this.runMultiplier : this.playerSpeed);
      const targetAngle = Math.atan2(moveDir.x, moveDir.z);

      // Smooth rotate player towards direction of movement
      let diff = targetAngle - this.playerGroup.rotation.y;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.playerGroup.rotation.y += diff * 15 * delta;

      // Proposed horizontal displacement
      const stepX = moveDir.x * currentSpeed * delta;
      const stepZ = moveDir.z * currentSpeed * delta;

      const testPos = this.playerGroup.position.clone();
      testPos.x += stepX;
      testPos.z += stepZ;

      // Bounds clamping within city (-50 to 50)
      testPos.x = Math.max(-52, Math.min(52, testPos.x));
      testPos.z = Math.max(-52, Math.min(52, testPos.z));

      // Separate axis collision check for smooth sliding against walls
      const canMoveX = !this.checkCollision(new THREE.Vector3(testPos.x, testPos.y, this.playerGroup.position.z));
      const canMoveZ = !this.checkCollision(new THREE.Vector3(this.playerGroup.position.x, testPos.y, testPos.z));

      if (canMoveX) this.playerGroup.position.x = testPos.x;
      if (canMoveZ) this.playerGroup.position.z = testPos.z;

      // Footstep sound
      this.footstepTimer += delta * (this.isRunning ? 1.6 : 1.0);
      if (this.footstepTimer > 0.35 && this.isGrounded) {
        this.footstepTimer = 0;
        soundManager.playFootstep();
      }

      // Procedural limb swinging animation (Roblox style)
      this.limbAngle += delta * (this.isRunning ? 18 : 11);
      const swing = Math.sin(this.limbAngle) * 0.75;
      this.leftLeg.rotation.x = swing;
      this.rightLeg.rotation.x = -swing;
      this.leftArm.rotation.x = -swing * 0.8;
      this.rightArm.rotation.x = swing * 0.8;
    } else {
      // Idle return to neutral
      this.leftLeg.rotation.x = THREE.MathUtils.damp(this.leftLeg.rotation.x, 0, 10, delta);
      this.rightLeg.rotation.x = THREE.MathUtils.damp(this.rightLeg.rotation.x, 0, 10, delta);
      this.leftArm.rotation.x = THREE.MathUtils.damp(this.leftArm.rotation.x, 0, 10, delta);
      this.rightArm.rotation.x = THREE.MathUtils.damp(this.rightArm.rotation.x, 0, 10, delta);
    }

    // 3. Jump and Gravity Physics
    const gravity = -32;
    if (this.requestJump && this.isGrounded) {
      this.playerVelocity.y = 11;
      this.isGrounded = false;
      this.requestJump = false;
      soundManager.playJump();
    }

    this.playerVelocity.y += gravity * delta;
    this.playerGroup.position.y += this.playerVelocity.y * delta;

    if (this.playerGroup.position.y <= 0) {
      this.playerGroup.position.y = 0;
      this.playerVelocity.y = 0;
      this.isGrounded = true;
    }

    // 4. Third-person Camera Follow
    const cameraTargetY = this.playerGroup.position.y + 1.8;
    const camX = this.playerGroup.position.x + Math.sin(this.cameraYaw) * Math.cos(this.cameraPitch) * this.cameraDistance;
    const camY = cameraTargetY + Math.sin(this.cameraPitch) * this.cameraDistance;
    const camZ = this.playerGroup.position.z + Math.cos(this.cameraYaw) * Math.cos(this.cameraPitch) * this.cameraDistance;

    this.camera.position.set(camX, camY, camZ);
    this.camera.lookAt(this.playerGroup.position.x, cameraTargetY, this.playerGroup.position.z);

    // 5. Rotate Ferris Wheel
    if (this.ferrisWheelGroup) {
      this.ferrisWheelGroup.rotation.z += delta * 0.25;
    }

    // 6. Animate Coins & Check Pickup
    const pPos = this.playerGroup.position;
    this.coins.forEach((c) => {
      if (!c.collected) {
        c.mesh.rotation.y += delta * 3;
        c.mesh.position.y = 1.2 + Math.sin(this.clock.elapsedTime * 3 + c.id) * 0.2;

        const dist = c.mesh.position.distanceTo(pPos);
        if (dist < 1.7) {
          c.collected = true;
          this.scene.remove(c.mesh);
          soundManager.playCoin();
          this.callbacks.onCoinCollected(c.id, this.coins.filter(coin => coin.collected).length);
        }
      }
    });

    // 7. Check Proximity to NPCs & Animate them
    let nearestArea: AreaId | null = null;
    let nearestDist = Infinity;

    this.npcs.forEach((npc) => {
      // Gentle idle breathing
      npc.group.position.y = Math.sin(this.clock.elapsedTime * 2.5 + npc.group.position.x) * 0.05;

      const d = npc.group.position.distanceTo(pPos);
      if (d < 4.2 && d < nearestDist) {
        nearestDist = d;
        nearestArea = npc.areaId;
      }
    });

    if (nearestArea !== this.currentNearArea) {
      this.currentNearArea = nearestArea;
      this.callbacks.onNearNPC(nearestArea);
    }

    // 8. Player position callback for minimap
    if (this.callbacks.onPlayerPositionUpdate) {
      this.callbacks.onPlayerPositionUpdate({
        x: this.playerGroup.position.x,
        z: this.playerGroup.position.z,
        heading: this.playerGroup.rotation.y,
      });
    }

    // Render Scene
    this.renderer.render(this.scene, this.camera);
  };

  private onResize = () => {
    if (!this.container) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  public dispose() {
    cancelAnimationFrame(this.frameId);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    this.renderer.dispose();
  }
}
