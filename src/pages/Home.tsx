import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { Sweet } from "../types";
import { SweetCard } from "../components/SweetCard";
import { BrandLogo } from "../components/BrandLogo";
import { HeroCarousel } from "../components/HeroCarousel";
import { FolkDivider, Lotus } from "../components/Decor";

export function Home() {
  const [allSweets, setAllSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .listSweets()
      .then(({ sweets }) => setAllSweets(sweets))
      .finally(() => setLoading(false));
  }, []);

  const featured = useMemo(
    () => allSweets.filter((s) => s.featured).slice(0, 4),
    [allSweets]
  );

  const marqueeNames = useMemo(
    () => allSweets.filter((s) => s.featured).map((s) => s.name),
    [allSweets]
  );

  // Scroll to #our-story when navigated via hash link
  useEffect(() => {
    if (window.location.hash === "#our-story") {
      const el = document.getElementById("our-story");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <Lotus size={420} color="var(--terracotta)" className="hero-lotus" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <BrandLogo className="brand-logo-hero" />
            <p className="eyebrow">
              <span className="bn">বাঙালি মিষ্টি</span> · Since 1844
            </p>
            <h1>
              স্বাগতম — Welcome to{" "}
              <span>Girish Chandra Dey &amp; Nakur Chandra Nandy</span>
            </h1>
            <p className="lead">
              Five generations of handcrafted Bengali mishti, made fresh
              every morning from recipes passed down since 1844.
            </p>
            <div className="hero-actions">
              <Link to="/shop" className="btn btn-primary">
                Browse the mishti
              </Link>
            </div>
          </div>
          <div className="hero-stage">
            <HeroCarousel />
          </div>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...marqueeNames, ...marqueeNames].map((name, i) => (
            <span key={i}>{name}</span>
          ))}
        </div>
      </div>

      <section className="container section">
        <FolkDivider color="var(--terracotta)" />
        <div className="section-head">
          <h2>From Our Kitchen</h2>
        </div>
        {loading ? (
          <p className="muted">Loading sweets…</p>
        ) : (
          <>
            <div className="sweet-grid">
              {featured.map((s) => (
                <SweetCard key={s.id} sweet={s} />
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 28 }}>
              <Link to="/shop" className="btn btn-ghost">See all sweets →</Link>
            </div>
          </>
        )}
      </section>

      <section id="our-story" className="container section about-section">
        <FolkDivider color="var(--terracotta)" />
        <div className="section-head">
          <h2>Our Story</h2>
        </div>
        <div className="about-illustration">
          <img src="/address.png" alt="Girish Chandra Dey & Nakur Chandra Nandy — traditional Bengali sweet shop" />
        </div>
        <div className="about-grid">
          <div className="about-block">
            <h3>Our Glory</h3>
            <p>
              Since the middle of the 19th century, Nakur's sandesh has occupied a
              proud place on the all-India stage. Nakur's chocolate, parijat, and
              mousumi sandesh shone brightly at the wedding reception of Abhishek
              Bachchan and Aishwarya Rai. West Bengal Chief Minister Mamata
              Banerjee gifted one hundred pieces of kanchagolla and an equal
              number of parijat sandesh to US Foreign Secretary Hillary Clinton.
              A momentous occasion was the 34 kg sandesh that served as the
              centrepiece to felicitate the Kolkata Knight Riders in the presence
              of the Governor and the Chief Minister. Prime Minister Narendra Modi
              is known to have a sweet tooth for our sandesh. Nakur's brand has
              been patronised by great personalities of India, including Satyajit
              Ray, matinee idol Uttam Kumar, and former Prime Minister Rajiv
              Gandhi. Satyajit Ray's daughter-in-law was a regular customer.
              Rajiv Gandhi had a fondness for golapi pera. We feel proud to have
              delivered sandesh on the occasion of Lakshmi Puja to Uttam Kumar's
              residence at Moyra Street.
            </p>
          </div>
          <div className="about-block">
            <h3>Historical Background</h3>
            <p>
              Nakur Chandra Nandy hailed from Janai in Hooghly district and came
              to Calcutta as son-in-law to renowned confectioner Simla, Girish
              Chandra Dey. A joint venture started by the father-in-law and the
              son-in-law has grown from strength to strength over the decades.
            </p>
          </div>
          <div className="about-block about-block--full">
            <h3>Our Unravelled Journey Continues</h3>
            <p>
              Located at 56, Ramdulal Sarkar Street and surrounded by heritage
              sites that include Bethune College, Hedua, and the birthplace of
              Swami Vivekananda, ours is a permanent address for the sweets
              aficionado. The building that houses the outlet enjoys Heritage
              status. We don't buy any product as an ingredient for our sandesh.
              We buy them raw and the processing is done by our in-house system.
              None of our products remain unsold at the end of a day and make way
              for fresh products. Sandesh of naram-pak remains intact for one to
              three days, while those of kara-pak enjoy a span of a week. The
              five-generation business is certainly not for its own sake. Our
              highest priority is our customers, local and beyond. We push our
              quest for perfection to the limits and beyond and render our best
              efforts to upgrade our standards with every passing day. As many as
              sixty items of sandesh are available; nevertheless, our core
              competence lies in talsash, jalbhara, parijat, dikhush, monohara,
              blackforest, and other varieties.
            </p>
          </div>
        </div>
      </section>

      <section className="container section social-section">
        <FolkDivider color="var(--terracotta)" />
        <div className="section-head">
          <h2>Social Links</h2>
          <p className="muted">Follow us for daily specials &amp; behind-the-scenes</p>
        </div>
        <div className="social-grid">
          {/* Facebook */}
          <a href="https://www.facebook.com/girishnakur/" target="_blank" rel="noopener noreferrer" className="social-card">
            <div className="social-card-icon social-card-icon--fb">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </div>
            <div className="social-card-body">
              <h3>Facebook</h3>
              <p className="social-card-handle">@girishnakur</p>
              <div className="social-card-stat">
                <span className="social-card-stat-num">45K+</span>
                <span className="social-card-stat-label">followers</span>
              </div>
              <p className="social-card-detail">Latest: Jagannath Swami Nayana Patha Gami Bhavatu Me 🙏</p>
            </div>
            <span className="social-card-cta">Follow Page →</span>
          </a>

          {/* Instagram */}
          <a href="https://www.instagram.com/girishnakur/" target="_blank" rel="noopener noreferrer" className="social-card">
            <div className="social-card-icon social-card-icon--ig">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </div>
            <div className="social-card-body">
              <h3>Instagram</h3>
              <p className="social-card-handle">@girishnakur</p>
              <p className="social-card-detail">Behind-the-scenes from our kitchen, daily specials, and the art of mishti-making</p>
            </div>
            <span className="social-card-cta">Follow →</span>
          </a>

          {/* X / Twitter */}
          <a href="https://x.com/GirishNakur" target="_blank" rel="noopener noreferrer" className="social-card">
            <div className="social-card-icon social-card-icon--x">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </div>
            <div className="social-card-body">
              <h3>X (Twitter)</h3>
              <p className="social-card-handle">@GirishNakur</p>
              <div className="social-card-stat">
                <span className="social-card-stat-num">12K+</span>
                <span className="social-card-stat-label">followers</span>
              </div>
              <p className="social-card-detail">Sharing the art of traditional Bengali mishti daily</p>
            </div>
            <span className="social-card-cta">Follow →</span>
          </a>

          {/* Tripadvisor */}
          <a href="https://www.tripadvisor.in/Restaurant_Review-g304558-d2385461-Reviews-Girish_Chandra_Dey_Nakur_Chandra_Nandy-Kolkata_Calcutta_Kolkata_District_West_Ben.html" target="_blank" rel="noopener noreferrer" className="social-card">
            <div className="social-card-icon social-card-icon--ta">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12.004 2c2.265 0 4.335.75 5.925 2.025a7.88 7.88 0 0 1 2.1 2.7c.375.75.63 1.575.795 2.4a8.07 8.07 0 0 1-.42 3.6 7.86 7.86 0 0 1-2.25 3.3 8.04 8.04 0 0 1-3.45 1.8 8.21 8.21 0 0 1-2.7.45c-2.265 0-4.335-.75-5.925-2.025A7.88 7.88 0 0 1 5.379 14.4a8.07 8.07 0 0 1-.795-2.4 8.07 8.07 0 0 1 .42-3.6 7.86 7.86 0 0 1 2.25-3.3A8.04 8.04 0 0 1 10.749 3.25c.42-.075.855-.125 1.29-.125z"/><circle cx="6.5" cy="14.5" r="1.5"/><circle cx="17.5" cy="14.5" r="1.5"/></svg>
            </div>
            <div className="social-card-body">
              <h3>Tripadvisor</h3>
              <div className="social-card-rating">
                <span className="social-card-stars">★★★★½</span>
                <span className="social-card-stat-num">4.5</span>
              </div>
              <div className="social-card-stat">
                <span className="social-card-stat-num">764</span>
                <span className="social-card-stat-label">reviews</span>
              </div>
              <p className="social-card-detail">#29 of 5,134 places to eat in Kolkata</p>
            </div>
            <span className="social-card-cta">Read Reviews →</span>
          </a>

        </div>
      </section>

    </div>
  );
}
