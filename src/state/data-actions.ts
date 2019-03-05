import api from "../api/api";
import { Taxon } from "../api/types";
import { byNumberKey } from "../utils/objects";
import { setTaxaById, setTaxaBySite, setTaxaBySiteByTime } from "./actions";
import { TimeSegment } from "./types";

// these are actions / thunks that use the server to load in data

export function loadTaxaForSite(siteId: string, time: TimeSegment | null = null) {
  return async (dispatch: any) => {
    let result: Taxon[];
    if (time !== null) {
      // this works as TimeSegment are round hours
      const decimalTime = parseInt(time);
      result = await api.taxa.get(siteId, decimalTime);
    } else {
      result = await api.taxa.get(siteId);
    }

    // reduce the taxa into a map with the id as it's key
    const taxaById = byNumberKey("id", result);
    dispatch(setTaxaById(taxaById));

    // set the taxaIdBySiteId
    const taxaIds = Object.keys(taxaById);
    dispatch(setTaxaBySite(siteId, taxaIds));

    if (time !== null) {
      dispatch(setTaxaBySiteByTime(siteId, time, taxaIds));
    }
  };
}
