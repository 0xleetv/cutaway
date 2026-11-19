// Phone 3D model with individual components, teardown layout, and assembly animations.
import * as THREE from 'three';
import {makeMaterials, PAL, roundedBox, V3} from './parts.js';

export const PHONE_W = 2.4;
export const PHONE_H = 4.9;
export const PHONE_D = 0.28;
export const PHONE_R = 0.22;

export function buildPhone() {
  const root = new THREE.Group();
  const mat = makeMaterials();
  const slots = {};
  const anchors = [];

  const addAnchor = (name, obj, offset = new V3()) => {
    anchors.push({name, obj, offset});
  };

  // -------------------------------------------------------------
  // 1. REAR COVER (Glossy black ceramic/glass back panel)
  // -------------------------------------------------------------
  const backGroup = new THREE.Group();
  root.add(backGroup);
  slots.BACK = backGroup;

  // Main ceramic plate
  const backGeo = roundedBox(PHONE_W, PHONE_H, 0.06, PHONE_R);
  const backMesh = new THREE.Mesh(backGeo, mat.backCover);
  backGroup.add(backMesh);

  // Dual camera opening rim & holes (top-left)
  const camBezel = new THREE.Mesh(
    new THREE.BoxGeometry(0.52, 0.76, 0.065),
    mat.cameraHousing
  );
  camBezel.position.set(-0.72, 1.95, 0.005);
  backGroup.add(camBezel);

  const lens1 = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.07, 16), mat.lens);
  lens1.rotation.x = Math.PI / 2;
  lens1.position.set(-0.72, 2.12, 0.01);
  backGroup.add(lens1);

  const lens2 = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.07, 16), mat.lens);
  lens2.rotation.x = Math.PI / 2;
  lens2.position.set(-0.72, 1.78, 0.01);
  backGroup.add(lens2);

  // Flash aperture
  const flash = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.07, 12), mat.gold);
  flash.rotation.x = Math.PI / 2;
  flash.position.set(-0.35, 2.12, 0.01);
  backGroup.add(flash);

  // Dual magnetic accessory connector dots (gold pins at top right)
  const pin1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.07, 12), mat.gold);
  pin1.rotation.x = Math.PI / 2;
  pin1.position.set(0.68, 2.12, 0.01);
  backGroup.add(pin1);

  const pin2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.07, 12), mat.gold);
  pin2.rotation.x = Math.PI / 2;
  pin2.position.set(0.88, 2.12, 0.01);
  backGroup.add(pin2);

  // Circular fingerprint sensor cutout hole
  const fpRing = new THREE.Mesh(new THREE.RingGeometry(0.24, 0.28, 24), mat.midframe);
  fpRing.position.set(0, 1.15, 0.032);
  backGroup.add(fpRing);

  const fpCenter = new THREE.Mesh(new THREE.CircleGeometry(0.24, 24), mat.backCoverInner);
  fpCenter.position.set(0, 1.15, 0.031);
  backGroup.add(fpCenter);

  addAnchor('REAR CERAMIC', backMesh, new V3(0, 0, 0.05));

  // -------------------------------------------------------------
  // 2. MIDFRAME CHASSIS (Titanium rim & CNC-machined structure)
  // -------------------------------------------------------------
  const frameGroup = new THREE.Group();
  root.add(frameGroup);
  slots.FRAME = frameGroup;

  // Solid base backplate of chassis
  const chassisBack = new THREE.Mesh(
    roundedBox(PHONE_W, PHONE_H, 0.06, PHONE_R),
    mat.midframe
  );
  chassisBack.position.set(0, 0, 0);
  frameGroup.add(chassisBack);

  // Raised titanium perimeter rim
  const rimLeft = new THREE.Mesh(new THREE.BoxGeometry(0.12, PHONE_H, 0.14), mat.midframe);
  rimLeft.position.set(-PHONE_W * 0.5 + 0.06, 0, 0.04);
  frameGroup.add(rimLeft);

  const rimRight = new THREE.Mesh(new THREE.BoxGeometry(0.12, PHONE_H, 0.14), mat.midframe);
  rimRight.position.set(PHONE_W * 0.5 - 0.06, 0, 0.04);
  frameGroup.add(rimRight);

  const rimTop = new THREE.Mesh(new THREE.BoxGeometry(PHONE_W, 0.12, 0.14), mat.midframe);
  rimTop.position.set(0, PHONE_H * 0.5 - 0.06, 0.04);
  frameGroup.add(rimTop);

  const rimBottom = new THREE.Mesh(new THREE.BoxGeometry(PHONE_W, 0.12, 0.14), mat.midframe);
  rimBottom.position.set(0, -PHONE_H * 0.5 + 0.06, 0.04);
  frameGroup.add(rimBottom);

  // Inner carved battery recess (dark matte cavity tray)
  const batteryRecess = new THREE.Mesh(
    new THREE.BoxGeometry(PHONE_W * 0.76, PHONE_H * 0.44, 0.02),
    mat.chassisInner
  );
  batteryRecess.position.set(0, -0.45, 0.04);
  frameGroup.add(batteryRecess);

  // Motherboard upper tray (machined silver plate)
  const boardTray = new THREE.Mesh(
    new THREE.BoxGeometry(PHONE_W * 0.82, PHONE_H * 0.38, 0.02),
    mat.heatShield
  );
  boardTray.position.set(0, 1.45, 0.04);
  frameGroup.add(boardTray);

  // Camera window hole through chassis
  const camHole = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.85, 0.05), mat.chassisInner);
  camHole.position.set(-0.72, 1.95, 0.045);
  frameGroup.add(camHole);

  // Fingerprint window hole through chassis
  const fpHole = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.05, 24), mat.chassisInner);
  fpHole.rotation.x = Math.PI / 2;
  fpHole.position.set(0, 1.15, 0.045);
  frameGroup.add(fpHole);

  // Antenna isolation bands (dark slits on frame edges)
  [-1.6, 1.6].forEach((y) => {
    [-1, 1].forEach((xSign) => {
      const ant = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.142), mat.antennaBand);
      ant.position.set(xSign * (PHONE_W * 0.5 - 0.02), y, 0.04);
      frameGroup.add(ant);
    });
  });

  // Standoff posts and screw bosses
  const postGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.06, 8);
  [
    [-0.9, 2.2], [0.9, 2.2], [-0.9, 0.6], [0.9, 0.6],
    [-0.9, -1.5], [0.9, -1.5], [-0.5, -2.2], [0.5, -2.2]
  ].forEach(([px, py]) => {
    const post = new THREE.Mesh(postGeo, mat.screw);
    post.position.set(px, py, 0.06);
    frameGroup.add(post);
  });

  addAnchor('TITANIUM FRAME', chassisBack, new V3(0, 0, 0.1));

  // -------------------------------------------------------------
  // 3. CAMERAS (Dual rear + selfie front module)
  // -------------------------------------------------------------
  const camGroup = new THREE.Group();
  root.add(camGroup);
  slots.CAMERAS = camGroup;

  // Dual camera module housing
  const dualCamBox = new THREE.Mesh(
    roundedBox(0.55, 0.82, 0.16, 0.04),
    mat.cameraHousing
  );
  dualCamBox.position.set(-0.4, 0, 0);
  camGroup.add(dualCamBox);

  // Twin camera lenses with metallic brass rims
  [-0.2, 0.2].forEach((yOff) => {
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.05, 16), mat.gold);
    rim.rotation.x = Math.PI / 2;
    rim.position.set(-0.4, yOff, 0.08);
    camGroup.add(rim);

    const camLens = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.06, 16), mat.lens);
    camLens.rotation.x = Math.PI / 2;
    camLens.position.set(-0.4, yOff, 0.085);
    camGroup.add(camLens);
  });

  // Dual cam flex cable with gold header
  const camFlex = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.45, 0.015), mat.kapton);
  camFlex.position.set(-0.05, 0.2, 0.04);
  camGroup.add(camFlex);

  const camHeader = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.08, 0.04), mat.gold);
  camHeader.position.set(-0.05, 0.42, 0.045);
  camGroup.add(camHeader);

  // Front selfie camera module
  const selfieBox = new THREE.Mesh(roundedBox(0.26, 0.26, 0.12, 0.03), mat.cameraHousing);
  selfieBox.position.set(0.45, 0.1, 0);
  camGroup.add(selfieBox);

  const selfieLens = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.05, 14), mat.lens);
  selfieLens.rotation.x = Math.PI / 2;
  selfieLens.position.set(0.45, 0.1, 0.06);
  camGroup.add(selfieLens);

  const selfieFlex = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.14, 0.015), mat.kapton);
  selfieFlex.position.set(0.7, 0.1, 0.03);
  camGroup.add(selfieFlex);

  const selfieHeader = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.16, 0.04), mat.gold);
  selfieHeader.position.set(0.88, 0.1, 0.035);
  camGroup.add(selfieHeader);

  addAnchor('DUAL CAMERA', dualCamBox, new V3(0, 0, 0.1));

  // -------------------------------------------------------------
  // 4. HEAT SHIELD (Stamped aluminum plate with radiant copper heat pipes)
  // -------------------------------------------------------------
  const shieldGroup = new THREE.Group();
  root.add(shieldGroup);
  slots.SHIELD = shieldGroup;

  const shieldPlate = new THREE.Mesh(
    roundedBox(PHONE_W * 0.94, PHONE_H * 0.94, 0.03, PHONE_R * 0.9),
    mat.heatShield
  );
  shieldGroup.add(shieldPlate);

  // Cutout over battery/chassis
  const shieldIndent = new THREE.Mesh(
    new THREE.BoxGeometry(PHONE_W * 0.72, PHONE_H * 0.44, 0.032),
    mat.chassisInner
  );
  shieldIndent.position.set(0.05, -0.45, -0.005);
  shieldGroup.add(shieldIndent);

  // Radiant copper heat pipe: Horizontal upper tube + Curved elbow + Vertical spine tube
  const pipeCurve = new THREE.CatmullRomCurve3([
    new V3(0.55, 1.72, 0.03),
    new V3(-0.65, 1.72, 0.03),
    new V3(-0.78, 1.58, 0.03),
    new V3(-0.78, 0.15, 0.03),
  ]);
  const pipeGeo = new THREE.TubeGeometry(pipeCurve, 24, 0.06, 12, false);
  const copperPipe = new THREE.Mesh(pipeGeo, mat.copper);
  shieldGroup.add(copperPipe);

  // Copper heat spreader plates
  const copperSpreader1 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.28, 0.02), mat.copper);
  copperSpreader1.position.set(0.55, 1.72, 0.02);
  shieldGroup.add(copperSpreader1);

  const copperSpreader2 = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.4, 0.02), mat.copper);
  copperSpreader2.position.set(-0.78, 0.15, 0.02);
  shieldGroup.add(copperSpreader2);

  // Thermal interface pads (mint green and yellow)
  const pad1 = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.26, 0.025), mat.thermalMint);
  pad1.position.set(0.55, 1.35, 0.02);
  shieldGroup.add(pad1);

  const pad2 = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.22, 0.025), mat.thermalYellow);
  pad2.position.set(0.55, 0.95, 0.02);
  shieldGroup.add(pad2);

  addAnchor('COPPER HEAT SHIELD', shieldPlate, new V3(0, 0, 0.05));

  // -------------------------------------------------------------
  // 5. MOTHERBOARD / LOGIC BOARD (Saturated green PCB + silver RF cans)
  // -------------------------------------------------------------
  const boardGroup = new THREE.Group();
  root.add(boardGroup);
  slots.BOARD = boardGroup;

  // L-shaped mainboard: Top rectangular block + Left spine block
  const pcbTop = new THREE.Mesh(
    new THREE.BoxGeometry(PHONE_W * 0.88, 1.4, 0.04),
    mat.pcb
  );
  pcbTop.position.set(0, 1.6, 0);
  boardGroup.add(pcbTop);

  const pcbSpine = new THREE.Mesh(
    new THREE.BoxGeometry(0.48, 1.8, 0.04),
    mat.pcb
  );
  pcbSpine.position.set(-0.76, 0.0, 0);
  boardGroup.add(pcbSpine);

  const pcbBottom = new THREE.Mesh(
    new THREE.BoxGeometry(PHONE_W * 0.84, 0.65, 0.04),
    mat.pcb
  );
  pcbBottom.position.set(0, -1.95, 0);
  boardGroup.add(pcbBottom);

  // Prominent silver RF shield cans with micro-vent borders
  const rfCan1 = new THREE.Mesh(roundedBox(0.74, 0.60, 0.08, 0.02), mat.rfCan);
  rfCan1.position.set(-0.45, 1.76, 0.04);
  boardGroup.add(rfCan1);

  const rfCan2 = new THREE.Mesh(roundedBox(0.88, 0.54, 0.08, 0.02), mat.rfCan);
  rfCan2.position.set(0.42, 1.78, 0.04);
  boardGroup.add(rfCan2);

  const rfCan3 = new THREE.Mesh(roundedBox(0.58, 0.46, 0.08, 0.02), mat.rfCan);
  rfCan3.position.set(0.45, 1.25, 0.04);
  boardGroup.add(rfCan3);

  const rfCan4 = new THREE.Mesh(roundedBox(0.42, 0.44, 0.08, 0.02), mat.rfCan);
  rfCan4.position.set(-0.45, 1.15, 0.04);
  boardGroup.add(rfCan4);

  // SMT IC chips and components
  [
    [-0.75, 0.4, 0.24, 0.22],
    [-0.75, -0.1, 0.20, 0.32],
    [-0.75, -0.6, 0.26, 0.22],
    [-0.4, -1.95, 0.36, 0.26],
    [0.4, -1.95, 0.42, 0.28],
  ].forEach(([cx, cy, cw, ch]) => {
    const chip = new THREE.Mesh(new THREE.BoxGeometry(cw, ch, 0.04), mat.chip);
    chip.position.set(cx, cy, 0.035);
    boardGroup.add(chip);
  });

  // Gold flex connectors on board
  [
    [-0.72, 2.2, 0.32, 0.09],
    [0.05, 2.2, 0.24, 0.09],
    [-0.75, 0.85, 0.16, 0.26],
    [-0.75, -1.3, 0.16, 0.26],
    [0.0, -1.75, 0.32, 0.09],
  ].forEach(([gx, gy, gw, gh]) => {
    const conn = new THREE.Mesh(new THREE.BoxGeometry(gw, gh, 0.05), mat.gold);
    conn.position.set(gx, gy, 0.035);
    boardGroup.add(conn);
  });

  // Dual black coaxial antenna cables routing down the spine with silver clips
  const coax1 = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 2.8, 8), mat.coaxCable);
  coax1.position.set(-0.62, 0.1, 0.04);
  boardGroup.add(coax1);

  const coax2 = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 2.8, 8), mat.coaxCable);
  coax2.position.set(-0.56, 0.1, 0.04);
  boardGroup.add(coax2);

  // Micro coaxial connector clips
  [-1.2, 1.4].forEach((y) => {
    const clip = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.05), mat.screw);
    clip.position.set(-0.59, y, 0.045);
    boardGroup.add(clip);
  });

  addAnchor('LOGIC BOARD', pcbTop, new V3(0, 0, 0.08));

  // -------------------------------------------------------------
  // 6. BATTERY (Matte black pouch with silver regulatory print)
  // -------------------------------------------------------------
  const batteryGroup = new THREE.Group();
  root.add(batteryGroup);
  slots.BATTERY = batteryGroup;

  const batMesh = new THREE.Mesh(
    roundedBox(PHONE_W * 0.74, PHONE_H * 0.42, 0.11, 0.05),
    mat.batteryEdge
  );
  batteryGroup.add(batMesh);

  // Top face printed label with silver regulatory text
  const batLabel = new THREE.Mesh(
    new THREE.PlaneGeometry(PHONE_W * 0.72, PHONE_H * 0.40),
    mat.battery
  );
  batLabel.position.set(0, 0, 0.056);
  batteryGroup.add(batLabel);

  // Black pull-tab & ribbon connector
  const batFlex = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.45, 0.015), mat.blackFlex);
  batFlex.position.set(-0.45, PHONE_H * 0.21 + 0.18, 0.04);
  batteryGroup.add(batFlex);

  const batConn = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.1, 0.04), mat.gold);
  batConn.position.set(-0.45, PHONE_H * 0.21 + 0.38, 0.04);
  batteryGroup.add(batConn);

  addAnchor('BATTERY 3040 mAh', batMesh, new V3(0, 0, 0.08));

  // -------------------------------------------------------------
  // 7. DISPLAY REAR (Backing metal plate with serpentine ribbon)
  // -------------------------------------------------------------
  const displayGroup = new THREE.Group();
  root.add(displayGroup);
  slots.DISPLAY = displayGroup;

  const dispPlate = new THREE.Mesh(
    roundedBox(PHONE_W * 0.94, PHONE_H * 0.94, 0.03, PHONE_R * 0.9),
    mat.displayRear
  );
  displayGroup.add(dispPlate);

  // Top camera notch cutout on display
  const notchCut = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.24, 0.04), mat.chassisInner);
  notchCut.position.set(0, PHONE_H * 0.47, 0);
  displayGroup.add(notchCut);

  // Serpentine black display flex ribbon cable running down center
  const ribbonCurve = new THREE.CatmullRomCurve3([
    new V3(0, 1.2, 0.02),
    new V3(0.35, 0.6, 0.02),
    new V3(-0.35, -0.2, 0.02),
    new V3(0.25, -1.0, 0.02),
    new V3(0, -1.7, 0.02),
  ]);
  const ribbonGeo = new THREE.TubeGeometry(ribbonCurve, 32, 0.028, 6, false);
  const ribbonMesh = new THREE.Mesh(ribbonGeo, mat.blackFlex);
  displayGroup.add(ribbonMesh);

  // Kapton / copper grounding tabs at bottom
  const kaptonTab = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.35, 0.015), mat.kapton);
  kaptonTab.position.set(0, -1.95, 0.02);
  displayGroup.add(kaptonTab);

  const dispConn = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.12, 0.04), mat.gold);
  dispConn.position.set(0, -2.15, 0.025);
  displayGroup.add(dispConn);

  addAnchor('DISPLAY ASSEMBLY', dispPlate, new V3(0, 0, 0.05));

  // -------------------------------------------------------------
  // 8. FRONT GLASS / SCREEN (Front display face)
  // -------------------------------------------------------------
  const screenGroup = new THREE.Group();
  root.add(screenGroup);
  slots.SCREEN = screenGroup;

  const frontMesh = new THREE.Mesh(
    roundedBox(PHONE_W, PHONE_H, 0.05, PHONE_R),
    mat.frontGlass
  );
  screenGroup.add(frontMesh);

  // Screen active OLED area
  const screenFace = new THREE.Mesh(
    new THREE.PlaneGeometry(PHONE_W * 0.92, PHONE_H * 0.92),
    mat.screenFace
  );
  screenFace.position.set(0, 0, 0.026);
  screenGroup.add(screenFace);

  // Speaker receiver slit at top rim
  const earSlit = new THREE.Mesh(
    new THREE.BoxGeometry(0.38, 0.04, 0.06),
    mat.antennaBand
  );
  earSlit.position.set(0, 2.32, 0.01);
  screenGroup.add(earSlit);

  // Front camera circle inside notch
  const notchCircle = new THREE.Mesh(
    new THREE.CircleGeometry(0.08, 16),
    mat.lens
  );
  notchCircle.position.set(0, 2.18, 0.027);
  screenGroup.add(notchCircle);

  addAnchor('FRONT SCREEN', frontMesh, new V3(0, 0, 0.05));

  // -------------------------------------------------------------
  // 9. SUB-ASSEMBLIES (Distinct pieces: Speaker, Coin motor, SIM tray, Barcode, Fingerprint)
  // -------------------------------------------------------------
  const subGroup = new THREE.Group();
  root.add(subGroup);
  slots.SUB = subGroup;

  // 9a. Bottom Speaker box enclosure
  const speakerBox = new THREE.Mesh(roundedBox(0.95, 0.45, 0.12, 0.04), mat.chip);
  speakerBox.position.set(-1.2, 0, 0);
  subGroup.add(speakerBox);

  // Gold antenna spring leaves on speaker box
  [-0.22, 0.22].forEach((xOff) => {
    const spring = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.04), mat.gold);
    spring.position.set(-1.2 + xOff, 0.16, 0.06);
    subGroup.add(spring);
  });

  // 9b. Coin vibration motor (silver disc with dark ring and two gold leaf springs)
  const vibMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.07, 24), mat.steel);
  vibMotor.rotation.x = Math.PI / 2;
  vibMotor.position.set(-0.35, 0, 0.035);
  subGroup.add(vibMotor);

  const vibCore = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.072, 16), mat.chip);
  vibCore.rotation.x = Math.PI / 2;
  vibCore.position.set(-0.35, 0, 0.036);
  subGroup.add(vibCore);

  [-0.05, 0.05].forEach((xOff) => {
    const contact = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 0.02), mat.gold);
    contact.position.set(-0.35 + xOff, 0.15, 0.06);
    subGroup.add(contact);
  });

  // 9c. Metal SIM tray (silver aluminum tray with black outer rim and eject pinhole)
  const simTray = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.30, 0.025), mat.steel);
  simTray.position.set(0.42, 0, 0.02);
  subGroup.add(simTray);

  const simBezel = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.30, 0.07), mat.titanium);
  simBezel.position.set(0.64, 0, 0.02);
  subGroup.add(simBezel);

  const simHole = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.20, 0.026), mat.chassisInner);
  simHole.position.set(0.38, 0, 0.02);
  subGroup.add(simHole);

  // 9d. White paper IMEI / serial barcode label
  const barcodeSticker = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.24), mat.barcodeLabel);
  barcodeSticker.position.set(0.95, 0, 0.02);
  subGroup.add(barcodeSticker);

  // 9e. Fingerprint sensor module on L-shaped Kapton ribbon
  const fpDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.05, 24), mat.chip);
  fpDisc.rotation.x = Math.PI / 2;
  fpDisc.position.set(1.65, 0, 0.025);
  subGroup.add(fpDisc);

  const fpBezel = new THREE.Mesh(new THREE.RingGeometry(0.24, 0.26, 24), mat.titanium);
  fpBezel.position.set(1.65, 0, 0.051);
  subGroup.add(fpBezel);

  // L-shaped Kapton ribbon cable extending up and left
  const fpFlex1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.65, 0.015), mat.kapton);
  fpFlex1.position.set(1.65, 0.45, 0.02);
  subGroup.add(fpFlex1);

  const fpFlex2 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 0.015), mat.kapton);
  fpFlex2.position.set(1.48, 0.72, 0.02);
  subGroup.add(fpFlex2);

  const fpConn = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.10, 0.04), mat.gold);
  fpConn.position.set(1.32, 0.72, 0.035);
  subGroup.add(fpConn);

  addAnchor('SUB MODULES', speakerBox, new V3(0, 0, 0.05));

  // -------------------------------------------------------------
  // POSE FUNCTION: Assembled vs Teardown Layout
  // -------------------------------------------------------------
  const D2R = Math.PI / 180;
  const FLAT_X = -Math.PI / 2; // Lie flat on table with normal pointing UP (+Y)

  // Teardown target positions (flat on table matching iFixit reference picture)
  // X: left to right across table
  // Y: table elevation (just above floor Y=0)
  // Z: front to back (top of phone is -Z, bottom is +Z)
  const TEARDOWN_POS = {
    BACK: {pos: new V3(-6.2, 0.04, -0.1), rot: new V3(FLAT_X, 0, -14 * D2R)},
    CAMERAS: {pos: new V3(-3.5, 0.12, -3.2), rot: new V3(FLAT_X, 0, -3 * D2R)},
    FRAME: {pos: new V3(-3.5, 0.10, -0.2), rot: new V3(FLAT_X, 0, -3 * D2R)},
    SUB: {pos: new V3(-3.5, 0.08, 3.2), rot: new V3(FLAT_X, 0, 0)},
    SHIELD: {pos: new V3(-1.1, 0.06, -0.2), rot: new V3(FLAT_X, 0, 0)},
    BOARD: {pos: new V3(1.1, 0.08, -1.0), rot: new V3(FLAT_X, 0, 0)},
    BATTERY: {pos: new V3(1.6, 0.07, 2.0), rot: new V3(FLAT_X, 0, 0)},
    DISPLAY: {pos: new V3(3.6, 0.06, -0.2), rot: new V3(FLAT_X, 0, 0)},
    SCREEN: {pos: new V3(6.0, 0.04, -0.1), rot: new V3(FLAT_X, 0, -4 * D2R)},
  };

  // Assembled positions (compact smartphone standing upright or lying)
  const ASSEMBLED_POS = {
    BACK: {pos: new V3(0, 0, -0.08), rot: new V3(0, 0, 0)},
    CAMERAS: {pos: new V3(0, 0, -0.04), rot: new V3(0, 0, 0)},
    FRAME: {pos: new V3(0, 0, 0), rot: new V3(0, 0, 0)},
    SUB: {pos: new V3(0, 0, 0.01), rot: new V3(0, 0, 0)},
    SHIELD: {pos: new V3(0, 0, 0.02), rot: new V3(0, 0, 0)},
    BOARD: {pos: new V3(0, 0, 0.02), rot: new V3(0, 0, 0)},
    BATTERY: {pos: new V3(0, -0.45, 0.01), rot: new V3(0, 0, 0)},
    DISPLAY: {pos: new V3(0, 0, 0.05), rot: new V3(0, 0, 0)},
    SCREEN: {pos: new V3(0, 0, 0.08), rot: new V3(0, 0, 0)},
  };

  // Exploded 3D positions (for film and interactive CAD breakdown)
  const EXPLODE_POS = {
    BACK: {pos: new V3(0, 0, -1.8), rot: new V3(0, 0, 0)},
    CAMERAS: {pos: new V3(-0.6, 1.2, -0.8), rot: new V3(0, 0, 0)},
    FRAME: {pos: new V3(0, 0, 0), rot: new V3(0, 0, 0)},
    SUB: {pos: new V3(0, -1.4, 0.4), rot: new V3(0, 0, 0)},
    SHIELD: {pos: new V3(0, 0, 0.7), rot: new V3(0, 0, 0)},
    BOARD: {pos: new V3(0, 0.8, 1.3), rot: new V3(0, 0, 0)},
    BATTERY: {pos: new V3(0, -0.8, 1.1), rot: new V3(0, 0, 0)},
    DISPLAY: {pos: new V3(0, 0, 1.9), rot: new V3(0, 0, 0)},
    SCREEN: {pos: new V3(0, 0, 2.6), rot: new V3(0, 0, 0)},
  };

  const pose = ({teardown = 1.0, explode = 0.0, open = {}} = {}) => {
    const kTea = Math.max(0, Math.min(1, teardown));
    const kExp = Math.max(0, Math.min(1, explode));

    Object.keys(slots).forEach((key) => {
      const g = slots[key];
      const tea = TEARDOWN_POS[key];
      const ass = ASSEMBLED_POS[key];
      const exp = EXPLODE_POS[key];

      if (!tea || !ass || !exp) return;

      // Base pose between assembled and exploded
      const basePos = new V3().lerpVectors(ass.pos, exp.pos, kExp);
      const baseRot = new V3().lerpVectors(ass.rot, exp.rot, kExp);

      // Interpolate with teardown
      g.position.lerpVectors(basePos, tea.pos, kTea);
      g.rotation.set(
        THREE.MathUtils.lerp(baseRot.x, tea.rot.x, kTea),
        THREE.MathUtils.lerp(baseRot.y, tea.rot.y, kTea),
        THREE.MathUtils.lerp(baseRot.z, tea.rot.z, kTea)
      );

      // Per-component focus/open offset
      if (open[key.toLowerCase()]) {
        g.position.y += open[key.toLowerCase()] * 0.5;
      }
    });

    // When approaching assembled phone, cleanly tuck sub-modules and display backing inside
    if (slots.SUB) {
      const looseScale = Math.min(1.0, kTea * 1.5 + kExp * 1.2);
      slots.SUB.scale.setScalar(Math.max(0.001, looseScale));
    }
    if (slots.DISPLAY) {
      slots.DISPLAY.visible = kTea > 0.08 || kExp > 0.08;
    }
  };

  // Initial pose in teardown mode
  pose({teardown: 1.0});

  return {root, slots, anchors, pose, mat};
}
