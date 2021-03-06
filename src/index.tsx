import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./components/App";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import store from "./store";

function noop() {}

if (process.env.NODE_ENV !== "development") {
  console.log = noop;
  console.warn = noop;
  console.error = noop;
}

console.log("Rendering");
ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,

  document.getElementById("root")
);

serviceWorker.unregister();
