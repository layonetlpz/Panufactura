import * as THREE from 'three';

export function createFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#E5E0D8';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle industrial concrete tile grid
  ctx.strokeStyle = '#D1C9BD';
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

  // Subtle speckle for realism
  for (let i = 0; i < 600; i++) {
    ctx.fillStyle = i % 2 === 0 ? 'rgba(120,113,108,0.08)' : 'rgba(255,255,255,0.12)';
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(14, 8);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createDigitalDisplayTexture(topText: string, bottomText: string, accent = '#34D399'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(0, 0, 256, 128);
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, 250, 122);

  ctx.fillStyle = accent;
  ctx.font = 'bold 34px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(topText, 128, 56);

  ctx.fillStyle = '#CBD5E1';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(bottomText, 128, 98);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createSackTexture(label: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#EADBC2';
  ctx.fillRect(0, 0, 256, 256);

  ctx.fillStyle = '#B45309';
  ctx.fillRect(20, 64, 216, 40);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(label, 128, 92);

  ctx.fillStyle = '#78350F';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('FORTIFICADA · 50 kg', 128, 140);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
