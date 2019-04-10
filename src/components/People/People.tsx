import React from "react";
import adi from "./adi_circle.png";
import david from "./david_circle.png";
import henry from "./henry_circle.png";
import jani from "./jani_circle.png";
import lorenzo from "./lorenzo_circle.png";
import nick from "./nick_circle.png";
import styles from "./People.module.css";
import rob from "./rob_circle.png";
import sarab from "./sarab_circle.png";
import syamin from "./syamin_circle.png";

function People() {
  return (
    <div className={styles.People}>
      <a className={styles.NameBlock} href="https://www.imperial.ac.uk/people/s.sethi16">
        <img src={sarab} alt="Sarab" />
        <span className={styles.Name}>Sarab</span>
      </a>
      <a className={styles.NameBlock} href="https://www.imperial.ac.uk/people/r.ewers">
        <img src={rob} alt="Rob" />
        <span className={styles.Name}>Rob</span>
      </a>
      <a className={styles.NameBlock} href="https://www.imperial.ac.uk/people/l.picinali">
        <img src={lorenzo} alt="Lorenzo" />
        <span className={styles.Name}>Lorenzo</span>
      </a>
      <a className={styles.NameBlock} href="https://www.imperial.ac.uk/people/nick.jones">
        <img src={nick} alt="Nick" />
        <span className={styles.Name}>Nick</span>
      </a>
      <a className={styles.NameBlock} href="https://www.imperial.ac.uk/people/d.orme">
        <img src={david} alt="David" />
        <span className={styles.Name}>David</span>
      </a>
      <a className={styles.NameBlock} href="https://www.researchgate.net/profile/Henry_Bernard">
        <img src={henry} alt="Henry" />
        <span className={styles.Name}>Henry</span>
      </a>
      <div className={styles.NameBlock}>
        <img src={jani} alt="Jani" />
        <span className={styles.Name}>Jani</span>
      </div>
      <div className={styles.NameBlock}>
        <img src={syamin} alt="Nursyamin" />
        <span className={styles.Name}>Syamin</span>
      </div>
      <div className={styles.NameBlock}>
        <img src={adi} alt="Adi" />
        <span className={styles.Name}>Adi</span>
      </div>
    </div>
  );
}

export default People;
