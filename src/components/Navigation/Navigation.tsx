import React from "react";
import logo from "./logo.svg";
import styles from "./Navigation.module.css";
export function Navigation() {
  return (
    <header role="navigation" className={styles.nav}>
      <img src={logo} alt="SAFE logo" />
      <ul>
        <li>
          <a href="/about" target="_blank" rel="noopener noreferrer">
            Find Out More
          </a>
        </li>

        <li>
          <a href="https://www.safeproject.net/" target="_blank" rel="noopener noreferrer">
            The SAFE Project
          </a>
        </li>
      </ul>
    </header>
  );
}
