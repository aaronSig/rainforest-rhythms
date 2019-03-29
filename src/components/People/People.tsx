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
      <img src={sarab} alt="Sarab" />
      <img src={rob} alt="Rob" />
      <img src={lorenzo} alt="Lorenzo" />
      <img src={nick} alt="Nick" />
      <img src={david} alt="David" />
      <img src={henry} alt="Henry" />
      <img src={jani} alt="Jani" />
      <img src={syamin} alt="Nursyamin" />
      <img src={adi} alt="Adi" />
    </div>
  );
}

export default People;
