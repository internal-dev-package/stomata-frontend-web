'use client';

import { PannaProvider, LoginButton, liskSepolia } from 'panna-sdk';
import { ThemeProvider } from '../theme/theme-provider';
import { Toaster } from 'sonner';
import { themeConfig } from '../theme/theme-config';
import { PannaAutoConnect } from '../providers/PannaAutoConnect';

export function Providers({ children }: { children: React.ReactNode }) {
  const clientId = import.meta.env.VITE_PANNA_CLIENT_ID as string | undefined;
  const partnerId = import.meta.env.VITE_PANNA_PARTNER_ID as string | undefined;

  if (!clientId || !partnerId) {
    // Fail-fast di dev agar variabel env tidak lupa diisi
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn(
        'VITE_PANNA_CLIENT_ID atau VITE_PANNA_PARTNER_ID belum di-set di .env'
      );
    }
  }

  return (
    <PannaProvider clientId={clientId!} partnerId={partnerId!}>
      {/* Tombol login Panna tersembunyi — bisa di-trigger programatik */}
      <div id="panna-auto-login-root" style={{ display: 'none' }}>
        <LoginButton chain={liskSepolia} />
      </div>

      {/* Auto buka modal Panna setelah Firebase login */}
      <PannaAutoConnect />

      <ThemeProvider
        defaultMode={themeConfig.defaultMode}
        modeStorageKey={themeConfig.modeStorageKey}
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </PannaProvider>
  );
}
