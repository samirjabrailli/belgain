import * as THREE from 'three';

// Procedural Latte Art / Espresso Crema texture
export function createLatteArtTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Deep rich espresso base with micro-bubbles
  const gradient = ctx.createRadialGradient(512, 512, 40, 512, 512, 512);
  gradient.addColorStop(0, '#c7843d'); // golden caramel crema
  gradient.addColorStop(0.35, '#8c4e1a'); // hazelnut espresso
  gradient.addColorStop(0.7, '#4a250e'); // dark roasted coffee
  gradient.addColorStop(1, '#2c1408'); // dark edge
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1024, 1024);

  // Micro-crema dots
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const r = Math.random() * 3 + 1;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(230, 185, 125, ${Math.random() * 0.25 + 0.05})`;
    ctx.fill();
  }

  // Belgian Heart / Tulip Latte Art
  ctx.save();
  ctx.translate(512, 512);
  
  // Outer swirl leaves
  const leafCount = 7;
  for (let i = leafCount; i >= 1; i--) {
    const scale = (i / leafCount) * 0.9;
    ctx.fillStyle = 'rgba(255, 252, 245, 0.95)';
    ctx.beginPath();
    const yOffset = -220 + (leafCount - i) * 65;
    ctx.ellipse(0, yOffset, 120 * scale, 55 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    // Crema border around leaf
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(140, 78, 26, 0.35)';
    ctx.stroke();
  }

  // Central heart cap
  ctx.fillStyle = 'rgba(255, 252, 245, 0.98)';
  ctx.beginPath();
  ctx.arc(-25, 230, 35, 0, Math.PI * 2);
  ctx.arc(25, 230, 35, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-50, 240);
  ctx.lineTo(0, 310);
  ctx.lineTo(50, 240);
  ctx.closePath();
  ctx.fill();

  // Central stem drag line through leaves
  ctx.strokeStyle = '#6e3811';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, -260);
  ctx.lineTo(0, 305);
  ctx.stroke();

  ctx.restore();

  // Subtle Belgian golden ring near rim
  ctx.strokeStyle = 'rgba(212, 163, 89, 0.4)';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(512, 512, 490, 0, Math.PI * 2);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// Procedural Belgian Ceramic Crest Logo Decal
export function createBelgianLogoTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 512, 512);

  // Deep emerald circular badge
  ctx.beginPath();
  ctx.arc(256, 256, 240, 0, Math.PI * 2);
  ctx.fillStyle = '#0f2b1d';
  ctx.fill();

  // Gold rim ring
  ctx.lineWidth = 12;
  ctx.strokeStyle = '#c59b27';
  ctx.stroke();

  // Golden bean half and cream 'B'
  // Bean half on left
  ctx.beginPath();
  ctx.fillStyle = '#d4a359';
  ctx.ellipse(195, 256, 65, 115, -0.15, 0, Math.PI * 2);
  ctx.fill();

  // Dark curved cut between bean and B
  ctx.beginPath();
  ctx.fillStyle = '#0f2b1d';
  ctx.ellipse(225, 256, 22, 120, -0.15, 0, Math.PI * 2);
  ctx.fill();

  // Cream 'B' typography on right
  ctx.fillStyle = '#f8f4ec';
  ctx.font = 'bold 230px "Cinzel", "Playfair Display", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('B', 290, 260);

  // Arched text around border
  ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#c59b27';
  ctx.fillText('BELGIAN CHOCOLATE & COFFEE', 256, 65);
  ctx.font = '18px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#e8d9ba';
  ctx.fillText('★ BAKU • EST. 2020 ★', 256, 445);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Procedural Waffle Baked Grid Bump & Color Map
export function createWaffleTextures(): { color: THREE.CanvasTexture; bump: THREE.CanvasTexture } {
  const size = 512;
  const cCanvas = document.createElement('canvas');
  const bCanvas = document.createElement('canvas');
  cCanvas.width = size;
  cCanvas.height = size;
  bCanvas.width = size;
  bCanvas.height = size;

  const cCtx = cCanvas.getContext('2d')!;
  const bCtx = bCanvas.getContext('2d')!;

  // Warm golden baked waffle color
  cCtx.fillStyle = '#c98a3b';
  cCtx.fillRect(0, 0, size, size);

  // Bump neutral
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, size, size);

  const cells = 4;
  const cellSize = size / cells;
  const padding = 20;

  for (let i = 0; i < cells; i++) {
    for (let j = 0; j < cells; j++) {
      const x = i * cellSize + padding;
      const y = j * cellSize + padding;
      const w = cellSize - padding * 2;
      const h = cellSize - padding * 2;

      // Darker baked well inside waffle grid
      const wellGrad = cCtx.createRadialGradient(x + w / 2, y + h / 2, 5, x + w / 2, y + h / 2, w / 2);
      wellGrad.addColorStop(0, '#754013');
      wellGrad.addColorStop(0.7, '#a86221');
      wellGrad.addColorStop(1, '#db9b48');

      cCtx.fillStyle = wellGrad;
      cCtx.beginPath();
      cCtx.roundRect(x, y, w, h, 14);
      cCtx.fill();

      // Bump: deep indentation
      bCtx.fillStyle = '#101010';
      bCtx.beginPath();
      bCtx.roundRect(x, y, w, h, 14);
      bCtx.fill();
    }
  }

  // Caramelized sugar flecks on waffle ridges
  for (let i = 0; i < 200; i++) {
    const rx = Math.random() * size;
    const ry = Math.random() * size;
    cCtx.fillStyle = 'rgba(255, 235, 180, 0.6)';
    cCtx.beginPath();
    cCtx.arc(rx, ry, Math.random() * 2 + 1, 0, Math.PI * 2);
    cCtx.fill();
  }

  const color = new THREE.CanvasTexture(cCanvas);
  color.colorSpace = THREE.SRGBColorSpace;
  const bump = new THREE.CanvasTexture(bCanvas);

  return { color, bump };
}

// Procedural Chocolate Bar Block Stamp
export function createChocolateBlockTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Deep cocoa base
  ctx.fillStyle = '#2b160c';
  ctx.fillRect(0, 0, 512, 512);

  // Recessed embossed inner frame
  ctx.strokeStyle = '#1d0d06';
  ctx.lineWidth = 14;
  ctx.strokeRect(35, 35, 442, 442);

  ctx.strokeStyle = '#4a2817';
  ctx.lineWidth = 4;
  ctx.strokeRect(45, 45, 422, 422);

  // Embossed 'B' Monogram
  ctx.font = 'bold 190px "Cinzel", Georgia, serif';
  ctx.fillStyle = '#1d0d06'; // bevel shadow
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('B', 258, 258);

  ctx.fillStyle = '#422212'; // highlight
  ctx.fillText('B', 254, 254);

  // Cocoa pod leaf flourish
  ctx.font = '24px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#3a1e0f';
  ctx.fillText('85% BELGIAN CACAO', 256, 400);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Procedural Soft Radial Contact Shadow
export function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
  gradient.addColorStop(0, 'rgba(4, 12, 8, 0.7)');
  gradient.addColorStop(0.3, 'rgba(4, 12, 8, 0.45)');
  gradient.addColorStop(0.7, 'rgba(4, 12, 8, 0.15)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}
