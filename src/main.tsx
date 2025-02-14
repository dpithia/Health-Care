import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

console.log("Initializing application");

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
