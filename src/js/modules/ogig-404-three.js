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

  // -------------------------
  // Option A: Cursor affordance
  // -------------------------
  const canHover = window.matchMedia?.('(hover: hover) and (pointer: fine)')?.matches;
  if (canHover) canvas.style.cursor = 'grab';

  const container = $stage[0];
  const getSize = () => ({
    w: Math.max(1, container.clientWidth || 700),
    h: Math.max(1, container.clientHeight || 420),
  });

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  // Scene + Camera
  const scene = new THREE.Scene();
  const { w, h } = getSize();
  const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 200);
  camera.position.set(0, 1.1, 10);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.78));
  const key = new THREE.DirectionalLight(0xffffff, 1.05);
  key.position.set(6, 8, 6);
  scene.add(key);

  // Materials
  const metalMat = new THREE.MeshStandardMaterial({
    color: 0xd7dde3,
    metalness: 1.0,
    roughness: 0.22,
  });
  const darkMat = new THREE.MeshStandardMaterial({
    color: 0x111318,
    metalness: 0.45,
    roughness: 0.75,
  });

  // ---- Sign texture ----
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

    // base yellow
    ctx.fillStyle = '#f6c400';
    ctx.fillRect(0, 0, c.width, c.height);

    // stripes
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.translate(c.width * 0.10, 0);
    ctx.rotate((-20 * Math.PI) / 180);
    ctx.fillStyle = '#111111';

    const stripeW = Math.round(c.width * 0.05);
    const gap = Math.round(c.width * 0.04);
    for (let x = -c.width; x < c.width * 2; x += stripeW + gap) {
      ctx.fillRect(x, -c.height, stripeW, c.height * 3);
    }
    ctx.restore();
    ctx.globalAlpha = 1;

    // border
    ctx.lineWidth = Math.round(c.width * 0.02);
    ctx.strokeStyle = '#111111';
    ctx.strokeRect(innerX, innerY, innerW, innerH);

    const fitText = (text, maxWidth, startPx, minPx, weight = 900) => {
      let px = startPx;
      while (px > minPx) {
        ctx.font = `${weight} ${px}px Arial, sans-serif`;
        if (ctx.measureText(text).width <= maxWidth) break;
        px -= 4;
      }
      return px;
    };

    // Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#111111';

    const title = 'UNDER CONSTRUCTION';
    const titlePx = fitText(title, innerW * 0.92, 170, 84, 900);
    ctx.font = `900 ${titlePx}px Arial, sans-serif`;
    ctx.fillText(title, c.width / 2, innerY + innerH * 0.42);

    // Subtitle
    const sub = 'Page not found.';
    const subPx = fitText(sub, innerW * 0.84, 72, 34, 800);
    ctx.globalAlpha = 0.95;
    ctx.font = `800 ${subPx}px Arial, sans-serif`;
    ctx.fillText(sub, c.width / 2, innerY + innerH * 0.60);
    ctx.globalAlpha = 1;

    // Tag
    ctx.globalAlpha = 0.65;
    ctx.font = `900 ${Math.round(c.width * 0.03)}px Arial, sans-serif`;
    ctx.fillText('OGIG Factory Direct', c.width / 2, innerY + innerH * 0.78);
    ctx.globalAlpha = 1;

    // gloss
    const grad = ctx.createLinearGradient(0, 0, 0, c.height);
    grad.addColorStop(0, 'rgba(255,255,255,0.22)');
    grad.addColorStop(0.32, 'rgba(255,255,255,0.07)');
    grad.addColorStop(1, 'rgba(0,0,0,0.12)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, c.width, c.height);

    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy?.() || 1;
    tex.needsUpdate = true;
    return tex;
  }

  const signTex = makeSignTexture();
  const signFaceMat = new THREE.MeshStandardMaterial({
    map: signTex,
    metalness: 0.06,
    roughness: 0.35,
  });

  // Root group
  const root = new THREE.Group();
  scene.add(root);

  // Bar + mounts
  const bar = new THREE.Mesh(new THREE.BoxGeometry(9, 0.22, 0.22), darkMat);
  bar.position.set(0, 2.45, 0);
  root.add(bar);

  const mountL = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.35, 0.35), darkMat);
  const mountR = mountL.clone();
  mountL.position.set(-3.2, 2.28, 0);
  mountR.position.set(3.2, 2.28, 0);
  root.add(mountL, mountR);

  // Sign swing pivot
  const anchorY = 2.15;
  const signGroup = new THREE.Group();
  signGroup.position.set(0, anchorY, 0);
  root.add(signGroup);

  const signW = 7.2;
  const signH = 3.2;

  const frame = new THREE.Mesh(new THREE.BoxGeometry(signW + 0.22, signH + 0.22, 0.28), darkMat);
  frame.position.set(0, -signH / 2 - 0.45, -0.10);
  signGroup.add(frame);

  const face = new THREE.Mesh(new THREE.PlaneGeometry(signW, signH), signFaceMat);
  face.position.set(0, -signH / 2 - 0.45, 0.06);
  signGroup.add(face);

  // Bolts
  const boltGeom = new THREE.CylinderGeometry(0.10, 0.10, 0.14, 16);
  const boltL = new THREE.Mesh(boltGeom, metalMat);
  const boltR = boltL.clone();
  boltL.rotation.x = Math.PI / 2;
  boltR.rotation.x = Math.PI / 2;

  const boltY = face.position.y + signH / 2 - 0.28;
  boltL.position.set(-signW / 2 + 0.65, boltY, 0.10);
  boltR.position.set(signW / 2 - 0.65, boltY, 0.10);
  signGroup.add(boltL, boltR);

  // Chains
  const chainGeom = new THREE.CylinderGeometry(0.06, 0.06, 2.0, 12);
  const chainL = new THREE.Mesh(chainGeom, metalMat);
  const chainR = chainL.clone();
  chainL.position.set(-3.2, 1.35, 0);
  chainR.position.set(3.2, 1.35, 0);
  root.add(chainL, chainR);

  // -------------------------
  // Interaction: drag to swing
  // -------------------------
  let isDown = false;
  let lastX = 0;
  let swingVel = 0;
  let swing = 0;

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const onDown = (e) => {
    isDown = true;
    lastX = e.clientX;

    if (canHover) canvas.style.cursor = 'grabbing';
  };

  const onMove = (e) => {
    if (!isDown) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;

    swingVel += dx * 0.0011;
    swingVel = clamp(swingVel, -0.08, 0.08);
  };

  const onUp = () => {
    isDown = false;
    if (canHover) canvas.style.cursor = 'grab';
  };

  canvas.addEventListener('pointerdown', onDown, { passive: true });
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerup', onUp, { passive: true });

  // -------------------------
  // Fit camera (bigger sign, stable)
  // -------------------------
  const baseRootPos = root.position.clone();
  const centerOffset = new THREE.Vector3(); // reused
  const box = new THREE.Box3();
  const sizeVec = new THREE.Vector3();
  const centerVec = new THREE.Vector3();

  function fitCameraToRoot() {
    // Reset root before measuring so we don't accumulate offsets
    root.position.copy(baseRootPos);

    box.setFromObject(root);
    box.getSize(sizeVec);
    box.getCenter(centerVec);

    // Center the assembly at origin (once per fit)
    centerOffset.copy(centerVec);
    root.position.sub(centerOffset);

    const { w: cw, h: ch } = getSize();
    const aspect = cw / ch;

    // Lower value = closer camera = bigger sign
    // Tweak these two if you want even bigger:
    const kWide = 0.95;
    const kTall = 1.10;

    const maxDim = Math.max(sizeVec.x, sizeVec.y);
    const k = aspect > 1.25 ? kWide : kTall;
    const dist = maxDim * k;

    camera.position.set(0, 1.0, dist);
    camera.lookAt(0, 0.7, 0);
  }

  // Resize
  function onResize() {
    const { w: nw, h: nh } = getSize();
    renderer.setSize(nw, nh, false);
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
    fitCameraToRoot();
  }

  window.addEventListener('resize', onResize);

  // IMPORTANT: initial sizing after layout settles (fixes “small until resize”)
  onResize();
  requestAnimationFrame(() => requestAnimationFrame(onResize));

  // -------------------------
  // Animate
  // -------------------------
  const clock = new THREE.Clock();

  // slightly stronger idle for first few seconds (affordance)
  const AFFORD_MS = 2800;
  const start = performance.now();

  function animate() {
    const dt = clock.getDelta();
    const t = clock.elapsedTime;

    if (!reduceMotion) {
      const afford = Math.max(0, 1 - (performance.now() - start) / AFFORD_MS);

      if (!isDown) {
        // mild sway; stronger briefly on load to hint interaction
        swingVel += Math.sin(t * 0.9) * (0.00003 + afford * 0.00008);
      }

      swing += swingVel;
      swingVel += (-swing) * 0.02;
      swingVel *= 0.985;
      swing = clamp(swing, -0.55, 0.55);
    } else {
      swing = 0;
      swingVel = 0;
    }

    signGroup.rotation.z = swing;
    chainL.rotation.z = swing * 0.65;
    chainR.rotation.z = swing * 0.65;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
}