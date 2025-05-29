import React from "react";

function Home() {
  return (
    <div className="home-page">
      <div className="hero">
        <h1>Attack on Titan: API</h1>
        <p>Postacie, coś tam i tak dalej..</p>
        <a href="/characters" className="cta-button">{'-->'}Zobacz zdjęcia {'<--'}</a>
      </div>
    </div>
  );
}

export default Home;
