import React from "react";
import styles from "./Navigation.module.css";

export function Navigation() {
  return (
    <header role="navigation" className={styles.nav}>
      <h2>Logo</h2>
      <ul>
        <li>
          <a href="#">Find Out More</a>
        </li>
        <li>
          <a href="#">Contact Us</a>
        </li>
      </ul>
    </header>
  );
}
