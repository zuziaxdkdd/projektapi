import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="header">
      <img
        src="https://1000logos.net/wp-content/uploads/2025/01/Attack-on-Titan-Logo.png"
        alt="Attack on Titan Logo"
        className="logo"
      />
      <nav>
        <ul>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/characters">Characters</Link>
          </li>
          <li>
            <Link to="/locations">Locations</Link>
          </li>
          <li>
            <Link to="/episodes">Episodes</Link>
          </li>
          <li>
            <Link to="/gra">Gra</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Header;
