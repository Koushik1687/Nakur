import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";
import type { Sweet } from "../types";
import { SweetArt } from "../components/SweetArt";

export function SweetDetail() {
  const { id } = useParams<{ id: string }>();
  const [sweet, setSweet] = useState<Sweet | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    api
      .getSweet(id)
      .then(({ sweet }) => setSweet(sweet))
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <div className="container section">
        <p className="muted">That sweet doesn’t exist.</p>
        <Link to="/shop" className="btn btn-ghost">
          Back to shop
        </Link>
      </div>
    );
  }

  if (!sweet) {
    return (
      <div className="container section">
        <p className="muted">Loading…</p>
      </div>
    );
  }

  return (
    <div className="container section detail">
      <Link to="/shop" className="back-link">
        ← Shop
      </Link>
      <div className="detail-grid">
        <div className={`detail-stage${!sweet.inStock ? " oos" : ""}`}>
          {!sweet.inStock && <span className="oos-overlay">Sold Out</span>}
          <SweetArt sweet={sweet} />
        </div>
        <div className="detail-info">
          <p className="sweet-card-cat">{sweet.category}</p>
          <h1>{sweet.name}</h1>
          <p className="lead">{sweet.description}</p>
          <div className="detail-foot">
            <span className="price big">₹{sweet.price}</span>
            <span className="shelf-life">Best before {sweet.bestBeforeHours} hours</span>
            {sweet.inStock ? (
              <span className="badge in">In stock</span>
            ) : (
              <span className="badge out">Out of stock</span>
            )}
          </div>
          <p className="muted small">
            Made fresh every morning at our Kolkata shop. Walk in to pick
            yours up, or call ahead for festive and bulk orders.
          </p>
        </div>
      </div>
    </div>
  );
}
