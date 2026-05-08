import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Beaker, RefreshCw, Zap, CheckCircle2, ChevronRight,
  RotateCcw, Eye, EyeOff, GitBranch, Box,
} from 'lucide-react';
import * as THREE from 'three';
import { cn } from '../../lib/utils';
 
// ─── Data ────────────────────────────────────────────────────────────────────
 
interface AtomDef {
  symbol: string;
  position: [number, number, number];
  radius: number;   // van-der-Waals scale (relative)
  color: number;    // hex
}
 
interface Molecule {
  id: string;
  name: string;
  formula: string;
  type: 'Covalent' | 'Ionic';
  subtype: string;
  geometry: string;
  bondAngle: string;
  stability: string;
  stabilityColor: string;
  lewis: string;
  description: string;
  facts: { label: string; value: string }[];
  atoms: AtomDef[];
  bonds: [number, number][];
}
 
const MOLECULES: Molecule[] = [
  {
    id: 'H2O', name: 'Water', formula: 'H₂O',
    type: 'Covalent', subtype: 'Polar Covalent',
    geometry: 'Bent / V-shaped', bondAngle: '104.5°',
    stability: 'High', stabilityColor: '#69f0ae',
    lewis: 'O\n|   |\nH   H\n(2 lone pairs on O)',
    description: 'A polar molecule with an asymmetric bent shape. Two lone pairs on oxygen compress the bond angle below the tetrahedral 109.5°, creating a strong molecular dipole.',
    facts: [
      { label: 'Boiling point', value: '100 °C' },
      { label: 'Melting point', value: '0 °C' },
      { label: 'Dipole moment', value: '1.85 D' },
      { label: 'Bond length', value: '0.96 Å' },
      { label: 'Hybridisation', value: 'sp³' },
    ],
    atoms: [
      { symbol: 'O', position: [0, 0, 0],     radius: 0.73, color: 0xff4444 },
      { symbol: 'H', position: [1.2, 0.85, 0],  radius: 0.31, color: 0xdddddd },
      { symbol: 'H', position: [-1.2, 0.85, 0], radius: 0.31, color: 0xdddddd },
    ],
    bonds: [[0, 1], [0, 2]],
  },
  {
    id: 'CO2', name: 'Carbon Dioxide', formula: 'CO₂',
    type: 'Covalent', subtype: 'Non-polar Covalent',
    geometry: 'Linear', bondAngle: '180°',
    stability: 'High', stabilityColor: '#69f0ae',
    lewis: 'O = C = O\n(double bonds)',
    description: 'A linear, non-polar molecule. Despite having two polar C=O bonds, its perfect 180° symmetry causes the dipoles to cancel completely.',
    facts: [
      { label: 'Boiling point', value: '−78.5 °C' },
      { label: 'Bond order', value: '2 (double bond)' },
      { label: 'Dipole moment', value: '0 D' },
      { label: 'Bond length', value: '1.16 Å' },
      { label: 'Hybridisation', value: 'sp' },
    ],
    atoms: [
      { symbol: 'C', position: [0, 0, 0],     radius: 0.77, color: 0x666666 },
      { symbol: 'O', position: [1.55, 0, 0],   radius: 0.73, color: 0xff4444 },
      { symbol: 'O', position: [-1.55, 0, 0],  radius: 0.73, color: 0xff4444 },
    ],
    bonds: [[0, 1], [0, 2]],
  },
  {
    id: 'NH3', name: 'Ammonia', formula: 'NH₃',
    type: 'Covalent', subtype: 'Polar Covalent',
    geometry: 'Trigonal Pyramidal', bondAngle: '107.3°',
    stability: 'High', stabilityColor: '#69f0ae',
    lewis: 'N (lone pair at apex)\n/ | \\\nH  H  H',
    description: 'A trigonal pyramidal molecule with one lone pair on nitrogen. The lone pair repels the three N-H bonds downward, reducing the angle slightly below tetrahedral.',
    facts: [
      { label: 'Boiling point', value: '−33.3 °C' },
      { label: 'Melting point', value: '−77.7 °C' },
      { label: 'Dipole moment', value: '1.47 D' },
      { label: 'Bond length', value: '1.01 Å' },
      { label: 'Hybridisation', value: 'sp³' },
    ],
    atoms: [
      { symbol: 'N', position: [0, 0.4, 0],        radius: 0.75, color: 0x4488ff },
      { symbol: 'H', position: [1.1, -0.4, 0],      radius: 0.31, color: 0xdddddd },
      { symbol: 'H', position: [-0.55, -0.4, 0.95], radius: 0.31, color: 0xdddddd },
      { symbol: 'H', position: [-0.55, -0.4, -0.95],radius: 0.31, color: 0xdddddd },
    ],
    bonds: [[0, 1], [0, 2], [0, 3]],
  },
  {
    id: 'CH4', name: 'Methane', formula: 'CH₄',
    type: 'Covalent', subtype: 'Non-polar Covalent',
    geometry: 'Tetrahedral', bondAngle: '109.5°',
    stability: 'Very High', stabilityColor: '#69f0ae',
    lewis: '   H\n   |\nH–C–H\n   |\n   H',
    description: 'Perfect tetrahedral geometry. Carbon forms four equal sp³ bonds with no lone pairs, resulting in a symmetric, non-polar molecule with the ideal 109.5° angles.',
    facts: [
      { label: 'Boiling point', value: '−161.5 °C' },
      { label: 'Melting point', value: '−182.5 °C' },
      { label: 'Dipole moment', value: '0 D' },
      { label: 'Bond length', value: '1.09 Å' },
      { label: 'Hybridisation', value: 'sp³' },
    ],
    atoms: [
      { symbol: 'C', position: [0, 0, 0],         radius: 0.77, color: 0x666666 },
      { symbol: 'H', position: [1.1, 1.1, 1.1],   radius: 0.31, color: 0xdddddd },
      { symbol: 'H', position: [-1.1, -1.1, 1.1], radius: 0.31, color: 0xdddddd },
      { symbol: 'H', position: [-1.1, 1.1, -1.1], radius: 0.31, color: 0xdddddd },
      { symbol: 'H', position: [1.1, -1.1, -1.1], radius: 0.31, color: 0xdddddd },
    ],
    bonds: [[0, 1], [0, 2], [0, 3], [0, 4]],
  },
  {
    id: 'NaCl', name: 'Sodium Chloride', formula: 'NaCl',
    type: 'Ionic', subtype: 'Ionic Bond',
    geometry: 'Cubic Lattice', bondAngle: 'N/A',
    stability: 'High', stabilityColor: '#69f0ae',
    lewis: '[Na]⁺   [:Cl:]⁻\nElectron transfer: Na → Cl',
    description: 'An ionic compound formed when sodium transfers its valence electron to chlorine. The resulting opposite charges create a strong electrostatic lattice with a high melting point.',
    facts: [
      { label: 'Melting point', value: '801 °C' },
      { label: 'Boiling point', value: '1413 °C' },
      { label: 'Lattice energy', value: '787 kJ/mol' },
      { label: 'Electronegativity Δ', value: '2.1' },
      { label: 'Crystal structure', value: 'Face-centred cubic' },
    ],
    atoms: [
      { symbol: 'Na', position: [-1.1, 0, 0], radius: 0.95, color: 0xaa66ff },
      { symbol: 'Cl', position: [1.1, 0, 0],  radius: 1.02, color: 0x44cc66 },
    ],
    bonds: [[0, 1]],
  },
  {
    id: 'BF3', name: 'Boron Trifluoride', formula: 'BF₃',
    type: 'Covalent', subtype: 'Non-polar Covalent',
    geometry: 'Trigonal Planar', bondAngle: '120°',
    stability: 'High', stabilityColor: '#69f0ae',
    lewis: 'F – B – F\n      |\n      F\n(no lone pairs on B)',
    description: 'Trigonal planar with 120° bond angles. Boron has only 6 valence electrons, making it electron-deficient (a Lewis acid). All atoms lie in the same plane.',
    facts: [
      { label: 'Boiling point', value: '−101 °C' },
      { label: 'Melting point', value: '−127 °C' },
      { label: 'Dipole moment', value: '0 D' },
      { label: 'Bond length', value: '1.31 Å' },
      { label: 'Hybridisation', value: 'sp²' },
    ],
    atoms: [
      { symbol: 'B', position: [0, 0, 0],          radius: 0.87, color: 0xffd54f },
      { symbol: 'F', position: [1.3, 0, 0],         radius: 0.64, color: 0x00e5ff },
      { symbol: 'F', position: [-0.65, 1.13, 0],    radius: 0.64, color: 0x00e5ff },
      { symbol: 'F', position: [-0.65, -1.13, 0],   radius: 0.64, color: 0x00e5ff },
    ],
    bonds: [[0, 1], [0, 2], [0, 3]],
  },
];
 
const ELEMENT_COLORS: Record<string, { hex: number; css: string; text: string }> = {
  H:  { hex: 0xdddddd, css: '#dddddd', text: '#111' },
  C:  { hex: 0x666666, css: '#666666', text: '#fff' },
  N:  { hex: 0x4488ff, css: '#4488ff', text: '#fff' },
  O:  { hex: 0xff4444, css: '#ff4444', text: '#fff' },
  F:  { hex: 0x00e5ff, css: '#00e5ff', text: '#000' },
  B:  { hex: 0xffd54f, css: '#ffd54f', text: '#111' },
  Na: { hex: 0xaa66ff, css: '#aa66ff', text: '#fff' },
  Cl: { hex: 0x44cc66, css: '#44cc66', text: '#fff' },
};
 
// ─── Molecule Viewer (Three.js) ───────────────────────────────────────────────
 
interface ViewerProps {
  molecule: Molecule;
  showLabels: boolean;
  showBonds: boolean;
  wireframe: boolean;
  autoRotate: boolean;
  rotateSpeed: number;
}
 
const MoleculeViewer3D: React.FC<ViewerProps> = ({
  molecule, showLabels, showBonds, wireframe, autoRotate, rotateSpeed,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    scene: null as THREE.Scene | null,
    camera: null as THREE.PerspectiveCamera | null,
    renderer: null as THREE.WebGLRenderer | null,
    molGroup: null as THREE.Group | null,
    animId: 0,
    isDragging: false,
    prevX: 0, prevY: 0,
    rotX: 0.3, rotY: 0.3,
    time: 0,
  });
 
  // ── helpers ──────────────────────────────────────────────────────────────
 
  const makeLabel = useCallback((text: string, hexColor: number): THREE.Sprite => {
    const c = document.createElement('canvas');
    c.width = 128; c.height = 64;
    const ctx = c.getContext('2d')!;
    const css = '#' + hexColor.toString(16).padStart(6, '0');
    ctx.clearRect(0, 0, 128, 64);
    ctx.fillStyle = 'rgba(3,8,17,0.88)';
    ctx.beginPath();
    ctx.roundRect(4, 8, 120, 48, 8);
    ctx.fill();
    ctx.strokeStyle = css;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(4, 8, 120, 48, 8);
    ctx.stroke();
    ctx.fillStyle = css;
    ctx.font = 'bold 28px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 64, 34);
    const tex = new THREE.CanvasTexture(c);
    const mat = new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(0.8, 0.4, 1);
    return sprite;
  }, []);
 
  const cylBetween = useCallback((
    p1: THREE.Vector3, p2: THREE.Vector3, isIonic: boolean,
  ): THREE.Mesh => {
    const dir = new THREE.Vector3().subVectors(p2, p1);
    const len = dir.length();
    const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    const geo = new THREE.CylinderGeometry(0.065, 0.065, len, 14);
    const color = isIonic ? 0xffd54f : 0x00aacc;
    const mat = new THREE.MeshStandardMaterial({
      color, metalness: 0.3, roughness: 0.4,
      emissive: color, emissiveIntensity: 0.18,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(mid);
    mesh.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.normalize(),
    );
    return mesh;
  }, []);
 
  // ── build/rebuild molecule meshes ────────────────────────────────────────
 
  const buildMolecule = useCallback(() => {
    const s = stateRef.current;
    if (!s.molGroup || !s.scene) return;
 
    while (s.molGroup.children.length > 0)
      s.molGroup.remove(s.molGroup.children[0]);
 
    // centre atoms
    const positions = molecule.atoms.map(a => new THREE.Vector3(...a.position));
    const centre = new THREE.Vector3();
    positions.forEach(p => centre.add(p));
    centre.divideScalar(positions.length);
    positions.forEach(p => p.sub(centre));
 
    // bonds
    if (showBonds) {
      molecule.bonds.forEach(([i, j]) => {
        s.molGroup!.add(cylBetween(positions[i], positions[j], molecule.type === 'Ionic'));
      });
    }
 
    // atoms
    molecule.atoms.forEach((atom, i) => {
      const r = atom.radius * 0.6 + 0.18;
      const geo = new THREE.SphereGeometry(r, 32, 32);
      const mat = new THREE.MeshStandardMaterial({
        color: atom.color,
        metalness: 0.18, roughness: wireframe ? 1 : 0.32,
        emissive: atom.color, emissiveIntensity: wireframe ? 0 : 0.1,
        wireframe,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(positions[i]);
      s.molGroup!.add(mesh);
 
      if (showLabels) {
        const lbl = makeLabel(atom.symbol, atom.color);
        lbl.position.copy(positions[i]);
        lbl.position.y += r + 0.32;
        s.molGroup!.add(lbl);
      }
    });
  }, [molecule, showLabels, showBonds, wireframe, cylBetween, makeLabel]);
 
  // ── init Three.js (once) ─────────────────────────────────────────────────
 
  useEffect(() => {
    const canvas = canvasRef.current!;
    const s = stateRef.current;
 
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x030811, 1);
    renderer.shadowMap.enabled = true;
    s.renderer = renderer;
 
    const scene = new THREE.Scene();
    s.scene = scene;
 
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 8;
    s.camera = camera;
 
    scene.add(new THREE.AmbientLight(0x112244, 1.4));
    const dl = new THREE.DirectionalLight(0xffffff, 2.2);
    dl.position.set(5, 8, 5);
    scene.add(dl);
    const dl2 = new THREE.DirectionalLight(0x00aaff, 0.9);
    dl2.position.set(-5, -3, -5);
    scene.add(dl2);
    const pl = new THREE.PointLight(0x00e5ff, 1.6, 30);
    pl.position.set(0, 5, 5);
    scene.add(pl);
 
    const molGroup = new THREE.Group();
    scene.add(molGroup);
    s.molGroup = molGroup;
 
    // resize
    const ro = new ResizeObserver(() => {
      const w = canvas.parentElement!.clientWidth;
      const h = canvas.parentElement!.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    ro.observe(canvas.parentElement!);
    const w = canvas.parentElement!.clientWidth;
    const h = canvas.parentElement!.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
 
    // drag
    const onDown = (x: number, y: number) => { s.isDragging = true; s.prevX = x; s.prevY = y; };
    const onMove = (x: number, y: number) => {
      if (!s.isDragging) return;
      s.rotY += (x - s.prevX) * 0.012;
      s.rotX += (y - s.prevY) * 0.012;
      s.prevX = x; s.prevY = y;
    };
    const onUp = () => { s.isDragging = false; };
    canvas.addEventListener('mousedown', e => onDown(e.clientX, e.clientY));
    canvas.addEventListener('mousemove', e => onMove(e.clientX, e.clientY));
    canvas.addEventListener('mouseup', onUp);
    canvas.addEventListener('mouseleave', onUp);
    canvas.addEventListener('touchstart', e => onDown(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    canvas.addEventListener('touchmove', e => onMove(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    canvas.addEventListener('touchend', onUp);
    canvas.addEventListener('wheel', e => {
      camera.position.z = Math.max(3, Math.min(15, camera.position.z + e.deltaY * 0.012));
    }, { passive: true });
 
    // animate
    const loop = () => {
      s.animId = requestAnimationFrame(loop);
      s.time += 0.016;
      if (autoRotate && !s.isDragging) s.rotY += 0.006 * rotateSpeed;
      s.molGroup!.rotation.x = s.rotX;
      s.molGroup!.rotation.y = s.rotY;
      const breathe = 1 + Math.sin(s.time * 1.2) * 0.013;
      s.molGroup!.scale.setScalar(breathe);
      renderer.render(scene, camera);
    };
    loop();
 
    return () => {
      cancelAnimationFrame(s.animId);
      ro.disconnect();
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 
  // keep autoRotate / rotateSpeed live without re-init
  useEffect(() => {
    const s = stateRef.current;
    // patch into the closure by reassigning the loop reference via a flag
    // (we capture autoRotate and rotateSpeed in the render loop via closure update trick)
    // Since loop captures `autoRotate` via closure, we trigger a re-render of the loop:
    cancelAnimationFrame(s.animId);
    const loop = () => {
      s.animId = requestAnimationFrame(loop);
      s.time += 0.016;
      if (autoRotate && !s.isDragging) s.rotY += 0.006 * rotateSpeed;
      s.molGroup!.rotation.x = s.rotX;
      s.molGroup!.rotation.y = s.rotY;
      const breathe = 1 + Math.sin(s.time * 1.2) * 0.013;
      s.molGroup!.scale.setScalar(breathe);
      s.renderer!.render(s.scene!, s.camera!);
    };
    loop();
    return () => cancelAnimationFrame(s.animId);
  }, [autoRotate, rotateSpeed]);
 
  // rebuild meshes whenever molecule / display options change
  useEffect(() => {
    buildMolecule();
    stateRef.current.rotX = 0.3;
    stateRef.current.rotY = 0.3;
  }, [buildMolecule]);
 
  return <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />;
};
 
// ─── Main Component ───────────────────────────────────────────────────────────
 
type InfoTab = 'desc' | 'lewis' | 'facts';
 
export const BondSimulator: React.FC = () => {
  const [selected, setSelected] = useState<Molecule>(MOLECULES[0]);
  const [infoTab, setInfoTab] = useState<InfoTab>('desc');
  const [autoRotate, setAutoRotate] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showBonds, setShowBonds] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [rotateSpeed, setRotateSpeed] = useState(1.0);
 
  // unique elements across all molecules
  const usedSymbols = Array.from(
    new Set(MOLECULES.flatMap(m => m.atoms.map(a => a.symbol)))
  );
 
  const handleSelect = (mol: Molecule) => {
    setSelected(mol);
    setInfoTab('desc');
  };
 
  return (
    <div className="min-h-[calc(100vh-80px)] p-4 lg:p-6 flex flex-col gap-5 bg-[#030811]">
 
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Zap size={18} />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Bond Simulation Lab</h2>
          </div>
          <p className="text-white/40 text-sm ml-11">Select a molecule · drag to rotate · scroll to zoom</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setAutoRotate(true); setShowLabels(true); setShowBonds(true); setWireframe(false); setRotateSpeed(1); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-bold hover:bg-white/10 transition-colors text-white/70"
          >
            <RefreshCw size={15} /> Reset View
          </button>
        </div>
      </div>
 
      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 flex-1">
 
        {/* ── Left panel ── */}
        <div className="xl:col-span-3 flex flex-col gap-5 order-2 xl:order-1">
 
          {/* Element legend */}
          <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
            <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-3">Elements</p>
            <div className="grid grid-cols-4 gap-2">
              {usedSymbols.map(sym => {
                const el = ELEMENT_COLORS[sym];
                if (!el) return null;
                return (
                  <div key={sym} className="flex flex-col items-center gap-1">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-inner border border-white/5"
                      style={{ background: el.css + '22', color: el.css, borderColor: el.css + '44' }}
                    >
                      {sym}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
 
          {/* Molecule list */}
          <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md flex-1">
            <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-3">Molecules</p>
            <div className="space-y-2">
              {MOLECULES.map(mol => (
                <button
                  key={mol.id}
                  onClick={() => handleSelect(mol)}
                  className={cn(
                    'w-full p-3.5 rounded-xl border transition-all text-left flex items-center justify-between group',
                    selected.id === mol.id
                      ? 'bg-cyan-500/10 border-cyan-500/40'
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.06] hover:border-white/15',
                  )}
                >
                  <div>
                    <span className={cn(
                      'text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md mr-0',
                      mol.type === 'Ionic'
                        ? 'bg-yellow-500/15 text-yellow-400'
                        : 'bg-cyan-500/15 text-cyan-400',
                    )}>
                      {mol.type}
                    </span>
                    <h3 className="font-black text-base text-white mt-1">{mol.name}</h3>
                    <p className="text-cyan-400/80 font-mono text-xs">{mol.formula}</p>
                  </div>
                  <div className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center transition-all shrink-0',
                    selected.id === mol.id ? 'bg-cyan-500 text-white' : 'bg-white/5 text-white/20 group-hover:bg-white/10',
                  )}>
                    <ChevronRight size={15} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
 
        {/* ── Center: 3D viewer ── */}
        <div className="xl:col-span-6 order-1 xl:order-2 flex flex-col gap-3">
 
          {/* Viewer controls strip */}
          <div className="flex flex-wrap gap-2 px-1">
            {[
              { label: autoRotate ? 'Auto ⟳' : 'Paused', icon: <RotateCcw size={13}/>, active: autoRotate, onClick: () => setAutoRotate(v => !v) },
              { label: showLabels ? 'Labels On' : 'Labels Off', icon: <Eye size={13}/>, active: showLabels, onClick: () => setShowLabels(v => !v) },
              { label: showBonds ? 'Bonds On' : 'Bonds Off', icon: <GitBranch size={13}/>, active: showBonds, onClick: () => setShowBonds(v => !v) },
              { label: wireframe ? 'Wireframe' : 'Solid', icon: <Box size={13}/>, active: wireframe, onClick: () => setWireframe(v => !v) },
            ].map(btn => (
              <button
                key={btn.label}
                onClick={btn.onClick}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all',
                  btn.active
                    ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400'
                    : 'bg-white/[0.04] border-white/10 text-white/40 hover:text-white/70',
                )}
              >
                {btn.icon} {btn.label}
              </button>
            ))}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-[10px] text-white/30 uppercase tracking-widest">Speed</span>
              <input
                type="range" min={0.2} max={3} step={0.1}
                value={rotateSpeed}
                onChange={e => setRotateSpeed(parseFloat(e.target.value))}
                className="w-20 accent-cyan-500"
              />
              <span className="text-xs text-cyan-400 font-mono w-8">{rotateSpeed.toFixed(1)}×</span>
            </div>
          </div>
 
          {/* Canvas container */}
          <div className="relative flex-1 min-h-[420px] rounded-3xl bg-black/60 border border-white/10 overflow-hidden shadow-2xl">
 
            {/* HUD top-left */}
            <div className="absolute top-5 left-5 z-10 pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.25 }}
                  className="px-4 py-2 rounded-xl bg-[#050B18]/90 backdrop-blur-md border border-white/10"
                >
                  <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest block">Structure</span>
                  <h4 className="font-black text-lg text-white leading-tight">{selected.name}</h4>
                  <span className="text-cyan-400 font-mono text-sm">{selected.formula}</span>
                </motion.div>
              </AnimatePresence>
            </div>
 
            <MoleculeViewer3D
              molecule={selected}
              showLabels={showLabels}
              showBonds={showBonds}
              wireframe={wireframe}
              autoRotate={autoRotate}
              rotateSpeed={rotateSpeed}
            />
 
            {/* Bottom stats bar */}
            <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center pb-5 pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selected.id + '-bar'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-0 rounded-2xl bg-[#050B18]/90 backdrop-blur-md border border-white/10 overflow-hidden"
                >
                  {[
                    { label: 'Geometry', value: selected.geometry },
                    { label: 'Bond Angle', value: selected.bondAngle },
                    { label: 'Type', value: selected.subtype },
                    { label: 'Stability', value: selected.stability, color: selected.stabilityColor },
                  ].map((s, i) => (
                    <React.Fragment key={s.label}>
                      {i > 0 && <div className="w-px h-10 bg-white/10" />}
                      <div className="px-5 py-2.5 text-center">
                        <span className="text-[8px] font-bold text-white/25 uppercase tracking-widest block mb-0.5">{s.label}</span>
                        <span className="text-xs font-bold" style={s.color ? { color: s.color } : { color: '#d0eaff' }}>{s.value}</span>
                      </div>
                    </React.Fragment>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
 
        {/* ── Right panel ── */}
        <div className="xl:col-span-3 flex flex-col gap-5 order-3">
 
          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Atoms', value: selected.atoms.length },
              { label: 'Bonds', value: selected.bonds.length },
            ].map(s => (
              <div key={s.label} className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-center">
                <div className="text-[9px] font-bold text-white/25 uppercase tracking-widest mb-1">{s.label}</div>
                <div className="text-2xl font-black text-white">{s.value}</div>
              </div>
            ))}
          </div>
 
          {/* Tab switcher */}
          <div className="flex p-1 bg-white/[0.04] rounded-2xl border border-white/10 gap-1">
            {(['desc', 'lewis', 'facts'] as InfoTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setInfoTab(tab)}
                className={cn(
                  'flex-1 py-2.5 rounded-xl font-bold text-xs transition-all capitalize',
                  infoTab === tab ? 'bg-cyan-500 text-white shadow-lg' : 'text-white/35 hover:text-white/70',
                )}
              >
                {tab === 'desc' ? 'Info' : tab === 'lewis' ? 'Lewis' : 'Data'}
              </button>
            ))}
          </div>
 
          {/* Tab content */}
          <div className="flex-1 p-6 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl overflow-hidden">
            <AnimatePresence mode="wait">
              {infoTab === 'desc' && (
                <motion.div
                  key="desc"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="flex flex-col h-full gap-4"
                >
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <Beaker size={16} className="text-cyan-400" /> Molecular Info
                  </h4>
                  <p className="text-white/55 text-sm leading-relaxed">{selected.description}</p>
                  <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 mt-auto">
                    <span className="text-[9px] font-bold text-white/25 uppercase tracking-widest block mb-1">Tip</span>
                    <p className="text-xs text-cyan-200/80 leading-relaxed">
                      Watch the orbital overlap as atoms bond. Electron density concentrates between nuclei.
                    </p>
                  </div>
                  <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-cyan-900/30">
                    Full Analysis <CheckCircle2 size={16} />
                  </button>
                </motion.div>
              )}
 
              {infoTab === 'lewis' && (
                <motion.div
                  key="lewis"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-full p-6 rounded-2xl bg-black/40 border border-cyan-500/25 flex items-center justify-center">
                    <span className="font-mono text-sm text-cyan-400 tracking-widest whitespace-pre text-center leading-relaxed">
                      {selected.lewis}
                    </span>
                  </div>
                  <p className="text-white/35 text-xs leading-relaxed text-center">
                    Lewis structures show valence electrons and predict geometry via VSEPR theory.
                  </p>
                </motion.div>
              )}
 
              {infoTab === 'facts' && (
                <motion.div
                  key="facts"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="flex flex-col gap-2"
                >
                  {selected.facts.map(f => (
                    <div key={f.label} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                      <span className="text-xs text-white/40">{f.label}</span>
                      <span className="text-xs font-bold font-mono text-cyan-300">{f.value}</span>
                    </div>
                  ))}
                  <div className="mt-2 p-3 rounded-xl bg-black/30 border border-white/5">
                    <span className="text-[9px] font-bold text-white/25 uppercase tracking-widest block mb-1">Bond Class</span>
                    <span className={cn(
                      'text-xs font-bold px-2 py-1 rounded-lg',
                      selected.type === 'Ionic'
                        ? 'bg-yellow-500/15 text-yellow-400'
                        : 'bg-cyan-500/15 text-cyan-400',
                    )}>
                      {selected.subtype}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};