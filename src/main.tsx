import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import "./index.css";
import "./global.css";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/index.tsx";
import { ThemeProvider } from "./theme/theme-provider.tsx";
import { themeConfig } from "./theme/theme-config.ts";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider
      noSsr
      defaultMode={themeConfig.defaultMode}
      modeStorageKey={themeConfig.modeStorageKey}
    >
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
