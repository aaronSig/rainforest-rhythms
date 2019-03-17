import { useEffect } from "react";
import { InfoPaneProps } from "./InfoPane";

/***
 * Load in the data,
 */
export default function useInfoPaneData(props: InfoPaneProps) {
  // Fetch the taxon data when the site and time changes
  useEffect(() => {
    // We've already got the data for this time
    const hasLoaded = props.taxa.some(t => t.seenAtThisTime);

    if (props.focusedSite && !hasLoaded) {
      props.loadTaxaForSite(props.focusedSite.id, props.focusedTimeSegment);
    }
  }, [props.focusedSite, props.focusedTimeSegment, props.taxa, props.loadTaxaForSite]);

  // Fetch the taxon data for the whole site
  useEffect(() => {
    if (props.focusedSite && props.taxa.length === 0) {
      props.loadTaxaForSite(props.focusedSite.id);
    }
  }, [props.focusedSite, props.loadTaxaForSite, props.taxa]);
}
