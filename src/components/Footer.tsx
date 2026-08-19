import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <img src="/Logo/logo.png" alt="Girish Chandra Dey & Nakur Chandra Nandy" className="footer-logo" />
          <p>
            Girish Chandra Dey started manufacturing SANDESH more than a
            hundred years ago. Subsequently the late Shri Nakur Chandra Nandy
            joined him as a partner. Since then the firm became well known as
            Girish Chandra Dey &amp; Nakur Chandra Nandy. The firm specialised
            in KARAPAK SANDESH (hard baked sandesh).
          </p>
        </div>
        <div>
          <h4>Visit</h4>
          <a href="#">নাকুর মিষ্টির দোকান</a>
          <a href="#">Kolkata · Bengal</a>
          <a href="#">Open 7am – 10:30pm</a>
        </div>
        <div>
          <h4>Explore</h4>
          <Link to="/#our-story">Our Story</Link>
          <Link to="/shop">The Shop</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/admin">Admin Login</Link>
        </div>
        <div>
          <h4>Our Promise</h4>
          <p className="footer-li">Pure ghee, fresh chhena, no shortcuts</p>
          <p className="footer-li">Made fresh each morning, never frozen</p>
          <p className="footer-li">Ingredients processed in-house</p>
          <p className="footer-li">Recipes passed down five generations</p>
        </div>
        <div>
          <h4>Contact</h4>
          <a href="tel:+919432494423">+91-9432494423</a>
          <a href="tel:+913322410048">+91-33-22410048</a>
          <a href="mailto:girishnakur@gmail.com">girishnakur@gmail.com</a>
          <a href="mailto:contact@girishnakur.com">contact@girishnakur.com</a>
          <a href="#">Kolkata, Bengal</a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>Mishti since 1844 · 56 Ramdulal Sarkar St, Kolkata</span>
        <span>
          © {new Date().getFullYear()} Girish Chandra Dey &amp; Nakur Chandra
          Nandy
        </span>
      </div>
    </footer>
  );
}
