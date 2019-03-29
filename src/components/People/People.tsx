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
      <a href="https://www.imperial.ac.uk/people/s.sethi16">
        <img src={sarab} alt="Sarab" />
      </a>
      <a href="https://www.imperial.ac.uk/people/r.ewers">
        <img src={rob} alt="Rob" />
      </a>
      <a href="https://www.imperial.ac.uk/people/l.picinali">
        <img src={lorenzo} alt="Lorenzo" />
      </a>
      <a href="https://www.imperial.ac.uk/people/nick.jones">
        <img src={nick} alt="Nick" />
      </a>
      <a href="https://www.imperial.ac.uk/people/d.orme">
        <img src={david} alt="David" />
      </a>
      <a href="https://www.researchgate.net/profile/Henry_Bernard">
        <img src={henry} alt="Henry" />
      </a>
      <img src={jani} alt="Jani" />
      <img src={syamin} alt="Nursyamin" />
      <img src={adi} alt="Adi" />
    </div>
  );
}

export default People;
