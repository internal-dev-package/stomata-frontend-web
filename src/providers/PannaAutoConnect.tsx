// src/providers/PannaAutoConnect.tsx
'use client';

import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useActiveAccount, usePanna } from "panna-sdk";

function clickHiddenPannaButton(): boolean {
  const root = document.getElementById("panna-auto-login-root");
  if (!root) return false;

  const clickable =
    root.querySelector("button") ||
    root.querySelector('[role="button"]') ||
    root.querySelector('[tabindex]');

  if (!clickable) return false;

  (clickable as HTMLElement).focus?.();
  (clickable as HTMLElement).dispatchEvent(
    new MouseEvent("click", { bubbles: true })
  );
  return true;
}

export function PannaAutoConnect() {
  const { client } = usePanna();
  const active = useActiveAccount();

  useEffect(() => {
    const auth = getAuth();

    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!client) return;

      // sudah connect? selesai.
      if (active?.address) return;

      // (opsional) coba restore session kalau SDK mendukung
      try {
        // @ts-ignore optional API
        await client.auth?.restore?.();
      } catch {}

      // kalau setelah restore tetap belum ada address → trigger modal
      if (!active?.address && fbUser) {
        let clicked = false;
        for (let i = 0; i < 8 && !clicked; i++) {
          clicked = clickHiddenPannaButton();
          if (!clicked) await new Promise((r) => setTimeout(r, 250));
        }
        if (import.meta.env.DEV) {
          console.log("[PannaAutoConnect] clicked hidden login =", clicked);
        }
      }
    });

    return () => unsub();
  }, [client, active?.address]);

  return null;
}
