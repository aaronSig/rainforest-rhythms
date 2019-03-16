import { useEffect } from "react";
import { InfoPaneProps } from "./InfoPane";

/***
 * Load in the data,
 */
export default function useInfoPaneData(props: InfoPaneProps) {
  // Fetch the taxon data when the site and time changes
  useEffect(() => {
    if (props.focusedSite) {
      props.loadTaxaForSite(props.focusedSite.id, props.focusedTimeSegment);
    }
  }, [props.focusedSite, props.focusedTimeSegment, props.loadTaxaForSite]);

  // Fetch the taxon data for the whole site
  useEffect(() => {
    if (props.focusedSite) {
      props.loadTaxaForSite(props.focusedSite.id);
    }
  }, [props.focusedSite, props.loadTaxaForSite]);
}
