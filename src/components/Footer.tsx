import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <h3 className="footer-bn">গিরিশ চন্দ্র দে ও নাকুর চন্দ্র নন্দী</h3>
          <p className="footer-en">
            Girish Chandra Dey &amp; Nakur Chandra Nandy
          </p>
          <p>
            Handmade Bengali sweets since 1844 — sandesh, rosogolla, laddu and
            more, prepared fresh every day.
          </p>
        </div>
        <div>
          <h4>Visit</h4>
          <a href="#">নাকুর মিষ্টির দোকান</a>
          <a href="#">Kolkata · Bengal</a>
          <a href="#">Open 9am – 9pm</a>
        </div>
        <div>
          <h4>Explore</h4>
          <Link to="/#our-story">Our Story</Link>
          <Link to="/shop">The Shop</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/admin">Admin Login</Link>
        </div>
        <div>
          <h4>Quality Assurance</h4>
          <p className="footer-li">Handmade with pure ghee</p>
          <p className="footer-li">Prepared fresh every day</p>
          <p className="footer-li">Hygienic kitchen practices</p>
          <p className="footer-li">Authentic recipes since 1844</p>
        </div>
        <div>
          <h4>Contact</h4>
          <a href="tel:+919000000000">+91 90000 00000</a>
          <a href="mailto:hello@girishnakur.com">hello@girishnakur.com</a>
          <a href="#">Kolkata, Bengal</a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>Sweets since 1844 · Kolkata, Bengal</span>
        <span>
          © {new Date().getFullYear()} Girish Chandra Dey &amp; Nakur Chandra
          Nandy
        </span>
      </div>
    </footer>
  );
}
