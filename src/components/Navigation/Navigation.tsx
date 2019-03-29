import { Link } from "@reach/router";
import React from "react";
import logo from "./logo.svg";
import styles from "./Navigation.module.css";
export function Navigation() {
  return (
    <header role="navigation" className={styles.nav}>
      <img src={logo} alt="SAFE logo" />
      <ul>
        <li>
          <Link to="/about">Find Out More</Link>
        </li>
      </ul>
    </header>
  );
}
