'use client';

import { PannaProvider} from 'panna-sdk';
import { ThemeProvider } from '../theme/theme-provider';
import { Toaster } from 'sonner';
import { themeConfig } from '../theme/theme-config';

export function Providers({ children }: { children: React.ReactNode }) {
  const clientId = import.meta.env.VITE_PANNA_CLIENT_ID as string | undefined;
  const partnerId = import.meta.env.VITE_PANNA_PARTNER_ID as string | undefined;



  return (
    <PannaProvider clientId={clientId!} partnerId={partnerId!}>
      {/* Tombol login Panna tersembunyi — bisa di-trigger programatik */}


      {/* Auto buka modal Panna setelah Firebase login */}

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
