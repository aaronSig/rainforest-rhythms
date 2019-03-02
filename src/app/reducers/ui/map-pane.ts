import { AnyAction } from "redux";
import { Site } from "../../../api/types";
import { FOCUS_SITE_ID, SET_GEO_JSON, SET_SITES } from "../../actions/map";

export interface MapPaneState {
  // The progress (between 0 => 1) of the progress bar
  sites: Site[];
  focusedSiteId: null | number; // the id of the currently selected site. Can be null until the sites are loaded. Never after
  habitatData: null | GeoJSON.GeoJsonObject;
  streamData: null | GeoJSON.GeoJsonObject;
}

export const mapPaneInitialState: MapPaneState = {
  sites: [],
  habitatData: null,
  streamData: null,
  focusedSiteId: null
};

export default function mapPaneReducer(
  state: MapPaneState = mapPaneInitialState,
  action: AnyAction
) {
  switch (action.type) {
    case FOCUS_SITE_ID:
    case SET_GEO_JSON:
    case SET_SITES:
      return Object.assign({}, state, action.item);

    default:
      return state;
  }
}
