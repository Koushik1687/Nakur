import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { BrandLogo } from "./BrandLogo";

export function Header() {
  const [storyActive, setStoryActive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    if (!isHome) {
      setStoryActive(false);
      return;
    }

    const el = document.getElementById("our-story");
    if (!el) return;

    // Only mark "Our Story" active when it dominates the viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        // isIntersecting alone is not enough — require the element
        // to fill at least 35 % of the viewport height (≈ deeply scrolled
        // into the Our Story section) before switching the active state.
        setStoryActive(entry.isIntersecting && entry.intersectionRatio > 0.35);
      },
      // rootMargin pulls the root so the element must be well within view
      { threshold: [0, 0.35, 0.5, 1] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isHome]);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close menu when clicking outside the nav panel and toggle button
  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        navRef.current && !navRef.current.contains(e.target as Node) &&
        toggleRef.current && !toggleRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          <BrandLogo
            className="brand-logo-header"
            fallback={
              <>
                <span className="brand-mark">🪷</span>
                <span className="brand-text">
                  <span className="brand-bn">গিরিশ চন্দ্র দে ও নাকুর চন্দ্র নন্দী</span>
                  <span className="brand-en">
                    Girish Chandra Dey &amp; Nakur Chandra Nandy
                  </span>
                </span>
              </>
            }
          />
        </Link>

        <button
          ref={toggleRef}
          className={`menu-toggle${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span className="menu-toggle-bar" />
          <span className="menu-toggle-bar" />
          <span className="menu-toggle-bar" />
        </button>

        {menuOpen && <div className="nav-overlay" onClick={() => setMenuOpen(false)} />}
        <nav ref={navRef} className={`nav${menuOpen ? " nav--open" : ""}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive && !storyActive) ? "active" : undefined}
            onClick={() => {
              if (isHome) {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            Home
          </NavLink>
          <NavLink
            to="/#our-story"
            className={() => {
              // Only show active if the observer says so AND we're on the home page;
              // ignore NavLink's own isActive to avoid a false positive on "/".
              if (!isHome) return undefined;
              return storyActive ? "active" : undefined;
            }}
            onClick={(e) => {
              if (isHome) {
                e.preventDefault();
                document.getElementById("our-story")?.scrollIntoView({ behavior: "smooth" });
                setMenuOpen(false);
              }
            }}
          >
            Our Story
          </NavLink>
          <NavLink to="/shop" onClick={() => setMenuOpen(false)}>Shop</NavLink>
          <NavLink to="/showcase" onClick={() => setMenuOpen(false)}>Showcase</NavLink>
          <NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact</NavLink>
        </nav>
      </div>
    </header>
  );
}
