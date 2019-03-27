import { useEffect } from "react";
import { InfoPaneProps } from "./InfoPane";

/***
 * Load in the data,
 */
export default function useInfoPaneData(props: InfoPaneProps) {
  const { focusedSite, focusedTimeSegment, taxa, loadTaxaForSite } = props;
  // Fetch the taxon data when the site and time changes
  useEffect(() => {
    // We've already got the data for this time
    const hasLoaded = taxa.some(t => t.seenAtThisTime);
    if (focusedSite && !hasLoaded) {
      loadTaxaForSite(focusedSite.id, focusedTimeSegment);
    }
  }, [focusedSite, focusedTimeSegment, taxa, loadTaxaForSite]);
  // Fetch the taxon data for the whole site
  useEffect(() => {
    if (focusedSite && taxa.length === 0) {
      loadTaxaForSite(focusedSite.id);
    }
  }, [focusedSite, loadTaxaForSite, taxa]);
}
