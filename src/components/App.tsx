import { Router } from "@reach/router";
import React from "react";
import Index from "./screens/Index";

function App() {
  return (
    <Router style={{ height: "100%" }}>
      <Index path="/" />
      <Index path="/:timeSegment" />
      <Index path="/:timeSegment/:siteId" />
      <Index path="/:timeSegment/:siteId/:audioId" />
    </Router>
  );
}

export default App;
