import { AnyAction } from "redux";
import { SET_ERROR, SET_LOADING } from "../../actions/actions";

export interface GlobalUIState {
  loading: number; // any number greater than 0 is loading
  error: string | null; // a place to globally show any errors. This could raise a toast notification
}

export const gloablUIInitialState: GlobalUIState = {
  loading: 0,
  error: null
};

export default function globalUiReducer(
  state: GlobalUIState = gloablUIInitialState,
  action: AnyAction
) {
  switch (action.type) {
    case SET_LOADING:
      return Object.assign({}, state, action.item);
    case SET_ERROR:
      console.error(action.item);
      return Object.assign({}, state, action.item);
    default:
      return state;
  }
}
