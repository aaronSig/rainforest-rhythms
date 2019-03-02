import { AnyAction } from "redux";
import { Taxon } from "../../../api/types";
import { CLEAR_DATA } from "../../actions/actions";
import { SET_TAXA } from "../../actions/info";

export interface InfoPaneState {
  taxa: Taxon[];
}

export const infoPaneInitialState: InfoPaneState = {
  taxa: []
};

export default function InfoPaneReducer(
  state: InfoPaneState = infoPaneInitialState,
  action: AnyAction
) {
  switch (action.type) {
    case SET_TAXA:
      return Object.assign({}, state, action.item);
    case CLEAR_DATA:
      return Object.assign({}, state, infoPaneInitialState);
    default:
      return state;
  }
}
