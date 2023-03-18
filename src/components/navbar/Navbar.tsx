import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"

function Navbar() {
  return (
    <nav>
      <ul>
        <li key="1">
          <Link to="/">Home</Link>
        </li>
        <li key="2">
          <Link to="/parallel-coordinates-kanva">Kanva PC</Link>
        </li>
        <li key="3">
          <Link to="/parallel-coordinates-babylon">Babylon PC</Link>
        </li>
        <li key="4">
          <Link to="/parallel-coordinates-pixijs">PixiJS PC</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;