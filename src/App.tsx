import React, { Component } from "react";
import ContainerDimensions from "react-container-dimensions";
import "./App.css";
import { Navigation } from "./Navigation/Navigation";
import { AudioControlPane } from "./panes/AudioControlPane/AudioControlPane";
import { InfoPane } from "./panes/InfoPane/InfoPane";
import { MapPane } from "./panes/MapPane/MapPane";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navigation />
        <div className="row">
          <ContainerDimensions>
            <MapPane interactive={false} />
          </ContainerDimensions>
          <InfoPane />
        </div>
        <AudioControlPane />
      </div>
    );
  }
}

export default App;
