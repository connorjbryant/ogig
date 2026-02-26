// src/js/modules/404-three.js
import * as THREE from 'three';

export function init404Three($) {
  const $stage = $('#ogig-404-3d');
  if (!$stage.length) return;
  if ($stage.data('three-init') === 'done') return;
  $stage.data('three-init', 'done');

  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

  const canvas = $stage.find('canvas.webgl')[0];
  if (!canvas) return;

  const container = $stage[0];
  const getSize = () => ({
    w: Math.max(1, container.clientWidth || 700),
    h: Math.max(1, container.clientHeight || 420),
  });

  // -----------------------
  // Renderer
  // -----------------------
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearAlpha(0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // -----------------------
  // Scene + Camera
  // -----------------------
  const scene = new THREE.Scene();

  // --- Sky gradient background ---
  function makeSkyTexture() {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 1024;
    const ctx = c.getContext('2d');

    const g = ctx.createLinearGradient(0, 0, 0, c.height);
    g.addColorStop(0.00, '#86ccff');
    g.addColorStop(0.55, '#d9f2ff');
    g.addColorStop(1.00, '#ffffff');

    ctx.fillStyle = g;
    ctx.fillRect(0, 0, c.width, c.height);

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }

  scene.background = makeSkyTexture();
  scene.fog = new THREE.FogExp2(0xd9f2ff, 0.028);

  const { w, h } = getSize();
  const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 200);
  camera.position.set(0, 2.2, 12);

  // -----------------------
  // Lights
  // -----------------------
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));

  const key = new THREE.DirectionalLight(0xffffff, 1.35);
  key.position.set(8, 10, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 35;
  key.shadow.camera.left = -12;
  key.shadow.camera.right = 12;
  key.shadow.camera.top = 12;
  key.shadow.camera.bottom = -12;
  key.shadow.bias = -0.00015;
  scene.add(key);

  const rim = new THREE.DirectionalLight(0xffffff, 0.55);
  rim.position.set(-10, 7, -8);
  scene.add(rim);

  // -----------------------
  // Materials
  // -----------------------
  const metalMat = new THREE.MeshStandardMaterial({
    color: 0xd7dde3,
    metalness: 0.9,
    roughness: 0.25,
  });

  const darkMat = new THREE.MeshStandardMaterial({
    color: 0x111318,
    metalness: 0.35,
    roughness: 0.78,
  });

  const safetyOrange = new THREE.MeshStandardMaterial({
    color: 0xff4a1a,
    metalness: 0.05,
    roughness: 0.78,
  });

  const concreteMat = new THREE.MeshStandardMaterial({
    color: 0x6f7780,
    metalness: 0.02,
    roughness: 0.95,
  });

  const dirtMat = new THREE.MeshStandardMaterial({
    color: 0x6a4a2f, // dirt
    metalness: 0.0,
    roughness: 0.98,
  });

  const grassMat = new THREE.MeshStandardMaterial({
    color: 0x2f7d3b, // grass
    metalness: 0.0,
    roughness: 0.95,
  });

  // -----------------------
  // Sign texture
  // -----------------------
  function makeSignTexture() {
    const c = document.createElement('canvas');
    c.width = 2048;
    c.height = 1024;
    const ctx = c.getContext('2d');

    const pad = Math.round(c.width * 0.06);
    const innerX = pad;
    const innerY = pad;
    const innerW = c.width - pad * 2;
    const innerH = c.height - pad * 2;

    // Base yellow
    ctx.fillStyle = '#f5c400';
    ctx.fillRect(0, 0, c.width, c.height);

    // Subtle diagonal caution bands
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.translate(c.width * 0.12, 0);
    ctx.rotate((-18 * Math.PI) / 180);
    ctx.fillStyle = '#111111';
    const stripeW = Math.round(c.width * 0.06);
    const gap = Math.round(c.width * 0.065);
    for (let x = -c.width; x < c.width * 2; x += stripeW + gap) {
      ctx.fillRect(x, -c.height, stripeW, c.height * 3);
    }
    ctx.restore();
    ctx.globalAlpha = 1;

    // Border
    ctx.lineWidth = Math.round(c.width * 0.02);
    ctx.strokeStyle = '#111111';
    ctx.strokeRect(innerX, innerY, innerW, innerH);

    // Inner panel
    ctx.save();
    ctx.globalAlpha = 0.10;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(innerX + 18, innerY + 18, innerW - 36, innerH - 36);
    ctx.restore();

    const fitText = (text, maxWidth, startPx, minPx, weight = 900) => {
      let px = startPx;
      while (px > minPx) {
        ctx.font = `${weight} ${px}px Arial, sans-serif`;
        if (ctx.measureText(text).width <= maxWidth) break;
        px -= 4;
      }
      return px;
    };

    ctx.textAlign = 'center';
    ctx.fillStyle = '#111111';

    // Big 404
    const code = '404';
    const codePx = fitText(code, innerW * 0.88, 240, 120, 900);
    ctx.font = `900 ${codePx}px Arial, sans-serif`;
    ctx.fillText(code, c.width / 2, innerY + innerH * 0.48);

    // UNDER CONSTRUCTION
    const title = 'UNDER CONSTRUCTION';
    const titlePx = fitText(title, innerW * 0.92, 120, 64, 900);
    ctx.font = `900 ${titlePx}px Arial, sans-serif`;
    ctx.fillText(title, c.width / 2, innerY + innerH * 0.72);

    // Tag line
    ctx.globalAlpha = 0.78;
    ctx.font = `800 ${Math.round(c.width * 0.028)}px Arial, sans-serif`;
    ctx.fillText('', c.width / 2, innerY + innerH * 0.86);
    ctx.globalAlpha = 1;

    // Gloss
    const grad = ctx.createLinearGradient(0, 0, 0, c.height);
    grad.addColorStop(0, 'rgba(255,255,255,0.18)');
    grad.addColorStop(0.35, 'rgba(255,255,255,0.06)');
    grad.addColorStop(1, 'rgba(0,0,0,0.12)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, c.width, c.height);

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy?.() || 1;
    tex.generateMipmaps = true;
    tex.needsUpdate = true;
    return tex;
  }

  const signTex = makeSignTexture();

  const signFaceMat = new THREE.MeshStandardMaterial({
    map: signTex,
    metalness: 0.03,
    roughness: 0.35,
    emissive: new THREE.Color(0x111111),
    emissiveIntensity: 0.08,
  });

  // -----------------------
  // Root group
  // -----------------------
  const root = new THREE.Group();
  scene.add(root);

  // -----------------------
  // Mini “island” base
  // -----------------------
  const island = new THREE.Group();
  root.add(island);

  // Concrete base
  const baseGeom = new THREE.CylinderGeometry(6.3, 6.8, 1.25, 48);
  const base = new THREE.Mesh(baseGeom, concreteMat);
  base.position.set(0, -2.35, 0);
  base.castShadow = true;
  base.receiveShadow = true;
  island.add(base);

  // Dirt top (disc)
  const dirtTop = new THREE.Mesh(new THREE.CylinderGeometry(5.65, 5.65, 0.26, 48), dirtMat);
  dirtTop.position.set(0, -1.70, 0);
  dirtTop.receiveShadow = true;
  island.add(dirtTop);

  // Grass rim (torus ring)
  const grassRing = new THREE.Mesh(new THREE.TorusGeometry(5.75, 0.35, 14, 72), grassMat);
  grassRing.position.set(0, -1.58, 0);
  grassRing.rotation.x = Math.PI / 2;
  grassRing.receiveShadow = true;
  island.add(grassRing);

  // Curb ring detail (thin dark edge)
  const curbRing = new THREE.Mesh(new THREE.TorusGeometry(6.12, 0.08, 12, 64), darkMat);
  curbRing.position.set(0, -1.55, 0);
  curbRing.rotation.x = Math.PI / 2;
  curbRing.receiveShadow = true;
  island.add(curbRing);

  // Shadow catcher
  const shadowPlane = new THREE.Mesh(
    new THREE.CircleGeometry(7.2, 64),
    new THREE.ShadowMaterial({ opacity: 0.22 })
  );
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.set(0, -1.57, 0);
  shadowPlane.receiveShadow = true;
  root.add(shadowPlane);

  // -----------------------
  // Props
  // -----------------------
  // Cones
  const coneGeom = new THREE.ConeGeometry(0.35, 1.05, 14);
  const conePositions = [
    [-2.2, -1.15, -2.2],
    [2.3, -1.15, -2.0],
    [-0.2, -1.15, 2.4],
  ];
  conePositions.forEach(([x, y, z]) => {
    const cone = new THREE.Mesh(coneGeom, safetyOrange);
    cone.position.set(x, y, z);
    cone.castShadow = true;
    cone.receiveShadow = true;
    island.add(cone);
  });

  // Barrier plank
  const barrier = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.9, 0.12), safetyOrange);
  barrier.position.set(0, -1.25, -3.4);
  barrier.rotation.y = 0.12;
  barrier.castShadow = true;
  barrier.receiveShadow = true;
  island.add(barrier);

  // -----------------------
  // Cartoon construction sign (rectangle + single stake in ground)
  // -----------------------
  const signGroup = new THREE.Group();
  signGroup.position.set(0, 0.55, 0.35);
  root.add(signGroup);

  // Stake (vertical rectangle)
  const stake = new THREE.Mesh(new THREE.BoxGeometry(0.28, 3.2, 0.22), darkMat);
  stake.position.set(0, -0.55, 0);
  stake.castShadow = true;
  stake.receiveShadow = true;
  signGroup.add(stake);

  // Sign board
  const signW = 6.8;
  const signH = 3.5;

  const board = new THREE.Group();
  board.position.set(0, 0.95, 0.18);
  board.rotation.x = -0.07;
  signGroup.add(board);

  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(signW + 0.24, signH + 0.24, 0.28),
    darkMat
  );
  frame.position.set(0, 0.0, -0.10);
  frame.castShadow = true;
  frame.receiveShadow = true;
  board.add(frame);

  const face = new THREE.Mesh(new THREE.PlaneGeometry(signW, signH), signFaceMat);
  face.position.set(0, 0.0, 0.06);
  board.add(face);

  // Bolts
  const boltGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.14, 16);
  const boltL = new THREE.Mesh(boltGeom, metalMat);
  const boltR = boltL.clone();
  boltL.rotation.x = Math.PI / 2;
  boltR.rotation.x = Math.PI / 2;
  boltL.position.set(-signW / 2 + 0.6, signH / 2 - 0.28, 0.10);
  boltR.position.set(signW / 2 - 0.6, signH / 2 - 0.28, 0.10);
  boltL.castShadow = true;
  boltR.castShadow = true;
  board.add(boltL, boltR);

  // Small mounting tabs (optional but helps it feel “attached”)
  const tabGeom = new THREE.BoxGeometry(0.55, 0.22, 0.25);
  const tabTop = new THREE.Mesh(tabGeom, darkMat);
  const tabBot = tabTop.clone();
  tabTop.position.set(0, 0.85, -0.02);
  tabBot.position.set(0, -0.85, -0.02);
  tabTop.castShadow = true;
  tabBot.castShadow = true;
  board.add(tabTop, tabBot);

  // -----------------------
  // World bubble
  // -----------------------
  const bubbleGeom = new THREE.SphereGeometry(9.2, 44, 36);
  const bubbleMat = new THREE.MeshPhysicalMaterial({
    color: 0xbfe6ff,
    transparent: true,
    opacity: 0.10,
    roughness: 0.12,
    metalness: 0.0,
    transmission: 0.65,
    thickness: 1.0,
    ior: 1.25,
    clearcoat: 0.6,
    clearcoatRoughness: 0.25,
  });

  const bubble = new THREE.Mesh(bubbleGeom, bubbleMat);
  bubble.position.set(0, -0.2, 0);
  root.add(bubble);

  // -----------------------
  // Camera fitting
  // -----------------------
  const baseRootPos = root.position.clone();
  const centerOffset = new THREE.Vector3();
  const box = new THREE.Box3();
  const sizeVec = new THREE.Vector3();
  const centerVec = new THREE.Vector3();

  function fitCameraToRoot() {
    root.position.copy(baseRootPos);

    box.setFromObject(root);
    box.getSize(sizeVec);
    box.getCenter(centerVec);

    centerOffset.copy(centerVec);
    root.position.sub(centerOffset);

    const { w: cw, h: ch } = getSize();
    const aspect = cw / ch;

    const kWide = 0.72;
    const kTall = 0.88;
    const maxDim = Math.max(sizeVec.x, sizeVec.y);
    const k = aspect > 1.25 ? kWide : kTall;
    const dist = Math.max(9.5, maxDim * k);

    camera.position.set(0, 2.25, dist);
    camera.lookAt(0, 0.8, 0);
  }

  function onResize() {
    const { w: nw, h: nh } = getSize();
    renderer.setSize(nw, nh, false);
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
    fitCameraToRoot();
  }

  window.addEventListener('resize', onResize);

  window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  onResize();
  requestAnimationFrame(() => requestAnimationFrame(onResize));

  // -----------------------
  // Intro Spin (one-time, slower + lands correctly)
  // -----------------------
  let introSpinProgress = 0;
  const introSpinDuration = 3.2;        // slower (was 2.2)
  const introSpinAmount = Math.PI * 0.6; // ~108° rotation

  const clock = new THREE.Clock();

  // Mouse tracking (-1 to +1)
  let mouse = new THREE.Vector2(0, 0);
  let smoothedMouse = new THREE.Vector2(0, 0); // for damping

  const tiltStrength = 0.22;     // how much overall rotation (lower = subtler)
  const lerpSpeed = 0.08;        // 0.04–0.12 range; lower = smoother/lazier

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // Start slightly turned so it rotates into view
  root.rotation.y = -introSpinAmount;

  function animate() {
    const dt = clock.getDelta();
    const t = clock.elapsedTime;

    if (!reduceMotion) {
      // One-time intro spin
      if (introSpinProgress < 1) {
        introSpinProgress += dt / introSpinDuration;
        if (introSpinProgress > 1) introSpinProgress = 1;
        const eased = easeOutCubic(introSpinProgress);
        root.rotation.y = -introSpinAmount * (1 - eased);
      }

      // Smooth mouse
      smoothedMouse.x += (mouse.x - smoothedMouse.x) * lerpSpeed;
      smoothedMouse.y += (mouse.y - smoothedMouse.y) * lerpSpeed;

      // Tilt whole island + subtle extra on sign
      const tiltAmt = 0.18;  // reduced from 0.22 — less aggressive
      island.rotation.y = smoothedMouse.x * tiltAmt;
      island.rotation.x = smoothedMouse.y * -tiltAmt;

      signGroup.rotation.y = smoothedMouse.x * tiltAmt * 1.5;  // sign leans a bit more
      signGroup.rotation.x = smoothedMouse.y * -tiltAmt * 1.2;

      // Optional tiny slide for depth
      // island.position.x = smoothedMouse.x * 0.15;
      // island.position.z = smoothedMouse.y * -0.15;

      // Bob
      const bob = Math.sin(t * 0.9) * 0.03;
      island.position.y = bob * 0.35;

      // Sign sway
      board.rotation.z = Math.sin(t * 0.75) * 0.035;
    } else {
      island.position.y = 0;
      board.rotation.z = 0;
      island.rotation.set(0, 0, 0);
      signGroup.rotation.set(0, 0, 0);
    }

    fitCameraToRoot();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
}