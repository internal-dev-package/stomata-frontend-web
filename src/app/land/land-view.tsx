// src/pages/LandView.tsx
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useActiveAccount } from "panna-sdk";
import LandsList from "../../components/LandList";
import { useLand } from "../../hooks/useLand";
import { colorPalette } from "../../theme/color-palette";

const BACKEND_URL =
  (import.meta.env.VITE_BACKEND_URL as string) || "http://localhost:3000";

export default function LandView() {
  const active = useActiveAccount();
  const address = active?.address ?? "";
  const { lands, loading, error, minting, mintDemo, refresh, canTransact } =
    useLand();
  const [snackOpen, setSnackOpen] = useState(false);

  useEffect(() => {
    if (address) refresh();
  }, [address, refresh]);

  useEffect(() => {
    if (error) setSnackOpen(true);
  }, [error]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        flexGrow: 1,
        p: 4,
        paddingTop: 15,
      }}
    >
      <Typography variant="h5">Lands</Typography>
      <Alert severity="info">
        Mint a demo Land NFT via <b>Panna gasless</b>. Backend must expose{" "}
        <code>POST {BACKEND_URL}/lands/pin</code>.
      </Alert>

      <Button
        variant="contained"
        disabled={!canTransact || minting}
        onClick={mintDemo}
        sx={{
          width: { xs: "100%", sm: "fit-content" },
          backgroundColor: colorPalette.primary.darkGreen,
        }}
      >
        {minting ? <CircularProgress size={16} sx={{ mr: 1 }} /> : null}
        {minting ? "Submitting mint..." : "Add Land NFT (Mint)"}
      </Button>

      <Typography variant="body2" color="text.secondary">
        Owner:{" "}
        {address
          ? `${address.slice(0, 6)}...${address.slice(-4)}`
          : "Not connected"}
      </Typography>

      <LandsList items={lands} loading={loading} />

      <Snackbar
        open={snackOpen}
        autoHideDuration={4000}
        onClose={() => setSnackOpen(false)}
      >
        <Alert severity="error" onClose={() => setSnackOpen(false)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
