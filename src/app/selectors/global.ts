import { State } from "../reducers";

export const isLoading = (state: State) => state.ui.global.loading > 0;
export const loadingCount = (state: State) => state.ui.global.loading;
