import React from "react";

function EpisodeCard({ name, image, onError }) {
  return (
    <div className="card">
      <img
        src={image}
        alt={name}
        onError={onError}
      />
      <p className="episode-name">{name}</p>
    </div>
  );
}

export default EpisodeCard;
