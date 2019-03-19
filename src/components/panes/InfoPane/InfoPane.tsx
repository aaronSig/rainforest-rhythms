import React from "react";
import { connect } from "react-redux";
import { Site } from "../../../api/types";
import { focusTaxonId } from "../../../state/actions";
import { loadTaxaForSite } from "../../../state/data-actions";
import {
  getFocusedSite,
  getFocusedTaxonId,
  getFocusedTimeSegment,
  getTaxaWithMedia,
  isLoading
} from "../../../state/selectors";
import { State, TaxonWithMedia, TimeSegment } from "../../../state/types";
import useResizeAware from "../../../utils/useResizeAware";
import useInfoPaneData from "./infoHooks";
import styles from "./InfoPane.module.css";
import SingleImageView from "./SingleImageView/SingleImageView";
import TaxonAudioPlayer from "./TaxonAudioPlayer";

export interface InfoPaneProps {
  focusedSite: Site | null;
  focusedTimeSegment: TimeSegment;
  focusedTaxonId: string | null;
  isLoading: boolean;

  taxa: TaxonWithMedia[];

  focusTaxonId: (focusedTaxonId: string) => void;
  loadTaxaForSite: (siteId: string, time?: TimeSegment | null) => void;
}

function InfoPaneView(props: InfoPaneProps) {
  useInfoPaneData(props);
  const [resizeListener, sizes] = useResizeAware();
  const height = sizes.height || 0;
  return (
    <section className={styles.InfoPaneContainer}>
      {resizeListener}
      <SingleImageView
        isLoading={props.isLoading}
        height={height}
        taxa={props.taxa}
        focusedTaxonId={props.focusedTaxonId}
        focusTaxonId={props.focusTaxonId}
      />
      <TaxonAudioPlayer />
    </section>
  );
}

const mapStateToProps = (state: State) => {
  return {
    focusedSite: getFocusedSite(state),
    focusedTimeSegment: getFocusedTimeSegment(state),
    taxa: getTaxaWithMedia(state),
    focusedTaxonId: getFocusedTaxonId(state),
    isLoading: isLoading(state)
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    loadTaxaForSite: (siteId: string, time: TimeSegment | null = null) => {
      dispatch(loadTaxaForSite(siteId, time));
    },
    focusTaxonId: (focusedTaxonId: string) => {
      dispatch(focusTaxonId(focusedTaxonId));
    }
  };
};

const InfoPane = connect(
  mapStateToProps,
  mapDispatchToProps
)(InfoPaneView);

export default InfoPane;
