import { State } from "../reducers";

export const mapPaneHabitatData = (state: State) => state.ui.mapPane.habitatData;
export const mapPaneStreamData = (state: State) => state.ui.mapPane.streamData;
export const mapPaneSites = (state: State) => state.ui.mapPane.sites;
export const mapPaneFocusedSiteId = (state: State) => state.ui.mapPane.focusedSiteId;
