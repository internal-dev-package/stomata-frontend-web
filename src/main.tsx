// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { ThemeProvider } from "./theme/theme-provider";
import { themeConfig } from "./theme/theme-config";

import { PannaProvider, LoginButton, liskSepolia } from "panna-sdk";
import { PannaAutoConnect } from "./providers/PannaAutoConnect";

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
      {/* ⬇️ tombol login Panna disembunyikan, akan di-click programatik */}
      <div
        id="panna-auto-login-root"
        style={{ position: "fixed", left: -9999, top: -9999, opacity: 0 }}
      >
        <LoginButton chain={liskSepolia} />
      </div>

      {/* ⬇️ auto-open modal setelah Firebase login */}
      <PannaAutoConnect />

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
