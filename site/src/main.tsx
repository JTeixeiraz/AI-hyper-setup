import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ProvedorLingua } from "./i18n";
import { App } from "./App";
import "./estilo.css";

createRoot(document.getElementById("raiz")!).render(
  <StrictMode>
    <ProvedorLingua>
      <App />
    </ProvedorLingua>
  </StrictMode>,
);
