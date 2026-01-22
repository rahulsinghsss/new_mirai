"use client";

import { useEffect, useRef, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { StaticImageData } from 'next/image';

// Register GSAP plugin once at module level
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================
// 1. Mobile Hotspot Component
// ============================================
interface HotspotProps {
  title: string;
  subtitle: string;
  description: string;
  position: 'left' | 'right' | 'center';
}

function MobileHotspot({ title, subtitle, description, position }: HotspotProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTap = () => {
    setIsExpanded(!isExpanded);
  };

  // Close when clicking outside
  useEffect(() => {
    if (!isExpanded) return;
    
    const handleClickOutside = (e: TouchEvent | MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.hotspot-container')) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isExpanded]);

  return (
    <div 
      className="hotspot-container"
      style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: position === 'center' ? 'center' : position === 'right' ? 'flex-end' : 'flex-start',
        transform: 'translateZ(0)',
      }} 
    >
      <button 
        onClick={handleTap}
        className="relative z-20 flex items-center justify-center shrink-0"
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: isExpanded ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.6)',
          border: '1.5px solid rgba(255, 255, 255, 0.5)',
          boxShadow: isExpanded ? '0 0 25px rgba(255,255,255,0.5)' : '0 0 15px rgba(0,0,0,0.5)', 
          transition: 'all 0.3s ease',
        }}
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none"
          style={{ 
            transform: isExpanded ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        >
          <line x1="12" y1="5" x2="12" y2="19" stroke={isExpanded ? '#000' : '#fff'} strokeWidth="2" strokeLinecap="round" />
          <line x1="5" y1="12" x2="19" y2="12" stroke={isExpanded ? '#000' : '#fff'} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <div 
        style={{
          marginTop: '8px',
          opacity: isExpanded ? 0 : 1,
          transform: isExpanded ? 'translateY(-10px)' : 'translateY(0)',
          transition: 'all 0.3s ease',
          textAlign: position === 'center' ? 'center' : position === 'right' ? 'right' : 'left',
        }}
      >
        <h3 style={{
          color: '#FFFFFF',
          fontSize: '12px',
          fontWeight: '400',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          textShadow: '0 2px 8px rgba(0,0,0,0.9)',
          whiteSpace: 'nowrap',
        }}>
          {title}
        </h3>
        <p style={{
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '9px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          textShadow: '0 2px 8px rgba(0,0,0,0.9)',
          marginTop: '2px',
          whiteSpace: 'nowrap',
        }}>
          {subtitle}
        </p>
      </div>
      
      <div 
        style={{
          position: 'absolute',
          top: '60px',
          left: position === 'right' ? 'auto' : position === 'center' ? '50%' : '0',
          right: position === 'right' ? '0' : 'auto',
          transform: position === 'center' ? 'translateX(-50%)' : 'none',
          maxWidth: isExpanded ? '280px' : '0px',
          opacity: isExpanded ? 1 : 0,
          pointerEvents: isExpanded ? 'auto' : 'none',
          transition: 'all 0.3s ease',
          zIndex: 100,
        }}
      >
        <div 
          style={{ 
            padding: '16px',
            borderRadius: '12px',
            minWidth: '240px',
            backgroundColor: 'rgba(10, 10, 10, 0.95)',
            backdropFilter: 'blur(12px)', 
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
          }}
        >
          <h3 style={{ 
            color: '#FFFFFF', 
            fontSize: '14px', 
            fontWeight: '400', 
            letterSpacing: '0.15em', 
            textTransform: 'uppercase', 
            marginBottom: '4px' 
          }}>
            {title}
          </h3>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.5)', 
            fontSize: '10px', 
            letterSpacing: '0.1em', 
            textTransform: 'uppercase', 
            marginBottom: '12px' 
          }}>
            {subtitle}
          </p>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.85)', 
            fontSize: '13px', 
            fontWeight: '300', 
            lineHeight: '1.6', 
            letterSpacing: '0.01em' 
          }}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 2. Main Mobile Zoom Component
// ============================================
interface ZoomRevealProps {
  buildingImage?: string | StaticImageData;
  windowImage?: string | StaticImageData;
  shapeImage?: string | StaticImageData;
  scrollDistance?: string;
  buildingZoomScale?: number;
  windowZoomScale?: number;
  windowMoveDistance?: number;
}

export function RevealZoomMobile({
  buildingImage = '/images/gateway/girlmobile.png',
  windowImage = '/images/gateway/Buildingmobile.png',
  shapeImage = '/images/gateway/shape-two.png',
  scrollDistance = "+=500%",
  buildingZoomScale = 12,
  windowZoomScale = 2.0,
  windowMoveDistance = 0.8,
}: ZoomRevealProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buildingRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  // Hotspot refs
  const pointer1Ref = useRef<HTMLDivElement>(null);
  const pointer2Ref = useRef<HTMLDivElement>(null);
  const pointer3Ref = useRef<HTMLDivElement>(null);
  const pointer4Ref = useRef<HTMLDivElement>(null);

  const pointer1InnerRef = useRef<HTMLDivElement>(null);
  const pointer2InnerRef = useRef<HTMLDivElement>(null);
  const pointer3InnerRef = useRef<HTMLDivElement>(null);
  const pointer4InnerRef = useRef<HTMLDivElement>(null);
  
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  
  const [isReady, setIsReady] = useState(false);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  
  const shapeRef = useRef<HTMLImageElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  
  const animState = useRef({
    scale: 1,
    panY: 0,
    lastScale: -1,
    lastPanY: -1,
  });

  const resolvedBuildingSrc = typeof buildingImage === 'string' ? buildingImage : buildingImage.src;
  const resolvedWindowSrc = typeof windowImage === 'string' ? windowImage : windowImage.src;
  const resolvedShapeSrc = typeof shapeImage === 'string' ? shapeImage : shapeImage.src;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const timer = setTimeout(() => { setIsReady(true); }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    let loadedCount = 0;
    const totalImages = 3;
    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount >= totalImages) setAllImagesLoaded(true);
    };
    
    const windowImg = new Image();
    windowImg.decoding = 'async';
    windowImg.onload = () => { imageRef.current = windowImg; checkAllLoaded(); };
    windowImg.onerror = checkAllLoaded;
    windowImg.src = resolvedWindowSrc;
    
    const buildingImg = new Image();
    buildingImg.decoding = 'async';
    buildingImg.onload = checkAllLoaded;
    buildingImg.onerror = checkAllLoaded;
    buildingImg.src = resolvedBuildingSrc;
    
    const shapeImg = new Image();
    shapeImg.decoding = 'async';
    shapeImg.onload = checkAllLoaded;
    shapeImg.onerror = checkAllLoaded;
    shapeImg.src = resolvedShapeSrc;
  }, [isReady, resolvedWindowSrc, resolvedBuildingSrc, resolvedShapeSrc]);

  // Canvas Drawing
  const drawCanvas = useCallback((force: boolean = false) => {
    const canvas = canvasRef.current;
    const ctx = canvasCtxRef.current;
    const img = imageRef.current;
    if (!canvas || !ctx || !img) return;

    const { scale, panY, lastScale, lastPanY } = animState.current;
    if (!force && Math.abs(scale - lastScale) < 0.001 && Math.abs(panY - lastPanY) < 0.001) return;
    
    animState.current.lastScale = scale;
    animState.current.lastPanY = panY;

    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    
    if (displayWidth === 0 || displayHeight === 0) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = displayWidth / displayHeight;
    
    let baseWidth: number, baseHeight: number;
    if (imgAspect > canvasAspect) {
      baseHeight = displayHeight;
      baseWidth = baseHeight * imgAspect;
    } else {
      baseWidth = displayWidth;
      baseHeight = baseWidth / imgAspect;
    }
    
    const drawWidth = baseWidth * scale;
    const drawHeight = baseHeight * scale;
    
    // Zoom/Pan X Logic
    const zoomProgress = Math.max(0, (scale - 1) / (windowZoomScale - 1));
    const rightShift = displayWidth * 0.15 * zoomProgress;
    const drawX = ((displayWidth - drawWidth) / 2) + rightShift;
    
    // =========================================================================
    // UPDATED Y-AXIS LOGIC (Crop from top)
    // =========================================================================
    
    // Calculate how much taller the image is than the screen
    const extraHeight = drawHeight - displayHeight;

    // We start at 0 (Top of image is visible at top of screen).
    // As panY goes from 0 to 1, we move the image UP (negative Y)
    // to reveal the bottom parts.
    const drawY = -(extraHeight * panY);

    ctx.drawImage(
      img, 
      0, 0, img.naturalWidth, img.naturalHeight, 
      drawX, drawY, drawWidth, drawHeight
    );
  }, [windowZoomScale]);

  const scheduleCanvasDraw = useCallback(() => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = requestAnimationFrame(() => drawCanvas(true));
  }, [drawCanvas]);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    canvas.width = rect.width;
    canvas.height = rect.height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'medium';
      canvasCtxRef.current = ctx;
    }
    drawCanvas(true);
  }, [drawCanvas]);

  useEffect(() => {
    if (allImagesLoaded && imageRef.current && canvasRef.current) {
      const timer = setTimeout(() => {
        setupCanvas();
        drawCanvas(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [allImagesLoaded, setupCanvas, drawCanvas]);

  useEffect(() => {
    if (!allImagesLoaded) return;
    const handleResize = () => {
      setupCanvas();
      timelineRef.current?.invalidate();
      scrollTriggerRef.current?.refresh();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [allImagesLoaded, setupCanvas]);

  // ANIMATION TIMELINE
  useEffect(() => {
    if (typeof window === 'undefined' || !allImagesLoaded || !isReady) return;

    if (timelineRef.current) timelineRef.current.kill();
    if (scrollTriggerRef.current) scrollTriggerRef.current.kill();

    animState.current = { scale: 1, panY: 0, lastScale: -1, lastPanY: -1 };

    gsap.set(shapeRef.current, { opacity: 1, force3D: true });
    gsap.set(buildingRef.current, { scale: 1, opacity: 1, force3D: true, z: 0 }); 
    gsap.set(textRef.current, { opacity: 0, y: 40 });
    gsap.set([
      pointer1InnerRef.current, pointer2InnerRef.current, 
      pointer3InnerRef.current, pointer4InnerRef.current
    ], { opacity: 0, scale: 0.8, force3D: true });

    const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } });
    timelineRef.current = tl;

    // ZOOM PHASE
    tl.to(shapeRef.current, { opacity: 0, duration: 0.6, ease: "power1.out" }, 0);
    tl.to(textRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, 0.3);
    tl.to(buildingRef.current, { scale: buildingZoomScale, duration: 2.5, ease: "sine.inOut", force3D: true }, 0);

    // FADE OUT PHASE
    tl.to(buildingRef.current, { opacity: 0, duration: 0.6, ease: "power1.inOut" }, 2.2);
    tl.to(textRef.current, { opacity: 0, duration: 0.6, ease: "power1.inOut" }, 2.2);

    // HOTSPOT REVEAL
    const revealHotspot = (ref: React.RefObject<HTMLDivElement | null>, time: number, duration: number = 2.0) => {
      tl.to(ref.current, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.2)" }, time);
      tl.to(ref.current, { opacity: 1, scale: 1, duration: duration }, time + 0.5);
    };

    revealHotspot(pointer1InnerRef, 2.8, 1.5);
    revealHotspot(pointer2InnerRef, 3.5, 1.5);
    revealHotspot(pointer3InnerRef, 4.5, 1.5);
    revealHotspot(pointer4InnerRef, 5.5, 1.5);

    const stTimer = setTimeout(() => {
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        end: scrollDistance,
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (timelineRef.current) {
            timelineRef.current.progress(self.progress);
            scheduleCanvasDraw();
          }
        }
      });
    }, 50);

    return () => {
      clearTimeout(stTimer);
      scrollTriggerRef.current?.kill();
      timelineRef.current?.kill();
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [allImagesLoaded, isReady, buildingZoomScale, windowZoomScale, windowMoveDistance, scrollDistance, scheduleCanvasDraw]);

  if (!isReady) return <section className="w-full h-screen bg-black" />;

  return (
    <section 
      ref={wrapperRef} 
      className="relative w-full bg-black overflow-hidden" 
      style={{ 
        minHeight: '100vh', 
        zIndex: 50,
        opacity: allImagesLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
    >
      <div ref={containerRef} className="relative w-full h-screen overflow-hidden">
        
        {/* Layer 1: Window/Canvas */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full" 
          style={{ zIndex: 1, backgroundColor: 'transparent' }} 
        />

        {/* Layer 2: Building Image */}
        <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
          <img
            ref={buildingRef}
            src={resolvedBuildingSrc}
            alt="Building View"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ willChange: 'transform, opacity', backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
          />
        </div>

        {/* Layer 3: Shape Overlay */}
        <img
          ref={shapeRef}
          src={resolvedShapeSrc}
          alt=""
          decoding="async"
          className="absolute top-0 left-1/2 w-full max-w-[100vw] -translate-x-1/2 pointer-events-none"
          style={{ zIndex: 100, height: 'auto', objectFit: 'contain', willChange: 'opacity', backfaceVisibility: 'hidden' }}
        />

        {/* HOTSPOTS */}
        <div ref={pointer1Ref} className="absolute" style={{ zIndex: 20, top: '25%', right: '20%', willChange: 'transform' }}>
          <div ref={pointer1InnerRef} className="opacity-0 scale-90 origin-center">
            <MobileHotspot title="SkyPods" subtitle="54th-55th Floor" position="left" description="The 4 Sky Pods, inspired by the elements, elevate everyday moments into something truly spectacular." />
          </div>
        </div>

        <div ref={pointer2Ref} className="absolute" style={{ zIndex: 20, top: '35%', left: '15%', willChange: 'transform' }}>
          <div ref={pointer2InnerRef} className="opacity-0 scale-90 origin-center">
            <MobileHotspot title="Residencies" subtitle="5th-53rd Floor" position="left" description="Live uninhibited at our magnificent residences that stretch out at 8,000+ sft each." />
          </div>
        </div>

        <div ref={pointer3Ref} className="absolute" style={{ zIndex: 20, top: '180%', right: '25%', willChange: 'transform' }}>
          <div ref={pointer3InnerRef} className="opacity-0 scale-90 origin-center">
            <MobileHotspot title="Clubhouse" subtitle="G-4th Floor" position="right" description="The first 4 floors of Mirai are a spectacular Clubhouse, accessible only to a privileged few." />
          </div>
        </div>

        <div ref={pointer4Ref} className="absolute" style={{ zIndex: 20, top: '195%', left: '10%', willChange: 'transform' }}>
          <div ref={pointer4InnerRef} className="opacity-0 scale-90 origin-center">
            <MobileHotspot title="Podium Level" subtitle="Ground Floor" position="left" description="Discover mesmerising terrains & unique amenities at the podium of Mirai."/>
          </div>
        </div>

        {/* Text */}
        <div ref={textRef} className="absolute top-6 right-4 left-4" style={{ zIndex: 15 }}>
          <h2 
            className="text-white leading-tight tracking-tight uppercase text-center"
            style={{ 
              fontFamily: 'Migra', 
              fontSize: '24px', 
              fontWeight: 300,
              textShadow: '0 2px 10px rgba(0,0,0,0.8)',
            }}
          >
            Where You're Always<br />
            In Your Element
          </h2>
        </div>
      </div>
    </section>
  );
}

export default RevealZoomMobile;
