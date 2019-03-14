import React from "react";
import { connect } from "react-redux";
import { isLoading } from "../../state/selectors";
import { State } from "../../state/types";
import styles from "./LoadingIndicator.module.css";

interface LoadingIndicatorViewProps {
  isloading: boolean;
}

function LoadingIndicatorView(props: LoadingIndicatorViewProps) {
  if (!props.isloading) {
    return null;
  }

  return (
    <div className={styles.spinner}>
      <div className={styles.bounce1} />
      <div className={styles.bounce2} />
      <div />
    </div>
  );
}

const mapStateToProps = (state: State) => {
  return {
    isloading: isLoading(state)
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {};
};

const LoadingIndicator = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoadingIndicatorView);

export default LoadingIndicator;
