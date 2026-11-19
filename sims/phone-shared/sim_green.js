// Sim runner for smartphone teardown with Green Console interface.
import * as THREE from 'three';
import {runSim} from '../kit/runtime.js';
import {createConsole} from '../green/console.js';
import {makeCursor, makeLabels, nice} from '../green/look.js';
import {buildPhone} from './phone.js';
import {createStage} from './stage.js';

const ACTS = [
  ['overview', 'Overview'],
  ['optics', 'Optics'],
  ['board', 'Board'],
  ['shield', 'Shield'],
  ['battery', 'Battery'],
  ['exploded', 'Teardown'],
  ['hero', 'Release'],
];

const PAGE = {
  name: 'Aero 12',
  code: 'TEARDOWN',
  title: 'Smartphone Teardown, Taken Apart',
  date: '2026-11-19',
  sub: {
    overview: ['13 modular sub-assemblies', 'Flat studio teardown layout'],
    optics: ['Dual camera module & selfie cam', 'Sapphire lenses & flex cables'],
    board: ['Industrial green PCB', '4 RF shield cans & gold traces'],
    shield: ['Internal heat shield', 'Tubular copper heat pipe'],
    battery: ['3040 mAh Li-ion pouch', 'Model HE323, regulatory print'],
    exploded: ['Full 3D exploded view', 'Floating component turntable'],
    hero: ['Reassembled compact smartphone', 'Final hardware showcase'],
  },
  cards: [
    {k: 'Parts Count', kind: 'wave', unit: 'pcs'},
    {k: 'Chassis Integrity', kind: 'bar', unit: '%'},
    {k: 'Sub-circuits', kind: 'bars', n: 6},
    {k: 'Battery Health', kind: 'bar', unit: '%'},
  ],
};

const STATUS = {
  overview: 'Teardown overview',
  optics: 'Optics inspection',
  board: 'Logic board inspection',
  shield: 'Thermal pipe analysis',
  battery: 'Power cell inspection',
  exploded: '3D Exploded teardown',
  assemble: 'Reassembling hardware',
  hero: 'Hardware complete',
};

const ss = (a, b, t) => {
  const u = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return u * u * u * (u * (u * 6 - 15) + 10);
};

const lerp = (a, b, k) => a + (b - a) * k;

export function runPhoneGreen(TL = {}) {
  const DEFAULTS = {
    duration: TL.duration || 20.0,
    fps: 60,
    hud: {enabled: false},
    director: {enabled: false},
  };

  return runSim(DEFAULTS, async ({canvas, capture}) => {
    const app = document.getElementById('app') || document.body;
    const stage = createStage({canvas, floorY: 0.0});
    const phone = buildPhone();
    stage.addPhone(phone);

    const usedPills = new Set(TL.pills || ACTS.map(([k]) => k));
    const activeActs = ACTS.filter(([k]) => usedPills.has(k));

    const ui = createConsole(app, {
      ...PAGE,
      nav: [['overview', 'Overview'], ...activeActs.filter(([k]) => k !== 'overview')],
      pills: activeActs,
    });

    const cursorAt = makeCursor(ui, TL.script || [], (act) => (act === 'assemble' ? 'exploded' : act));
    const labels = makeLabels(stage, phone.anchors);

    const fit = () => {
      if (app && app.style) {
        const s = Math.min(innerWidth / 1600, innerHeight / 900);
        const x = Math.max(0, (innerWidth - 1600 * s) / 2);
        const y = Math.max(0, (innerHeight - 900 * s) / 2);
        app.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
      }
    };

    const resize = () => {
      fit();
      const dpr = capture ? 1.0 : Math.min(window.devicePixelRatio || 1, 2);
      stage.resize(1600, 900, dpr);
    };
    resize();

    // Default teardown pose
    phone.pose({teardown: 1.0, explode: 0.0});
    phone.root.updateMatrixWorld(true);

    const SCR = [...(TL.script || [])].sort((a, b) => a.t - b.t);

    return {
      resize,
      render(t) {
        // Still review mode at t = 0: pure clean studio overhead
        if (t === 0 || t == null) {
          phone.root.position.set(0, 0, 0);
          phone.root.rotation.set(0, 0, 0);
          phone.pose({teardown: 1.0, explode: 0.0});
          phone.root.updateMatrixWorld(true);
          stage.frame({
            cam: {
              pos: new THREE.Vector3(0, 14.8, 11.8),
              target: new THREE.Vector3(0, 0, 0.1),
            },
          });
          return {};
        }

        // Determine current act from timeline
        let currentAct = 'overview';
        for (let i = SCR.length - 1; i >= 0; i--) {
          if (t >= SCR[i].t) {
            currentAct = SCR[i].act;
            break;
          }
        }

        let teardown = 1.0;
        let explode = 0.0;
        const open = {};
        const camPos = new THREE.Vector3(0, 14.8, 11.8);
        const camTarget = new THREE.Vector3(0, 0, 0.1);
        let shiftX = -15;
        let shiftY = 110;
        let apartPct = 100;
        let labelOpacity = 0.92;
        let labelSet = [];

        // Reset root transforms by default
        phone.root.position.set(0, 0, 0);
        phone.root.rotation.set(0, 0, 0);
        if (phone.mat.screenFace) {
          phone.mat.screenFace.emissive.setRGB(0, 0, 0);
        }

        if (t < 2.8) {
          // Act 1: Overview
          const u = ss(0.0, 2.8, t);
          teardown = 1.0;
          explode = 0.0;
          camPos.set(lerp(0, -0.3, u), lerp(14.8, 14.0, u), lerp(11.8, 11.2, u));
          camTarget.set(0, 0, 0.1);
          shiftX = -15;
          shiftY = 80;
          apartPct = 100;
          labelSet = [
            ['TITANIUM FRAME', 'Midframe Chassis', 'Anodized 7000 Series'],
            ['BATTERY 3040 mAh', 'Li-ion Battery', '3040 mAh Pouch'],
            ['LOGIC BOARD', 'Logic Board', 'Industrial Green PCB'],
            ['FRONT SCREEN', 'OLED Screen', 'Gorilla Glass 5'],
          ];
        } else if (t < 6.2) {
          // Act 2: Optics
          const u = ss(2.8, 6.2, t);
          teardown = 1.0;
          explode = 0.0;
          const lift = Math.sin(u * Math.PI);
          open.cameras = lift * 0.45;
          camPos.set(lerp(-3.0, -3.4, u), lerp(4.5, 3.6, u), lerp(-0.5, -1.2, u));
          camTarget.set(-3.5, 0.35 + lift * 0.2, -2.8);
          shiftX = -15;
          shiftY = 115;
          apartPct = 90;
          labelSet = [
            ['DUAL CAMERA', 'Dual Camera Module', '12MP Dual-Pixel OIS'],
            ['TITANIUM FRAME', 'Camera Bay', 'CNC Milled Chassis'],
          ];
        } else if (t < 9.4) {
          // Act 3: Logic Board
          const u = ss(6.2, 9.4, t);
          teardown = 1.0;
          explode = 0.0;
          const lift = Math.sin(u * Math.PI);
          open.board = lift * 0.4;
          camPos.set(lerp(1.8, 1.3, u), lerp(4.8, 3.8, u), lerp(0.5, -0.2, u));
          camTarget.set(1.1, 0.3 + lift * 0.2, -2.0);
          shiftX = -15;
          shiftY = 115;
          apartPct = 85;
          labelSet = [
            ['LOGIC BOARD', 'Motherboard', '4 RF Shield Cans'],
          ];
        } else if (t < 12.2) {
          // Act 4: Heat Shield
          const u = ss(9.4, 12.2, t);
          teardown = 1.0;
          explode = 0.0;
          const lift = Math.sin(u * Math.PI);
          open.shield = lift * 0.45;
          camPos.set(lerp(-0.4, -0.8, u), lerp(4.6, 3.6, u), lerp(1.6, 0.9, u));
          camTarget.set(-1.1, 0.25 + lift * 0.2, -0.8);
          shiftX = -15;
          shiftY = 115;
          apartPct = 80;
          labelSet = [
            ['COPPER HEAT SHIELD', 'Heat Pipe', 'Sintered Pure Copper'],
          ];
        } else if (t < 14.6) {
          // Act 5: Battery
          const u = ss(12.2, 14.6, t);
          teardown = 1.0;
          explode = 0.0;
          const lift = Math.sin(u * Math.PI);
          open.battery = lift * 0.35;
          camPos.set(lerp(2.4, 1.9, u), lerp(4.2, 3.4, u), lerp(4.2, 3.6, u));
          camTarget.set(1.6, 0.25 + lift * 0.15, 2.0);
          shiftX = -15;
          shiftY = 115;
          apartPct = 75;
          labelSet = [
            ['BATTERY 3040 mAh', 'Power Cell', 'Model HE323, 3040 mAh'],
          ];
        } else if (t < 17.2) {
          // Act 6: 3D Exploded View
          const u = ss(14.6, 17.2, t);
          teardown = lerp(1.0, 0.0, Math.min(1.0, u * 1.8));
          explode = lerp(0.0, 1.0, Math.min(1.0, u * 1.5));
          const angle = lerp(0.25 * Math.PI, 1.35 * Math.PI, u);
          const radius = lerp(12.8, 12.0, u);
          camPos.set(Math.sin(angle) * radius, lerp(4.6, 3.8, u), Math.cos(angle) * radius);
          camTarget.set(0, 0.2, 0);
          shiftX = -15;
          shiftY = 95;
          apartPct = Math.round(explode * 100);
          labelSet = [
            ['REAR CERAMIC', 'Back Panel', 'Gorilla Glass 5'],
            ['TITANIUM FRAME', 'Midframe Chassis', '7000 Series Alloy'],
            ['LOGIC BOARD', 'Logic Board', 'RF Shield Cans'],
            ['BATTERY 3040 mAh', 'Battery', '3040 mAh Li-ion'],
            ['FRONT SCREEN', 'Display', 'Active OLED Matrix'],
          ];
        } else if (t < 18.4) {
          // Act 7: Reassembly Snap
          const u = ss(17.2, 18.4, t);
          teardown = 0.0;
          explode = lerp(1.0, 0.0, u);
          apartPct = Math.round(explode * 100);
          camPos.set(lerp(8.0, 4.2, u), lerp(4.2, 2.6, u), lerp(9.0, 10.8, u));
          camTarget.set(0, 0.2, 0);
          shiftX = -15;
          shiftY = 95;
          labelOpacity = 1.0 - u;
        } else {
          // Act 8: Hero Phone Showcase
          const u = ss(18.4, 20.0, t);
          teardown = 0.0;
          explode = 0.0;
          apartPct = 0;
          // Front 3/4 hero showcase: azimuth ~ 22 degrees
          camPos.set(lerp(3.6, 4.2, u), lerp(2.2, 1.8, u), lerp(10.5, 10.0, u));
          camTarget.set(0, 0.2, 0);
          phone.root.rotation.x = -8 * Math.PI / 180;
          phone.root.rotation.y = lerp(-10, 12, u) * Math.PI / 180;
          phone.root.position.y = 0.3;
          shiftX = -15;
          shiftY = 95;
          labelOpacity = u;
          labelSet = [
            ['FRONT SCREEN', 'Assembled Smartphone', 'Precision Fit & Finish'],
          ];
          if (phone.mat.screenFace) {
            phone.mat.screenFace.emissive.setRGB(0.06 * u, 0.22 * u, 0.12 * u);
          }
        }

        phone.pose({teardown, explode, open});
        phone.root.updateMatrixWorld(true);
        stage.frame({cam: {pos: camPos, target: camTarget, sx: shiftX, sy: shiftY}});

        // Dynamic telemetry values
        const integrity = 1.0 - (teardown * 0.95 + explode * 0.9);
        const partsCount = Math.max(1, Math.round(13 * (teardown + explode * 0.8)));
        const batteryHealth = 1.0;
        const waveData = [0.2, 0.5, 0.8, 0.6, 0.9, 0.4, 0.7, 0.3];

        ui.update({
          time: t,
          dur: TL.duration || 20.0,
          status: STATUS[currentAct] || nice(currentAct),
          cards: [
            {v: partsCount.toString(), wave: waveData},
            {v: Math.round(integrity * 100), bar: integrity},
            {bars: [0.85, 0.92, 0.78, 0.95, 0.88, 0.74]},
            {v: Math.round(batteryHealth * 100), bar: batteryHealth},
          ],
          apart: apartPct,
          view: currentAct === 'assemble' ? 'exploded' : currentAct,
          callouts: labels({set: labelSet, o: labelOpacity}),
          cursor: cursorAt(t),
        });

        return {};
      },
    };
  });
}
