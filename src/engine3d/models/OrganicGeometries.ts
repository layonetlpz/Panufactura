import * as THREE from 'three';

/**
 * Pseudo-Perlin 3D multi-octave smooth noise function for organic dough, bread, and textile sack deformation.
 */
function smoothNoise3D(x: number, y: number, z: number): number {
  const n1 = Math.sin(x * 3.7 + y * 2.3 + z * 4.1) * Math.cos(x * 2.9 - z * 3.3);
  const n2 = Math.sin(x * 7.3 - y * 5.9 + z * 6.7) * 0.45;
  const n3 = Math.cos(x * 13.1 + y * 11.7 - z * 12.3) * 0.18;
  return (n1 + n2 + n3) / 1.63;
}

/**
 * 1. Deformed Textile Flour Sack Geometry (Section 4.1)
 * Replaces rigid rectangular boxes with a pillowed, pinched-corner woven sack with stitched ear seams and gravity sag.
 */
export function createDeformedSackGeometry(
  width = 0.68,
  height = 0.25,
  depth = 0.48,
  seedOffset = 0
): THREE.BufferGeometry {
  const geom = new THREE.BoxGeometry(width, height, depth, 18, 10, 14);
  const pos = geom.attributes.position;
  const hw = width / 2;
  const hh = height / 2;
  const hd = depth / 2;

  for (let i = 0; i < pos.count; i++) {
    let vx = pos.getX(i);
    let vy = pos.getY(i);
    let vz = pos.getZ(i);

    // Normalized coords -1..1
    const nx = vx / hw;
    const ny = vy / hh;
    const nz = vz / hd;

    // Pillow bulge in the middle, pinched toward the stitched seams at nz = +-1
    const radial2D = Math.min(1, nx * nx * 0.85 + nz * nz * 0.85);
    const bulge = Math.cos(radial2D * Math.PI * 0.48);

    // Pinched sewn ends at front/back (nz near +-1) creating characteristic sack ears
    const seamPinch = Math.pow(Math.abs(nz), 2.6);
    vy *= THREE.MathUtils.lerp(1.08, 0.24, seamPinch) * (0.75 + 0.35 * bulge);

    // Slight waist indentation and bottom flattening under gravity
    if (ny < 0) {
      vy = Math.max(-hh * 0.92, vy * 0.82);
    }
    vx *= 1 + (1 - Math.abs(ny) * 0.35) * 0.08 * Math.cos(nz * 1.4);

    // Subtle textile wrinkle noise
    const wrinkle =
      smoothNoise3D(vx * 5 + seedOffset, vy * 5, vz * 5 + seedOffset) * 0.014;
    vx += wrinkle;
    vy += wrinkle * 0.6;
    vz += wrinkle;

    pos.setXYZ(i, vx, vy, vz);
  }

  geom.computeVertexNormals();
  return geom;
}

/**
 * 2. High-Resolution Organic Bulk Dough Geometry (Section 5.1 - 5.3)
 * Used in Mixing, Kneading, and First Fermentation. Features a flat contact bottom, viscoelastic folds, and organic asymmetry.
 */
export function createOrganicBulkDoughGeometry(radius = 0.29): THREE.BufferGeometry {
  const geom = new THREE.SphereGeometry(radius, 48, 36);
  const pos = geom.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    let vx = pos.getX(i);
    let vy = pos.getY(i);
    let vz = pos.getZ(i);

    const ny = vy / radius; // -1..1

    // Flatten the bottom contact surface so the dough sits naturally on the bowl/tray
    if (ny < -0.25) {
      const t = (-0.25 - ny) / 0.75;
      vy = -radius * (0.25 + t * 0.38);
      const spread = 1 + t * 0.16;
      vx *= spread;
      vz *= spread;
    }

    // Multi-lobe viscoelastic kneading folds
    const n = smoothNoise3D(vx * 4.2, vy * 4.2, vz * 4.2);
    const fold = Math.sin(vx * 9.5 + vz * 7.2) * 0.012;
    const disp = 1 + n * 0.065 + fold;

    pos.setXYZ(i, vx * disp, vy * (1 + n * 0.04), vz * disp);
  }

  geom.computeVertexNormals();
  return geom;
}

/**
 * 3. Organic Divided / Rounded Portion Geometry (Phases 7, 8, 9)
 * Morphs from an irregular freshly-cut dough chunk (roundness = 0) to a taut, bottom-tucked sphere (roundness = 1).
 */
export function createOrganicPortionGeometry(
  radius = 0.095,
  roundness = 1.0
): THREE.BufferGeometry {
  const geom = new THREE.SphereGeometry(radius, 32, 24);
  const pos = geom.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    let vx = pos.getX(i);
    let vy = pos.getY(i);
    let vz = pos.getZ(i);

    const ny = vy / radius;

    // Contact base flattening
    if (ny < -0.3) {
      const t = (-0.3 - ny) / 0.7;
      vy = -radius * (0.3 + t * 0.35);
      vx *= 1 + t * 0.12;
      vz *= 1 + t * 0.12;
    }

    // When roundness is low (freshly divided in Phase 7), add blocky facets & irregular edges
    const irregularity = THREE.MathUtils.lerp(0.14, 0.035, roundness);
    const n = smoothNoise3D(vx * 14, vy * 14, vz * 14) * irregularity;

    pos.setXYZ(i, vx * (1 + n), vy * (1 + n * 0.7), vz * (1 + n));
  }

  geom.computeVertexNormals();
  return geom;
}

/**
 * 4. Authentic Colombian "Pan de Sal Tradicional Tipo Rollo" Geometry (Sections 5.2, 6)
 * NOT a generic capsule! Built with a flat baking base, arched crown, tapered rolled ends,
 * 4 overlapping spiral coil ridges from rolling the dough sheet, and subtle organic surface asymmetry.
 */
export function createColombianRollBreadGeometry(): THREE.BufferGeometry {
  // Base cylinder along X axis (length = 0.24, radius = 0.072) with high subdivision
  const length = 0.24;
  const baseRadius = 0.072;
  const radialSegs = 36;
  const heightSegs = 44;

  const geom = new THREE.CylinderGeometry(
    baseRadius,
    baseRadius,
    length,
    radialSegs,
    heightSegs,
    false
  );
  // Rotate so length is along X axis and Y is vertical height
  geom.rotateZ(Math.PI / 2);

  const pos = geom.attributes.position;
  const halfL = length / 2;

  for (let i = 0; i < pos.count; i++) {
    let vx = pos.getX(i);
    let vy = pos.getY(i);
    let vz = pos.getZ(i);

    // Normalized axial position u in [-1, 1]
    const u = THREE.MathUtils.clamp(vx / halfL, -1, 1);
    const absU = Math.abs(u);

    // 1. Plump belly profile along the roll axis (tapered rounded ends like a real Colombian pan rollo)
    const axialEnvelope = Math.pow(Math.max(0.001, 1 - Math.pow(absU, 2.35)), 0.46);

    // 2. 4 characteristic spiral roll coils (pliegues del enrollado cilíndrico) visible on top and sides
    const angle = Math.atan2(vy, vz); // angle around X axis
    const topFactor = THREE.MathUtils.clamp((vy / baseRadius + 0.3) / 1.3, 0, 1);
    const coilWave = Math.cos(u * Math.PI * 3.8) * 0.0065 * topFactor * (1 - absU * 0.5);

    // Subtle indentation groove between coils
    const coilGroove = -Math.pow(Math.abs(Math.sin(u * Math.PI * 3.8)), 3) * 0.004 * topFactor;

    // 3. Apply axial envelope and coil relief to Y and Z
    const rScale = axialEnvelope + (coilWave + coilGroove) / baseRadius;
    vy *= rScale * 0.92; // slightly wider than tall
    vz *= rScale * 1.08;

    // 4. Flat baking base (base de cocción sobre la lata)
    const floorY = -baseRadius * 0.52;
    if (vy < floorY) {
      const flattenT = (floorY - vy) / (baseRadius * 0.48);
      vy = floorY - flattenT * 0.004;
      vz *= 1 + flattenT * 0.06;
    }

    // 5. Subtle organic asymmetry so it never looks machine-lathed or plastic
    const organicNoise =
      smoothNoise3D(vx * 16 + 1.7, vy * 16, vz * 16 + angle * 0.3) * 0.0032;
    vx += organicNoise * 0.5;
    vy += organicNoise;
    vz += organicNoise;

    pos.setXYZ(i, vx, vy, vz);
  }

  geom.computeVertexNormals();
  return geom;
}

/**
 * 5. Sliced Colombian Roll Half Geometry for Crumb Cross-Section Inspection (Section 6)
 * Cuts the roll cleanly at x = 0 so the flat cross-section plane reveals the internal alveolar crumb texture.
 */
export function createSlicedRollHalfGeometry(): {
  crustGeom: THREE.BufferGeometry;
  crumbCapGeom: THREE.BufferGeometry;
} {
  const crustGeom = createColombianRollBreadGeometry();
  const pos = crustGeom.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const vx = pos.getX(i);
    if (vx > 0) {
      pos.setX(i, 0);
    }
  }
  crustGeom.computeVertexNormals();

  // Build a D-shaped cross-section cap matching the roll profile at x = 0.001
  const shape = new THREE.Shape();
  const steps = 32;
  const rx = 0.077; // width Z
  const ry = 0.066; // height Y
  const floorY = -0.037;

  for (let s = 0; s <= steps; s++) {
    const theta = (s / steps) * Math.PI * 2;
    const z = Math.cos(theta) * rx;
    let y = Math.sin(theta) * ry;
    if (y < floorY) y = floorY;
    if (s === 0) shape.moveTo(z, y);
    else shape.lineTo(z, y);
  }
  shape.closePath();

  const crumbCapGeom = new THREE.ShapeGeometry(shape, 16);
  // Orient cap on the YZ plane facing +X
  crumbCapGeom.rotateY(Math.PI / 2);

  // Normalize UVs to 0..1 so the alveolar crumb texture maps cleanly
  const uv = crumbCapGeom.attributes.uv;
  const capPos = crumbCapGeom.attributes.position;
  for (let i = 0; i < capPos.count; i++) {
    const y = capPos.getY(i);
    const z = capPos.getZ(i);
    uv.setXY(i, (z / rx + 1) * 0.5, (y / ry + 1) * 0.5);
  }

  return { crustGeom, crumbCapGeom };
}

/**
 * 6. True 3D Forged Helical Spiral Hook Geometry for the Industrial Kneader (Section 4.3)
 */
export function createTrueSpiralHookGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector3[] = [];
  const steps = 48;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    if (t < 0.25) {
      // Upper vertical drive shaft
      const st = t / 0.25;
      points.push(new THREE.Vector3(0, -st * 0.22, 0));
    } else {
      // Helical spiral descending into the bowl
      const ht = (t - 0.25) / 0.75;
      const angle = ht * Math.PI * 2.35;
      const radius = THREE.MathUtils.lerp(0.03, 0.17, Math.sin(ht * Math.PI * 0.85));
      const y = -0.22 - ht * 0.42;
      points.push(new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius));
    }
  }
  const curve = new THREE.CatmullRomCurve3(points);
  return new THREE.TubeGeometry(curve, 56, 0.024, 14, false);
}

/**
 * 7. True 3D Helical Spiral Channel for the Conical Dough Rounder (Section 4.6)
 */
export function createHelicalRounderTrackGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector3[] = [];
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = t * Math.PI * 3.1; // 1.55 turns around the inverted cone
    const radius = THREE.MathUtils.lerp(0.24, 0.47, t);
    const y = THREE.MathUtils.lerp(0.76, 1.32, t);
    points.push(new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius));
  }
  const curve = new THREE.CatmullRomCurve3(points);
  return new THREE.TubeGeometry(curve, 64, 0.034, 12, false);
}
