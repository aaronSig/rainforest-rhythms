import epsrc from "images/epsrc.jpg";
import imperial from "images/imperial.jpg";
import nerc from "images/nerc.jpg";
import safe from "images/safe.jpg";
import searrp from "images/searrp.jpg";
import wwf from "images/wwf.png";
import React from "react";
import styles from "./Affiliations.module.css";

function Affiliations() {
  return (
    <div className={styles.Affiliations}>
      <a href="https://nerc.ukri.org/">
        <img src={nerc} alt="NERC Logo" height={100} />
      </a>
      <a href="https://epsrc.ukri.org/">
        <img src={epsrc} alt="EPSRC Logo" height={100} />
      </a>
      <a href="http://www.searrp.org/">
        <img src={searrp} alt="searrp Logo" height={100} />
      </a>
      <a href="https://www.safeproject.net/">
        <img src={safe} alt="SAFE Logo" height={100} />
      </a>
      <a href="https://www.wwf.org.uk/">
        <img src={wwf} alt="WWF Logo" height={100} />
      </a>
      <a href="https://www.imperial.ac.uk/">
        <img src={imperial} alt="Imperial College London Logo" height={100} />
      </a>
    </div>
  );
}

export default Affiliations;
