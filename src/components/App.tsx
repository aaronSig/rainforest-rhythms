import React from "react";
import useSize from "../utils/useSize";
import "./App.css";
import { LocationListener } from "./LocationListener";
import { Navigation } from "./Navigation/Navigation";
import { AudioControlPane } from "./panes/AudioControlPane/AudioControlPane";
import { InfoPane } from "./panes/InfoPane/InfoPane";
import { MapPane } from "./panes/MapPane/MapPane";

function App() {
  const [ref, rowSize] = useSize();
  return (
    <div className="App">
      <LocationListener />
      <Navigation />
      <div className="row" ref={ref}>
        <MapPane interactive={false} width={rowSize.width * 0.67} height={rowSize.height} />
        <InfoPane />
      </div>
      <AudioControlPane />
    </div>
  );
}

export default App;
