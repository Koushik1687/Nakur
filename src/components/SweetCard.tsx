import { Link } from "react-router-dom";
import type { Sweet } from "../types";
import { SweetArt } from "./SweetArt";

export function SweetCard({ sweet }: { sweet: Sweet }) {
  return (
    <Link
      to={`/sweet/${sweet.id}`}
      className={`sweet-card${!sweet.inStock ? " oos" : ""}`}
    >
      <div className="sweet-card-canvas">
        {sweet.featured && <span className="ribbon">Featured</span>}
        {!sweet.inStock && <span className="oos-overlay">Sold Out</span>}
        <SweetArt sweet={sweet} />
      </div>
      <div className="sweet-card-body">
        <div className="sweet-card-top">
          <h3>{sweet.name}</h3>
          {!sweet.inStock && <span className="badge out">Out</span>}
        </div>
        <p className="sweet-card-cat">{sweet.category}</p>
        <p className="sweet-card-desc">{sweet.description}</p>
        <div className="sweet-card-foot">
          <span className="price">₹{sweet.price}</span>
          <span className="view">View →</span>
        </div>
      </div>
    </Link>
  );
}
