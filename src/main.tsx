// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { ThemeProvider } from "./theme/theme-provider";
import { themeConfig } from "./theme/theme-config";

import { PannaProvider } from "panna-sdk";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PannaProvider
      clientId={import.meta.env.VITE_PANNA_CLIENT_ID}
      partnerId={import.meta.env.VITE_PANNA_PARTNER_ID}
    >


      <ThemeProvider
        noSsr
        defaultMode={themeConfig.defaultMode}
        modeStorageKey={themeConfig.modeStorageKey}
      >
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </PannaProvider>
  </StrictMode>
);
