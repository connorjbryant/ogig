// src/js/modules/footer-three.js
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

export function initFooterThree($) {
  const $container = $('#footer-logo-3d');
  if (!$container.length) return;

  // Prevent double init
  if ($container.data('footerThreeInit') === 'done') {
    return;
  }
  $container.data('footerThreeInit', 'done');

  const container = $container[0];
  const $canvas = $container.find('canvas.webgl');
  if (!$canvas.length) return;

  const canvas = $canvas[0];
  const $spinButton = $container.find('.footer-logo-rotate');

  // — Scene —
  const scene = new THREE.Scene();
  scene.background = null;

  // — Responsive Camera
  const viewSize = 10;
  let width = container.clientWidth || 260;   // fallback width if 0
  let height = container.clientHeight || 120; // fallback height if 0
  let aspect = width / height;

  const camera = new THREE.OrthographicCamera(
    -viewSize * aspect / 2,
     viewSize * aspect / 2,
     viewSize / 2,
    -viewSize / 2,
    0.1,
    100
  );
  camera.position.z = 30;

  // — Lighting —
  scene.add(new THREE.AmbientLight(0xffffff, 0.95));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.85);
  dirLight.position.set(6, 10, 15);
  scene.add(dirLight);

  // — Materials —
  const WHITE = 0xffffff;
  const BLACK = 0x111111;
  const whiteMat = new THREE.MeshBasicMaterial({ color: WHITE });
  const blackMat = new THREE.MeshBasicMaterial({ color: BLACK });

  // — Logo Group —
  const logoGroup = new THREE.Group();
  logoGroup.scale.set(0.9, 0.9, 0.9);
  scene.add(logoGroup);

  let craneGroup = null;

  // --- Spin state (for button) ---
  let spinActive = false;
  let spinElapsed = 0;
  const SPIN_DURATION = 2.4; // seconds for a full 360°
  const BASE_Y_ROT = 0;      // front-on orientation

  // — Load Font & Build Logo —
  const loader = new FontLoader();
  loader.load(
    '/wp-content/themes/ogig/assets/fonts/Science Gothic_Regular.json',
    (font) => {
      const getWidth = (geom) => {
        geom.computeBoundingBox();
        return geom.boundingBox.max.x - geom.boundingBox.min.x;
      };

      const letterSize = 4.0;
      const letterHeight = 0.05;

      // ogig Letters
      const tGeom = new TextGeometry('I', {
        font,
        size: letterSize,
        height: letterHeight,
        depth: 0.5,
        bevelEnabled: false
      });
      const lGeom = new TextGeometry('L', {
        font,
        size: letterSize,
        height: letterHeight,
        depth: 0.5,
        bevelEnabled: false
      });
      const kGeom = new TextGeometry('K', {
        font,
        size: letterSize,
        height: letterHeight,
        depth: 0.5,
        bevelEnabled: false
      });

      // Extend T stem a bit
      tGeom.computeBoundingBox();
      const tTop = tGeom.boundingBox.max.y;
      tGeom.translate(0, -tTop, 0);
      tGeom.scale(1, 1.12, 1);
      tGeom.translate(0, tTop, 0);

      const tWidth = getWidth(tGeom);
      const lWidth = getWidth(lGeom);
      const kWidth = getWidth(kGeom);
      const spacing = 0.7;

      const tMesh = new THREE.Mesh(tGeom, whiteMat);
      const lMesh = new THREE.Mesh(lGeom, whiteMat);
      const kMesh = new THREE.Mesh(kGeom, whiteMat);

      // Center letters horizontally
      tGeom.computeBoundingBox();
      lGeom.computeBoundingBox();
      kGeom.computeBoundingBox();

      tMesh.position.x = -tGeom.boundingBox.min.x;
      lMesh.position.x = -lGeom.boundingBox.min.x;
      kMesh.position.x = -kGeom.boundingBox.min.x;

      const baseY = -0.3;
      tMesh.position.y = baseY;
      lMesh.position.y = baseY - 0.4;
      kMesh.position.y = baseY - 0.4;

      tMesh.position.x += 0;
      lMesh.position.x += tWidth + spacing;
      kMesh.position.x += tWidth + spacing + lWidth + spacing;

      const ogigGroup = new THREE.Group();
      ogigGroup.add(tMesh, lMesh, kMesh);

      // Center ogig horizontally
      const ogigBox = new THREE.Box3().setFromObject(ogigGroup);
      ogigGroup.position.x -= ogigBox.getCenter(new THREE.Vector3()).x;

      logoGroup.add(ogigGroup);

      const ogigTop = ogigBox.max.y;
      const ogigBottom = ogigBox.min.y;
      const ogigWidthTotal = ogigBox.max.x - ogigBox.min.x;

      // — Crane (no cable/weight) —
      craneGroup = new THREE.Group();
      logoGroup.add(craneGroup);

      const beamMargin = 1.6;
      const beamWidth = ogigWidthTotal + beamMargin * 2;
      const beamHeight = 0.85;
      const beamDepth = 0.65;
      const beamY = ogigTop + beamHeight / 2;

      const beam = new THREE.Mesh(
        new THREE.BoxGeometry(beamWidth, beamHeight, beamDepth),
        whiteMat
      );
      beam.position.set(0, beamY, 0.3);
      craneGroup.add(beam);

      // Caps
      const capGeom = new THREE.ConeGeometry(0.48, 1.0, 12);
      const leftCap = new THREE.Mesh(capGeom, whiteMat);
      leftCap.rotation.z = Math.PI / 2;
      leftCap.position.set(-beamWidth / 2 - 0.25, beamY, 0.32);
      const rightCap = leftCap.clone();
      rightCap.rotation.z = -Math.PI / 2;
      rightCap.position.x = beamWidth / 2 + 0.25;
      craneGroup.add(leftCap, rightCap);

      // Holes
      const holeCount = 8;
      const marginX = 1.4;
      const usable = beamWidth - 2 * marginX;
      const step = usable / (holeCount - 1);
      for (let i = 0; i < holeCount; i++) {
        const x = -beamWidth / 2 + marginX + i * step;
        const hole = new THREE.Mesh(
          new THREE.BoxGeometry(0.8, 0.35, beamDepth + 0.4),
          blackMat
        );
        hole.position.set(x, beamY, 0.32);
        craneGroup.add(hole);
      }

      // — PRECISION text —
      const precGeom = new TextGeometry('PRECISION', {
        font,
        size: 1.2,
        height: 0.03,
        depth: 0.5,
        bevelEnabled: false
      });
      precGeom.computeBoundingBox();
      const precWidth = precGeom.boundingBox.max.x - precGeom.boundingBox.min.x;

      const precision = new THREE.Mesh(precGeom, whiteMat);
      precision.position.set(-precWidth / 2, ogigBottom - 1.6, 0.35);
      logoGroup.add(precision);

      // — FINAL POSITIONING —
      const finalBox = new THREE.Box3().setFromObject(logoGroup);
      const center   = finalBox.getCenter(new THREE.Vector3());
      const size     = finalBox.getSize(new THREE.Vector3());

      // Center in world
      logoGroup.position.sub(center);

      // Right align in view
      const marginRight = 0.6;
      const aspectNow   = width / height;
      const viewRight   = (viewSize * aspectNow) / 2;
      const currentMaxX = size.x * 0.5;

      logoGroup.position.x += (viewRight - marginRight) - currentMaxX;

      // re-align after layout settles
      requestAnimationFrame(() => requestAnimationFrame(onResize));
    }
  );

  // — Renderer —
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height);

  const clock = new THREE.Clock();

  // — Spin button click handler —
  if ($spinButton.length) {
    $spinButton.on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (spinActive) return; // ignore while mid-spin
      spinActive = true;
      spinElapsed = 0;
      $spinButton.addClass('is-spinning');
    });
  }

  // — Animation Loop —
  const animate = () => {
    const delta = clock.getDelta();

    if (logoGroup) {
      if (spinActive) {
        spinElapsed += delta;
        let progress = spinElapsed / SPIN_DURATION;
        if (progress >= 1) {
          progress = 1;
          spinActive = false;
          logoGroup.rotation.y = BASE_Y_ROT;
          $spinButton.removeClass('is-spinning');
        } else {
          const angle = BASE_Y_ROT + progress * Math.PI * 2;
          logoGroup.rotation.y = angle;
        }
      } else {
        // keep facing front between spins
        logoGroup.rotation.y += (BASE_Y_ROT - logoGroup.rotation.y) * 0.1;
      }
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };
  animate();

  // — Resize Handler —
  const onResize = () => {
    width = container.clientWidth || 260;
    height = container.clientHeight || 120;
    aspect = width / height;

    camera.left   = -viewSize * aspect / 2;
    camera.right  =  viewSize * aspect / 2;
    camera.top    =  viewSize / 2;
    camera.bottom = -viewSize / 2;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);

    if (logoGroup) {
      const prevRotY = logoGroup.rotation.y;
      logoGroup.rotation.y = 0;

      const finalBox = new THREE.Box3().setFromObject(logoGroup);
      const size = finalBox.getSize(new THREE.Vector3());
      const viewRight = (viewSize * aspect) / 2;
      const currentMaxX = size.x * 0.5;

      logoGroup.position.x = (viewRight - 0.6) - currentMaxX;

      logoGroup.rotation.y = prevRotY;
    }
  };

  $(window).on('resize', onResize);
  onResize();
}