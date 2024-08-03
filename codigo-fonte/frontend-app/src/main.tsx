import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AuthProvider } from "../src/hooks/auth";
import * as serviceWorker from "./serviceWorker";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);

serviceWorker.register();
