import { Router } from "@reach/router";
import React from "react";
import About from "./screens/About";
import Index from "./screens/Index";

function App() {
  return (
    <Router style={{ height: "100%" }}>
      <About path="/about" />
      <Index path="/" />
      <Index path="/:timeSegment" />
      <Index path="/:timeSegment/:siteId" />
      <Index path="/:timeSegment/:siteId/:audioId" />
    </Router>
  );
}

export default App;
