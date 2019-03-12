import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { State } from "../../../state/types";
import styles from "./InfoPane.module.css";

interface InfoPaneProps {}

function InfoPaneView(props: InfoPaneProps) {
  return (
    <section className={styles.InfoPane}>
      <div className={styles.Time} />

      <h4>Animals known to appear at this time</h4>
      <ul className={styles.Taxa} />

      <h4>Animals spotted at this site</h4>
      <ul className={styles.Taxa}>
        <li>todo</li>
      </ul>
    </section>
  );
}

const mapStateToProps = (state: State) => {
  return {};
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {};
};

const InfoPane = connect(
  mapStateToProps,
  mapDispatchToProps
)(InfoPaneView);
export default InfoPane;
