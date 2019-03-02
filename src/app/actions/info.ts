import api from "../../api/api";
import { State } from "../reducers";
import { audioControlDecimalHour } from "../selectors/audio";
import { mapPaneFocusedSiteId } from "../selectors/maps";
import { ax } from "./actions";

// The Audio file has been selected and is loading. Fetch the area info now.
export const SET_TAXA = "SET_TAXA";
export function loadTaxaInfo() {
  return async (dispatch: any, getState: () => State) => {
    const state = getState();
    const siteId = mapPaneFocusedSiteId(state);
    const decimalTime = audioControlDecimalHour(state);

    if (!siteId || decimalTime === undefined) {
      return;
    }

    const taxa = await api.taxa.get(siteId, decimalTime);
    dispatch(ax(SET_TAXA, { taxa }));
  };
}
