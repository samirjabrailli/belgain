import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  createCoffeeCupModel,
  createChocolateModel,
  createWaffleModel,
  createFrappeModel
} from './three/models';
import { createContactShadowTexture } from './three/proceduralTextures';
import {
  Layers,
  Camera,
  Maximize2,
  Sparkles,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Info,
  Check,
  RotateCw
} from 'lucide-react';

export type ModelType = 'cup' | 'chocolate' | 'waffle' | 'frappe';

interface ThreeCanvasProps {
  activeModel: ModelType;
  onSelectModel: (m: ModelType) => void;
  onAddToCartDirect: (model: ModelType, cupColor?: string, cocoaGrade?: string) => void;
  isAzerbaijani: boolean;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  activeModel,
  onSelectModel,
  onAddToCartDirect,
  isAzerbaijani
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [explodedAmount, setExplodedAmount] = useState(0);
  const [cupColor, setCupColor] = useState<'green' | 'cream' | 'noir' | 'burgundy'>('green');
  const [cocoaGrade, setCocoaGrade] = useState<'dark' | 'milk' | 'white'>('dark');
  const [sauceType, setSauceType] = useState<'dark' | 'milk' | 'white'>('dark');
  const [autoRotate, setAutoRotate] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // References for render loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelHandlesRef = useRef<{
    cup?: ReturnType<typeof createCoffeeCupModel>;
    chocolate?: ReturnType<typeof createChocolateModel>;
    waffle?: ReturnType<typeof createWaffleModel>;
    frappe?: ReturnType<typeof createFrappeModel>;
  }>({});
  const activeGroupRef = useRef<THREE.Group | null>(null);
  const explodedTargetRef = useRef(0);
  const currentExplodedRef = useRef(0);

  // Hotspots definitions per model
  const hotspotsData: Record<ModelType, Array<{ id: number; titleAz: string; titleEn: string; descAz: string; descEn: string; x: number; y: number }>> = {
    cup: [
      { id: 1, titleAz: 'Əsl Belçika Şokoladı', titleEn: 'Real Belgian Chocolate', descAz: 'Dibində əridilmiş xalis Callebaut südlü & tünd şokolad qatı', descEn: 'Melted pure Callebaut chocolate foundation at the cup bottom', x: 50, y: 55 },
      { id: 2, titleAz: 'Artisan Latte Art', titleEn: 'Artisan Latte Art', descAz: 'İpək kimi mikrokopüklü təbii süd və qızılı kremalı espresso', descEn: 'Silky micro-textured fresh milk foam with rich crema', x: 42, y: 35 },
      { id: 3, titleAz: 'Seçilmiş Arabica Dənləri', titleEn: 'Select Arabica Beans', descAz: 'Hər həftə təzə qovrulan 100% təmiz yüksək dağ Arabica növləri', descEn: 'Freshly roasted weekly 100% single-origin high altitude Arabica', x: 68, y: 72 },
    ],
    chocolate: [
      { id: 1, titleAz: '%85 Tünd Belçika Kakaosu', titleEn: '85% Dark Belgian Cacao', descAz: 'Qana və Ekvador kakao dənələrindən hazırlanmış premium qara şokolad', descEn: 'Gourmet dark chocolate crafted with Ecuadorian and Ghanaian beans', x: 48, y: 45 },
      { id: 2, titleAz: 'Qızılı Qablaşdırma', titleEn: 'Golden Foil Ingot', descAz: 'Aromatı və təravəti saxlayan xüsusi zərli qoruyucu təbəqə', descEn: 'Protective gold foil sealing freshness and delicate aromas', x: 30, y: 55 },
      { id: 3, titleAz: 'Əl İşi Pralin Truffle', titleEn: 'Handcrafted Truffle', descAz: 'Təmiz kakao tozu ilə örtülmüş fındıqlı kremli içlik', descEn: 'Roasted hazelnut center dusted with fine Dutch cocoa powder', x: 72, y: 65 },
    ],
    waffle: [
      { id: 1, titleAz: 'Karamelizə Liege Xəmiri', titleEn: 'Caramelized Liege Dough', descAz: 'Xüsusi Belçika mirvari şəkəri ilə bişirilən xırtıldayan daxili toxuma', descEn: 'Authentic pearl sugar clusters melting into crunchy pockets', x: 45, y: 50 },
      { id: 2, titleAz: 'İsti Şokolad Daşqını', titleEn: 'Molten Chocolate Cascade', descAz: 'İsti halda axıdılan zəngin Belçika şokolad sousu', descEn: 'Steaming warm cascade of velvety Belgian melted ganache', x: 58, y: 40 },
      { id: 3, titleAz: 'Təzə Giləmeyvələr & Qaymaq', titleEn: 'Fresh Berries & Cream', descAz: 'Gündəlik təzə çiyələk dilimləri və kərə yağı qaymağı', descEn: 'Fresh seasonal strawberries, bananas, and sweet whipped cream', x: 35, y: 38 },
    ],
    frappe: [
      { id: 1, titleAz: 'Qaymaqlı Tac & Kakao', titleEn: 'Cream Peak & Cocoa', descAz: 'Çalınmış təzə qaymaq üzərində xırdalanmış qoz və kakao tozu', descEn: 'Freshly whipped cream dusted with roasted nuts and cocoa', x: 52, y: 24 },
      { id: 2, titleAz: 'Qat-qat Lüks Qarışıq', titleEn: 'Layered Luxury Blend', descAz: 'Şokolad qatı, soyuq dəmlənmiş espresso və təzə süd harmoniyası', descEn: 'Dense chocolate ganache bottom, cold brew, and chilled milk', x: 48, y: 52 },
      { id: 3, titleAz: 'Buz Kristalları', titleEn: 'Crystal Ice Cubes', descAz: 'İçkini ideal temperaturda sərin saxlayan təmizlənmiş su buzları', descEn: 'Slow-melting purified ice cubes locking in crisp refreshment', x: 58, y: 64 },
    ]
  };

  // Sync exploded slider with ref
  useEffect(() => {
    explodedTargetRef.current = explodedAmount;
  }, [explodedAmount]);

  // Handle cup color updates
  useEffect(() => {
    if (modelHandlesRef.current.cup) {
      const colors = {
        green: 0x0f2b1d,
        cream: 0xf4eee1,
        noir: 0x1a1a1a,
        burgundy: 0x4a121a
      };
      modelHandlesRef.current.cup.setCupColor(colors[cupColor]);
    }
  }, [cupColor]);

  // Handle cocoa grade updates
  useEffect(() => {
    if (modelHandlesRef.current.chocolate) {
      modelHandlesRef.current.chocolate.setCocoaGrade(cocoaGrade);
    }
  }, [cocoaGrade]);

  // Handle waffle sauce updates
  useEffect(() => {
    if (modelHandlesRef.current.waffle) {
      modelHandlesRef.current.waffle.setSauceColor(sauceType);
    }
  }, [sauceType]);

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL from renderer string (Three.js skill directive)
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a1c14); // Deep luxury forest green ambient
    scene.fog = new THREE.Fog(0x0a1c14, 8, 22);

    // Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(2.8, 2.2, 3.8);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Don't go below ground
    controls.minDistance = 2.0;
    controls.maxDistance = 8.0;
    controls.target.set(0, 0.7, 0);
    controls.autoRotate = autoRotate && !isSoftwareGl;
    controls.autoRotateSpeed = 1.2;

    // Procedural Studio Environment Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio 3-Point Lighting Rig
    // Warm Key Light (casts soft shadows)
    const keyLight = new THREE.DirectionalLight(0xfff1dc, 2.4);
    keyLight.position.set(4, 6, 3);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
      const d = 2.5;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
    }
    scene.add(keyLight);

    // Cool Fill Light
    const fillLight = new THREE.DirectionalLight(0xd0e8ff, 1.1);
    fillLight.position.set(-4, 3, -2);
    scene.add(fillLight);

    // Warm Rim / Backlight for separation
    const rimLight = new THREE.DirectionalLight(0xd4af37, 1.8);
    rimLight.position.set(0, 5, -4);
    scene.add(rimLight);

    // Soft Ambient Fill
    const hemiLight = new THREE.HemisphereLight(0xfffaed, 0x091c13, 0.8);
    scene.add(hemiLight);

    // Ground Contact Shadow Grounding Plane (prevents floating look)
    const shadowTex = createContactShadowTexture();
    const shadowGeo = new THREE.PlaneGeometry(5, 5);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.005;
    scene.add(shadowMesh);

    // Polished Boutique Pedestal Ring
    const ringGeo = new THREE.RingGeometry(2.1, 2.14, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.2,
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 0.01;
    scene.add(ringMesh);

    // Create Models
    const cupModel = createCoffeeCupModel(isSoftwareGl);
    const chocolateModel = createChocolateModel();
    const waffleModel = createWaffleModel();
    const frappeModel = createFrappeModel(isSoftwareGl);

    modelHandlesRef.current = {
      cup: cupModel,
      chocolate: chocolateModel,
      waffle: waffleModel,
      frappe: frappeModel,
    };

    // Animation & Render Loop
    let frameId = 0;
    const clock = new THREE.Clock();

    function renderLoop() {
      const delta = clock.getDelta();

      // Smooth exponential damping for exploded slider
      currentExplodedRef.current = THREE.MathUtils.damp(
        currentExplodedRef.current,
        explodedTargetRef.current,
        10,
        delta
      );

      // Update current active model
      cupModel.update(delta, currentExplodedRef.current);
      chocolateModel.update(delta, currentExplodedRef.current);
      waffleModel.update(delta, currentExplodedRef.current);
      frappeModel.update(delta, currentExplodedRef.current);

      controls.update();
      renderer.render(scene, camera);

      frameId = requestAnimationFrame(renderLoop);
    }

    renderLoop();

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      scene.clear();
    };
  }, []);

  // Update active model visibility in scene
  useEffect(() => {
    const scene = sceneRef.current;
    const handles = modelHandlesRef.current;
    if (!scene || !handles.cup || !handles.chocolate || !handles.waffle || !handles.frappe) return;

    // Remove existing model group if any
    if (activeGroupRef.current) {
      scene.remove(activeGroupRef.current);
    }

    let targetGroup: THREE.Group;
    let targetCameraY = 0.7;

    if (activeModel === 'cup') {
      targetGroup = handles.cup.group;
      targetCameraY = 0.7;
    } else if (activeModel === 'chocolate') {
      targetGroup = handles.chocolate.group;
      targetCameraY = 0.35;
    } else if (activeModel === 'waffle') {
      targetGroup = handles.waffle.group;
      targetCameraY = 0.5;
    } else {
      targetGroup = handles.frappe.group;
      targetCameraY = 1.3;
    }

    activeGroupRef.current = targetGroup;
    scene.add(targetGroup);

    // Smoothly shift camera target to center the current item
    if (controlsRef.current) {
      controlsRef.current.target.set(0, targetCameraY, 0);
    }
  }, [activeModel]);

  // Sync auto-rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Camera preset transitions
  const setCameraPreset = useCallback((preset: 'cinematic' | 'front' | 'macro' | 'top') => {
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    setAutoRotate(false);

    if (preset === 'cinematic') {
      camera.position.set(2.8, 2.2, 3.8);
      controls.target.set(0, activeModel === 'frappe' ? 1.3 : 0.6, 0);
    } else if (preset === 'front') {
      camera.position.set(0, 1.2, 4.2);
      controls.target.set(0, activeModel === 'frappe' ? 1.4 : 0.6, 0);
    } else if (preset === 'macro') {
      camera.position.set(1.4, 1.4, 1.8);
      controls.target.set(0, activeModel === 'frappe' ? 1.6 : 0.7, 0);
    } else if (preset === 'top') {
      camera.position.set(0.1, 4.6, 0.4);
      controls.target.set(0, 0, 0);
    }
  }, [activeModel]);

  // Trigger add to cart
  const handleAddToCart = () => {
    setAddedAnimation(true);
    onAddToCartDirect(activeModel, cupColor, cocoaGrade);
    setTimeout(() => setAddedAnimation(false), 1400);
  };

  const currentHotspots = hotspotsData[activeModel];

  return (
    <div className="relative w-full h-[620px] md:h-[680px] bg-gradient-to-b from-[#06140e] via-[#0a1e15] to-[#071710] rounded-3xl overflow-hidden border border-[#234d38]/50 shadow-2xl">
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Header Badge & 3D Specs */}
      <div className="absolute top-5 left-5 right-5 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 bg-[#0a2016]/85 border border-[#2b5a42] px-4 py-2 rounded-2xl shadow-lg pointer-events-auto backdrop-blur-md">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-[#c59b27] flex items-center justify-center bg-[#071910]">
            <img src="/assets/aistudio/IMG_5127_acff560b.jpeg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#d4af37]">3D Studio Vitrini</span>
              <span className="bg-[#173e2c] text-[#a9dfbf] text-[10px] px-2 py-0.5 rounded-md font-medium border border-[#276648]">
                Real-Time 360°
              </span>
            </div>
            <p className="text-sm font-semibold text-white">
              {activeModel === 'cup' && (isAzerbaijani ? 'İmza Belçika Qəhvəsi Fincanı' : 'Signature Belgian Coffee Cup')}
              {activeModel === 'chocolate' && (isAzerbaijani ? 'Əl İşi Belçika Şokolad Plitəsi & Pralinlər' : 'Handcrafted Belgian Chocolate Bar & Pralines')}
              {activeModel === 'waffle' && (isAzerbaijani ? 'İsti Belçika Liege Vaflisi & Şokolad Sousu' : 'Warm Belgian Liege Waffle & Ganache')}
              {activeModel === 'frappe' && (isAzerbaijani ? 'Lüks Buzlu Belgian Frappe & Kokteyl' : 'Luxury Iced Belgian Frappe & Cocktail')}
            </p>
          </div>
        </div>

        {/* Quick 3D Actions */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2.5 rounded-xl border text-xs font-medium transition flex items-center gap-1.5 shadow-md ${
              autoRotate
                ? 'bg-[#c59b27] text-black border-[#ffd359]'
                : 'bg-[#0a2016]/80 text-[#d5e8dd] border-[#2b5a42] hover:bg-[#133827]'
            }`}
            title={isAzerbaijani ? '360° Avto Fırlanma' : 'Auto Rotate'}
          >
            <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
            <span className="hidden sm:inline">{isAzerbaijani ? 'Avto-Dönmə' : 'Auto'}</span>
          </button>
        </div>
      </div>

      {/* Floating Interactive Hotspots overlay */}
      {currentHotspots.map((spot) => (
        <div
          key={spot.id}
          style={{ top: `${spot.y}%`, left: `${spot.x}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-10"
        >
          <button
            onClick={() => setActiveHotspot(activeHotspot === spot.id ? null : spot.id)}
            className={`group relative flex items-center justify-center w-7 h-7 rounded-full border-2 transition-transform duration-300 hover:scale-110 shadow-lg ${
              activeHotspot === spot.id
                ? 'bg-[#c59b27] border-white text-black scale-110'
                : 'bg-[#0f2b1d]/90 border-[#d4af37] text-[#d4af37] hover:bg-[#1a4430]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="sr-only">Hotspot info</span>
          </button>

          {/* Hotspot Popover Tooltip */}
          {activeHotspot === spot.id && (
            <div className="absolute top-9 left-1/2 -translate-x-1/2 w-56 sm:w-64 p-3 bg-[#081811] border border-[#d4af37] rounded-xl shadow-2xl text-left z-20 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-1 mb-1 border-b border-[#234d38]">
                <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wide">
                  {isAzerbaijani ? spot.titleAz : spot.titleEn}
                </span>
                <button
                  onClick={() => setActiveHotspot(null)}
                  className="text-gray-400 hover:text-white text-xs p-1"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-gray-200 leading-relaxed">
                {isAzerbaijani ? spot.descAz : spot.descEn}
              </p>
            </div>
          )}
        </div>
      ))}

      {/* Three.js Skill Directive: SLEEK COLLAPSIBLE BOTTOM CONTROL DOCK (Zero Viewport Occlusion) */}
      <div
        className="absolute left-1/2 -translate-x-1/2 w-[94%] max-w-[920px] transition-all duration-300 pointer-events-auto z-20"
        style={{
          bottom: isCollapsed ? '-280px' : '20px',
        }}
      >
        {/* Collapse / Expand Toggle Button on Dock Top Edge */}
        <div className="flex justify-center -mb-3 relative z-30">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0e2c1e] hover:bg-[#163f2c] border border-[#2f664a] rounded-full text-xs font-semibold text-[#eeddb2] shadow-xl transition-all"
          >
            {isCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-[#c59b27]" />
                <span>{isAzerbaijani ? 'Vitrin İdarəetməsini Aç' : 'Show 3D Controls'}</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-[#c59b27]" />
                <span>{isAzerbaijani ? 'İdarəetməni Gizlət' : 'Hide Controls'}</span>
              </>
            )}
          </button>
        </div>

        {/* Glassmorphic Unified Dock */}
        <div className="bg-[#0b1f16]/95 border border-[#2b5a42] rounded-3xl p-4 shadow-2xl backdrop-blur-md">
          {/* Row 1: Model Switcher Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3.5">
            <button
              onClick={() => {
                onSelectModel('cup');
                setExplodedAmount(0);
              }}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all border ${
                activeModel === 'cup'
                  ? 'bg-[#c59b27] text-black border-[#eeddb2] shadow-md font-semibold'
                  : 'bg-[#0f2b1d] text-[#e0eee6] border-[#204a35] hover:bg-[#173e2c]'
              }`}
            >
              <span>☕</span>
              <span>{isAzerbaijani ? 'Belgian Coffee' : 'Belgian Coffee'}</span>
            </button>

            <button
              onClick={() => {
                onSelectModel('chocolate');
                setExplodedAmount(0);
              }}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all border ${
                activeModel === 'chocolate'
                  ? 'bg-[#c59b27] text-black border-[#eeddb2] shadow-md font-semibold'
                  : 'bg-[#0f2b1d] text-[#e0eee6] border-[#204a35] hover:bg-[#173e2c]'
              }`}
            >
              <span>🍫</span>
              <span>{isAzerbaijani ? 'Şokolad Box' : 'Chocolate Box'}</span>
            </button>

            <button
              onClick={() => {
                onSelectModel('waffle');
                setExplodedAmount(0);
              }}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all border ${
                activeModel === 'waffle'
                  ? 'bg-[#c59b27] text-black border-[#eeddb2] shadow-md font-semibold'
                  : 'bg-[#0f2b1d] text-[#e0eee6] border-[#204a35] hover:bg-[#173e2c]'
              }`}
            >
              <span>🧇</span>
              <span>{isAzerbaijani ? 'Liege Vafli' : 'Liege Waffle'}</span>
            </button>

            <button
              onClick={() => {
                onSelectModel('frappe');
                setExplodedAmount(0);
              }}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all border ${
                activeModel === 'frappe'
                  ? 'bg-[#c59b27] text-black border-[#eeddb2] shadow-md font-semibold'
                  : 'bg-[#0f2b1d] text-[#e0eee6] border-[#204a35] hover:bg-[#173e2c]'
              }`}
            >
              <span>🥤</span>
              <span>{isAzerbaijani ? 'Iced Belgian' : 'Iced Belgian'}</span>
            </button>
          </div>

          {/* Row 2: Model-Specific Customizer Swatches & Exploded Slider & Camera Views */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center border-t border-[#1d4532] pt-3">
            {/* Customizer Swatches (Col 1-4) */}
            <div className="md:col-span-4 flex items-center gap-2 flex-wrap">
              {activeModel === 'cup' && (
                <>
                  <span className="text-[11px] font-semibold text-[#d4af37] uppercase tracking-wider">
                    {isAzerbaijani ? 'Fincan:' : 'Cup:'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCupColor('green')}
                      className={`w-6 h-6 rounded-full bg-[#0f2b1d] border-2 transition ${
                        cupColor === 'green' ? 'border-[#c59b27] scale-110 ring-2 ring-[#c59b27]/40' : 'border-gray-500'
                      }`}
                      title={isAzerbaijani ? 'Belçika Yaşılı' : 'Belgian Green'}
                    />
                    <button
                      onClick={() => setCupColor('cream')}
                      className={`w-6 h-6 rounded-full bg-[#f4eee1] border-2 transition ${
                        cupColor === 'cream' ? 'border-[#c59b27] scale-110 ring-2 ring-[#c59b27]/40' : 'border-gray-500'
                      }`}
                      title={isAzerbaijani ? 'Vanil Kremi' : 'Vanilla Cream'}
                    />
                    <button
                      onClick={() => setCupColor('noir')}
                      className={`w-6 h-6 rounded-full bg-[#1a1a1a] border-2 transition ${
                        cupColor === 'noir' ? 'border-[#c59b27] scale-110 ring-2 ring-[#c59b27]/40' : 'border-gray-500'
                      }`}
                      title={isAzerbaijani ? 'Qara Məxmər' : 'Black Velvet'}
                    />
                    <button
                      onClick={() => setCupColor('burgundy')}
                      className={`w-6 h-6 rounded-full bg-[#4a121a] border-2 transition ${
                        cupColor === 'burgundy' ? 'border-[#c59b27] scale-110 ring-2 ring-[#c59b27]/40' : 'border-gray-500'
                      }`}
                      title={isAzerbaijani ? 'Kraliyyət Bordo' : 'Royal Burgundy'}
                    />
                  </div>
                </>
              )}

              {activeModel === 'chocolate' && (
                <>
                  <span className="text-[11px] font-semibold text-[#d4af37] uppercase tracking-wider">
                    {isAzerbaijani ? 'Növ:' : 'Type:'}
                  </span>
                  <div className="flex items-center gap-1 text-[11px]">
                    <button
                      onClick={() => setCocoaGrade('dark')}
                      className={`px-2 py-1 rounded-md border ${
                        cocoaGrade === 'dark' ? 'bg-[#261309] text-[#e8d9ba] border-[#c59b27]' : 'bg-[#0f2b1d] border-[#1d4532]'
                      }`}
                    >
                      %85 Tünd
                    </button>
                    <button
                      onClick={() => setCocoaGrade('milk')}
                      className={`px-2 py-1 rounded-md border ${
                        cocoaGrade === 'milk' ? 'bg-[#522912] text-[#e8d9ba] border-[#c59b27]' : 'bg-[#0f2b1d] border-[#1d4532]'
                      }`}
                    >
                      Südlü
                    </button>
                    <button
                      onClick={() => setCocoaGrade('white')}
                      className={`px-2 py-1 rounded-md border ${
                        cocoaGrade === 'white' ? 'bg-[#f3ebd3] text-black border-[#c59b27]' : 'bg-[#0f2b1d] border-[#1d4532]'
                      }`}
                    >
                      Ağ Şokolad
                    </button>
                  </div>
                </>
              )}

              {activeModel === 'waffle' && (
                <>
                  <span className="text-[11px] font-semibold text-[#d4af37] uppercase tracking-wider">
                    {isAzerbaijani ? 'Sous:' : 'Sauce:'}
                  </span>
                  <div className="flex items-center gap-1 text-[11px]">
                    <button
                      onClick={() => setSauceType('dark')}
                      className={`px-2 py-1 rounded-md border ${
                        sauceType === 'dark' ? 'bg-[#221008] text-[#e8d9ba] border-[#c59b27]' : 'bg-[#0f2b1d] border-[#1d4532]'
                      }`}
                    >
                      Tünd Şokolad
                    </button>
                    <button
                      onClick={() => setSauceType('milk')}
                      className={`px-2 py-1 rounded-md border ${
                        sauceType === 'milk' ? 'bg-[#5a2d12] text-[#e8d9ba] border-[#c59b27]' : 'bg-[#0f2b1d] border-[#1d4532]'
                      }`}
                    >
                      Südlü
                    </button>
                    <button
                      onClick={() => setSauceType('white')}
                      className={`px-2 py-1 rounded-md border ${
                        sauceType === 'white' ? 'bg-[#fbf3da] text-black border-[#c59b27]' : 'bg-[#0f2b1d] border-[#1d4532]'
                      }`}
                    >
                      Ağ Şokolad
                    </button>
                  </div>
                </>
              )}

              {activeModel === 'frappe' && (
                <div className="flex items-center gap-1.5 text-xs text-[#a3d9bc]">
                  <span className="text-[#d4af37]">★</span>
                  <span>{isAzerbaijani ? '100% Qat-qat Belçika Qanajı & Espresso' : 'Layered Belgian Ganache & Espresso'}</span>
                </div>
              )}
            </div>

            {/* Exploded View Slider (Col 5-8) */}
            <div className="md:col-span-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#c59b27] shrink-0" />
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-center text-[11px] text-[#bed8ca]">
                  <span>{isAzerbaijani ? 'Qatları Ayır (Exploded)' : 'Exploded View'}</span>
                  <span className="font-mono text-[#d4af37]">{Math.round(explodedAmount * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={explodedAmount}
                  onChange={(e) => setExplodedAmount(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-[#173e2c] rounded-lg appearance-none cursor-pointer accent-[#c59b27]"
                />
              </div>
            </div>

            {/* Camera Presets & Direct Add to Cart (Col 9-12) */}
            <div className="md:col-span-4 flex items-center justify-end gap-2">
              <div className="hidden sm:flex items-center gap-1 bg-[#091b12] p-1 rounded-xl border border-[#1f4834]">
                <button
                  onClick={() => setCameraPreset('cinematic')}
                  className="px-2 py-1 rounded-lg text-[10px] font-medium text-[#cce4d7] hover:text-white hover:bg-[#153a27]"
                  title={isAzerbaijani ? 'Sinematik bucaq' : 'Cinematic angle'}
                >
                  {isAzerbaijani ? 'Sinema' : 'Cinema'}
                </button>
                <button
                  onClick={() => setCameraPreset('front')}
                  className="px-2 py-1 rounded-lg text-[10px] font-medium text-[#cce4d7] hover:text-white hover:bg-[#153a27]"
                  title={isAzerbaijani ? 'Ön vitrin' : 'Front view'}
                >
                  {isAzerbaijani ? 'Vitrin' : 'Front'}
                </button>
                <button
                  onClick={() => setCameraPreset('macro')}
                  className="px-2 py-1 rounded-lg text-[10px] font-medium text-[#cce4d7] hover:text-white hover:bg-[#153a27]"
                  title={isAzerbaijani ? 'Yaxın baxış' : 'Close up'}
                >
                  {isAzerbaijani ? 'Makro' : 'Macro'}
                </button>
                <button
                  onClick={() => setCameraPreset('top')}
                  className="px-2 py-1 rounded-lg text-[10px] font-medium text-[#cce4d7] hover:text-white hover:bg-[#153a27]"
                  title={isAzerbaijani ? 'Üstdən baxış' : 'Top view'}
                >
                  {isAzerbaijani ? 'Üst' : 'Top'}
                </button>
              </div>

              {/* Direct Add To Cart Button */}
              <button
                onClick={handleAddToCart}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-lg ${
                  addedAnimation
                    ? 'bg-emerald-500 text-white scale-105'
                    : 'bg-gradient-to-r from-[#c59b27] to-[#e4ba4c] text-black hover:brightness-110 active:scale-95'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{isAzerbaijani ? 'Əlavə edildi!' : 'Added!'}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isAzerbaijani ? 'Səbətə At' : 'Add to Cart'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
