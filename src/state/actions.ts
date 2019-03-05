import { Map } from "immutable";
import { Taxon } from "../api/types";
import ax from "./ax";
import { TimeSegment } from "./types";

// in here are normal actions that will lead into reducers

export const SET_TAXA_BY_ID = "SET_TAXA_BY_ID";
export function setTaxaById(taxaById: { [id: string]: Taxon }) {
  return ax(SET_TAXA_BY_ID, Map(taxaById));
}

export const SET_TAXA_BY_SITE = "SET_TAXA_BY_SITE";
export function setTaxaBySite(siteId: string, taxaIds: string[]) {
  return {
    type: SET_TAXA_BY_SITE,
    siteId,
    taxaIds
  };
}

export const SET_TAXA_BY_SITE_BY_TIME = "SET_TAXA_BY_SITE_BY_TIME";
export function setTaxaBySiteByTime(siteId: string, time: TimeSegment, taxaIds: string[]) {
  return {
    type: SET_TAXA_BY_SITE_BY_TIME,
    siteId,
    time,
    taxaIds
  };
}
