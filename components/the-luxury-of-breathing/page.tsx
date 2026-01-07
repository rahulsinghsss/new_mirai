"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function MiraiHomesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [showHeadText, setShowHeadText] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const mainRef = useRef<HTMLElement>(null);
  const scrollDistRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const progressPathRef = useRef<SVGPathElement>(null);

  // Preloader effect
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadProgress((prev) => {
        if (prev >= 99) {
          clearInterval(interval);
          return 99;
        }
        return prev + 1;
      });
    }, 20);

    const timer = setTimeout(() => {
      setLoadProgress(100);
      setTimeout(() => setIsLoading(false), 500);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  // GSAP Parallax animations
  useEffect(() => {
    if (isLoading) return;

    const ctx = gsap.context(() => {
      // Parallax animation for clouds and sky
      gsap.timeline({
        scrollTrigger: {
          trigger: scrollDistRef.current,
          start: "0 0",
          end: "100% 100%",
          scrub: 1,
        },
      })
        .fromTo(".sky", { y: 0 }, { y: -200 }, 0)
        .fromTo(".cloud1", { y: 100 }, { y: -800 }, 0)
        .fromTo(".cloud2", { y: -150 }, { y: -500 }, 0)
        .fromTo(".cloud3", { y: -50 }, { y: -650 }, 0);
    }, mainRef);

    return () => ctx.revert();
  }, [isLoading]);

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
    <>
      {/* ==================== PRELOADER ==================== */}
      <div
        className={`fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900 transition-opacity duration-1000 ${
          !isLoading ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative flex flex-col items-center gap-8">
          <div className="relative">
            <div className="w-24 h-24 border border-amber-500/30 rotate-45 animate-[spin_8s_linear_infinite]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-serif text-amber-500 tracking-widest">M</span>
            </div>
          </div>

          <div className="w-48 h-[1px] bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-100 ease-out"
              style={{ width: `${loadProgress}%` }}
            />
          </div>

          <span className="text-amber-500/80 text-sm tracking-[0.3em] font-light">
            {loadProgress}%
          </span>
        </div>
      </div>

      {/* ==================== MAIN CONTENT ==================== */}
      <main
        ref={mainRef}
        className={`relative transition-opacity duration-1000 ${isLoading ? "opacity-0" : "opacity-100"}`}
      >
        {/* Scroll Distance Trigger */}
        <div ref={scrollDistRef} className="h-[150vh] absolute w-full top-0 left-0 pointer-events-none" />

        {/* ==================== PARALLAX HERO SECTION ==================== */}
        <section ref={heroRef} className="relative z-10">
          <svg viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
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
                <stop offset="0%" stopColor="#1a365d" />
                <stop offset="50%" stopColor="#2c5282" />
                <stop offset="100%" stopColor="#4299e1" />
              </linearGradient>
            </defs>

            <image
              className="sky"
              xlinkHref="https://azure-baboon-302476.hostingersite.com//mirai_/media/footer_img.png"
              width="1200"
              height="679"
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
              <rect fill="#fff" width="100%" height="90%" />
            </g>
          </svg>

          {/* Text Overlay */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center text-center px-4 transition-all duration-700 ${
              showHeadText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#800020] mb-6 leading-tight drop-shadow-2xl max-w-5xl">
              The Luxury of Breathing Room: A Philosophy of Space
            </h2>
            <p className="text-[#800020]/90 text-sm md:text-base tracking-[0.2em] uppercase font-light drop-shadow-lg">
              Pavani Mirai
            </p>
          </div>
        </section>

        {/* ==================== ARTICLE CONTENT ==================== */}
        <article className="relative z-20 bg-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-12 text-slate-700 leading-relaxed">
            
            {/* Intro */}
            <div className="prose prose-lg prose-slate max-w-none">
              <p className="text-lg md:text-xl text-slate-600 font-light leading-8">
                In today’s cities, space has become the most coveted luxury. Urban life, with all its conveniences and connections, has also brought with it a quiet longing for openness, serenity, and a sense of balance. At <strong>Pavani Mirai</strong>, that longing finds its answer.
              </p>
              <p className="mt-6">
                Set against the ever-evolving skyline of Hyderabad’s Financial District, Pavani Mirai represents a bold shift in what modern luxury can mean. Mirai offers a philosophy of space. Here, expansive 8,000 sq. ft. homes rise amid 75% open landscaped greens, blending the grace of vertical luxury with the grounding calm of nature.
              </p>
              <p className="mt-4 italic border-l-4 border-amber-500 pl-4 text-slate-500">
                For those who believe that true wealth lies in the freedom to breathe, Mirai redefines luxury not through excess, but through expanse of space, of light, and of thought.
              </p>
            </div>

            {/* Section 1 - Openness */}
            <div>
              <h3 className="text-2xl md:text-3xl font-serif text-slate-900 mb-6">
                An Architectural Ode to Openness
              </h3>
              <p className="mb-4">
                Pavani Mirai’s design stems from a simple yet profound idea: that a home should not confine, but liberate.
              </p>
              <p className="mb-4">
                With just 178 residences spread across a single 55-storey tower, each residence at Mirai is conceived as a sanctuary in the sky - private, voluminous, and naturally lit. Spanning an extraordinary 8,000 sq. ft., every home embodies the rarest luxury in today’s urban context: breathing room.
              </p>
              <p>
                From the moment one steps into Mirai’s grand 40 ft. high entrance door, the scale of the experience is unmistakable. The arrival isn’t just physical; it’s an emotional awakening into an elevated world that values space as the ultimate indulgence.
              </p>
            </div>

            {/* Section 2 - Space Details (Light Box) */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
              <h3 className="text-2xl md:text-3xl font-serif text-slate-900 mb-6">
                Space That Breathes, Inside and Out
              </h3>
              <p className="mb-6">
                At Pavani Mirai, space isn’t just measured in square feet, it’s measured in moments.
              </p>
              <p className="mb-6">
                Every residence unfolds like a private universe, seamlessly woven into a design that flows naturally from one experience to another:
              </p>
              
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                 <li className="flex items-center gap-2"><span className="w-2 h-2 bg-amber-500 rounded-full"></span> Foyer Lobby & Formal Lounge</li>
                 <li className="flex items-center gap-2"><span className="w-2 h-2 bg-amber-500 rounded-full"></span> Expansive Living Room</li>
                 <li className="flex items-center gap-2"><span className="w-2 h-2 bg-amber-500 rounded-full"></span> Master Suite Retreat</li>
                 <li className="flex items-center gap-2"><span className="w-2 h-2 bg-amber-500 rounded-full"></span> Private Home Theatre</li>
                 <li className="flex items-center gap-2"><span className="w-2 h-2 bg-amber-500 rounded-full"></span> Family Deck & Balcony</li>
                 <li className="flex items-center gap-2"><span className="w-2 h-2 bg-amber-500 rounded-full"></span> Dedicated Helper’s Room</li>
              </ul>

              <p className="text-slate-600 text-sm leading-relaxed">
                The decks offer a sweeping 270° panoramic view allowing the sky, horizon, and greenery to become part of the interior canvas. Morning light pours into the living areas; evenings dissolve into views that stretch endlessly across the cityscape. This interplay of openness and intimacy gives Mirai’s homes a sense of rhythm and calm that few spacious apartments in Financial District can rival.
              </p>
            </div>

            {/* Section 3 - Greenery (Dark Box) */}
            <div className="bg-slate-900 text-white p-8 md:p-12 rounded-2xl">
              <h3 className="text-2xl md:text-3xl font-serif text-amber-500 mb-6">
                A Vertical Haven Rooted in Green
              </h3>
              <p className="mb-4 text-slate-300">
                While Pavani Mirai rises skyward, it remains deeply grounded in nature. The project is set within <strong>75% open landscaped greens</strong>, forming a tranquil cocoon amidst Hyderabad’s dynamic business district.
              </p>
              <p className="mb-4 text-slate-300">
                Pathways lined with foliage, water features that mirror the sky, and pockets of biophilic design ensure that nature is never out of reach with even more than 50 floors above ground. This thoughtful integration of greenery doesn’t just beautify; it rejuvenates. It fosters well-being, lowers stress, and reinforces the project’s commitment to luxury that sustains life rather than just decorates it.
              </p>
              <p className="text-slate-300 italic">
                This harmony between height and horizon, between structure and soil, is what makes Pavani Mirai one of the most premium gated communities in Hyderabad.
              </p>
            </div>

            {/* Section 4 - Privacy & Flow */}
            <div>
              <h3 className="text-2xl md:text-3xl font-serif text-slate-900 mb-6">
                The New Standard of Private Luxury
              </h3>
              <p className="mb-8">
                Privacy is not an afterthought at Mirai; it is a design principle. With just <strong>one residence per floor</strong>, each home enjoys unmatched exclusivity. Residents have private access to their floors, ensuring peace, discretion, and security at every level. This architecture of privacy allows homeowners to enjoy the spatial freedom of an independent villa while retaining the elevated privileges of a luxury high-rise.
              </p>

              <h3 className="text-2xl md:text-3xl font-serif text-slate-900 mb-6">
                Luxury That Flows Naturally
              </h3>
              <p className="mb-4">
                The magic of Mirai lies in its spatial choreography. The formal lounge welcomes guests with understated grandeur, while the living room opens into decks that blur the boundary between indoors and outdoors. The master suite is a world within itself by offering a place of quiet retreat framed by views that stretch across the city skyline.
              </p>
              <p>
                For leisure and entertainment, the home theatre offers an intimate cinematic escape, while the family deck and balcony provide settings for conversation, coffee, or contemplation. Every corner, every curve, and every corridor has been designed to evoke a sense of openness, not just of space, but of spirit.
              </p>
            </div>

            {/* FAQ Section */}
            <div className="border-t border-b border-slate-200 py-12">
              <h3 className="text-2xl md:text-3xl font-serif text-slate-900 mb-8 text-center">FAQs</h3>
              <div className="space-y-8">
                <div>
                  <h5 className="font-bold text-lg text-slate-800 mb-2">1. What are the key dimensions and features of the residences?</h5>
                  <p className="text-slate-600">Each residence at Pavani Mirai spans approximately 8,000 sq. ft., making it one of the most spacious apartment layouts in Hyderabad. Homes feature a foyer lobby, formal lounge, living room, master suite, home theatre, family deck, balcony, and helper’s room, ensuring every aspect of luxury living is catered to. The 270° panoramic decks provide spectacular views, while the 40 ft. high entrance door sets the tone for an unparalleled sense of arrival.</p>
                </div>
                <div>
                  <h5 className="font-bold text-lg text-slate-800 mb-2">2. How is resident privacy ensured in these luxury homes?</h5>
                  <p className="text-slate-600">Privacy at Mirai is ensured through one residence per floor, offering residents a completely private living environment. Each home enjoys dedicated access and controlled entry, ensuring exclusivity and security. Sound insulation, thoughtful floor planning, and spatial separation of private and social areas further enhance personal comfort and peace, the key hallmarks of premium gated communities in Hyderabad.</p>
                </div>
                <div>
                  <h5 className="font-bold text-lg text-slate-800 mb-2">3. How does Pavani Mirai contrast vertical luxury with green space?</h5>
                  <p className="text-slate-600">Pavani Mirai redefines vertical living by integrating 75% open landscaped space into its master plan. While the tower ascends into the skyline, it remains surrounded by lush greens, reflective water bodies, and biophilic landscapes. This unique balance allows residents to enjoy the benefits of vertical luxury living while remaining deeply connected to nature. This rare equilibrium positions Mirai among the most forward-thinking luxury homes in Hyderabad.</p>
                </div>
              </div>
            </div>

            {/* Conclusion */}
            <div className="text-center pt-8">
              <h3 className="text-2xl md:text-3xl font-serif text-slate-900 mb-6">
                Beyond Square Feet: A Philosophy of Space
              </h3>
              <p className="mb-6 max-w-2xl mx-auto">
                Pavani Mirai is an embodiment of how the future of urban living must evolve. As cities grow denser and faster, luxury can no longer be confined to material opulence; it must be measured by breathing room, natural balance, and emotional peace.
              </p>
              <p className="mb-8 max-w-2xl mx-auto">
                By offering 8,000 sq. ft. homes surrounded by expansive open landscapes, Mirai delivers an antidote to the chaos of modern city life. It invites you to live not just well, but fully, with time, light, and stillness as your most prized luxuries.
              </p>
              
              <div className="inline-block border-y-2 border-amber-500 py-4 px-8 mt-4">
                <p className="text-xl font-light text-slate-800">
                  The future of urban luxury belongs to those who see beyond possessions and seek presence.
                </p>
                <p className="mt-4 font-serif text-2xl text-amber-600 font-bold">
                  Space is not just what surrounds you,<br/>
                  it’s what centres you.
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
              stroke="#d97706"
              strokeWidth="3"
              className="transition-all duration-100"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-amber-600">
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
    </>
  );
}