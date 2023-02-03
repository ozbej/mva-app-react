import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css"

function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/parallel-coordinates-kanva">Kanva PC</Link>
        </li>
        <li>
          <Link to="/parallel-coordinates-canvas2d">Canvas2d PC</Link>
        </li>
        <li>
          <Link to="/parallel-coordinates-babylon">Babylon PC</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;