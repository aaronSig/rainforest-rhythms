import { Map } from "immutable";
import api from "../api/api";
import { Site, Taxon } from "../api/types";
import { byNumberKey } from "../utils/objects";
import { setPreloadedData, setTaxaById, setTaxaBySite, setTaxaBySiteByTime } from "./actions";
import { TimeSegment } from "./types";

// these are actions / thunks that use the server to load in data

// Go get all the stuff we need to layout the page
export function initialLoad() {
  return async (dispatch: any) => {
    const [habitats, streams, sites] = await Promise.all([
      api.geoJson.habitats(),
      api.geoJson.streams(),
      api.sites.list()
    ]);
    const sitesById = {} as { [key: string]: Site };
    for (const site of sites) {
      sitesById[site.id] = site;
    }
    dispatch(setPreloadedData(habitats, streams, Map(sitesById)));
  };
}

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
