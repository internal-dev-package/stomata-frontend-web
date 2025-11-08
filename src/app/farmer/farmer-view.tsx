import { Alert, Box, Button, CircularProgress, Snackbar } from "@mui/material";
import { useState } from "react";

// Hook yang baru (tanpa low-level relay)
import { usePannaRelay } from "../../hooks/usePannaWallet";

import FarmersList from "../../components/FarmersList";

// Kontrak farmer
import { FARMER_NFT_ABI } from "../../types/farmer";
import { getFarmerContractAddress } from "../../config/contracts";
// Ganti dengan address kontrak kamu (tetap disediakan kalau butuh)
const FARMER_CONTRACT_ENV = import.meta.env
  .VITE_FARMER_NFT_ADDRESS as `0x${string}`;

const BACKEND_URL =
  (import.meta.env.VITE_BACKEND_URL as string) || "http://localhost:3000";

export default function FarmerView() {
  const {
    address: pannaAddress,
    pannaReady,
    pannaError,
    sendContractCall,
  } = usePannaRelay();

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">(
    "success"
  );
  const [isMinting, setIsMinting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const showSnack = (message: string, severity: "success" | "error") => {
    setSnackSeverity(severity);
    setSnackMsg(message);
    setSnackOpen(true);
  };

  const handleMintFarmer = async () => {
    if (!pannaAddress) {
      showSnack("Please connect with Panna first (Login button).", "error");
      return;
    }
    if (!pannaReady) {
      showSnack(pannaError || "Panna client is not ready.", "error");
      return;
    }

    setIsMinting(true);
    try {
      // 1) Pin metadata di backend → dapat CID
      const metadata = {
        company: {
          name: "PT Agro Demo",
          owner: "Demo Owner",
          address: {
            line1: "Jl. Kebun Raya No. 1",
            city: "Bandung",
            province: "Jawa Barat",
            country: "Indonesia",
          },
        },
        farmer: {
          id: `DEMO-${Date.now()}`,
          name: "Farmer Demo",
          nik: `3204${Math.floor(Math.random() * 1_000_000_000)
            .toString()
            .padStart(9, "0")}`,
          age: 34,
          gender: "M",
          address: {
            line1: "Desa Sukamaju",
            city: "Bandung",
            province: "Jawa Barat",
            country: "Indonesia",
          },
        },
        ui: {
          // image: "https://via.placeholder.com/400x400.png?text=Farmer+Demo",
          image:
            "https://nestle-nespresso.com/sites/site.prod.nestle-nespresso.com/files/styles/crop_freeform/public/beans_africa.jpg?itok=lAPliHPp",
          tags: ["demo", "gasless", "test"],
        },
        extraAttributes: [
          { trait_type: "experience", value: "5 years" },
          { trait_type: "commodity", value: "Tea" },
        ],
      };

      const pinResponse = await fetch(`${BACKEND_URL}/farmers/pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metadata),
      });
      if (!pinResponse.ok) {
        const errorText = await pinResponse.text();
        throw new Error(
          `Pin metadata failed: ${pinResponse.status} ${errorText}`
        );
      }
      const pinJson: { cid: string; tokenURI: string } =
        await pinResponse.json();
      if (!pinJson?.cid) throw new Error("Pin metadata response missing CID");

      // address kontrak bisa dari helper config atau env (helper diutamakan)
      const FARMER_CONTRACT_ADDRESS =
        (getFarmerContractAddress?.() as `0x${string}`) || FARMER_CONTRACT_ENV;

      // 2) Call kontrak via Thirdweb + akun Panna (gasless by design)
      await sendContractCall({
        address: FARMER_CONTRACT_ADDRESS,
        abi: FARMER_NFT_ABI,
        functionName: "mintFarmer",
        params: [pannaAddress, pinJson.cid], // (to, ipfsCid)
      });

      showSnack(`Submitted mint (gasless) for CID ${pinJson.cid}`, "success");

      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Mint farmer failed", error);
      showSnack(
        error instanceof Error ? error.message : "Mint failed",
        "error"
      );
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 4,
        paddingTop: 15,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* <Typography variant="h5" gutterBottom>
          Dashboard
        </Typography> */}
      <Alert severity="info">
        Mint a demo farmer NFT using <b>Panna gasless</b>. Ensure backend is
        running at {BACKEND_URL}.
      </Alert>
      <Button
        variant="contained"
        onClick={handleMintFarmer}
        disabled={!pannaAddress || isMinting}
        sx={{ width: { xs: "100%", sm: "fit-content" } }}
      >
        {isMinting ? <CircularProgress size={16} sx={{ mr: 1 }} /> : null}
        {isMinting ? "Submitting mint..." : "Mint Farmer NFT (Gasless Demo)"}
      </Button>

      <FarmersList
        ownerAddress={pannaAddress ?? undefined}
        refreshTrigger={refreshTrigger}
      />
      <Snackbar
        open={snackOpen || Boolean(pannaError)}
        autoHideDuration={4000}
        onClose={() => setSnackOpen(false)}
      >
        <Alert
          severity={pannaError ? "error" : snackSeverity}
          onClose={() => setSnackOpen(false)}
        >
          {pannaError ?? snackMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
