// Phone teardown parts, materials, and procedural textures.
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

export const V3 = THREE.Vector3;
export const D2R = Math.PI / 180;

// Studio palette
export const PAL = {
  white: '#f5f5f7',
  black: '#0c0d0f',
  graphite: '#1f2126',
  titanium: '#2a2d33',
  steel: '#d8dce2',
  aluminum: '#e2e6eb',
  copper: '#f07d38',       // Bright radiant metallic copper
  gold: '#f5c538',         // Gleaming polished gold
  kapton: '#ea7c1d',       // Rich amber polyimide
  pcbGreen: '#1b6937',     // Saturated industrial circuit green
  thermalMint: '#9bc4a7',
  thermalYellow: '#d6c57a',
  accentGreen: '#00e575',
};

// Procedural high-resolution battery texture with exact regulatory text
export function createBatteryTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Matte charcoal-black battery pouch
  ctx.fillStyle = '#111215';
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle perimeter weld line
  ctx.strokeStyle = '#1d1f24';
  ctx.lineWidth = 4;
  ctx.strokeRect(24, 24, 976, 976);

  // Regulatory silver-white text (high-contrast, sharp)
  const silver = '#e6eaf2';
  const muted = '#9da3af';

  ctx.fillStyle = silver;
  ctx.font = 'bold 36px sans-serif';
  ctx.fillText('Model / 型号: HE323', 60, 100);

  ctx.font = '26px sans-serif';
  ctx.fillText('Li-ion Polymer Rechargeable Battery', 60, 145);
  ctx.fillText('聚合物锂离子可充电电池', 60, 180);

  ctx.fillStyle = muted;
  ctx.font = '24px sans-serif';
  ctx.fillText('Nominal Voltage / 标称电压: 3.85V ===', 60, 230);
  ctx.fillText('Rated Capacity / 额定容量: 3040mAh / 11.70Wh', 60, 268);
  ctx.fillText('Charge Limited Voltage / 充电限制电压: 4.4V ===', 60, 306);
  ctx.fillText('Execution Standard / 执行标准: GB 31241-2014   1ICP5/61/69', 60, 344);

  // Warning text block
  ctx.fillStyle = silver;
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('WARNING / 注意事项:', 60, 410);

  ctx.fillStyle = muted;
  ctx.font = '21px sans-serif';
  ctx.fillText('• 为防止起火或者爆炸, 请勿拆解、穿刺、挤压、加热或燃烧。', 60, 448);
  ctx.fillText('• 仅可使用原厂指定充电器。浸水后严禁使用。', 60, 484);
  ctx.fillText('• Potential for fire or burning. Do not disassemble, puncture, crush or heat.', 60, 524);
  ctx.fillText('• No use of battery after water immersion. Dispose properly.', 60, 560);

  // Manufacturer line
  ctx.font = '22px sans-serif';
  ctx.fillText('Amperex Technology Limited / 新能源科技有限公司', 60, 620);

  // Certification symbols
  // 1. CE Mark
  ctx.strokeStyle = silver;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(760, 490, 48, Math.PI * 0.5, Math.PI * 1.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(840, 490, 48, Math.PI * 0.5, Math.PI * 1.5);
  ctx.stroke();
  ctx.fillRect(795, 487, 42, 6);

  // 2. Crossed-out trash can (WEEE)
  ctx.strokeRect(650, 450, 48, 68);
  ctx.beginPath();
  ctx.moveTo(640, 450);
  ctx.lineTo(710, 450);
  ctx.moveTo(645, 450);
  ctx.lineTo(705, 518);
  ctx.moveTo(705, 450);
  ctx.lineTo(645, 518);
  ctx.stroke();

  // 3. Recycling triangle
  ctx.beginPath();
  ctx.moveTo(780, 360);
  ctx.lineTo(820, 420);
  ctx.lineTo(740, 420);
  ctx.closePath();
  ctx.stroke();
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('Li-ion', 758, 410);

  // 4. Production Date & Barcode section
  ctx.fillStyle = silver;
  ctx.font = 'bold 28px monospace';
  ctx.fillText('生产日期: 20170526', 60, 710);

  // QR Code
  ctx.fillStyle = silver;
  ctx.fillRect(60, 760, 160, 160);
  ctx.fillStyle = '#111215';
  ctx.fillRect(76, 776, 128, 128);
  ctx.fillStyle = silver;
  ctx.fillRect(92, 792, 96, 96);
  ctx.fillStyle = '#111215';
  ctx.fillRect(108, 808, 64, 64);

  // Serial text & barcode simulation
  ctx.fillStyle = silver;
  ctx.font = '24px monospace';
  ctx.fillText('SN: AABPM100002S', 250, 810);
  ctx.fillText('LOT: 175260124542', 250, 850);
  ctx.fillText('MADE IN CHINA / 中国制造', 250, 890);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  return texture;
}

// Procedural high-resolution saturated green PCB texture
export function createPCBTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d');

  // Rich saturated industrial green PCB base
  ctx.fillStyle = '#1a6838';
  ctx.fillRect(0, 0, 1024, 2048);

  // Secondary copper plane polygons
  ctx.fillStyle = '#14572e';
  ctx.fillRect(40, 40, 944, 480);
  ctx.fillRect(40, 560, 360, 880);
  ctx.fillRect(40, 1500, 944, 500);

  // Saturated golden circuit trace bus lines
  ctx.strokeStyle = '#e0b53a';
  ctx.lineWidth = 3;
  for (let y = 60; y < 2000; y += 48) {
    ctx.beginPath();
    ctx.moveTo(60, y);
    ctx.lineTo(240, y);
    ctx.lineTo(320, y + 36);
    ctx.lineTo(680, y + 36);
    ctx.lineTo(760, y);
    ctx.lineTo(960, y);
    ctx.stroke();
  }

  // Micro circuit trace tracks along spine
  ctx.lineWidth = 2;
  for (let x = 80; x < 360; x += 16) {
    ctx.beginPath();
    ctx.moveTo(x, 560);
    ctx.lineTo(x, 1440);
    ctx.stroke();
  }

  // Golden circular test vias
  ctx.fillStyle = '#e8bf45';
  for (let i = 0; i < 400; i++) {
    const px = 50 + ((i * 127) % 920);
    const py = 50 + ((i * 257) % 1940);
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Silver solder pads / micro connectors
  ctx.fillStyle = '#e2e6ec';
  for (let i = 0; i < 80; i++) {
    const px = 80 + ((i * 190) % 860);
    const py = 80 + ((i * 160) % 1880);
    ctx.fillRect(px, py, 24, 14);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  return texture;
}

// Procedural barcode label texture for SIM / serial sticker
export function createBarcodeTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#f8f8fa';
  ctx.fillRect(0, 0, 256, 128);

  ctx.fillStyle = '#111215';
  ctx.font = 'bold 16px monospace';
  ctx.fillText('IMEI: 35894108', 20, 26);

  // Barcode vertical stripes
  let x = 20;
  const pattern = [2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 3, 1, 4, 1, 2, 3, 1, 2, 4, 1, 2, 3];
  pattern.forEach((w) => {
    ctx.fillRect(x, 34, w * 2.5, 54);
    x += w * 2.5 + 4;
  });

  ctx.font = '12px monospace';
  ctx.fillText('8901410321111851072', 20, 108);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export function makeMaterials() {
  const phys = (o) => new THREE.MeshPhysicalMaterial(o);
  const std = (o) => new THREE.MeshStandardMaterial(o);

  const batteryTex = createBatteryTexture();
  const pcbTex = createPCBTexture();
  const barcodeTex = createBarcodeTexture();

  return {
    // Ultra-glossy ceramic/glass back panel
    backCover: phys({
      color: PAL.black,
      roughness: 0.06,
      metalness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      reflectivity: 0.95,
    }),
    backCoverInner: std({
      color: '#1a1b1e',
      roughness: 0.6,
      metalness: 0.1,
    }),
    // Titanium / matte aluminum chassis perimeter
    midframe: std({
      color: PAL.titanium,
      roughness: 0.35,
      metalness: 0.85,
    }),
    // Machined inner magnesium / aluminum tray
    chassisInner: std({
      color: '#707782',
      roughness: 0.42,
      metalness: 0.65,
    }),
    antennaBand: std({
      color: '#111214',
      roughness: 0.7,
      metalness: 0.0,
    }),
    // Stamped aluminum heat shield plate
    heatShield: std({
      color: PAL.aluminum,
      roughness: 0.28,
      metalness: 0.92,
    }),
    // Radiant metallic copper for heat pipes
    copper: std({
      color: PAL.copper,
      roughness: 0.16,
      metalness: 0.98,
    }),
    // Thermal interface pads
    thermalMint: std({
      color: PAL.thermalMint,
      roughness: 0.65,
      metalness: 0.0,
    }),
    thermalYellow: std({
      color: PAL.thermalYellow,
      roughness: 0.65,
      metalness: 0.0,
    }),
    // Saturated green circuit board (PCB)
    pcb: std({
      map: pcbTex,
      color: '#ffffff',
      roughness: 0.40,
      metalness: 0.18,
    }),
    // Bright silver stamped RF shield cans
    rfCan: std({
      color: PAL.steel,
      roughness: 0.18,
      metalness: 0.96,
    }),
    // Polished gold connector contacts and springs
    gold: std({
      color: PAL.gold,
      roughness: 0.14,
      metalness: 0.95,
    }),
    // Black plastic IC package / chips
    chip: std({
      color: '#161719',
      roughness: 0.55,
      metalness: 0.05,
    }),
    // Battery pouch with silver regulatory print
    battery: std({
      map: batteryTex,
      color: '#ffffff',
      roughness: 0.38,
      metalness: 0.12,
    }),
    batteryEdge: std({
      color: '#111214',
      roughness: 0.6,
      metalness: 0.05,
    }),
    // Rear backing of display assembly
    displayRear: std({
      color: PAL.graphite,
      roughness: 0.40,
      metalness: 0.68,
    }),
    // Front display glass
    frontGlass: phys({
      color: '#08080a',
      roughness: 0.05,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.01,
      reflectivity: 0.95,
    }),
    screenFace: phys({
      color: '#0e1014',
      roughness: 0.10,
      metalness: 0.1,
      clearcoat: 0.85,
      clearcoatRoughness: 0.03,
    }),
    lens: phys({
      color: '#030406',
      roughness: 0.03,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.01,
    }),
    cameraHousing: std({
      color: '#2b2d33',
      roughness: 0.28,
      metalness: 0.88,
    }),
    // Amber Kapton polyimide flex ribbon cables
    kapton: phys({
      color: PAL.kapton,
      roughness: 0.28,
      metalness: 0.08,
      clearcoat: 0.8,
      clearcoatRoughness: 0.08,
      side: THREE.DoubleSide,
    }),
    blackFlex: std({
      color: '#151619',
      roughness: 0.48,
      metalness: 0.05,
      side: THREE.DoubleSide,
    }),
    coaxCable: std({
      color: '#0f1012',
      roughness: 0.65,
      metalness: 0.1,
    }),
    screw: std({
      color: PAL.steel,
      roughness: 0.16,
      metalness: 0.96,
    }),
    // Barcode sticker
    barcodeLabel: std({
      map: barcodeTex,
      color: '#ffffff',
      roughness: 0.75,
      metalness: 0.0,
    }),
  };
}

export function roundedBox(w, h, d, r, segs = 4) {
  return new RoundedBoxGeometry(w, h, d, segs, r);
}
