import { createStore } from "redux";
import { Taxon } from "../../api/types";
import { setTaxaById, setTaxaBySite, setTaxaBySiteByTime } from "../actions";
import reducer from "../reducers";
import { State } from "../types";
import { standardState } from "./fixtures";

let store = createStore(reducer);

beforeEach(() => {
  store = createStore(reducer);
});

test("Correctly set taxa by id", () => {
  const taxaById: { [id: string]: Taxon } = (standardState as State).taxaById.toJS() as any;
  const taxon = taxaById[1];
  store.dispatch(setTaxaById({ 1: taxon }));
  const state = store.getState();
  expect(state.taxaById.toJS()).toEqual({ 1: taxon });
});

test("Correctly set taxa by id by site", () => {
  store.dispatch(setTaxaBySite("22", ["1"]));
  const state = store.getState();
  expect(state.taxaIdBySiteId.toJS()).toEqual({ "22": ["1"] });
});

test("Correctly set taxa by id by site by time", () => {
  store.dispatch(setTaxaBySiteByTime("22", "10:00", ["1"]));
  const state = store.getState();
  expect(state.taxaIdBySiteIdByTime.toJS()).toEqual({ "22": { "10:00": ["1"] } });
});
