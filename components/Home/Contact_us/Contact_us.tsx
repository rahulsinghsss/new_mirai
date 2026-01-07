'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
const dayViewPath = '/images/day_view.png';

export default function ContactForm() {
  const [bgLoaded, setBgLoaded] = useState(false);
  const [bgError, setBgError] = useState(false);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setBgLoaded(true);
    img.onerror = () => {
      setBgLoaded(true);
      setBgError(true);
    };
    img.src = dayViewPath;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = window.innerHeight;
      
      // Calculate scroll percentage
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
      
      // Start fading in at 85%, fully visible at 95%
      if (scrollPercentage < 0.85) {
        setOpacity(0);
      } else if (scrollPercentage >= 0.95) {
        setOpacity(1);
      } else {
        // Linear interpolation between 85% and 95%
        const fadeProgress = (scrollPercentage - 0.85) / 0.10;
        setOpacity(fadeProgress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Always render, but control visibility with opacity
  // Also use pointer-events to prevent interaction when hidden
  const isInteractive = opacity > 0.1;

  return (
    <section
      id="contact-section"
      className="fixed inset-0 flex items-center justify-start"
      style={{ 
        zIndex: 20,
        opacity: opacity,
        transition: 'opacity 0.3s ease-out',
        pointerEvents: isInteractive ? 'auto' : 'none',
        visibility: opacity > 0 ? 'visible' : 'hidden',
        backgroundColor: bgLoaded && !bgError ? 'black' : '#f3f4f6'
      }}
    >
      {/* Background Image */}
      {bgLoaded && !bgError && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={dayViewPath}
            alt="Day view"
            fill
            priority
            unoptimized
            className="object-cover object-center"
          />
        </div>
      )}
      
      {/* Fallback gradient for loading/error state */}
      {(!bgLoaded || bgError) && (
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white via-gray-100 to-white" aria-hidden="true" />
      )}
      
      <div className="relative z-10 h-full pl-6 lg:pl-12">
        <div className="flex items-center justify-start h-full">
          <div className="w-auto bg-white rounded-xl p-8 md:p-10 shadow-2xl" style={{ maxWidth: '340px' }}>
            <h2 className="text-3xl font-bold mb-8 text-gray-900 font-serif">Contact Us</h2>
            <div className="space-y-6">
              <input 
                placeholder="Name *" 
                className="w-full px-4 py-4 border-b-2 border-gray-200 outline-none text-black focus:border-blue-600 transition-colors" 
              />
              <input 
                placeholder="Email *" 
                className="w-full px-4 py-4 border-b-2 border-gray-200 outline-none text-black focus:border-blue-600 transition-colors" 
              />
              <button className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition-all">
                SUBMIT
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
