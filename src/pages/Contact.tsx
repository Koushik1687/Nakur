import { useState } from "react";
import { FolkDivider } from "../components/Decor";

export function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    // Simulate sending (replace with actual API call)
    await new Promise((r) => setTimeout(r, 1200));
    setBusy(false);
    setSubmitted(true);
  }

  return (
    <div className="contact-page">
      {/* Hero */}
      <section className="contact-hero">
        <div className="container contact-hero-inner">
          <span className="contact-hero-eyebrow">
            <span className="bn">যোগাযোগ</span> · Get in Touch
          </span>
          <h1>Let's Talk <span>Mishti</span></h1>
          <p className="contact-hero-sub">
            Whether you're planning a festive celebration, craving your
            favourite sandesh, or simply want to visit — we're always happy
            to hear from you.
          </p>
        </div>
      </section>

      {/* Info Cards */}
      <section className="container contact-info-section">
        <div className="contact-info-grid">
          <div className="contact-info-card">
            <div className="contact-info-icon" style={{ background: "rgba(177,67,36,0.1)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--terracotta)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <h3>Visit Our Shop</h3>
            <p>56, Ramdulal Sarkar Street</p>
            <p>Kolkata, West Bengal 700006</p>
            <a
              href="https://maps.google.com/?q=56+Ramdulal+Sarkar+Street+Kolkata"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-info-link"
            >
              Get Directions →
            </a>
          </div>

          <div className="contact-info-card">
            <div className="contact-info-icon" style={{ background: "rgba(78,122,63,0.12)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--ok)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <h3>Opening Hours</h3>
            <div className="contact-hours">
              <div className="contact-hours-status">
                <span className="contact-hours-dot" />
                Open Now
              </div>
              <div className="contact-hours-divider" />
              <div className="contact-hours-row">
                <span>Mon – Sun</span>
                <span className="contact-hours-time">7 am – 10:30 pm</span>
              </div>
              <p className="contact-info-note">Open all days including holidays</p>
            </div>
          </div>

          <div className="contact-info-card">
            <div className="contact-info-icon" style={{ background: "rgba(47,62,99,0.1)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--indigo)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <h3>Call Us</h3>
            <a href="tel:+919432494423" className="contact-phone">+91-9432494423</a>
            <a href="tel:+913322410048" className="contact-phone">+91-33-22410048</a>
            <p className="contact-info-note">
              For bulk &amp; festive orders, call ahead to ensure availability.
            </p>
          </div>

          <div className="contact-info-card">
            <div className="contact-info-icon" style={{ background: "rgba(201,138,43,0.12)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--ochre)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <h3>Email Us</h3>
            <a href="mailto:girishnakur@gmail.com" className="contact-email">
              girishnakur@gmail.com
            </a>
            <a href="mailto:contact@girishnakur.com" className="contact-email">
              contact@girishnakur.com
            </a>
            <p className="contact-info-note">
              We typically respond within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="container contact-main-section">
        <div className="contact-main-grid">
          {/* Contact Form */}
          <div className="contact-form-card">
            <h2>Send Us a Message</h2>

            {submitted ? (
              <div className="contact-success">
                <div className="contact-success-icon">✓</div>
                <h3>Message Sent!</h3>
                <p>
                  Thank you for reaching out. We'll get back to you within 24
                  hours.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setSubmitted(false);
                    setForm({
                      name: "",
                      email: "",
                      phone: "",
                      subject: "General Inquiry",
                      message: "",
                    });
                  }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-form-row">
                  <label className="contact-field">
                    <span>Your Name <span className="required">*</span></span>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      required
                    />
                  </label>
                  <label className="contact-field">
                    <span>Email Address <span className="required">*</span></span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="priya@example.com"
                      required
                    />
                  </label>
                </div>

                <div className="contact-form-row">
                  <label className="contact-field">
                    <span>Phone Number</span>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="+91 98765 43210"
                    />
                  </label>
                  <label className="contact-field">
                    <span>Subject</span>
                    <select
                      value={form.subject}
                      onChange={(e) => update("subject", e.target.value)}
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Festive Order">Festive / Bulk Order</option>
                      <option value="Catering">Catering Request</option>
                      <option value="Feedback">Feedback</option>
                      <option value="Wholesale">Wholesale Inquiry</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>
                </div>

                <label className="contact-field">
                  <span>Your Message <span className="required">*</span></span>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    placeholder="Tell us how we can help you…"
                    required
                  />
                </label>

                <button
                  className="btn btn-primary contact-submit"
                  type="submit"
                  disabled={busy}
                >
                  {busy ? (
                    <>
                      <span className="contact-spinner" />
                      Sending…
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Map */}
          <div className="contact-map-card">
            <div className="contact-map-header">
              <h3>Find Us</h3>
              <a
                href="https://maps.google.com/?q=56+Ramdulal+Sarkar+Street+Kolkata"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-map-link"
              >
                Open in Google Maps →
              </a>
            </div>
            <div className="contact-map-wrap">
              <iframe
                title="Girish Chandra Dey & Nakur Chandra Nandy Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.1!2d88.3639!3d22.5804!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0277c7a23e4b7d%3A0x1234567890abcdef!2s56%20Ramdulal%20Sarkar%20St%2C%20Kolkata%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Landmarks */}
            <div className="contact-landmarks">
              <h4>Nearby Landmarks</h4>
              <ul className="contact-landmark-list">
                <li>
                  <span className="contact-landmark-dot" />
                  Bethune College — 2 min walk
                </li>
                <li>
                  <span className="contact-landmark-dot" />
                  Swami Vivekananda's Birthplace — 3 min walk
                </li>
                <li>
                  <span className="contact-landmark-dot" />
                  Hedua Park — 5 min walk
                </li>
                <li>
                  <span className="contact-landmark-dot" />
                  Shobhabazar Sutanuti Metro — 8 min walk
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container contact-faq-section">
        <FolkDivider color="var(--terracotta)" />
        <div className="section-head">
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className="contact-faq-grid">
          <details className="contact-faq-item">
            <summary>Do you offer delivery?</summary>
            <p>
              Yes. We deliver across Kolkata. Orders within 5 km of our shop
              are delivered free of charge. For farther distances a nominal fee
              applies — just give us a call and we'll sort it out.
            </p>
          </details>
          <details className="contact-faq-item">
            <summary>Can I place bulk orders for weddings or festivals?</summary>
            <p>
              Of course — wedding and puja orders are a big part of what we do.
              We recommend ordering 3–5 days in advance so everything is fresh
              on the day. We also offer customised packaging for gifting.
            </p>
          </details>
          <details className="contact-faq-item">
            <summary>Do you ship sweets outside Kolkata?</summary>
            <p>
              At the moment we deliver within Kolkata and its nearby areas.
              For special out-of-city requests, reach out to us — we'll try
              our best to find a way.
            </p>
          </details>
          <details className="contact-faq-item">
            <summary>Are your sweets suitable for people with dietary restrictions?</summary>
            <p>
              Our sweets are made with fresh chhena, pure ghee, sugar, and
              natural flavourings — nothing artificial. We also have a sugar-free
              range. If you have a specific allergy or dietary concern, let us
              know and we'll guide you.
            </p>
          </details>
          <details className="contact-faq-item">
            <summary>How fresh are the sweets?</summary>
            <p>
              Everything is made fresh each morning. Nothing stays on the shelf
              overnight. We buy our ingredients raw and process them in-house,
              which is how we've kept our quality consistent for over 180 years.
            </p>
          </details>
          <details className="contact-faq-item">
            <summary>What payment methods do you accept?</summary>
            <p>
              We accept cash, UPI (Google Pay, PhonePe, Paytm), and all major
              debit and credit cards. For large orders we can also arrange a
              bank transfer.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
