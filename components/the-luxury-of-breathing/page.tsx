"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function MiraiHomesPage() {
  const [showHeadText, setShowHeadText] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [skyImageLoaded, setSkyImageLoaded] = useState(false);

  const mainRef = useRef<HTMLElement>(null);
  const scrollDistRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const progressPathRef = useRef<SVGPathElement>(null);

  // Preload the sky background image
  useEffect(() => {
    const img = new Image();
    img.src = "https://azure-baboon-302476.hostingersite.com//mirai_/media/footer_img.png";
    img.onload = () => setSkyImageLoaded(true);
  }, []);

  // GSAP Parallax animations
  useEffect(() => {
    if (!skyImageLoaded) return;

    const ctx = gsap.context(() => {
      // Set initial positions for clouds and sky
      gsap.set(".sky", { y: 0 });
      gsap.set(".cloud1", { y: 100 });
      gsap.set(".cloud2", { y: -150 });
      gsap.set(".cloud3", { y: -50 });

      // Parallax animation for clouds and sky using onUpdate for smoother performance
      ScrollTrigger.create({
        trigger: scrollDistRef.current,
        start: "0 0",
        end: "100% 100%",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Sky moves slowest
          gsap.set(".sky", { y: progress * -200 });
          
          // Cloud1 moves from y:100 to y:-800 (total -900 distance)
          gsap.set(".cloud1", { y: 100 + (progress * -900) });
          
          // Cloud2 moves from y:-150 to y:-500 (total -350 distance)
          gsap.set(".cloud2", { y: -150 + (progress * -350) });
          
          // Cloud3 moves from y:-50 to y:-650 (total -600 distance)
          gsap.set(".cloud3", { y: -50 + (progress * -600) });
        },
      });
    }, mainRef);

    return () => ctx.revert();
  }, [skyImageLoaded]);

  // Scroll event handlers
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      setScrollProgress(scrollPercent);
      setShowScrollTop(scrollTop > 50);
      setShowHeadText(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update scroll progress path
  useEffect(() => {
    if (progressPathRef.current) {
      const pathLength = progressPathRef.current.getTotalLength();
      const progressOffset = pathLength - (scrollProgress / 100) * pathLength;
      progressPathRef.current.style.strokeDasharray = `${pathLength} ${pathLength}`;
      progressPathRef.current.style.strokeDashoffset = `${progressOffset}`;
    }
  }, [scrollProgress]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main ref={mainRef} className="relative bg-white">
      {/* Scroll Distance Trigger */}
      <div ref={scrollDistRef} className="h-[150vh] absolute w-full top-0 left-0 pointer-events-none" />

      {/* ==================== PARALLAX HERO SECTION ==================== */}
      <section ref={heroRef} className="relative z-10 bg-white overflow-hidden">
        {/* Loading placeholder */}
        {!skyImageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-300 via-neutral-200 to-white" />
        )}
        
        <svg 
          viewBox="0 0 1200 800" 
          xmlns="http://www.w3.org/2000/svg" 
          className={`w-full h-auto block transition-opacity duration-500 ${skyImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ display: 'block', margin: 0, padding: 0, backgroundColor: 'white' }}
        >
          <defs>
            <mask id="m">
              <g className="cloud1">
                <rect fill="#fff" width="100%" height="801" y="799" />
                <image
                  xlinkHref="https://assets.codepen.io/721952/cloud1Mask.jpg"
                  width="1200"
                  height="800"
                />
              </g>
            </mask>
            <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1a1a1a" />
              <stop offset="50%" stopColor="#333333" />
              <stop offset="100%" stopColor="#4a4a4a" />
            </linearGradient>
          </defs>

          <image
            className="sky"
            xlinkHref="https://azure-baboon-302476.hostingersite.com//mirai_/media/blog-three.jpg"
            width="1200"
            height="800"
            preserveAspectRatio="xMidYMid slice"
          />

          <image
            className="cloud2"
            xlinkHref="https://assets.codepen.io/721952/cloud2.png"
            width="1200"
            height="800"
          />
          <image
            className="cloud1"
            xlinkHref="https://assets.codepen.io/721952/cloud1.png"
            width="1200"
            height="800"
          />
          <image
            className="cloud3"
            xlinkHref="https://assets.codepen.io/721952/cloud3.png"
            width="1200"
            height="800"
          />

          <g mask="url(#m)">
            <rect fill="#fff" width="100%" height="100%" />
          </g>
        </svg>

        {/* Text Overlay */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-end pb-16 md:pb-24 lg:pb-32 text-center px-4 transition-all duration-700 ${
            showHeadText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#78252f] mb-6 leading-tight drop-shadow-2xl max-w-5xl">
            The Luxury of Breathing Room: A Philosophy of Space
          </h2>
          <p className="text-[#78252f]/90 text-sm md:text-base tracking-[0.2em] uppercase font-light drop-shadow-lg">
            Pavani Mirai
          </p>
        </div>
      </section>

      {/* ==================== ARTICLE CONTENT ==================== */}
      <article className="relative z-20 bg-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12 text-black leading-relaxed">
          
          {/* Intro */}
          <div className="prose prose-lg max-w-none">
            <p className="text-lg md:text-xl text-black/70 font-light leading-8">
              In today's cities, space has become the most coveted luxury. Urban life, with all its conveniences and connections, has also brought with it a quiet longing for openness, serenity, and a sense of balance. At <strong>Pavani Mirai</strong>, that longing finds its answer.
            </p>
            <p className="mt-6 text-lg text-black/80">
              Set against the ever-evolving skyline of Hyderabad's Financial District, Pavani Mirai represents a bold shift in what modern luxury can mean. Mirai offers a philosophy of space. Here, expansive 8,000 sq. ft. homes rise amid 75% open landscaped greens, blending the grace of vertical luxury with the grounding calm of nature.
            </p>
            <p className="mt-4 text-lg italic border-l-4 border-[#78252f] pl-4 text-[#78252f]">
              For those who believe that true wealth lies in the freedom to breathe, Mirai redefines luxury not through excess, but through expanse of space, of light, and of thought.
            </p>
          </div>

          {/* Section 1 - Openness */}
          <div>
            <h3 className="text-2xl md:text-3xl font-serif text-[#78252f] mb-6">
              An Architectural Ode to Openness
            </h3>
            <p className="mb-4 text-lg text-black/80">
              Pavani Mirai's design stems from a simple yet profound idea: that a home should not confine, but liberate.
            </p>
            <p className="mb-4 text-lg text-black/80">
              With just 178 residences spread across a single 55-storey tower, each residence at Mirai is conceived as a sanctuary in the sky - private, voluminous, and naturally lit. Spanning an extraordinary 8,000 sq. ft., every home embodies the rarest luxury in today's urban context: breathing room.
            </p>
            <p className="text-lg text-black/80">
              From the moment one steps into Mirai's grand 40 ft. high entrance door, the scale of the experience is unmistakable. The arrival isn't just physical; it's an emotional awakening into an elevated world that values space as the ultimate indulgence.
            </p>
          </div>

          {/* Section 2 - Space Details (Light Box) */}
          <div className="bg-neutral-50 p-8 rounded-2xl border border-black/10">
            <h3 className="text-2xl md:text-3xl font-serif text-[#78252f] mb-6">
              Space That Breathes, Inside and Out
            </h3>
            <p className="mb-6 text-lg text-black/80">
              At Pavani Mirai, space isn't just measured in square feet, it's measured in moments.
            </p>
            <p className="mb-6 text-lg text-black/80">
              Every residence unfolds like a private universe, seamlessly woven into a design that flows naturally from one experience to another:
            </p>
            
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
               <li className="flex items-center gap-2 text-lg text-black/80"><span className="w-2 h-2 bg-[#78252f] rounded-full"></span> Foyer Lobby & Formal Lounge</li>
               <li className="flex items-center gap-2 text-lg text-black/80"><span className="w-2 h-2 bg-[#78252f] rounded-full"></span> Expansive Living Room</li>
               <li className="flex items-center gap-2 text-lg text-black/80"><span className="w-2 h-2 bg-[#78252f] rounded-full"></span> Master Suite Retreat</li>
               <li className="flex items-center gap-2 text-lg text-black/80"><span className="w-2 h-2 bg-[#78252f] rounded-full"></span> Private Home Theatre</li>
               <li className="flex items-center gap-2 text-lg text-black/80"><span className="w-2 h-2 bg-[#78252f] rounded-full"></span> Family Deck & Balcony</li>
               <li className="flex items-center gap-2 text-lg text-black/80"><span className="w-2 h-2 bg-[#78252f] rounded-full"></span> Dedicated Helper's Room</li>
            </ul>

            <p className="text-black/70 text-sm leading-relaxed">
              The decks offer a sweeping 270° panoramic view allowing the sky, horizon, and greenery to become part of the interior canvas. Morning light pours into the living areas; evenings dissolve into views that stretch endlessly across the cityscape. This interplay of openness and intimacy gives Mirai's homes a sense of rhythm and calm that few spacious apartments in Financial District can rival.
            </p>
          </div>

          {/* Section 3 - Greenery (Dark Box) */}
          <div className="bg-[#78252f] p-8 md:p-12 rounded-2xl">
            <h3 className="text-2xl md:text-3xl font-serif text-white mb-6">
              A Vertical Haven Rooted in Green
            </h3>
            <p className="mb-4 text-lg text-white">
              While Pavani Mirai rises skyward, it remains deeply grounded in nature. The project is set within <strong>75% open landscaped greens</strong>, forming a tranquil cocoon amidst Hyderabad's dynamic business district.
            </p>
            <p className="mb-4 text-lg text-white">
              Pathways lined with foliage, water features that mirror the sky, and pockets of biophilic design ensure that nature is never out of reach with even more than 50 floors above ground. This thoughtful integration of greenery doesn't just beautify; it rejuvenates. It fosters well-being, lowers stress, and reinforces the project's commitment to luxury that sustains life rather than just decorates it.
            </p>
            <p className="text-lg text-white italic">
              This harmony between height and horizon, between structure and soil, is what makes Pavani Mirai one of the most premium gated communities in Hyderabad.
            </p>
          </div>

          {/* Section 4 - Privacy & Flow */}
          <div>
            <h3 className="text-2xl md:text-3xl font-serif text-[#78252f] mb-6">
              The New Standard of Private Luxury
            </h3>
            <p className="mb-8 text-lg text-black/80">
              Privacy is not an afterthought at Mirai; it is a design principle. With just <strong>one residence per floor</strong>, each home enjoys unmatched exclusivity. Residents have private access to their floors, ensuring peace, discretion, and security at every level. This architecture of privacy allows homeowners to enjoy the spatial freedom of an independent villa while retaining the elevated privileges of a luxury high-rise.
            </p>

            <h3 className="text-2xl md:text-3xl font-serif text-[#78252f] mb-6">
              Luxury That Flows Naturally
            </h3>
            <p className="mb-4 text-lg text-black/80">
              The magic of Mirai lies in its spatial choreography. The formal lounge welcomes guests with understated grandeur, while the living room opens into decks that blur the boundary between indoors and outdoors. The master suite is a world within itself by offering a place of quiet retreat framed by views that stretch across the city skyline.
            </p>
            <p className="text-lg text-black/80">
              For leisure and entertainment, the home theatre offers an intimate cinematic escape, while the family deck and balcony provide settings for conversation, coffee, or contemplation. Every corner, every curve, and every corridor has been designed to evoke a sense of openness, not just of space, but of spirit.
            </p>
          </div>

          {/* FAQ Section */}
          <div className="border-t border-b border-black/20 py-12">
            <h3 className="text-2xl md:text-3xl font-serif text-[#78252f] mb-8 text-center">FAQs</h3>
            <div className="space-y-8">
              <div>
                <h5 className="font-normal text-lg text-[#78252f] mb-2">1. What are the key dimensions and features of the residences?</h5>
                <p className="text-lg text-black/70">Each residence at Pavani Mirai spans approximately 8,000 sq. ft., making it one of the most spacious apartment layouts in Hyderabad. Homes feature a foyer lobby, formal lounge, living room, master suite, home theatre, family deck, balcony, and helper's room, ensuring every aspect of luxury living is catered to. The 270° panoramic decks provide spectacular views, while the 40 ft. high entrance door sets the tone for an unparalleled sense of arrival.</p>
              </div>
              <div>
                <h5 className="font-normal text-lg text-[#78252f] mb-2">2. How is resident privacy ensured in these luxury homes?</h5>
                <p className="text-lg text-black/70">Privacy at Mirai is ensured through one residence per floor, offering residents a completely private living environment. Each home enjoys dedicated access and controlled entry, ensuring exclusivity and security. Sound insulation, thoughtful floor planning, and spatial separation of private and social areas further enhance personal comfort and peace, the key hallmarks of premium gated communities in Hyderabad.</p>
              </div>
              <div>
                <h5 className="font-normal text-lg text-[#78252f] mb-2">3. How does Pavani Mirai contrast vertical luxury with green space?</h5>
                <p className="text-lg text-black/70">Pavani Mirai redefines vertical living by integrating 75% open landscaped space into its master plan. While the tower ascends into the skyline, it remains surrounded by lush greens, reflective water bodies, and biophilic landscapes. This unique balance allows residents to enjoy the benefits of vertical luxury living while remaining deeply connected to nature. This rare equilibrium positions Mirai among the most forward-thinking luxury homes in Hyderabad.</p>
              </div>
            </div>
          </div>

          {/* Conclusion */}
          <div className="text-center pt-8">
            <h3 className="text-2xl md:text-3xl font-serif text-[#78252f] mb-6">
              Beyond Square Feet: A Philosophy of Space
            </h3>
            <p className="mb-6 text-lg max-w-2xl mx-auto text-black/80">
              Pavani Mirai is an embodiment of how the future of urban living must evolve. As cities grow denser and faster, luxury can no longer be confined to material opulence; it must be measured by breathing room, natural balance, and emotional peace.
            </p>
            <p className="mb-8 text-lg max-w-2xl mx-auto text-black/80">
              By offering 8,000 sq. ft. homes surrounded by expansive open landscapes, Mirai delivers an antidote to the chaos of modern city life. It invites you to live not just well, but fully, with time, light, and stillness as your most prized luxuries.
            </p>
            
            <div className="inline-block border-y-2 border-[#78252f] py-4 px-8 mt-4">
              <p className="text-xl font-light text-black">
                The future of urban luxury belongs to those who see beyond possessions and seek presence.
              </p>
              <p className="mt-4 font-serif text-2xl text-[#78252f] font-normal">
                Space is not just what surrounds you,<br/>
                it's what centres you.
              </p>
            </div>
          </div>

        </div>
      </article>

      {/* ==================== SCROLL TO TOP BUTTON ==================== */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110 ${
          showScrollTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="-1 -1 102 102">
          <path
            ref={progressPathRef}
            d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
            fill="none"
            stroke="#78252f"
            strokeWidth="3"
            className="transition-all duration-100"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[#78252f]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </span>
      </button>
    </main>
  );
}

