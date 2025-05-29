import React from "react";

function Location({ name, image }) {
  return (
    <div className="card">
      <img
        src={image}
        alt={name}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/images/placeholder.jpg";
        }}
      />
      <p className="location-name">{name}</p>
    </div>
  );
}

export default Location;
