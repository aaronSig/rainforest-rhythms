import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import initialState from "./state/initialState";
import reducer from "./state/reducers";

const w = window as any;
const composeEnhancers = w.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, initialState, composeEnhancers(applyMiddleware(thunk)));

export default store;
