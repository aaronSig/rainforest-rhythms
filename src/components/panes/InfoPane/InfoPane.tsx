import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Taxon } from "../../../api/types";
import { State } from "../../../app/reducers";
import { audioControlTime } from "../../../app/selectors/audio";
import { infoPaneTaxa } from "../../../app/selectors/info";
import styles from "./InfoPane.module.css";

interface InfoPaneProps {
  time: string;
  taxa: Taxon[];
}

function InfoPaneView(props: InfoPaneProps) {
  return (
    <section className={styles.InfoPane}>
      <div className={styles.Time}>
        <h4>{props.time}</h4>
      </div>

      <h4>Animals known to appear at this time</h4>
      <ul className={styles.Taxa}>
        {props.taxa.map(t => (
          <li key={t.id}>{t.common_name}</li>
        ))}
      </ul>

      <h4>Animals spotted at this site</h4>
      <ul className={styles.Taxa}>
        <li>todo</li>
      </ul>
    </section>
  );
}

const mapStateToProps = (state: State) => {
  return {
    time: audioControlTime(state),
    taxa: infoPaneTaxa(state)
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {};
};

const InfoPane = connect(
  mapStateToProps,
  mapDispatchToProps
)(InfoPaneView);
export default InfoPane;
