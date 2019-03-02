import { Router } from "@reach/router";
import React from "react";
import Index from "./screens/Index";

function App() {
  return (
    <Router style={{ height: "100%" }}>
      <Index path="/" />
      <Index path="/:audioId" />
    </Router>
  );
}

export default App;
