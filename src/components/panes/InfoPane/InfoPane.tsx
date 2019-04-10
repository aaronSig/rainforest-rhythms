import React from "react";
import { connect } from "react-redux";
import { Site, TaxonWithPresence, TimeSegment } from "../../../api/types";
import { focusTaxonId, setLightboxPhoto } from "../../../state/actions";
import { getFocusedSite, getFocusedTaxonId, getFocusedTimeSegment, getTaxaWithPresence, isLoading } from "../../../state/selectors";
import { State } from "../../../state/types";
import useResizeAware from "../../../utils/useResizeAware";
import styles from "./InfoPane.module.css";
import SingleImageView from "./SingleImageView/SingleImageView";
import TaxonAudioPlayer from "./TaxonAudioPlayer";

export interface InfoPaneProps {
  focusedSite: Site | null;
  focusedTimeSegment: TimeSegment;
  focusedTaxonId: string | null;
  isLoading: boolean;

  taxa: TaxonWithPresence[];

  focusTaxonId: (focusedTaxonId: string) => void;
  zoomImage: (url: string, alt: string) => void;
}

function InfoPaneView(props: InfoPaneProps) {
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
        zoomImage={props.zoomImage}
      />
      <TaxonAudioPlayer />
    </section>
  );
}

const mapStateToProps = (state: State) => {
  return {
    focusedSite: getFocusedSite(state),
    focusedTimeSegment: getFocusedTimeSegment(state),
    taxa: getTaxaWithPresence(state),
    focusedTaxonId: getFocusedTaxonId(state),
    isLoading: isLoading(state)
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    focusTaxonId: (focusedTaxonId: string) => {
      dispatch(focusTaxonId(focusedTaxonId));
    },
    zoomImage: (url: string, alt: string) => {
      dispatch(setLightboxPhoto(url, alt));
    }
  };
};

const InfoPane = connect(
  mapStateToProps,
  mapDispatchToProps
)(InfoPaneView);

export default InfoPane;
