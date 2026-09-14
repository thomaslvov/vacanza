"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const mobileMenuToggleRef = useRef<HTMLInputElement | null>(null);
  const tripDestinationRef = useRef<HTMLInputElement | null>(null);
  const destinationsRef = useRef<HTMLElement | null>(null);
  const aboutRef = useRef<HTMLElement | null>(null);
  const aboutMobileRef = useRef<HTMLElement | null>(null);
  const whyRef = useRef<HTMLElement | null>(null);
  const testimonialsRef = useRef<HTMLElement | null>(null);
  const contactRef = useRef<HTMLElement | null>(null);
  const [aboutFade, setAboutFade] = useState({ opacity: 1, y: 0 });
  const [destinationsFade, setDestinationsFade] = useState({ opacity: 1, y: 0 });
  const [whyFade, setWhyFade] = useState({ opacity: 1, y: 0 });
  const [testimonialsFade, setTestimonialsFade] = useState({ opacity: 1, y: 0 });
  const [contactFade, setContactFade] = useState({ opacity: 1, y: 0 });
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrollY(y);

      const viewport = window.innerHeight;

      const getFade = (element: HTMLElement | null, mobile = false) => {
        if (!element) return { opacity: 1, y: 0 };

        const rect = element.getBoundingClientRect();
        const edgeRange = viewport * (mobile ? 0.30 : 0.24);
        const minOpacity = mobile ? 0.14 : 0.46;
        const travel = mobile ? 12 : 8;

        const ease = (value: number) => {
          const t = Math.min(Math.max(value, 0), 1);
          return t * t * (3 - 2 * t);
        };

        // Mobile: use the section edges rather than its center so the effect
        // remains visible even for tall, full-screen sections.
        if (rect.top > 0) {
          const progress = ease(1 - rect.top / edgeRange);
          return {
            opacity: minOpacity + progress * (1 - minOpacity),
            y: (1 - progress) * travel,
          };
        }

        if (rect.bottom < viewport) {
          const progress = ease(1 - rect.bottom / edgeRange);
          return {
            opacity: 1 - progress * (1 - minOpacity),
            y: -progress * travel,
          };
        }

        return { opacity: 1, y: 0 };
      };

      // On mobile the desktop ABOUT section still exists in the DOM (it is
      // hidden with md:block), so never use it for the mobile fade calculation.
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      const aboutElement = isMobile
        ? aboutMobileRef.current
        : aboutRef.current;

      setAboutFade(getFade(aboutElement, isMobile));
      setDestinationsFade(getFade(destinationsRef.current, isMobile));
      setWhyFade(getFade(whyRef.current, isMobile));
      setTestimonialsFade(getFade(testimonialsRef.current, isMobile));
      setContactFade(getFade(contactRef.current, isMobile));
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    const closeMenuOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      const toggle = mobileMenuToggleRef.current;
      if (toggle?.checked) {
        toggle.checked = false;
        toggle.dispatchEvent(new Event("change", { bubbles: true }));
      }
    };

    window.addEventListener("keydown", closeMenuOnEscape);
    return () => window.removeEventListener("keydown", closeMenuOnEscape);
  }, []);

  const openTripPlannerWithDestination = (destination: string) => {
    if (tripDestinationRef.current) {
      tripDestinationRef.current.value = destination;
    }
    window.location.hash = "trip-planner";
  };

  const heroProgress = Math.min(
    Math.max(scrollY / 650, 0),
    1
  );

  const heroImageScale =
    1 + heroProgress * 0.035;

  const heroImageY =
    scrollY * 0.018;

  const heroContentOpacity =
    1 - Math.min(heroProgress * 1.25, 1);

  const heroContentY =
    scrollY * -0.045;

  const aboutProgress = Math.min(
    Math.max((scrollY - 500) / 1000, 0),
    1
  );

  const aboutImageScale =
    1.01 + aboutProgress * 0.025;

  const aboutImageY =
    aboutProgress * -12;

  return (
    <>
      <style>{`
        .trip-planner { display: none; }
        .trip-planner:target { display: flex; }

        .mobile-menu-toggle {
          position: fixed;
          inline-size: 1px;
          block-size: 1px;
          opacity: 0;
          pointer-events: none;
        }

        .mobile-menu-overlay {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition:
            opacity 280ms cubic-bezier(0.22, 1, 0.36, 1),
            visibility 0s linear 280ms;
        }

        .mobile-menu-panel {
          opacity: 0;
          transform: translate3d(0, -10px, 0);
          transition:
            opacity 180ms ease,
            transform 240ms ease;
        }

        .mobile-menu-toggle:checked ~ .mobile-menu-overlay {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transition:
            opacity 300ms cubic-bezier(0.22, 1, 0.36, 1),
            visibility 0s;
        }

        .mobile-menu-toggle:checked ~ .mobile-menu-overlay .mobile-menu-panel {
          opacity: 1;
          transform: translate3d(0, 0, 0);
          transition:
            opacity 320ms ease 45ms,
            transform 380ms cubic-bezier(0.22, 1, 0.36, 1) 45ms;
        }

        html:has(.mobile-menu-toggle:checked),
        body:has(.mobile-menu-toggle:checked) {
          overflow: hidden;
        }
      `}</style>
      <main className="min-h-screen bg-[#f1ebe2]">

      <input
        ref={mobileMenuToggleRef}
        id="mobile-menu-toggle"
        type="checkbox"
        className="mobile-menu-toggle"
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section id="hero" className="relative min-h-[115svh] overflow-hidden bg-[#2a2825] md:min-h-[125vh]">

        <div
          className="absolute inset-0 will-change-transform"
          style={{
            backgroundImage:
              "url('/hero2.png')",
            backgroundSize: "cover",
            backgroundPosition:
              "center center",
            transform: `
              translate3d(0, ${heroImageY}px, 0)
              scale(${heroImageScale})
            `,
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "rgba(0,0,0,0.20)",
          }}
        />

        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-[30vh]"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(238,231,220,0.03) 40%, rgba(238,231,220,0.18) 72%, #f1ebe2 100%)",
            opacity:
              Math.min(heroProgress * 1.15, 1),
          }}
        />

        {/* HEADER */}

        <header
          className="absolute left-0 right-0 top-0 z-30"
          style={{
            opacity:
              Math.max(
                1 - heroProgress * 1.5,
                0.2
              ),
          }}
        >

          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10 md:py-7">

            <a
              href="#"
              className="text-[25px] tracking-[0.18em] text-white transition-opacity duration-300 hover:opacity-70 md:text-2xl"
              style={{
                fontFamily:
                  "var(--font-cormorant)",
              }}
            >
              VACANZA
            </a>

            <div className="hidden items-center gap-10 md:flex">

              <nav className="flex items-center gap-8 text-sm text-white/90">

                <a
                  href="#destinations"
                  className="transition-opacity duration-300 hover:opacity-60"
                >
                  יעדים
                </a>

                <a
                  href="#why-vacanza"
                  className="transition-opacity duration-300 hover:opacity-60"
                >
                  למה Vacanza
                </a>

                <a
                  href="#about"
                  className="transition-opacity duration-300 hover:opacity-60"
                >
                  אודות
                </a>

                <a
                  href="#contact"
                  className="transition-opacity duration-300 hover:opacity-60"
                >
                  צור קשר
                </a>

              </nav>

              <a
                href="#trip-planner"
                className="border border-white/50 px-5 py-3 text-[11px] tracking-[0.08em] text-white/90 transition-all duration-300 hover:bg-white hover:text-black"
              >
                תכננו לי חופשה
              </a>

            </div>

            <label
              htmlFor="mobile-menu-toggle"
              className="flex cursor-pointer flex-col items-end md:hidden"
              aria-label="פתיחת תפריט"
              aria-controls="mobile-menu"
            >
              <span className="block h-px w-7 bg-white" />
              <span className="mt-2 block h-px w-5 bg-white" />
            </label>

          </div>

        </header>


        {/* HERO CONTENT */}

        <div
          className="sticky top-0 z-20 flex min-h-screen items-center"
          style={{
            opacity:
              heroContentOpacity,
            transform: `
              translate3d(0, ${heroContentY}px, 0)
            `,
          }}
        >

          <div className="mx-auto w-full max-w-7xl px-6 md:px-10">

            <div className="max-w-4xl text-white">

              <h1
                className="text-[58px] font-medium leading-[0.88] tracking-[-0.045em] sm:text-7xl md:text-8xl lg:text-9xl"
                style={{
                  fontFamily:
                    "var(--font-cormorant)",
                }}
              >
                YOUR NEXT
                <br />
                ESCAPE
              </h1>


              {/* HERO CTA */}

              <div className="mt-8 md:mt-10">

                <a
                  href="#trip-planner"
                  className="group inline-flex items-center gap-4 border border-white/60 px-5 py-3.5 text-[11px] tracking-[0.12em] text-white transition-all duration-500 hover:bg-white hover:text-black md:px-6 md:py-4 md:text-xs"
                >

                  <span>
                    תכננו לי חופשה
                  </span>

                  <span className="text-base transition-transform duration-500 group-hover:translate-x-1">
                    →
                  </span>

                </a>

              </div>



            </div>

          </div>

        </div>


        {/* HERO COUNTER */}

        <div
          className="absolute bottom-7 left-6 z-20 flex items-center gap-3 text-[10px] text-white md:bottom-8 md:left-10 md:gap-4 md:text-xs"
          style={{
            opacity:
              heroContentOpacity,
          }}
        >

          <span>01</span>

          <span className="text-white/40">
            /
          </span>

          <span className="text-white/40">
            02
          </span>

          <div className="ml-1 h-px w-10 bg-white/40 md:ml-2 md:w-16" />

        </div>


        {/* HERO SCROLL */}

        <div
          className="absolute bottom-7 right-6 z-20 md:bottom-8 md:right-10"
          style={{
            opacity:
              heroContentOpacity,
          }}
        >

          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-sm text-white md:h-10 md:w-10">
            ↓
          </div>

        </div>

      </section>

      {/* MOBILE MENU — native checkbox trigger for maximum reliability */}
      <div
        id="mobile-menu"
        className="mobile-menu-overlay fixed inset-0 z-[9999] min-h-[100dvh] md:hidden"
      >
        <label
          htmlFor="mobile-menu-toggle"
          aria-label="סגירת התפריט"
          className="absolute inset-0 block h-full w-full cursor-pointer"
          style={{
            background:
              "linear-gradient(145deg, rgba(24,23,21,0.50) 0%, rgba(24,23,21,0.40) 50%, rgba(24,23,21,0.54) 100%)",
            backdropFilter: "blur(24px) saturate(88%)",
            WebkitBackdropFilter: "blur(24px) saturate(88%)",
          }}
        />

        <div className="mobile-menu-panel pointer-events-none relative z-10 flex min-h-[100dvh] flex-col px-6 py-7">
          <div className="flex items-center justify-between">
            <a
              href="#hero"
              onClick={() => {
                if (mobileMenuToggleRef.current) mobileMenuToggleRef.current.checked = false;
              }}
              className="pointer-events-auto text-[25px] tracking-[0.18em] text-white"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              VACANZA
            </a>

            <label
              htmlFor="mobile-menu-toggle"
              aria-label="סגירת תפריט"
              className="pointer-events-auto flex h-10 w-10 cursor-pointer items-center justify-center text-4xl font-light leading-none text-white transition-opacity duration-300 hover:opacity-65"
            >
              ×
            </label>
          </div>

          <nav
            dir="rtl"
            className="mt-20 flex flex-col items-end gap-7 text-right text-white"
          >
            {[
              ["#destinations", "יעדים"],
              ["#why-vacanza", "למה Vacanza"],
              ["#about", "אודות"],
              ["#contact", "צור קשר"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                onClick={() => {
                  if (mobileMenuToggleRef.current) mobileMenuToggleRef.current.checked = false;
                }}
                className="pointer-events-auto text-2xl transition-opacity duration-300 hover:opacity-65"
              >
                {label}
              </a>
            ))}
          </nav>

          <div dir="rtl" className="mt-auto pb-4">
            <a
              href="#trip-planner"
              onClick={() => {
                if (mobileMenuToggleRef.current) mobileMenuToggleRef.current.checked = false;
              }}
              className="pointer-events-auto flex w-full items-center justify-center border border-white/50 bg-white/[0.03] px-5 py-4 text-[12px] tracking-[0.08em] text-white transition-all duration-300 hover:bg-white hover:text-black"
            >
              תכננו לי חופשה →
            </a>
          </div>
        </div>
      </div>


      {/* =====================================================
          ABOUT — DESKTOP
      ===================================================== */}

      <section
        id="about"
        ref={aboutRef}
        className="relative hidden min-h-screen overflow-hidden bg-[#2a2825] md:block"
        style={{
          opacity: aboutFade.opacity,
          transform: `translate3d(0, ${aboutFade.y}px, 0)`,
          transition: "opacity 180ms ease-out, transform 180ms ease-out",
          willChange: "opacity, transform",
        }}
      >

        <img
          src="/about.jpg"
          alt="חופשה על המים בשעת שקיעה"
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            objectPosition:
              "center center",

            transform: `
              translate3d(0, ${aboutImageY}px, 0)
              scale(${aboutImageScale})
            `,

            willChange:
              "transform",
          }}
        />

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.08) 55%, rgba(0,0,0,0.40) 100%)",
          }}
        />

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to left, rgba(0,0,0,0.34) 0%, rgba(0,0,0,0.12) 30%, transparent 58%)",
          }}
        />

        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-[38%]"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.46) 0%, rgba(0,0,0,0.12) 55%, transparent 100%)",
          }}
        />

        <div
          dir="rtl"
          className="absolute right-[7%] top-[20%] z-20 w-[360px] text-right text-white"
        >

          <p className="mb-5 text-[11px] tracking-[0.18em] text-white/60">
            קצת עלינו
          </p>

          <h2
            className="text-[54px] font-medium leading-[1.02] tracking-[-0.035em] lg:text-[62px]"
            style={{
              fontFamily:
                "var(--font-cormorant)",
            }}
          >
            החופשה שלכם,
            <br />
            בדיוק כמו שאתם רוצים.
          </h2>

          <p className="mt-6 max-w-[340px] text-[15px] leading-7 text-white/72">
            אנחנו בונים לכם את החופשה שמתאימה בדיוק לכם —
            מהיעד והמלון ועד לפרטים הקטנים שעושים את ההבדל.
          </p>

          <div className="mt-7 flex items-center justify-end gap-4 text-[11px] text-white/50">

            <span>
              מתכננים את החופשה שלכם יחד
            </span>

            <span className="h-px w-10 bg-white/30" />

          </div>

        </div>

      </section>


      {/* =====================================================
          ABOUT — MOBILE
      ===================================================== */}

      <section
        id="about-mobile"
        ref={aboutMobileRef}
        className="relative min-h-[100svh] overflow-hidden bg-[#2a2825] md:hidden"
        style={{
          opacity: aboutFade.opacity,
          transform: `translate3d(0, ${aboutFade.y}px, 0)`,
          transition: "opacity 180ms ease-out, transform 180ms ease-out",
          willChange: "opacity, transform",
        }}
      >

        <div className="relative min-h-[100svh] w-full overflow-hidden">

          <img
            src="/about.jpg"
            alt="חופשה על המים בשעת שקיעה"
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              objectPosition:
                "center center",

              transform: `
                translate3d(0, ${aboutImageY}px, 0)
                scale(${aboutImageScale})
              `,

              willChange:
                "transform",
            }}
          />

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.38) 32%, transparent 68%)",
            }}
          />

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(0,0,0,0.18) 0%, transparent 48%)",
            }}
          />

          <div
            dir="rtl"
            className="absolute bottom-0 left-0 z-20 w-[62%] px-5 pb-8 text-right text-white"
          >

            <p className="mb-3 text-[9px] tracking-[0.16em] text-white/60">
              קצת עלינו
            </p>

            <h2
              className="text-[31px] font-medium leading-[1.02] tracking-[-0.03em]"
              style={{
                fontFamily:
                  "var(--font-cormorant)",
              }}
            >
              החופשה שלכם,
              <br />
              בדיוק כמו שאתם רוצים.
            </h2>

            <p className="mt-4 text-[12px] leading-5 text-white/72">
              אנחנו בונים לכם את החופשה שמתאימה בדיוק לכם —
              מהיעד והמלון ועד לפרטים הקטנים שעושים את ההבדל.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          DESTINATIONS
      ===================================================== */}

      <section
        id="destinations"
        ref={destinationsRef}
        className="relative overflow-hidden px-6 py-12 md:px-10 md:py-16"
        style={{
          opacity: destinationsFade.opacity,
          transform: `translate3d(0, ${destinationsFade.y}px, 0)`,
          transition: "opacity 180ms ease-out, transform 180ms ease-out",
          willChange: "opacity, transform",
          background:
            "radial-gradient(circle at 18% 12%, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0) 36%), linear-gradient(135deg, #f1ebe2 0%, #ddd2c2 100%)",
        }}
      >

        <div
          className="mx-auto max-w-7xl"
        >

          {/* DESTINATIONS INTRO */}

          <div
            dir="rtl"
            className="grid items-start gap-8 md:grid-cols-[0.7fr_1.3fr] md:gap-16"
          >

            <div className="order-1 text-right">

              <h2
                className="text-[58px] font-medium leading-[0.88] tracking-[-0.045em] text-[#2a2825] sm:text-7xl md:text-8xl lg:text-[92px]"
                style={{
                  fontFamily:
                    "var(--font-cormorant)",
                }}
              >
                מקומות
                <br />
                שעושים חשק
                <br />
                לנסוע.
              </h2>

              <div className="mt-5 flex items-center justify-end gap-4">

                <p className="max-w-[290px] text-[13px] leading-6 text-black/50">
                  כמה מהיעדים שאנחנו הכי אוהבים.
                </p>

                <span className="h-px w-10 bg-black/20" />

              </div>

              <div className="mt-10 hidden items-center justify-end gap-4 text-[10px] tracking-[0.18em] text-black/35 md:flex">

                <span>01</span>

                <span>/</span>

                <span>05</span>

                <span className="ml-2 h-px w-12 bg-black/20" />

              </div>

            </div>


            {/* DESKTOP GALLERY */}

            <div className="order-2 hidden min-w-0 md:order-2 md:block">

              <div className="grid grid-cols-12 gap-3">


                {/* PHUKET */}

                <button
                  type="button"
                  onClick={() => openTripPlannerWithDestination("Phuket")}
                  className="group relative col-span-7 h-[560px] overflow-hidden bg-[#cfc2b1] text-left"
                  aria-label="תכנון חופשה בפוקט"
                >

                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[1600ms] ease-out group-hover:scale-[1.045]"
                    style={{
                      backgroundImage:
                        "url('/phuket.jpg')",
                    }}
                  />

                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.12) 48%, transparent 72%)",
                    }}
                  />

                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">

                    <div className="mb-4 flex items-center gap-3 text-[9px] tracking-[0.22em] text-white/65">
                      <span>01</span>
                      <span className="h-px w-8 bg-white/40" />
                      <span>תאילנד</span>
                    </div>

                    <h3
                      className="text-6xl tracking-[-0.035em]"
                      style={{
                        fontFamily:
                          "var(--font-cormorant)",
                      }}
                    >
                      Phuket
                    </h3>

                    <div className="mt-5 flex items-center gap-3 text-[10px] tracking-[0.14em] text-white/75">
                      <span>לגלות את היעד</span>
                      <span className="text-base">→</span>
                    </div>

                  </div>

                </button>


                {/* DUBAI */}

                <button
                  type="button"
                  onClick={() => openTripPlannerWithDestination("Dubai")}
                  className="group relative col-span-5 h-[560px] overflow-hidden bg-[#8b847a] text-left"
                  aria-label="תכנון חופשה בדובאי"
                >

                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[1600ms] ease-out group-hover:scale-[1.045]"
                    style={{
                      backgroundImage:
                        "url('/dubai.jpg')",
                    }}
                  />

                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.12) 50%, transparent 76%)",
                    }}
                  />

                  <div className="absolute bottom-0 left-0 right-0 p-7 text-white">

                    <div className="mb-4 flex items-center gap-3 text-[9px] tracking-[0.22em] text-white/65">
                      <span>02</span>
                      <span className="h-px w-7 bg-white/40" />
                      <span>איחוד האמירויות</span>
                    </div>

                    <h3
                      className="text-5xl tracking-[-0.035em]"
                      style={{
                        fontFamily:
                          "var(--font-cormorant)",
                      }}
                    >
                      Dubai
                    </h3>

                    <div className="mt-5 text-base text-white/75">
                      →
                    </div>

                  </div>

                </button>


                {/* MYKONOS */}

                <button
                  type="button"
                  onClick={() => openTripPlannerWithDestination("Mykonos")}
                  className="group relative col-span-5 h-[430px] overflow-hidden bg-[#c7c0b6] text-left"
                  aria-label="תכנון חופשה במיקונוס"
                >

                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[1600ms] ease-out group-hover:scale-[1.045]"
                    style={{
                      backgroundImage:
                        "url('/mykonos.jpg')",
                    }}
                  />

                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.64) 0%, rgba(0,0,0,0.10) 55%, transparent 80%)",
                    }}
                  />

                  <div className="absolute bottom-0 left-0 right-0 p-7 text-white">

                    <div className="mb-4 flex items-center gap-3 text-[9px] tracking-[0.22em] text-white/65">
                      <span>03</span>
                      <span className="h-px w-7 bg-white/40" />
                      <span>יוון</span>
                    </div>

                    <h3
                      className="text-5xl tracking-[-0.035em]"
                      style={{
                        fontFamily:
                          "var(--font-cormorant)",
                      }}
                    >
                      Mykonos
                    </h3>

                  </div>

                </button>


                {/* ROME */}

                <button
                  type="button"
                  onClick={() => openTripPlannerWithDestination("Rome")}
                  className="group relative col-span-7 h-[430px] overflow-hidden bg-[#bcae9d] text-left"
                  aria-label="תכנון חופשה ברומא"
                >

                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[1600ms] ease-out group-hover:scale-[1.045]"
                    style={{
                      backgroundImage:
                        "url('/rome.jpg')",
                    }}
                  />

                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.66) 0%, rgba(0,0,0,0.10) 55%, transparent 80%)",
                    }}
                  />

                  <div className="absolute bottom-0 left-0 right-0 p-7 text-white">

                    <div className="mb-4 flex items-center gap-3 text-[9px] tracking-[0.22em] text-white/65">
                      <span>04</span>
                      <span className="h-px w-7 bg-white/40" />
                      <span>איטליה</span>
                    </div>

                    <h3
                      className="text-5xl tracking-[-0.035em]"
                      style={{
                        fontFamily:
                          "var(--font-cormorant)",
                      }}
                    >
                      Rome
                    </h3>

                    <div className="mt-5 flex items-center gap-3 text-[10px] tracking-[0.14em] text-white/75">
                      <span>לגלות את היעד</span>
                      <span className="text-base">→</span>
                    </div>

                  </div>

                </button>


                {/* PRAGUE */}

                <button
                  type="button"
                  onClick={() => openTripPlannerWithDestination("Prague")}
                  className="group relative col-span-12 h-[390px] overflow-hidden bg-[#817b73] text-left"
                  aria-label="תכנון חופשה בפראג"
                >

                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[1600ms] ease-out group-hover:scale-[1.04]"
                    style={{
                      backgroundImage:
                        "url('/prague.jpg')",
                    }}
                  />

                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.16) 55%, transparent 82%)",
                    }}
                  />

                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">

                    <div className="mb-4 flex items-center gap-3 text-[9px] tracking-[0.22em] text-white/65">
                      <span>05</span>
                      <span className="h-px w-8 bg-white/40" />
                      <span>צ׳כיה</span>
                    </div>

                    <div className="flex items-end justify-between gap-8">

                      <div>

                        <h3
                          className="text-6xl tracking-[-0.035em]"
                          style={{
                            fontFamily:
                              "var(--font-cormorant)",
                          }}
                        >
                          Prague
                        </h3>

                      </div>

                      <span className="text-xl text-white/75">
                        →
                      </span>

                    </div>

                  </div>

                </button>

              </div>

            </div>


            {/* MOBILE GALLERY */}

            <div className="order-1 space-y-4 md:hidden">


              {/* PHUKET */}

              <button
                type="button"
                onClick={() => openTripPlannerWithDestination("Phuket")}
                className="group relative block aspect-[0.86/1] overflow-hidden bg-[#cfc2b1] w-full text-left"
                aria-label="תכנון חופשה בפוקט"
              >

                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('/phuket.jpg')",
                  }}
                />

                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.12) 50%, transparent 78%)",
                  }}
                />

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">

                  <p className="mb-3 text-[8px] tracking-[0.2em] text-white/60">
                    01 · תאילנד
                  </p>

                  <h3
                    className="text-5xl tracking-[-0.025em]"
                    style={{
                      fontFamily:
                        "var(--font-cormorant)",
                    }}
                  >
                    Phuket
                  </h3>

                  <div className="mt-4 text-[10px] tracking-[0.12em] text-white/70">
                    לגלות את היעד&nbsp;&nbsp; →
                  </div>

                </div>

              </button>


              {/* DUBAI + MYKONOS */}

              <div className="grid grid-cols-2 gap-4">

                <button
                  type="button"
                  onClick={() => openTripPlannerWithDestination("Dubai")}
                  className="group relative block aspect-[0.78/1] overflow-hidden bg-[#8b847a] w-full text-left"
                  aria-label="תכנון חופשה בדובאי"
                >

                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('/dubai.jpg')",
                    }}
                  />

                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.08) 60%, transparent 82%)",
                    }}
                  />

                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">

                    <p className="mb-2 text-[8px] tracking-[0.16em] text-white/60">
                      02 · איחוד האמירויות
                    </p>

                    <h3
                      className="text-3xl tracking-[-0.025em]"
                      style={{
                        fontFamily:
                          "var(--font-cormorant)",
                      }}
                    >
                      Dubai
                    </h3>

                  </div>

                </button>


                <button
                  type="button"
                  onClick={() => openTripPlannerWithDestination("Mykonos")}
                  className="group relative block aspect-[0.78/1] overflow-hidden bg-[#c7c0b6] w-full text-left"
                  aria-label="תכנון חופשה במיקונוס"
                >

                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('/mykonos.jpg')",
                    }}
                  />

                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.08) 60%, transparent 82%)",
                    }}
                  />

                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">

                    <p className="mb-2 text-[8px] tracking-[0.16em] text-white/60">
                      03 · יוון
                    </p>

                    <h3
                      className="text-3xl tracking-[-0.025em]"
                      style={{
                        fontFamily:
                          "var(--font-cormorant)",
                      }}
                    >
                      Mykonos
                    </h3>

                  </div>

                </button>

              </div>


              {/* ROME */}

              <button
                type="button"
                onClick={() => openTripPlannerWithDestination("Rome")}
                className="group relative block aspect-[1.35/1] overflow-hidden bg-[#bcae9d] w-full text-left"
                aria-label="תכנון חופשה ברומא"
              >

                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('/rome.jpg')",
                  }}
                />

                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.08) 55%, transparent 80%)",
                  }}
                />

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">

                  <p className="mb-3 text-[8px] tracking-[0.18em] text-white/60">
                    04 · איטליה
                  </p>

                  <h3
                    className="text-5xl tracking-[-0.025em]"
                    style={{
                      fontFamily:
                        "var(--font-cormorant)",
                    }}
                  >
                    Rome
                  </h3>

                </div>

              </button>


              {/* PRAGUE */}

              <button
                type="button"
                onClick={() => openTripPlannerWithDestination("Prague")}
                className="group relative block aspect-[1.35/1] overflow-hidden bg-[#817b73] w-full text-left"
                aria-label="תכנון חופשה בפראג"
              >

                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('/prague.jpg')",
                  }}
                />

                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.74) 0%, rgba(0,0,0,0.12) 55%, transparent 82%)",
                  }}
                />

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">

                  <p className="mb-3 text-[8px] tracking-[0.18em] text-white/60">
                    05 · צ׳כיה
                  </p>

                  <h3
                    className="text-5xl tracking-[-0.025em]"
                    style={{
                      fontFamily:
                        "var(--font-cormorant)",
                    }}
                  >
                    Prague
                  </h3>

                </div>

              </button>

            </div>

          </div>


          {/* DESTINATIONS CTA */}

          <div
            dir="rtl"
            className="mt-20 border-t border-black/10 pt-12 text-right md:mt-28 md:flex md:items-end md:justify-between"
          >

            <div>

              <h3
                className="text-[40px] font-medium leading-[0.95] tracking-[-0.035em] text-[#2a2825] md:text-[52px]"
                style={{
                  fontFamily:
                    "var(--font-cormorant)",
                }}
              >
                מחפשים יעד אחר?
              </h3>

              <p className="mt-5 max-w-[420px] text-[13px] leading-6 text-black/50">
                ספרו לנו לאן מתחשק לכם להגיע,
                <br />
                ואנחנו נבנה את החופשה בשבילכם.
              </p>

            </div>

            <a
              href="#trip-planner"
              className="group mt-8 inline-flex items-center gap-4 text-[11px] tracking-[0.1em] text-black md:mt-0"
            >

              <span className="border-b border-black/30 pb-2 transition-colors duration-300 group-hover:border-black">
                תכננו לי חופשה
              </span>

              <span className="text-base transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>

            </a>

          </div>

        </div>

      </section>


      {/* =====================================================
          WHY VACANZA
      ===================================================== */}

      <section
        id="why-vacanza"
        ref={whyRef}
        className="relative overflow-hidden bg-[#2a2825] px-6 py-24 text-white md:px-10 md:py-32"
        style={{
          opacity: whyFade.opacity,
          transform: `translate3d(0, ${whyFade.y}px, 0)`,
          transition: "opacity 180ms ease-out, transform 180ms ease-out",
          willChange: "opacity, transform",
        }}
      >

        <div className="mx-auto max-w-7xl">

          <div dir="rtl" className="grid gap-16 md:grid-cols-[0.78fr_1.22fr] md:gap-24">

            <div className="text-right">
              <p className="mb-5 text-[10px] tracking-[0.18em] text-white/40">
                למה Vacanza
              </p>

              <h2
                className="text-[52px] font-medium leading-[0.92] tracking-[-0.04em] md:text-[78px]"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                כי חופשה טובה
                <br />
                מתחילה בראש שקט.
              </h2>
            </div>

            <div dir="rtl" className="text-right">

              <div className="border-t border-white/15 py-7 md:py-8">
                <div className="flex items-start justify-between gap-8">
                  <span className="text-[11px] tracking-[0.16em] text-white/35">01</span>
                  <div className="max-w-xl">
                    <h3 className="text-[19px] font-medium text-white/95">התאמה אישית</h3>
                    <p className="mt-3 text-[13px] leading-6 text-white/55">
                      החופשה נבנית סביבכם — מהטיסה והמלון ועד הפרטים הקטנים.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/15 py-7 md:py-8">
                <div className="flex items-start justify-between gap-8">
                  <span className="text-[11px] tracking-[0.16em] text-white/35">02</span>
                  <div className="max-w-xl">
                    <h3 className="text-[19px] font-medium text-white/95">שקט נפשי גם כשהמצב משתנה</h3>
                    <p className="mt-3 text-[13px] leading-6 text-white/55">
                      גם בתקופות מלחמה או מצב ביטחוני, אנחנו יודעים למצוא פתרונות ביטול וזיכוי מול הספקים, כדי שתוכלו להזמין חופשה בראש שקט.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/15 py-7 md:py-8">
                <div className="flex items-start justify-between gap-8">
                  <span className="text-[11px] tracking-[0.16em] text-white/35">03</span>
                  <div className="max-w-xl">
                    <h3 className="text-[19px] font-medium text-white/95">הכל במקום אחד</h3>
                    <p className="mt-3 text-[13px] leading-6 text-white/55">
                      טיסות, מלונות, רכב, משחקים והופעות — הכל במקום אחד.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/15 py-7 md:py-8">
                <div className="flex items-start justify-between gap-8">
                  <span className="text-[11px] tracking-[0.16em] text-white/35">04</span>
                  <div className="max-w-xl">
                    <h3 className="text-[19px] font-medium text-white/95">ליווי אישי</h3>
                    <p className="mt-3 text-[13px] leading-6 text-white/55">
                      ליווי אישי לפני ההזמנה, במהלכה וגם כשמשהו משתנה בדרך.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          TESTIMONIALS
      ===================================================== */}

      <section
        id="testimonials"
        ref={testimonialsRef}
        className="relative overflow-hidden bg-[#f1ebe2] px-6 py-24 md:px-10 md:py-32"
        style={{
          opacity: testimonialsFade.opacity,
          transform: `translate3d(0, ${testimonialsFade.y}px, 0)`,
          transition: "opacity 180ms ease-out, transform 180ms ease-out",
          willChange: "opacity, transform",
        }}
      >

        <div className="mx-auto max-w-7xl">

          <div dir="rtl" className="mb-14 text-right md:mb-18">
            <p className="mb-5 text-[10px] tracking-[0.18em] text-black/35">
              המלצות
            </p>
            <h2
              className="text-[52px] font-medium leading-[0.92] tracking-[-0.04em] text-[#2a2825] md:text-[76px]"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              המלצות מהלקוחות
            </h2>
            <p className="mt-5 max-w-[420px] text-[13px] leading-6 text-black/50">
              שירות אישי וניסיון שנבנו לאורך השנים.
            </p>
          </div>

          <div dir="rtl" className="grid gap-px overflow-hidden border border-black/10 bg-black/10 md:grid-cols-2">

            <article className="bg-[#f1ebe2] p-7 md:p-9">
              <div className="text-[14px] tracking-[0.16em] text-black/65">★★★★★</div>
              <p className="mt-7 text-[17px] leading-8 text-black/75">
                המלצה על הסוכן תומס שנתן שירות מקצועי וליווי אישי. תודה
              </p>
              <p className="mt-7 text-[11px] text-black/45">
                m ilanlt · Google
              </p>
            </article>

            <article className="bg-[#f1ebe2] p-7 md:p-9">
              <div className="text-[14px] tracking-[0.16em] text-black/65">★★★★★</div>
              <p className="mt-7 text-[17px] leading-8 text-black/75">
                תומס מדהים! הרכיב לנו חוויה מושלמת!
              </p>
              <p className="mt-7 text-[11px] text-black/45">
                Liron Avivi · Google
              </p>
            </article>

            <article className="bg-[#f1ebe2] p-7 md:p-9">
              <div className="text-[14px] tracking-[0.16em] text-black/65">★★★★★</div>
              <p className="mt-7 text-[17px] leading-8 text-black/75">
                תומס סוכן מספר אחד! עוזר, מייעץ וממליץ על סמך ניסיון. זמין תמיד ואפשר לסמוך עליו שיעזור בכל דבר. מומלץ מאוד!
              </p>
              <p className="mt-7 text-[11px] text-black/45">
                Lital Dalal · Google
              </p>
            </article>

            <article className="bg-[#f1ebe2] p-7 md:p-9">
              <div className="text-[14px] tracking-[0.16em] text-black/65">★★★★★</div>
              <p className="mt-7 text-[17px] leading-8 text-black/75">
                תודה לתומס שדאג לנו מהפרט הקטן עד הגדול בקפדנות. בזכותך הייתה לנו חופשה מדהימה. תודה על הסבלנות והמקצועיות.
              </p>
              <p className="mt-7 text-[11px] text-black/45">
                Shlomit Haim · Google
              </p>
            </article>

          </div>

          <p dir="rtl" className="mt-5 text-right text-[10px] text-black/35">
            ההמלצות נכתבו על תומס במהלך עבודתו בתחום התיירות.
          </p>

        </div>

      </section>


      {/* =====================================================
          CONTACT / FINAL CTA
      ===================================================== */}

      <section
        id="contact"
        ref={contactRef}
        className="relative min-h-[70vh] overflow-hidden bg-[#2a2825] px-6 py-24 text-white md:px-10 md:py-32"
        style={{
          opacity: contactFade.opacity,
          transform: `translate3d(0, ${contactFade.y}px, 0)`,
          transition: "opacity 180ms ease-out, transform 180ms ease-out",
          willChange: "opacity, transform",
        }}
      >

        <div className="mx-auto flex min-h-[55vh] max-w-7xl flex-col justify-between">

          <div dir="rtl" className="max-w-3xl text-right">
            <p className="mb-5 text-[10px] tracking-[0.18em] text-white/40">
              צור קשר
            </p>
            <h2
              className="text-[58px] font-medium leading-[0.9] tracking-[-0.045em] md:text-[92px]"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              החופשה הבאה
              <br />
              שלכם מתחילה כאן.
            </h2>
            <p className="mt-7 max-w-[430px] text-[14px] leading-7 text-white/55">
              ספרו לנו לאן אתם רוצים להגיע. אנחנו נדאג לשאר.
            </p>
          </div>

          <div dir="rtl" className="mt-16 flex flex-col items-start justify-between gap-8 border-t border-white/15 pt-8 text-right md:flex-row md:items-end">
            <a
              href="#trip-planner"
              className="group inline-flex items-center gap-4 border border-white/50 px-6 py-4 text-[11px] tracking-[0.1em] text-white transition-all duration-300 hover:bg-white hover:text-black"
            >
              <span>תכננו לי חופשה</span>
              <span className="text-base transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>

            <div dir="ltr" className="flex items-start gap-6 sm:gap-8">
              <a
                href="https://wa.me/972546363398"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="group flex min-w-[58px] flex-col items-center gap-2 text-white/55 transition-colors duration-300 hover:text-white"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-all duration-300 group-hover:border-white/55 group-hover:bg-white/[0.06]">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[19px] w-[19px] fill-current">
                    <path d="M12.04 2a9.82 9.82 0 0 0-8.43 14.86L2 22l5.3-1.56A9.86 9.86 0 1 0 12.04 2Zm0 17.93a8.04 8.04 0 0 1-4.1-1.12l-.3-.18-3.14.92.94-3.06-.2-.31A8.06 8.06 0 1 1 12.04 19.93Zm4.42-6.03c-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.95-1.2-.72-.64-1.21-1.44-1.35-1.68-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.47-.39-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.39 1.37.5.58.18 1.1.16 1.51.1.46-.07 1.43-.59 1.63-1.15.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
                  </svg>
                </span>
                <span className="text-[10px] tracking-[0.08em]">WhatsApp</span>
              </a>

              <a
                href="https://instagram.com/tom_lvov"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="group flex min-w-[58px] flex-col items-center gap-2 text-white/55 transition-colors duration-300 hover:text-white"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-all duration-300 group-hover:border-white/55 group-hover:bg-white/[0.06]">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[19px] w-[19px] fill-none stroke-current" strokeWidth="1.6">
                    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.7" r="1" className="fill-current stroke-none" />
                  </svg>
                </span>
                <span className="text-[10px] tracking-[0.08em]">Instagram</span>
              </a>

              <a
                href="tel:+972546363398"
                aria-label="Phone"
                className="group flex min-w-[58px] flex-col items-center gap-2 text-white/55 transition-colors duration-300 hover:text-white"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-all duration-300 group-hover:border-white/55 group-hover:bg-white/[0.06]">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[19px] w-[19px] fill-none stroke-current" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6.6 3.8 9 3.2a1.3 1.3 0 0 1 1.5.75l1.15 2.7a1.3 1.3 0 0 1-.32 1.47L9.8 9.56a14.7 14.7 0 0 0 4.64 4.64l1.44-1.53a1.3 1.3 0 0 1 1.47-.32l2.7 1.15a1.3 1.3 0 0 1 .75 1.5l-.6 2.4a2.6 2.6 0 0 1-2.55 2A13.05 13.05 0 0 1 4.6 6.35 2.6 2.6 0 0 1 6.6 3.8Z" />
                  </svg>
                </span>
                <span className="text-[10px] tracking-[0.08em]">Phone</span>
              </a>
            </div>
          </div>

        </div>

      </section>


      {/* =====================================================
          TRIP PLANNER — WHATSAPP LEAD FORM
      ===================================================== */}

      <section
        id="trip-planner"
        className="trip-planner fixed inset-0 z-[9999] h-[100dvh] w-full items-center justify-center bg-black/80 p-0 backdrop-blur-[5px]"
        aria-label="תכנון חופשה"
      >
        <div
          dir="rtl"
          className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-[#f1ebe2] sm:h-auto sm:max-h-[92dvh] sm:max-w-[620px] sm:border sm:border-black/10"
        >
          <div className="flex shrink-0 items-center justify-between border-b border-black/10 px-5 py-5 sm:px-8 sm:py-6">
            <div>
              <p className="mb-1 text-[9px] tracking-[0.22em] text-black/40">
                VACANZA
              </p>
              <h2
                className="text-[32px] font-medium leading-none tracking-[-0.035em] text-[#2a2825] sm:text-[40px]"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                תכננו לי חופשה
              </h2>
            </div>

            <a
              href="#hero"
              aria-label="סגירת הטופס"
              className="flex h-11 w-11 shrink-0 items-center justify-center border border-black/15 text-2xl leading-none text-black/70"
            >
              ×
            </a>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-7 sm:px-8 sm:py-8">
            <form action="/api/whatsapp" method="get" className="flex min-h-full flex-col">
              <p className="mb-8 text-[13px] leading-6 text-black/55">
                כמה פרטים קטנים ונחזור אליכם עם הצעה שמתאימה לכם.
              </p>

              <div className="space-y-6">
                <div>
                  <label htmlFor="trip-name" className="mb-2 block text-[11px] text-black/70">
                    שם פרטי
                  </label>
                  <input
                    id="trip-name"
                    name="name"
                    type="text"
                    required
                    placeholder="איך קוראים לכם?"
                    autoComplete="name"
                    className="h-14 w-full rounded-none border-0 border-b border-black/20 bg-transparent px-0 text-[16px] text-[#2a2825] outline-none placeholder:text-black/30 focus:border-black"
                  />
                </div>

                <div>
                  <label htmlFor="trip-destination" className="mb-2 block text-[11px] text-black/70">
                    יעד שמעניין אותי
                  </label>
                  <input
                    ref={tripDestinationRef}
                    id="trip-destination"
                    name="destination"
                    type="text"
                    required
                    placeholder="לאן תרצו לטוס?"
                    autoComplete="off"
                    className="h-14 w-full rounded-none border-0 border-b border-black/20 bg-transparent px-0 text-[16px] text-[#2a2825] outline-none placeholder:text-black/30 focus:border-black"
                  />
                </div>

                <div>
                  <label htmlFor="trip-date" className="mb-2 block text-[11px] text-black/70">
                    תאריך / תקופה
                  </label>
                  <input
                    id="trip-date"
                    name="date"
                    type="text"
                    required
                    placeholder="לדוגמה: 10–15 באוקטובר"
                    autoComplete="off"
                    className="h-14 w-full rounded-none border-0 border-b border-black/20 bg-transparent px-0 text-[16px] text-[#2a2825] outline-none placeholder:text-black/30 focus:border-black"
                  />
                </div>

                <div>
                  <label htmlFor="trip-travelers" className="mb-2 block text-[11px] text-black/70">
                    מספר נוסעים
                  </label>
                  <input
                    id="trip-travelers"
                    name="travelers"
                    type="number"
                    min="1"
                    required
                    placeholder="כמה נוסעים?"
                    inputMode="numeric"
                    className="h-14 w-full rounded-none border-0 border-b border-black/20 bg-transparent px-0 text-[16px] text-[#2a2825] outline-none placeholder:text-black/30 focus:border-black"
                  />
                </div>

                <div>
                  <label htmlFor="trip-phone" className="mb-2 block text-[11px] text-black/70">
                    טלפון
                  </label>
                  <input
                    id="trip-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    placeholder="05X-XXXXXXX"
                    className="h-14 w-full rounded-none border-0 border-b border-black/20 bg-transparent px-0 text-[16px] text-[#2a2825] outline-none placeholder:text-black/30 focus:border-black"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-10 w-full bg-[#2a2825] px-6 py-4 text-[12px] tracking-[0.08em] text-white transition-opacity hover:opacity-80"
              >
                שלחו לי הצעה →
              </button>
            </form>
          </div>
        </div>
      </section>

      </main>
    </>
  );
}