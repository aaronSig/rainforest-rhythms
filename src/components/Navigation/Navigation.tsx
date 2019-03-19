import React from "react";
import logo from "./logo.svg";
import styles from "./Navigation.module.css";

export function Navigation() {
  return (
    <header role="navigation" className={styles.nav}>
      <img src={logo} alt="SAFE logo" />
      <ul>
        <li>
          <a href="#findoutmore">Find Out More</a>
        </li>
        <li>
          <a href="#contact">Contact Us</a>
        </li>
      </ul>
    </header>
  );
}
