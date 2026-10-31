import * as THREE from 'three';
import {
  createLatteArtTexture,
  createBelgianLogoTexture,
  createWaffleTextures,
  createChocolateBlockTexture
} from './proceduralTextures';

// Helper to create single roasted coffee bean geometry
function createCoffeeBean(): THREE.Group {
  const beanGroup = new THREE.Group();
  
  // Outer bean body (stretched ellipsoid)
  const beanGeo = new THREE.SphereGeometry(0.12, 16, 16);
  beanGeo.scale(1, 1.4, 0.65);

  const beanMat = new THREE.MeshStandardMaterial({
    color: 0x3d1d0c,
    roughness: 0.65,
    metalness: 0.05,
  });

  const beanMesh = new THREE.Mesh(beanGeo, beanMat);
  beanMesh.castShadow = true;
  beanMesh.receiveShadow = true;
  beanGroup.add(beanMesh);

  // Center seam indent (dark line)
  const seamGeo = new THREE.BoxGeometry(0.015, 0.32, 0.04);
  const seamMat = new THREE.MeshStandardMaterial({
    color: 0x180b05,
    roughness: 0.9,
  });
  const seamMesh = new THREE.Mesh(seamGeo, seamMat);
  seamMesh.position.z = 0.06;
  beanGroup.add(seamMesh);

  return beanGroup;
}

// 1. BELGIAN COFFEE CUP & SAUCER COMPOSITE MODEL
export function createCoffeeCupModel(isSoftwareGl: boolean) {
  const root = new THREE.Group();
  root.name = 'coffee-cup-root';

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xd4a359,
    metalness: 0.85,
    roughness: 0.2,
  });

  const porcelainColors: Record<string, number> = {
    green: 0x0f2b1d, // Signature Belgian Dark Green
    cream: 0xf4eee1, // Belgian Vanilla Cream
    noir: 0x1a1a1a,  // Velvet Black
    burgundy: 0x4a121a // Royal Bordeaux
  };

  const cupMat = new THREE.MeshStandardMaterial({
    color: porcelainColors.green,
    roughness: 0.25,
    metalness: 0.1,
  });

  // Saucer
  const saucerPoints: THREE.Vector2[] = [];
  saucerPoints.push(new THREE.Vector2(0, 0));
  saucerPoints.push(new THREE.Vector2(0.9, 0.02));
  saucerPoints.push(new THREE.Vector2(1.3, 0.1));
  saucerPoints.push(new THREE.Vector2(1.5, 0.2));
  saucerPoints.push(new THREE.Vector2(1.48, 0.18));
  saucerPoints.push(new THREE.Vector2(1.25, 0.08));
  saucerPoints.push(new THREE.Vector2(0.8, 0.02));
  saucerPoints.push(new THREE.Vector2(0, 0.02));

  const saucerGeo = new THREE.LatheGeometry(saucerPoints, 36);
  const saucerMesh = new THREE.Mesh(saucerGeo, cupMat);
  saucerMesh.castShadow = true;
  saucerMesh.receiveShadow = true;
  saucerMesh.name = 'part-saucer';

  // Saucer Gold Rim
  const saucerRimGeo = new THREE.TorusGeometry(1.49, 0.015, 12, 48);
  saucerRimGeo.rotateX(Math.PI / 2);
  const saucerRim = new THREE.Mesh(saucerRimGeo, goldMat);
  saucerRim.position.y = 0.19;
  saucerMesh.add(saucerRim);

  root.add(saucerMesh);

  // Cup Assembly Group
  const cupGroup = new THREE.Group();
  cupGroup.position.y = 0.08;
  cupGroup.name = 'part-cup-body';

  // Cup Curved Profile (Lathe)
  const cupPoints: THREE.Vector2[] = [];
  cupPoints.push(new THREE.Vector2(0.48, 0));
  cupPoints.push(new THREE.Vector2(0.55, 0.05));
  cupPoints.push(new THREE.Vector2(0.68, 0.35));
  cupPoints.push(new THREE.Vector2(0.82, 0.75));
  cupPoints.push(new THREE.Vector2(0.88, 1.05));
  cupPoints.push(new THREE.Vector2(0.85, 1.05));
  cupPoints.push(new THREE.Vector2(0.8, 0.75));
  cupPoints.push(new THREE.Vector2(0.64, 0.35));
  cupPoints.push(new THREE.Vector2(0.48, 0.05));
  cupPoints.push(new THREE.Vector2(0, 0.05));

  const cupGeo = new THREE.LatheGeometry(cupPoints, 36);
  const cupBodyMesh = new THREE.Mesh(cupGeo, cupMat);
  cupBodyMesh.castShadow = true;
  cupBodyMesh.receiveShadow = true;
  cupGroup.add(cupBodyMesh);

  // Gold Rim Ring on Cup Lip
  const cupRimGeo = new THREE.TorusGeometry(0.865, 0.02, 12, 48);
  cupRimGeo.rotateX(Math.PI / 2);
  const cupRim = new THREE.Mesh(cupRimGeo, goldMat);
  cupRim.position.y = 1.05;
  cupGroup.add(cupRim);

  // Handle (Torus)
  const handleGeo = new THREE.TorusGeometry(0.32, 0.07, 16, 28, Math.PI * 1.15);
  handleGeo.rotateZ(-Math.PI / 3);
  handleGeo.scale(0.8, 1.3, 1);
  const handleMesh = new THREE.Mesh(handleGeo, cupMat);
  handleMesh.position.set(0.86, 0.58, 0);
  handleMesh.castShadow = true;
  cupGroup.add(handleMesh);

  // Logo Decal on front
  const logoTex = createBelgianLogoTexture();
  const logoGeo = new THREE.PlaneGeometry(0.45, 0.45);
  const logoMat = new THREE.MeshBasicMaterial({
    map: logoTex,
    transparent: true,
    opacity: 0.95,
  });
  const logoMesh = new THREE.Mesh(logoGeo, logoMat);
  logoMesh.position.set(0, 0.55, 0.78);
  logoMesh.rotation.x = -0.15;
  cupGroup.add(logoMesh);

  // Coffee Liquid with Latte Art
  const latteArtTex = createLatteArtTexture();
  const liquidGeo = new THREE.CircleGeometry(0.81, 32);
  liquidGeo.rotateX(-Math.PI / 2);
  const liquidMat = new THREE.MeshStandardMaterial({
    map: latteArtTex,
    roughness: 0.35,
    metalness: 0.05,
  });
  const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
  liquidMesh.position.y = 0.95;
  liquidMesh.name = 'part-liquid';
  cupGroup.add(liquidMesh);

  root.add(cupGroup);

  // Golden Teaspoon resting on saucer
  const spoonGroup = new THREE.Group();
  spoonGroup.name = 'part-spoon';
  const spoonStemGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.4, 12);
  const spoonStem = new THREE.Mesh(spoonStemGeo, goldMat);
  spoonStem.rotation.z = Math.PI / 2.3;
  spoonStem.rotation.y = 0.4;
  spoonStem.position.set(0.65, 0.16, 0.6);
  spoonStem.castShadow = true;
  spoonGroup.add(spoonStem);

  const spoonBowlGeo = new THREE.SphereGeometry(0.12, 16, 12);
  spoonBowlGeo.scale(1.4, 0.4, 0.9);
  const spoonBowl = new THREE.Mesh(spoonBowlGeo, goldMat);
  spoonBowl.position.set(0.1, 0.1, 0.85);
  spoonBowl.rotation.y = 0.4;
  spoonGroup.add(spoonBowl);
  root.add(spoonGroup);

  // Roasted Coffee Beans on saucer
  const beansGroup = new THREE.Group();
  beansGroup.name = 'part-beans';
  const beanPositions = [
    { x: -0.9, y: 0.12, z: 0.4, rot: [0.3, 0.7, 0.2] },
    { x: -0.8, y: 0.11, z: 0.65, rot: [-0.2, 1.2, 0.5] },
    { x: -1.05, y: 0.13, z: -0.1, rot: [0.1, 2.4, -0.4] },
    { x: 0.75, y: 0.11, z: -0.85, rot: [-0.4, 0.9, 0.3] },
    { x: 0.95, y: 0.12, z: -0.6, rot: [0.5, -0.8, 0.2] },
  ];

  beanPositions.forEach((pos) => {
    const bean = createCoffeeBean();
    bean.position.set(pos.x, pos.y, pos.z);
    bean.rotation.set(pos.rot[0], pos.rot[1], pos.rot[2]);
    beansGroup.add(bean);
  });
  root.add(beansGroup);

  // Procedural Steam Particle System
  const steamCount = isSoftwareGl ? 18 : 36;
  const steamGeo = new THREE.BufferGeometry();
  const steamPos = new Float32Array(steamCount * 3);
  const steamVel = new Float32Array(steamCount * 3);

  for (let i = 0; i < steamCount; i++) {
    steamPos[i * 3] = (Math.random() - 0.5) * 0.4;
    steamPos[i * 3 + 1] = 1.05 + Math.random() * 0.9;
    steamPos[i * 3 + 2] = (Math.random() - 0.5) * 0.4;

    steamVel[i * 3] = (Math.random() - 0.5) * 0.005;
    steamVel[i * 3 + 1] = 0.008 + Math.random() * 0.012;
    steamVel[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
  }
  steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPos, 3));

  // Steam particle canvas dot
  const dotCanvas = document.createElement('canvas');
  dotCanvas.width = 64;
  dotCanvas.height = 64;
  const dCtx = dotCanvas.getContext('2d')!;
  const dGrad = dCtx.createRadialGradient(32, 32, 0, 32, 32, 30);
  dGrad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
  dGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.25)');
  dGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  dCtx.fillStyle = dGrad;
  dCtx.fillRect(0, 0, 64, 64);
  const dotTexture = new THREE.CanvasTexture(dotCanvas);

  const steamMat = new THREE.PointsMaterial({
    map: dotTexture,
    size: 0.35,
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const steamPointsMesh = new THREE.Points(steamGeo, steamMat);
  steamPointsMesh.name = 'part-steam';
  root.add(steamPointsMesh);

  return {
    group: root,
    update: (delta: number, explodedAmount: number) => {
      // Exploded separation
      cupGroup.position.y = 0.08 + explodedAmount * 0.9;
      liquidMesh.position.y = 0.95 + explodedAmount * 0.6;
      beansGroup.position.y = explodedAmount * 0.3;
      spoonGroup.position.x = explodedAmount * 0.5;

      // Update steam particles
      const posAttr = steamGeo.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < steamCount; i++) {
        arr[i * 3] += steamVel[i * 3] + Math.sin(Date.now() * 0.002 + i) * 0.001;
        arr[i * 3 + 1] += steamVel[i * 3 + 1];
        arr[i * 3 + 2] += steamVel[i * 3 + 2];

        // Reset if too high
        if (arr[i * 3 + 1] > 2.2 + explodedAmount * 0.9) {
          arr[i * 3] = (Math.random() - 0.5) * 0.35;
          arr[i * 3 + 1] = 1.05 + explodedAmount * 0.9;
          arr[i * 3 + 2] = (Math.random() - 0.5) * 0.35;
        }
      }
      posAttr.needsUpdate = true;
    },
    setCupColor: (colorHex: number) => {
      cupMat.color.setHex(colorHex);
    }
  };
}

// 2. BELGIAN ARTISANAL CHOCOLATE BAR & TRUFFLES COMPOSITE MODEL
export function createChocolateModel() {
  const root = new THREE.Group();
  root.name = 'chocolate-root';

  const chocoBlockTex = createChocolateBlockTexture();

  const darkChocoMat = new THREE.MeshStandardMaterial({
    color: 0x241108,
    roughness: 0.35,
    metalness: 0.08,
  });

  const goldFoilMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.3,
    metalness: 0.95,
  });

  const mainBarGroup = new THREE.Group();
  mainBarGroup.name = 'part-bar';

  // Base Bar Tray
  const baseGeo = new THREE.BoxGeometry(2.2, 0.12, 1.4);
  const baseMesh = new THREE.Mesh(baseGeo, darkChocoMat);
  baseMesh.position.y = 0.06;
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  mainBarGroup.add(baseMesh);

  // 3 x 4 Grid of beveled chocolate segments
  const cols = 4;
  const rows = 3;
  const segW = 0.48;
  const segH = 0.38;

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const segGeo = new THREE.BoxGeometry(segW - 0.04, 0.08, segH - 0.04);
      const segMat = new THREE.MeshStandardMaterial({
        color: 0x261309,
        roughness: 0.3,
        metalness: 0.05,
        map: chocoBlockTex,
      });
      const segMesh = new THREE.Mesh(segGeo, segMat);
      segMesh.position.set(
        -0.8 + c * segW,
        0.15,
        -0.4 + r * segH
      );
      segMesh.castShadow = true;
      mainBarGroup.add(segMesh);
    }
  }

  // Crumpled Gold Foil Wrapper wrapping half the bar
  const foilGeo = new THREE.BoxGeometry(1.2, 0.14, 1.44);
  const foilMesh = new THREE.Mesh(foilGeo, goldFoilMat);
  foilMesh.position.set(-0.55, 0.06, 0);
  foilMesh.rotation.y = 0.04;
  foilMesh.castShadow = true;
  mainBarGroup.add(foilMesh);

  root.add(mainBarGroup);

  // Broken Chocolate Fragment
  const brokenGroup = new THREE.Group();
  brokenGroup.name = 'part-broken';
  const brokenChunkGeo = new THREE.BoxGeometry(0.44, 0.14, 0.36);
  brokenChunkGeo.rotateY(0.4);
  const brokenChunk = new THREE.Mesh(brokenChunkGeo, darkChocoMat);
  brokenChunk.position.set(1.35, 0.08, 0.55);
  brokenChunk.castShadow = true;
  brokenGroup.add(brokenChunk);

  // Scattered chocolate crumbs
  for (let i = 0; i < 8; i++) {
    const crumbGeo = new THREE.DodecahedronGeometry(0.03 + Math.random() * 0.03);
    const crumb = new THREE.Mesh(crumbGeo, darkChocoMat);
    crumb.position.set(1.1 + Math.random() * 0.5, 0.03, 0.3 + Math.random() * 0.6);
    brokenGroup.add(crumb);
  }
  root.add(brokenGroup);

  // 2 Belgian Truffles
  const trufflesGroup = new THREE.Group();
  trufflesGroup.name = 'part-truffles';

  const truffleMat = new THREE.MeshStandardMaterial({
    color: 0x361c0d,
    roughness: 0.85, // matte cocoa powder dusted
    metalness: 0.02,
  });

  // Truffle 1: cocoa dusted sphere
  const truf1Geo = new THREE.SphereGeometry(0.24, 20, 20);
  truf1Geo.scale(1, 0.85, 1);
  const truf1 = new THREE.Mesh(truf1Geo, truffleMat);
  truf1.position.set(-0.95, 0.2, 0.95);
  truf1.castShadow = true;
  trufflesGroup.add(truf1);

  // White chocolate drizzle ribbon on truffle 1
  const drizzleGeo = new THREE.TorusGeometry(0.23, 0.02, 8, 24);
  drizzleGeo.rotateX(Math.PI / 3);
  const whiteChocoMat = new THREE.MeshStandardMaterial({
    color: 0xf8f1d8,
    roughness: 0.2,
    metalness: 0.1,
  });
  const drizzle = new THREE.Mesh(drizzleGeo, whiteChocoMat);
  drizzle.position.set(-0.95, 0.22, 0.95);
  trufflesGroup.add(drizzle);

  // Truffle 2: dark swirl
  const truf2Geo = new THREE.ConeGeometry(0.22, 0.32, 16);
  const truf2 = new THREE.Mesh(truf2Geo, darkChocoMat);
  truf2.position.set(-0.45, 0.16, 1.05);
  truf2.castShadow = true;
  trufflesGroup.add(truf2);

  // Whole roasted hazelnuts
  for (let i = 0; i < 3; i++) {
    const nutGeo = new THREE.SphereGeometry(0.09, 12, 12);
    nutGeo.scale(1.1, 0.9, 1);
    const nutMat = new THREE.MeshStandardMaterial({
      color: 0x9e6027,
      roughness: 0.6,
    });
    const nut = new THREE.Mesh(nutGeo, nutMat);
    nut.position.set(0.1 + i * 0.3, 0.09, 0.9 + (i % 2) * 0.2);
    nut.castShadow = true;
    trufflesGroup.add(nut);
  }

  root.add(trufflesGroup);

  return {
    group: root,
    update: (_delta: number, explodedAmount: number) => {
      mainBarGroup.position.y = explodedAmount * 0.5;
      brokenGroup.position.x = explodedAmount * 0.6;
      trufflesGroup.position.z = explodedAmount * 0.7;
    },
    setCocoaGrade: (grade: 'dark' | 'milk' | 'white') => {
      if (grade === 'dark') {
        darkChocoMat.color.setHex(0x200e06);
      } else if (grade === 'milk') {
        darkChocoMat.color.setHex(0x522912);
      } else {
        darkChocoMat.color.setHex(0xf3ebd3);
      }
    }
  };
}

// 3. BELGIAN LIEGE SPECIAL WAFFLE COMPOSITE MODEL
export function createWaffleModel() {
  const root = new THREE.Group();
  root.name = 'waffle-root';

  const { color: waffleColorTex, bump: waffleBumpTex } = createWaffleTextures();

  // Ceramic Plate
  const plateMat = new THREE.MeshStandardMaterial({
    color: 0x0f2b1d, // Belgian Green
    roughness: 0.2,
    metalness: 0.05,
  });

  const goldRimMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.25,
    metalness: 0.85,
  });

  const platePoints: THREE.Vector2[] = [];
  platePoints.push(new THREE.Vector2(0, 0));
  platePoints.push(new THREE.Vector2(1.2, 0.03));
  platePoints.push(new THREE.Vector2(1.8, 0.12));
  platePoints.push(new THREE.Vector2(2.1, 0.25));
  platePoints.push(new THREE.Vector2(2.08, 0.22));
  platePoints.push(new THREE.Vector2(1.75, 0.1));
  platePoints.push(new THREE.Vector2(1.15, 0.02));
  platePoints.push(new THREE.Vector2(0, 0.02));

  const plateGeo = new THREE.LatheGeometry(platePoints, 40);
  const plateMesh = new THREE.Mesh(plateGeo, plateMat);
  plateMesh.castShadow = true;
  plateMesh.receiveShadow = true;
  plateMesh.name = 'part-plate';

  const plateGoldRimGeo = new THREE.TorusGeometry(2.09, 0.02, 12, 48);
  plateGoldRimGeo.rotateX(Math.PI / 2);
  const plateGoldRim = new THREE.Mesh(plateGoldRimGeo, goldRimMat);
  plateGoldRim.position.y = 0.24;
  plateMesh.add(plateGoldRim);

  root.add(plateMesh);

  // Waffle Group
  const waffleGroup = new THREE.Group();
  waffleGroup.name = 'part-waffle-body';
  waffleGroup.position.y = 0.12;

  // Waffle Base (Golden baked block with beveled rounded corners)
  const waffleGeo = new THREE.BoxGeometry(1.9, 0.26, 1.9);
  const waffleMat = new THREE.MeshStandardMaterial({
    map: waffleColorTex,
    bumpMap: waffleBumpTex,
    bumpScale: 0.05,
    roughness: 0.7,
    metalness: 0.02,
  });
  const waffleMesh = new THREE.Mesh(waffleGeo, waffleMat);
  waffleMesh.castShadow = true;
  waffleMesh.receiveShadow = true;
  waffleGroup.add(waffleMesh);

  // Viscous Glossy Chocolate Drizzle across waffle
  const chocolateDrizzleMat = new THREE.MeshPhysicalMaterial({
    color: 0x221008,
    roughness: 0.1,
    metalness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
  });

  const curves = [
    [-0.8, 0.15, -0.7, 0.8, 0.15, 0.7],
    [-0.7, 0.15, 0.6, 0.7, 0.15, -0.6],
    [-0.5, 0.16, -0.8, 0.4, 0.16, 0.8],
    [0.1, 0.16, -0.9, -0.2, 0.16, 0.9]
  ];

  curves.forEach(([x1, y1, z1, x2, y2, z2]) => {
    const path = new THREE.LineCurve3(
      new THREE.Vector3(x1, y1, z1),
      new THREE.Vector3(x2, y2, z2)
    );
    const tubeGeo = new THREE.TubeGeometry(path, 16, 0.045, 8, false);
    const drizzleMesh = new THREE.Mesh(tubeGeo, chocolateDrizzleMat);
    drizzleMesh.castShadow = true;
    waffleGroup.add(drizzleMesh);
  });

  root.add(waffleGroup);

  // Fresh Strawberry & Banana Toppings Group
  const toppingsGroup = new THREE.Group();
  toppingsGroup.name = 'part-toppings';
  toppingsGroup.position.y = 0.28;

  // Strawberry slice 1
  const berryMat = new THREE.MeshStandardMaterial({
    color: 0xd8202b,
    roughness: 0.35,
  });
  const berry1Geo = new THREE.ConeGeometry(0.24, 0.38, 16);
  berry1Geo.rotateX(0.5);
  const berry1 = new THREE.Mesh(berry1Geo, berryMat);
  berry1.position.set(-0.35, 0.15, 0.3);
  berry1.castShadow = true;
  toppingsGroup.add(berry1);

  // Strawberry slice 2
  const berry2 = new THREE.Mesh(berry1Geo, berryMat);
  berry2.position.set(0.4, 0.15, -0.25);
  berry2.rotation.y = 1.2;
  berry2.castShadow = true;
  toppingsGroup.add(berry2);

  // Fresh Banana slice (cylinder)
  const bananaMat = new THREE.MeshStandardMaterial({
    color: 0xf5ecc6,
    roughness: 0.4,
  });
  const bananaGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.08, 16);
  const banana1 = new THREE.Mesh(bananaGeo, bananaMat);
  banana1.position.set(-0.4, 0.12, -0.4);
  banana1.rotation.x = 0.2;
  toppingsGroup.add(banana1);

  const banana2 = new THREE.Mesh(bananaGeo, bananaMat);
  banana2.position.set(0.35, 0.12, 0.4);
  banana2.rotation.z = -0.15;
  toppingsGroup.add(banana2);

  // Whipped cream dollop (quenelle / tiered cones)
  const creamMat = new THREE.MeshStandardMaterial({
    color: 0xfffcf5,
    roughness: 0.45,
  });
  const creamGroup = new THREE.Group();
  for (let k = 0; k < 3; k++) {
    const cRadius = 0.26 - k * 0.06;
    const cGeo = new THREE.CylinderGeometry(cRadius * 0.7, cRadius, 0.12, 12);
    const cMesh = new THREE.Mesh(cGeo, creamMat);
    cMesh.position.y = k * 0.09;
    creamGroup.add(cMesh);
  }
  creamGroup.position.set(0.05, 0.14, 0.05);
  toppingsGroup.add(creamGroup);

  root.add(toppingsGroup);

  return {
    group: root,
    update: (_delta: number, explodedAmount: number) => {
      waffleGroup.position.y = 0.12 + explodedAmount * 0.6;
      toppingsGroup.position.y = 0.28 + explodedAmount * 1.2;
    },
    setSauceColor: (type: 'dark' | 'milk' | 'white') => {
      if (type === 'dark') {
        chocolateDrizzleMat.color.setHex(0x221008);
      } else if (type === 'milk') {
        chocolateDrizzleMat.color.setHex(0x5a2d12);
      } else {
        chocolateDrizzleMat.color.setHex(0xfbf3da);
      }
    }
  };
}

// 4. ICED BELGIAN & PAKHLAVA FRAPPE COMPOSITE MODEL
export function createFrappeModel(isSoftwareGl: boolean) {
  const root = new THREE.Group();
  root.name = 'frappe-root';

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.85,
    roughness: 0.2,
  });

  // Tall Fluted Glass Vessel
  const glassGeo = new THREE.CylinderGeometry(0.75, 0.52, 2.4, 32, 1, true);
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: isSoftwareGl ? 0.4 : 0.85,
    transmission: isSoftwareGl ? 0 : 0.92,
    ior: 1.5,
    roughness: 0.08,
    metalness: 0.05,
    depthWrite: false,
  });
  const glassMesh = new THREE.Mesh(glassGeo, glassMat);
  glassMesh.position.y = 1.25;
  glassMesh.castShadow = false;
  root.add(glassMesh);

  // Glass Heavy Base
  const baseGeo = new THREE.CylinderGeometry(0.58, 0.64, 0.25, 32);
  const baseMesh = new THREE.Mesh(baseGeo, glassMat);
  baseMesh.position.y = 0.125;
  baseMesh.castShadow = true;
  root.add(baseMesh);

  // Layered Beverage Group
  const beverageGroup = new THREE.Group();
  beverageGroup.name = 'part-beverage';

  // Bottom Layer: Dark Belgian Chocolate Fudge
  const botGeo = new THREE.CylinderGeometry(0.58, 0.53, 0.55, 28);
  const botMat = new THREE.MeshStandardMaterial({
    color: 0x241108,
    roughness: 0.3,
  });
  const botMesh = new THREE.Mesh(botGeo, botMat);
  botMesh.position.y = 0.5;
  beverageGroup.add(botMesh);

  // Middle Layer: Cold Chilled Milk & Coffee Blend
  const midGeo = new THREE.CylinderGeometry(0.68, 0.58, 1.1, 28);
  const midMat = new THREE.MeshStandardMaterial({
    color: 0x8a542b,
    roughness: 0.4,
  });
  const midMesh = new THREE.Mesh(midGeo, midMat);
  midMesh.position.y = 1.3;
  beverageGroup.add(midMesh);

  // Top Layer: Crema & Light Foam
  const topGeo = new THREE.CylinderGeometry(0.72, 0.68, 0.5, 28);
  const topMat = new THREE.MeshStandardMaterial({
    color: 0xdfb482,
    roughness: 0.5,
  });
  const topMesh = new THREE.Mesh(topGeo, topMat);
  topMesh.position.y = 2.05;
  beverageGroup.add(topMesh);

  root.add(beverageGroup);

  // Floating Crystalline Ice Cubes inside
  const iceGroup = new THREE.Group();
  iceGroup.name = 'part-ice';
  const iceMat = new THREE.MeshPhysicalMaterial({
    color: 0xedf7f9,
    transparent: true,
    opacity: 0.7,
    roughness: 0.1,
    transmission: isSoftwareGl ? 0 : 0.85,
    ior: 1.31,
    depthWrite: false,
  });

  const icePositions = [
    { x: -0.15, y: 1.6, z: 0.15, rot: 0.4 },
    { x: 0.2, y: 1.8, z: -0.1, rot: 0.9 },
    { x: -0.1, y: 2.1, z: -0.15, rot: 0.2 },
    { x: 0.15, y: 1.3, z: 0.2, rot: 1.2 },
  ];

  icePositions.forEach((pos) => {
    const cubeGeo = new THREE.BoxGeometry(0.32, 0.32, 0.32);
    const cube = new THREE.Mesh(cubeGeo, iceMat);
    cube.position.set(pos.x, pos.y, pos.z);
    cube.rotation.set(pos.rot, pos.rot * 1.5, pos.rot * 0.7);
    iceGroup.add(cube);
  });
  root.add(iceGroup);

  // Whipped Cream Cloud Peak
  const creamPeakGroup = new THREE.Group();
  creamPeakGroup.name = 'part-cream-peak';
  const creamMat = new THREE.MeshStandardMaterial({
    color: 0xfffcf5,
    roughness: 0.5,
  });

  const whorlGeo1 = new THREE.TorusGeometry(0.48, 0.2, 16, 28);
  whorlGeo1.rotateX(Math.PI / 2);
  const whorl1 = new THREE.Mesh(whorlGeo1, creamMat);
  whorl1.position.y = 2.45;
  creamPeakGroup.add(whorl1);

  const whorlGeo2 = new THREE.TorusGeometry(0.3, 0.18, 16, 24);
  whorlGeo2.rotateX(Math.PI / 2);
  const whorl2 = new THREE.Mesh(whorlGeo2, creamMat);
  whorl2.position.y = 2.75;
  creamPeakGroup.add(whorl2);

  const tipGeo = new THREE.ConeGeometry(0.18, 0.3, 16);
  const tip = new THREE.Mesh(tipGeo, creamMat);
  tip.position.y = 2.95;
  creamPeakGroup.add(tip);

  // Straw
  const strawGeo = new THREE.CylinderGeometry(0.045, 0.045, 3.2, 16);
  const strawMat = new THREE.MeshStandardMaterial({
    color: 0x0f2b1d, // signature dark green straw
    roughness: 0.2,
  });
  const strawMesh = new THREE.Mesh(strawGeo, strawMat);
  strawMesh.rotation.z = -0.22;
  strawMesh.rotation.x = 0.15;
  strawMesh.position.set(0.25, 2.1, 0);
  creamPeakGroup.add(strawMesh);

  // Gold Band on straw
  const bandGeo = new THREE.CylinderGeometry(0.047, 0.047, 0.15, 16);
  const bandMesh = new THREE.Mesh(bandGeo, goldMat);
  bandMesh.rotation.z = -0.22;
  bandMesh.rotation.x = 0.15;
  bandMesh.position.set(0.34, 2.9, 0.06);
  creamPeakGroup.add(bandMesh);

  root.add(creamPeakGroup);

  return {
    group: root,
    update: (_delta: number, explodedAmount: number) => {
      creamPeakGroup.position.y = explodedAmount * 0.9;
      iceGroup.position.y = explodedAmount * 0.4;
      beverageGroup.position.y = explodedAmount * 0.2;
    }
  };
}
