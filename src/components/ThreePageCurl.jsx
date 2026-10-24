import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import gsap from "gsap";
import heroImgSrc from "../assets/graveyard-reference.jpg";
import {
  createCoverTexture,
  createBackTexture,
  createArchiveTexture,
} from "../utils/textureGenerator";

// =========================================================================
// GLSL SHADERS FOR 3D GPU PAGE CURL (Full-Screen 3D Game Quality)
// High-visibility lighting, Half-Lambert wrap, conical corner lift,
// dual-sided texture mapping, and interactive torch spotlight.
// =========================================================================

const pageVertexShader = /* glsl */ `
  uniform float uProgress;     // 0.0 to 1.0
  uniform float uBend;         // peak curvature factor
  uniform vec2 uPlaneSize;     // vec2(width, height)
  uniform float uCornerHover;  // hover curl factor on bottom-right corner
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying float vCurlShadow;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float w = uPlaneSize.x;
    float h = uPlaneSize.y;

    // Shift origin to left edge: x from 0 to w
    float origX = pos.x + w * 0.5;
    float origY = pos.y;

    // Normalized coordinates (u: 0 at hinge to 1 at right edge; v: -1 at bottom to 1 at top)
    float u = clamp(origX / w, 0.0, 1.0);
    float v = origY / (h * 0.5);

    // Primary swing angle from 0 to PI
    float angle = uProgress * 3.14159265;

    // Paper arch wave along the width (peaks at uProgress = 0.5)
    float bendWave = sin(angle) * sin(u * 3.14159265);

    // Compound rotation angle with bending lag
    float localAngle = angle + bendWave * uBend;

    // Distance from the hinge
    float r = origX;

    vec3 transformed;
    // Rotate around the left hinge
    transformed.x = r * cos(localAngle) - w * 0.5;
    transformed.y = origY;

    // Arching lift towards the camera (Z axis)
    float archLift = bendWave * (w * 0.35);

    // Conical corner lift (bottom-right peels first)
    float cornerWeight = pow(u, 2.0) * clamp(1.0 - (v + 1.0) * 0.45, 0.0, 1.0);
    float cornerLift = (sin(angle) + uCornerHover * (1.0 - uProgress) * 0.55) * cornerWeight * (w * 0.26);

    transformed.z = -r * sin(localAngle) + archLift + cornerLift;

    // Normal approximation for dynamic 3D game lighting
    float normalAngle = localAngle + 1.5707963;
    vec3 n = vec3(cos(normalAngle), 0.0, -sin(normalAngle));
    if (sin(localAngle) < 0.0) n = -n;

    vNormal = normalize(normalMatrix * n);

    vec4 worldPos = modelMatrix * vec4(transformed, 1.0);
    vWorldPosition = worldPos.xyz;
    vCurlShadow = clamp(bendWave * 1.5, 0.0, 1.0);

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const pageFragmentShader = /* glsl */ `
  uniform sampler2D uFrontTexture;
  uniform sampler2D uBackTexture;
  uniform vec3 uMoonLightColor;
  uniform vec3 uLanternColor;
  uniform vec3 uLanternPos;
  uniform vec3 uMouseLightPos;
  uniform float uTime;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying float vCurlShadow;

  void main() {
    vec4 texColor;
    vec3 normal = normalize(vNormal);

    if (gl_FrontFacing) {
      texColor = texture2D(uFrontTexture, vUv);
    } else {
      // Invert horizontal UV on backside of the page
      vec2 backUv = vec2(1.0 - vUv.x, vUv.y);
      texColor = texture2D(uBackTexture, backUv);
      normal = -normal;
    }

    // High-visibility Half-Lambert ambient & diffuse baseline so art and text pop
    vec3 ambient = vec3(0.52, 0.54, 0.58) * texColor.rgb;

    // Direct camera front-fill for crystal-clear readability
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float frontDiff = max(dot(normal, viewDir), 0.0);
    vec3 frontLight = vec3(0.44, 0.44, 0.46) * frontDiff * texColor.rgb;

    // Cold Silver Moonlight from Top-Center
    vec3 moonDir = normalize(vec3(0.0, 1.2, 0.8));
    float moonDiff = pow(max(dot(normal, moonDir) * 0.5 + 0.5, 0.0), 1.4);
    vec3 moonLight = uMoonLightColor * moonDiff * 1.05 * texColor.rgb;

    // Warm Lantern / Jack-o'-Lantern Flame (Manor & Pumpkins on right)
    float candleFlicker = 1.0 + 0.08 * sin(uTime * 7.5) + 0.04 * cos(uTime * 14.2);
    vec3 lanternDir = uLanternPos - vWorldPosition;
    float lanternDist = length(lanternDir);
    lanternDir = normalize(lanternDir);
    float lanternDiff = max(dot(normal, lanternDir), 0.0);
    float lanternAtten = 1.0 / (1.0 + 0.05 * lanternDist + 0.008 * lanternDist * lanternDist);
    vec3 lanternLight = uLanternColor * lanternDiff * lanternAtten * candleFlicker * 1.65 * texColor.rgb;

    // Interactive Torch / Mouse Light (Follows User Pointer)
    vec3 mouseDir = uMouseLightPos - vWorldPosition;
    float mouseDist = length(mouseDir);
    mouseDir = normalize(mouseDir);
    float mouseDiff = max(dot(normal, mouseDir), 0.0);
    float mouseAtten = 1.0 / (1.0 + 0.10 * mouseDist + 0.02 * mouseDist * mouseDist);
    vec3 mouseLight = vec3(1.0, 0.92, 0.76) * mouseDiff * mouseAtten * 1.15 * texColor.rgb;

    // Specular Sheen across Curving Paper
    vec3 halfVec = normalize(moonDir + viewDir);
    float spec = pow(max(dot(normal, halfVec), 0.0), 20.0);
    vec3 specular = vec3(0.95, 0.90, 0.80) * spec * 0.35;

    // Soft crease self-shadowing
    float shadowDarken = 1.0 - vCurlShadow * 0.35;

    vec3 finalColor = (ambient + frontLight + moonLight + lanternLight + mouseLight) * shadowDarken + specular;

    gl_FragColor = vec4(finalColor, texColor.a);
  }
`;

// Underlying Page Fragment Shader (The Archive in Blue + Cast Shadow from peeling cover)
const underFragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uProgress;
  uniform vec3 uMoonLightColor;
  uniform vec3 uLanternColor;
  uniform vec3 uLanternPos;
  uniform vec3 uMouseLightPos;
  uniform float uTime;

  varying vec2 vUv;
  varying vec3 vWorldPosition;

  void main() {
    vec4 texColor = texture2D(uTexture, vUv);
    vec3 normal = vec3(0.0, 0.0, 1.0);

    // High visibility base
    vec3 ambient = vec3(0.48, 0.52, 0.60) * texColor.rgb;

    // Moonlight
    vec3 moonDir = normalize(vec3(0.0, 1.2, 0.8));
    float moonDiff = pow(max(dot(normal, moonDir) * 0.5 + 0.5, 0.0), 1.4);
    vec3 moonLight = uMoonLightColor * moonDiff * 0.9 * texColor.rgb;

    // Mouse torch
    vec3 mouseDir = uMouseLightPos - vWorldPosition;
    float mouseDist = length(mouseDir);
    mouseDir = normalize(mouseDir);
    float mouseDiff = max(dot(normal, mouseDir), 0.0);
    float mouseAtten = 1.0 / (1.0 + 0.12 * mouseDist + 0.03 * mouseDist * mouseDist);
    vec3 mouseLight = vec3(0.85, 0.90, 1.0) * mouseDiff * mouseAtten * 0.9 * texColor.rgb;

    // Dynamic Cast Shadow from the peeling page above it
    float castProgress = sin(uProgress * 3.14159265);
    float castX = (1.0 - uProgress) * 0.85;
    float shadowDist = abs(vUv.x - castX);
    float dropShadow = 1.0 - smoothstep(0.0, 0.30, shadowDist) * castProgress * 0.55;

    vec3 finalColor = (ambient + moonLight + mouseLight) * dropShadow;

    gl_FragColor = vec4(finalColor, texColor.a);
  }
`;

const underVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

export function ThreePageCurl({ onPageChange }) {
  const mountRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0); // 0 = Cover, 1 = Archive
  const [isLoaded, setIsLoaded] = useState(false);

  // References to WebGL and animation controls
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const curlMaterialRef = useRef(null);
  const underMaterialRef = useRef(null);
  const pageMeshRef = useRef(null);
  const underMeshRef = useRef(null);
  const animationFrameRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, time: 0, moved: 0, startProgress: 0 });
  const progressStateRef = useRef({ value: 0 }); // 0 (Cover) to 1 (Archive)
  const mouseLightPosRef = useRef(new THREE.Vector3(0, 0, 3));

  // -------------------------------------------------------------------------
  // INITIALIZE THREE.JS SCENE, TEXTURES, AND SHADERS
  // -------------------------------------------------------------------------
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0, 11);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 2. 100% Edge-to-Edge Full-Screen Responsive Plane Sizing (No Scale Down)
    const vFOV = (camera.fov * Math.PI) / 180;
    const visibleH = 2 * Math.tan(vFOV / 2) * camera.position.z;
    const visibleW = visibleH * (width / height);

    const planeW = visibleW;
    const planeH = visibleH;

    // 3. Dense Grid Geometry for smooth 60/120fps paper curvature
    const pageGeometry = new THREE.PlaneGeometry(planeW, planeH, 80, 60);
    const underGeometry = new THREE.PlaneGeometry(planeW, planeH, 2, 2);

    // 4. Load Textures
    const textureLoader = new THREE.TextureLoader();
    const heroImage = new Image();
    heroImage.crossOrigin = "anonymous";
    heroImage.src = heroImgSrc;

    const setupMaterials = () => {
      const coverDataUrl = createCoverTexture(heroImage, 1920, 1080);
      const backDataUrl = createBackTexture(1920, 1080);
      const archiveDataUrl = createArchiveTexture(1920, 1080);

      const coverTex = textureLoader.load(coverDataUrl);
      coverTex.colorSpace = THREE.SRGBColorSpace;

      const backTex = textureLoader.load(backDataUrl);
      backTex.colorSpace = THREE.SRGBColorSpace;

      const archiveTex = textureLoader.load(archiveDataUrl);
      archiveTex.colorSpace = THREE.SRGBColorSpace;

      // Page Curl Shader Material
      const curlMaterial = new THREE.ShaderMaterial({
        vertexShader: pageVertexShader,
        fragmentShader: pageFragmentShader,
        uniforms: {
          uProgress: { value: 0.0 },
          uBend: { value: 0.52 },
          uPlaneSize: { value: new THREE.Vector2(planeW, planeH) },
          uCornerHover: { value: 0.0 },
          uFrontTexture: { value: coverTex },
          uBackTexture: { value: backTex },
          uMoonLightColor: { value: new THREE.Color(0xd8d0c4) },
          uLanternColor: { value: new THREE.Color(0xd69a62) },
          uLanternPos: { value: new THREE.Vector3(planeW * 0.35, -planeH * 0.35, 1.8) },
          uMouseLightPos: { value: mouseLightPosRef.current },
          uTime: { value: 0 },
        },
        side: THREE.DoubleSide,
        transparent: true,
      });
      curlMaterialRef.current = curlMaterial;

      // Underlying Page Material (The Archive in Blue)
      const underMaterial = new THREE.ShaderMaterial({
        vertexShader: underVertexShader,
        fragmentShader: underFragmentShader,
        uniforms: {
          uTexture: { value: archiveTex },
          uProgress: { value: 0.0 },
          uMoonLightColor: { value: new THREE.Color(0x93c5fd) },
          uLanternColor: { value: new THREE.Color(0x38bdf8) },
          uLanternPos: { value: new THREE.Vector3(planeW * 0.35, -planeH * 0.35, 1.8) },
          uMouseLightPos: { value: mouseLightPosRef.current },
          uTime: { value: 0 },
        },
      });
      underMaterialRef.current = underMaterial;

      // Page Meshes
      const pageMesh = new THREE.Mesh(pageGeometry, curlMaterial);
      pageMesh.position.set(0, 0, 0.01);
      scene.add(pageMesh);
      pageMeshRef.current = pageMesh;

      const underMesh = new THREE.Mesh(underGeometry, underMaterial);
      underMesh.position.set(0, 0, -0.02);
      scene.add(underMesh);
      underMeshRef.current = underMesh;

      setIsLoaded(true);
    };

    if (heroImage.complete && heroImage.naturalWidth > 0) {
      setupMaterials();
    } else {
      heroImage.onload = setupMaterials;
      heroImage.onerror = setupMaterials;
    }

    // 5. Render Loop with Dynamic High-Frequency Lighting Updates
    const clock = new THREE.Clock();
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      if (curlMaterialRef.current) {
        curlMaterialRef.current.uniforms.uTime.value = elapsedTime;
        curlMaterialRef.current.uniforms.uMouseLightPos.value.copy(mouseLightPosRef.current);
      }
      if (underMaterialRef.current) {
        underMaterialRef.current.uniforms.uTime.value = elapsedTime;
        underMaterialRef.current.uniforms.uMouseLightPos.value.copy(mouseLightPosRef.current);
      }

      renderer.render(scene, camera);
    };
    animate();

    // 6. Responsive Window Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);

      // Recompute 100% full-screen plane sizing on resize
      const currentVFOV = (camera.fov * Math.PI) / 180;
      const currVisH = 2 * Math.tan(currentVFOV / 2) * camera.position.z;
      const currVisW = currVisH * (w / h);

      if (curlMaterialRef.current) {
        curlMaterialRef.current.uniforms.uPlaneSize.value.set(currVisW, currVisH);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // -------------------------------------------------------------------------
  // UPDATE PROGRESS & SHADER UNIFORMS
  // -------------------------------------------------------------------------
  const setCurlProgress = useCallback(
    (val) => {
      const clamped = Math.max(0, Math.min(1, val));
      progressStateRef.current.value = clamped;

      if (curlMaterialRef.current) {
        curlMaterialRef.current.uniforms.uProgress.value = clamped;
      }
      if (underMaterialRef.current) {
        underMaterialRef.current.uniforms.uProgress.value = clamped;
      }

      const newPage = clamped > 0.5 ? 1 : 0;
      setCurrentPage(newPage);
    },
    []
  );

  // -------------------------------------------------------------------------
  // GSAP COMMIT / CANCEL FLIP ANIMATIONS
  // -------------------------------------------------------------------------
  const flipToPage = useCallback(
    (targetPage) => {
      const targetVal = targetPage === 1 ? 1 : 0;
      const currentVal = progressStateRef.current.value;
      const duration = Math.max(0.65, Math.abs(targetVal - currentVal) * 1.15);

      gsap.to(progressStateRef.current, {
        value: targetVal,
        duration: duration,
        ease: "power2.inOut",
        onUpdate: () => {
          setCurlProgress(progressStateRef.current.value);
        },
        onComplete: () => {
          if (targetVal === 1) {
            onPageChange?.(1);
          }
        },
      });
    },
    [setCurlProgress, onPageChange]
  );

  // -------------------------------------------------------------------------
  // MOUSE LIGHT TRACKING & TOUCH GESTURES
  // -------------------------------------------------------------------------
  const handlePointerMove = (e) => {
    const container = mountRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    // Map pointer to 3D world space coordinates for interactive torch light
    const aspect = rect.width / rect.height;
    mouseLightPosRef.current.set(nx * 5 * aspect, ny * 5, 2.8);

    // Corner Hover: If mouse is near bottom-right on Cover page, curl corner upward
    if (!isDraggingRef.current && curlMaterialRef.current && currentPage === 0) {
      if (nx > 0.45 && ny < -0.4) {
        gsap.to(curlMaterialRef.current.uniforms.uCornerHover, {
          value: 1.0,
          duration: 0.3,
        });
      } else {
        gsap.to(curlMaterialRef.current.uniforms.uCornerHover, {
          value: 0.0,
          duration: 0.3,
        });
      }
    }

    // Interactive Dragging
    if (isDraggingRef.current) {
      const deltaX = e.clientX - dragStartRef.current.x;
      dragStartRef.current.moved += Math.abs(deltaX);

      const ratio = deltaX / (rect.width * 0.7);
      let newProgress = 0;

      if (dragStartRef.current.startProgress < 0.5) {
        // Dragging left from Cover to Archive
        newProgress = Math.max(0, Math.min(1, -ratio));
      } else {
        // Dragging right from Archive back to Cover
        newProgress = Math.max(0, Math.min(1, 1 - ratio));
      }

      setCurlProgress(newProgress);
    }
  };

  const handlePointerDown = (e) => {
    if (e.target.closest("button, a")) return;

    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: performance.now(),
      moved: 0,
      startProgress: progressStateRef.current.value,
    };

    if (e.currentTarget?.setPointerCapture) {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Fallback
      }
    }
  };

  const handlePointerUp = (e) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    const d = dragStartRef.current;
    const elapsed = performance.now() - d.time;
    const vel = d.moved / (elapsed || 1);
    const curr = progressStateRef.current.value;

    // Tap or quick click: Toggle page smoothly
    if (d.moved < 12) {
      const target = curr < 0.5 ? 1 : 0;
      flipToPage(target);
      return;
    }

    // Velocity or distance commit threshold
    let target = curr > 0.42 ? 1 : 0;
    if (vel > 0.7) {
      target = d.x > e.clientX ? 1 : 0;
    }

    flipToPage(target);

    if (e.currentTarget?.releasePointerCapture) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Fallback
      }
    }
  };

  // -------------------------------------------------------------------------
  // MOUSE WHEEL / SCROLL & KEYBOARD NAVIGATION (User: "from then the page will scroll, a page flip, page turning")
  // -------------------------------------------------------------------------
  useEffect(() => {
    let scrollAccumulator = 0;
    let scrollResetTimer = null;

    const handleWheel = (e) => {
      scrollAccumulator += e.deltaY;
      if (scrollAccumulator > 50 && currentPage === 0) {
        scrollAccumulator = 0;
        flipToPage(1);
      } else if (scrollAccumulator < -50 && currentPage === 1) {
        scrollAccumulator = 0;
        flipToPage(0);
      }

      clearTimeout(scrollResetTimer);
      scrollResetTimer = setTimeout(() => {
        scrollAccumulator = 0;
      }, 350);
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      clearTimeout(scrollResetTimer);
    };
  }, [currentPage, flipToPage]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") && currentPage === 0) {
        flipToPage(1);
      } else if ((e.key === "ArrowLeft" || e.key === "PageUp") && currentPage === 1) {
        flipToPage(0);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, flipToPage]);

  return (
    <div
      ref={mountRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none overflow-hidden"
    >
      {/* Loading state indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#101820] text-[#d69a62] font-cinzel text-sm uppercase tracking-widest z-50">
          Enshrining 3D Folio...
        </div>
      )}

      {/* Atmospheric Gesture Cue (No Buttons — Drag/Pull to Turn Folio, padding < 2rem) */}
      <div className="absolute bottom-[1.25rem] z-30 flex items-center gap-[0.75rem] text-[0.85rem] text-[#d8d0c4]/90 bg-[#101820]/90 px-[1.35rem] py-[0.6rem] rounded-full border border-[#d69a62]/40 backdrop-blur-md shadow-2xl pointer-events-none">
        <span className="w-[0.5rem] h-[0.5rem] rounded-full bg-[#d69a62] animate-pulse shadow-[0_0_0.5rem_#d69a62]" />
        <span className="font-snell text-[1.15rem] text-[#d69a62] italic mr-[0.25rem]">
          Folio Turn:
        </span>
        <span className="font-cormorant italic text-[0.95rem] tracking-wider text-[#d8d0c4]">
          Drag mouse left across the page or pull bottom corner to open Archive
        </span>
        <span className="font-cinzel text-[0.8rem] text-[#d69a62] tracking-widest ml-[0.25rem]">
          ⟶
        </span>
      </div>

      {/* Atmospheric Corner Curl Indicator on Bottom-Right */}
      <div 
        className="absolute bottom-[1.5rem] right-[1.5rem] z-20 pointer-events-none flex flex-col items-end opacity-75 group-hover:opacity-100 transition-opacity"
        aria-hidden="true"
      >
        <span className="font-snell text-[1.1rem] text-[#d69a62] italic drop-shadow-md">
          Peel corner
        </span>
        <span className="font-cinzel text-[0.65rem] tracking-[0.25em] text-[#d8d0c4]/70 uppercase">
          Folio Corner ⤡
        </span>
      </div>
    </div>
  );
}

export default ThreePageCurl;
