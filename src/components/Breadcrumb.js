import React from "react";
import { Link } from "react-router-dom";
import "../styles/breadcrumb.css";

function Breadcrumb({ items }) {
    // items = [{ label: "Produits", to: "/produits" }, { label: "Détails" }, ...]
    return (
        <nav className="breadcrumb">
            {items.map((item, idx) => (
                <span key={idx}>
                    {item.to ? (
                        <Link to={item.to}>{item.label}</Link>
                    ) : (
                        <span className="breadcrumb-current">{item.label}</span>
                    )}
                    {idx < items.length - 1 && <span>&nbsp;&gt;&nbsp;</span>}
                </span>
            ))}
        </nav>
    );
}

export default Breadcrumb;