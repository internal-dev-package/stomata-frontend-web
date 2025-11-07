// src/app/home/home-parent-view.tsx
import {
  AppBar, Box, Button, CssBaseline, Dialog, DialogActions, DialogContent,
  DialogTitle, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Toolbar, Typography, Snackbar, Alert, CircularProgress,
  IconButton, Tooltip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import LandslideIcon from "@mui/icons-material/Landslide";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { colorPalette } from "../../theme/color-palette";
import { useEffect, useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase-configuration";
import { useActiveAccount, usePanna } from "panna-sdk";



import { usePannaRelay } from "../../hooks/usePannaWallet";
import FarmersList from "../../components/FarmersList";

import { FARMER_NFT_ABI } from "../../types/farmer";
import { isAddress } from "viem";

const BACKEND_URL =
  (import.meta.env.VITE_BACKEND_URL as string) || "http://localhost:3000";

const drawerWidth = 240;

interface MenuItem {
  name: string;
  type: string;
  icon: JSX.Element;
}

async function signOutPannaSafe(client: any) {
  try {
    // Prefer API resmi kalau ada
    if (client?.auth?.signOut) {
      await client.auth.signOut();
    } else if (client?.disconnect) {
      await client.disconnect();
    } else if (client?.wallet?.disconnect) {
      await client.wallet.disconnect();
    }
  } catch (e) {
    // swallow – jangan blokir logout total
    console.warn("Panna signOut failed (ignored):", e);
  }

  // Bersihkan kemungkinan sesi/SDK lain (opsional, aman)
  try {
    const keys = Object.keys(localStorage);
    for (const k of keys) {
      if (
        k.startsWith("panna:") ||
        k.startsWith("thirdweb:") ||
        k.startsWith("tw:") ||
        k.includes("panna") ||
        k.includes("thirdweb")
      ) {
        localStorage.removeItem(k);
      }
    }
  } catch {}
}


export default function HomeParentView() {
  const menus: MenuItem[] = [
    { icon: <AgricultureIcon sx={{ color: colorPalette.primary.darkGreen }} />, type: "FARMER", name: "Farmer" },
    { icon: <LandslideIcon sx={{ color: colorPalette.primary.darkGreen }} />, type: "LAND", name: "Farmland" },
    { icon: <AccountCircleIcon sx={{ color: colorPalette.primary.darkGreen }} />, type: "PROFILE", name: "Profile" },
    { icon: <ExitToAppIcon sx={{ color: colorPalette.primary.darkGreen }} />, type: "SIGNOUT", name: "Sign out" },
  ];

  const active = useActiveAccount();
  const pannaAddress = active?.address ?? null;
  const { client } = usePanna();  

  const [selected, setSelected] = useState<string>("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const {
    // address: pannaAddress,
    pannaReady,
    pannaError,
    sendContractCall,
  } = usePannaRelay();

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success");
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isMinting, setIsMinting] = useState(false);

  const showSnack = (message: string, severity: "success" | "error") => {
    setSnackSeverity(severity);
    setSnackMsg(message);
    setSnackOpen(true);
  };

  const handleCopyAddress = async () => {
    if (!pannaAddress) return;
    try {
      await navigator.clipboard.writeText(pannaAddress);
      showSnack("Address copied to clipboard", "success");
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = pannaAddress;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        showSnack("Address copied to clipboard", "success");
      } catch (e) {
        showSnack("Failed to copy address", "error");
      }
    }
  };

  const handleMintFarmer = async () => {
    if (!pannaAddress || !isAddress(pannaAddress as `0x${string}`)) {
      showSnack("Please connect wallet via Panna modal (auto-open setelah login).", "error");
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
          address: { line1: "Jl. Kebun Raya No. 1", city: "Bandung", province: "Jawa Barat", country: "Indonesia" },
        },
        farmer: {
          id: `DEMO-${Date.now()}`,
          name: "Farmer Demo",
          nik: `3204${Math.floor(Math.random() * 1_000_000_000).toString().padStart(9, "0")}`,
          age: 34,
          gender: "M",
          address: { line1: "Desa Sukamaju", city: "Bandung", province: "Jawa Barat", country: "Indonesia" },
        },
        ui: { image: "https://via.placeholder.com/400x400.png?text=Farmer+Demo", tags: ["demo", "gasless", "test"] },
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
        throw new Error(`Pin metadata failed: ${pinResponse.status} ${errorText}`);
      }
      const pinJson: { cid: string; tokenURI: string } = await pinResponse.json();
      if (!pinJson?.cid) throw new Error("Pin metadata response missing CID");

      // 2) Kirim tx mint via Panna (gasless)
      await sendContractCall({
        address: import.meta.env.VITE_FARMER_NFT_ADDRESS as `0x${string}`,
        abi: FARMER_NFT_ABI,
        functionName: "mintFarmer",
        params: [pannaAddress, pinJson.cid],
      });

      showSnack(`Submitted mint (gasless) for CID ${pinJson.cid}`, "success");
    } catch (error) {
      console.error("Mint farmer failed", error);
      showSnack(error instanceof Error ? error.message : "Mint failed", "error");
    } finally {
      setIsMinting(false);
    }
  };

  const handleClick = (menu: MenuItem) => {
    setSelected(menu.name);
    if (menu.type === "SIGNOUT") setOpen(true);
    if (menu.type === "LAND") navigate("/lands")
  };

  const handleClose = () => setOpen(false);

  useEffect(() => {
    const user = auth.currentUser;
    setUserEmail(user?.email ?? "");
  }, [userEmail]);

  async function logout() {
    setLoading(true);
    setDisableButton(true);

    try {
      // 1) putuskan sesi Panna (jika ada)
      await signOutPannaSafe(client);

      // 2) logout Firebase
      await signOut(auth);

      // 3) navigasi balik / ke halaman login
      navigate(-1); // atau navigate('/auth-signin')
      handleClose();
    } catch (error: any) {
      setError(true);
      setErrorMsg(error?.message ?? "Logout failed");
      handleClose();
    } finally {
      setLoading(false);
      setDisableButton(false);
    }
  }


  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar color="transparent" position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ marginLeft: "auto" }}>
            Hi, {userEmail}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        slotProps={{ paper: { sx: { border: "none", boxShadow: "none" } } }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight="bold">Stomata App</Typography>
          <Typography variant="body2" color="text.secondary">Versi 1.0.0</Typography>

          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">Wallet (Panna)</Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
              <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                {pannaAddress ? `${pannaAddress.slice(0, 6)}...${pannaAddress.slice(-4)}` : "Not connected"}
              </Typography>
              <Tooltip title={pannaAddress ? "Copy address" : "Connect first"}>
                <span>
                  <IconButton
                    size="small"
                    onClick={handleCopyAddress}
                    disabled={!pannaAddress}
                    aria-label="Copy wallet address"
                  >
                    <ContentCopyIcon fontSize="inherit" />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>

            <Typography variant="caption" color={pannaReady ? "text.secondary" : "error"}>
              {pannaReady ? "Gasless ready" : "Gasless unavailable"}
            </Typography>

            {/* Tombol manual connect dihapus — modal dibuka otomatis di provider */}
          </Box>

          <Snackbar open={snackOpen || Boolean(pannaError)} autoHideDuration={4000} onClose={() => setSnackOpen(false)}>
            <Alert severity={pannaError ? "error" : snackSeverity} onClose={() => setSnackOpen(false)}>
              {pannaError ?? snackMsg}
            </Alert>
          </Snackbar>
        </Box>

        <Box sx={{ padding: 2 }}>
          <Divider />
        </Box>
        <List>
          {menus.map((data) => (
            <ListItem key={data.name}>
              <ListItemButton onClick={() => handleClick(data)} selected={selected === data.name}>
                <ListItemIcon>{data.icon}</ListItemIcon>
                <ListItemText primary={data.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 4, display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h5" gutterBottom>Dashboard</Typography>
        <Alert severity="info">
          Mint a demo farmer NFT using <b>Panna gasless</b>. Ensure backend is running at {BACKEND_URL}.
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

        {/* ⬇️ Aman: hanya kirim ownerAddress kalau valid */}
        {pannaAddress && <FarmersList ownerAddress={`${pannaAddress}`} />}
      </Box>

      <Dialog disableEscapeKeyDown open={open} onClose={(reason) => { if (reason === "backdropClick") return; handleClose(); }}>
        <DialogTitle>Logout ?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure want to logout?</Typography>
          {isError && <p style={{ color: colorPalette.primary.error }}>{errorMsg}</p>}
        </DialogContent>
        <DialogActions>
          <Button disabled={disableButton} onClick={handleClose} sx={{ color: colorPalette.primary.darkGreen }}>Cancel</Button>
          <Button onClick={() => { logout(); }} sx={{ color: colorPalette.primary.error }}>Logout</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
