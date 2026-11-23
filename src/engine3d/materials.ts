import * as THREE from 'three';

export function createFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#DFD9CE';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle epoxy tile joints
  ctx.strokeStyle = '#C9C0B1';
  ctx.lineWidth = 2;
  for (let i = 0; i <= 512; i += 64) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(255,255,255,0.38)';
  ctx.lineWidth = 1;
  for (let i = 2; i <= 512; i += 64) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();
  }

  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = i % 2 === 0 ? 'rgba(85,78,68,0.06)' : 'rgba(255,255,255,0.15)';
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(16, 10);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createWallTileTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 2;
  for (let x = 0; x <= 256; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 256);
    ctx.stroke();
  }
  for (let y = 0; y <= 256; y += 16) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(22, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createBrushedMetalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);

  for (let y = 0; y < 256; y++) {
    const v = 115 + Math.floor(Math.random() * 28);
    ctx.strokeStyle = `rgb(${v},${v},${v})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  return tex;
}

export function createWoodGrainTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#C89B6E';
  ctx.fillRect(0, 0, 256, 256);

  for (let y = 0; y < 256; y += 2) {
    const shade = y % 16 === 0 ? 'rgba(110,72,38,0.22)' : 'rgba(145,98,55,0.12)';
    ctx.fillStyle = shade;
    ctx.fillRect(0, y, 256, 1.5);
  }

  // Plank joints
  ctx.strokeStyle = 'rgba(92,58,28,0.35)';
  ctx.lineWidth = 2;
  for (let y = 32; y < 256; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createDoughBumpTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);

  // Soft organic cellular dimples so dough never looks like smooth plastic
  for (let i = 0; i < 420; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const r = 4 + Math.random() * 14;
    const grad = ctx.createRadialGradient(x, y, 0.5, x, y, r);
    const bright = i % 2 === 0 ? 'rgba(165,165,165,0.18)' : 'rgba(95,95,95,0.18)';
    grad.addColorStop(0, bright);
    grad.addColorStop(1, 'rgba(128,128,128,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  return tex;
}

export function createBreadCrustTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Base warm golden crust gradient (darker crown, lighter bottom/sides)
  const bg = ctx.createLinearGradient(0, 0, 0, 256);
  bg.addColorStop(0, '#B96B1E');
  bg.addColorStop(0.35, '#CE7F2A');
  bg.addColorStop(0.75, '#E2A34C');
  bg.addColorStop(1, '#D38E3A');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 256, 256);

  // Natural toasted Maillard mottling & micro-blisters
  for (let i = 0; i < 550; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const r = 2 + Math.random() * 10;
    const grad = ctx.createRadialGradient(x, y, 0.5, x, y, r);
    if (i % 3 === 0) {
      grad.addColorStop(0, 'rgba(112, 52, 12, 0.16)');
    } else if (i % 3 === 1) {
      grad.addColorStop(0, 'rgba(248, 214, 148, 0.15)');
    } else {
      grad.addColorStop(0, 'rgba(168, 85, 22, 0.14)');
    }
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Subtle flour dusting specs
  for (let i = 0; i < 180; i++) {
    ctx.fillStyle = 'rgba(255, 248, 225, 0.12)';
    ctx.beginPath();
    ctx.arc(Math.random() * 256, Math.random() * 256, 1 + Math.random() * 2, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createCrumbAlveoliTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Soft creamy interior crumb matrix
  ctx.fillStyle = '#F7EDD0';
  ctx.fillRect(0, 0, 256, 256);

  // Outer golden crust border around the sliced cross-section
  ctx.strokeStyle = '#B86B1F';
  ctx.lineWidth = 14;
  ctx.strokeRect(4, 4, 248, 248);

  // Irregular natural alveoli (gas cells of varying sizes and orientations)
  let seed = 1337;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < 340; i++) {
    const cx = 22 + rand() * 212;
    const cy = 22 + rand() * 212;
    const rx = 1.5 + rand() * 7.5;
    const ry = 1.2 + rand() * 5.5;
    const rot = rand() * Math.PI;

    // Pore shadow cavity
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.fillStyle = i % 4 === 0 ? '#D5C295' : '#E3D3AA';
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rim highlight of gluten cell wall
    ctx.strokeStyle = 'rgba(255, 252, 240, 0.65)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.restore();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createDigitalDisplayTexture(
  topText: string,
  bottomText: string,
  accent = '#34D399',
  headerText = 'PID CONTROL · ACTIVO'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#090D16';
  ctx.fillRect(0, 0, 256, 128);
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, 250, 122);

  ctx.fillStyle = '#1E293B';
  ctx.fillRect(6, 6, 244, 22);
  ctx.fillStyle = '#94A3B8';
  ctx.font = 'bold 11px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(headerText, 12, 21);

  ctx.fillStyle = accent;
  ctx.font = 'bold 34px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(topText, 128, 68);

  ctx.fillStyle = '#E2E8F0';
  ctx.font = 'bold 20px monospace';
  ctx.fillText(bottomText, 128, 104);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createSackTexture(label: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#EBE0C5';
  ctx.fillRect(0, 0, 256, 256);

  // Cross-woven textile fiber pattern
  ctx.strokeStyle = 'rgba(145, 120, 88, 0.18)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 256; i += 6) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(256, i);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 256);
    ctx.stroke();
  }

  // Stitched red/white thread seams at top and bottom
  ctx.fillStyle = '#D3C09A';
  ctx.fillRect(0, 0, 256, 16);
  ctx.fillRect(0, 240, 256, 16);
  ctx.strokeStyle = '#9A3412';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(8, 8);
  ctx.lineTo(248, 8);
  ctx.moveTo(8, 248);
  ctx.lineTo(248, 248);
  ctx.stroke();
  ctx.setLineDash([]);

  // Center printed band
  ctx.fillStyle = '#9A3412';
  ctx.fillRect(18, 54, 220, 44);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 25px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(label, 128, 85);

  ctx.fillStyle = '#1B4332';
  ctx.fillRect(34, 110, 188, 24);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('FORTIFICADA · DECRETO 1944', 128, 126);

  ctx.fillStyle = '#3E342B';
  ctx.font = 'bold 16px monospace';
  ctx.fillText('PESO NETO: 50 kg', 128, 162);
  ctx.font = '12px monospace';
  ctx.fillText('LOTE: H-2026-11 · <14,5% HR', 128, 186);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
