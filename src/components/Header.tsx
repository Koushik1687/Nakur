import { useEffect, useState } from "react";
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

    const observer = new IntersectionObserver(
      ([entry]) => setStoryActive(entry.isIntersecting),
      { rootMargin: "-40% 0px -40% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isHome]);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
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
          className={`menu-toggle${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span className="menu-toggle-bar" />
          <span className="menu-toggle-bar" />
          <span className="menu-toggle-bar" />
        </button>

        <nav className={`nav${menuOpen ? " nav--open" : ""}`}>
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink
            to="/#our-story"
            className={storyActive ? "active" : undefined}
          >
            Our Story
          </NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/showcase">Showcase</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
      </div>
    </header>
  );
}
