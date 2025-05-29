import React from "react";

function Character({ image }) {
  return (
    <div className="card">
      <img
        src={image}
        alt="photos"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/images/placeholder.jpg";
        }}
      />
    </div>
  );
}

export default Character;
