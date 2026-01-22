// ANIMATION TIMELINE
  useEffect(() => {
    if (typeof window === 'undefined' || !allImagesLoaded || !isReady) return;

    if (timelineRef.current) timelineRef.current.kill();
    if (scrollTriggerRef.current) scrollTriggerRef.current.kill();

    animState.current = { scale: 1, panY: 0, lastScale: -1, lastPanY: -1 };

    // Initial setup
    gsap.set(shapeRef.current, { opacity: 1, force3D: true });
    // Ensure building starts fully visible and reset
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
    
    // Scale building
    tl.to(buildingRef.current, { 
      scale: buildingZoomScale, 
      duration: 2.5, 
      ease: "sine.inOut", 
      force3D: true 
    }, 0);

    // FADE OUT PHASE - FIX: Use fromTo to ensure reversibility works
    // This forces GSAP to acknowledge opacity must be 1 at start of this segment
    tl.fromTo(buildingRef.current, 
      { opacity: 1 }, 
      { opacity: 0, duration: 0.6, ease: "power1.inOut", immediateRender: false }, 
      2.2
    );

    // Also use fromTo for text to ensure it comes back
    tl.fromTo(textRef.current, 
      { opacity: 1 },
      { opacity: 0, duration: 0.6, ease: "power1.inOut", immediateRender: false }, 
      2.2
    );

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
