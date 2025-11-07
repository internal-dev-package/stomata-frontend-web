// src/app/home/home-parent-view.tsx
import { getFarmerContractAddress } from "../../config/contracts";
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
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

// Panna SDK UI: tombol login/conn
import { LoginButton, liskSepolia } from "panna-sdk";

// Hook yang baru (tanpa low-level relay)
import { usePannaRelay } from "../../hooks/usePannaWallet";

import FarmersList from "../../components/FarmersList";

// Kontrak farmer
import { FARMER_NFT_ABI } from "../../types/farmer";
// Ganti dengan address kontrak kamu (tetap disediakan kalau butuh)
const FARMER_CONTRACT_ENV = import.meta.env.FARMER_NFT_ADDRESS as `0x${string}`;

const BACKEND_URL =
  (import.meta.env.VITE_BACKEND_URL as string) || "http://localhost:3000";

const drawerWidth = 240;

interface MenuItem {
  name: string;
  type: string;
  icon: JSX.Element;
}

export default function HomeParentView() {
  const menus: MenuItem[] = [
    {
      icon: <AgricultureIcon sx={{ color: colorPalette.primary.darkGreen }} />,
      type: "FARMER",
      name: "Farmer",
    },
    {
      icon: <LandslideIcon sx={{ color: colorPalette.primary.darkGreen }} />,
      type: "LAND",
      name: "Farmland",
    },
    {
      icon: (
        <AccountCircleIcon sx={{ color: colorPalette.primary.darkGreen }} />
      ),
      type: "PROFILE",
      name: "Profile",
    },
    {
      icon: <ExitToAppIcon sx={{ color: colorPalette.primary.darkGreen }} />,
      type: "SIGNOUT",
      name: "Sign out",
    },
  ];

  const [selected, setSelected] = useState<string>("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Panna state (alamat dari akun Panna)
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
      // modern clipboard
      await navigator.clipboard.writeText(pannaAddress);
      showSnack("Address copied to clipboard", "success");
    } catch {
      // fallback
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
          image: "https://via.placeholder.com/400x400.png?text=Farmer+Demo",
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

  const handleClick = (menu: MenuItem) => {
    setSelected(menu.name);
    if (menu.type === "SIGNOUT") setOpen(true);
  };

  const handleClose = () => setOpen(false);

  useEffect(() => {
    const user = auth.currentUser;
    setUserEmail(user?.email ?? "");
  }, [userEmail]);

  async function logout() {
    setLoading(true);
    setDisableButton(true);
    await signOut(auth)
      .then(() => {
        navigate(-1);
        handleClose();
      })
      .catch((error) => {
        setError(true);
        setErrorMsg(error.message);
        handleClose();
      });
    setLoading(false);
    setDisableButton(false);
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        elevation={0}
        color="transparent"
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar sx={{ pt: 5 }}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ marginRight: "auto" }}
          >
            Dashboard
          </Typography>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ marginLeft: "auto" }}
          >
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
          <Typography variant="h6" fontWeight="bold">
            Stomata App
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Versi 1.0.0
          </Typography>

          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Wallet (Panna)
            </Typography>

            {/* Address + Copy button */}
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}
            >
              <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                {pannaAddress
                  ? `${pannaAddress.slice(0, 6)}...${pannaAddress.slice(-4)}`
                  : "Not connected"}
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

            {pannaReady ? (
              <Typography variant="caption" color="text.secondary">
                Gasless ready
              </Typography>
            ) : (
              <Typography variant="caption" color="error">
                Gasless unavailable
              </Typography>
            )}

            {!pannaAddress ? (
              <div style={{ marginTop: 8 }}>
                <LoginButton chain={liskSepolia} />
              </div>
            ) : (
              <Button size="small" disabled sx={{ mt: 1 }}>
                Connected
              </Button>
            )}
          </Box>

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

        <Box sx={{ padding: 2 }}>
          <Divider />
        </Box>
        <List>
          {menus.map((data) => (
            <ListItem key={data.name}>
              <ListItemButton
                onClick={() => handleClick(data)}
                selected={selected === data.name}
              >
                <ListItemIcon>{data.icon}</ListItemIcon>
                <ListItemText primary={data.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

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
        {pannaAddress && <FarmersList ownerAddress={pannaAddress} />}
      </Box>

      <Dialog
        disableEscapeKeyDown
        open={open}
        onClose={(reason) => {
          if (reason === "backdropClick") return;
          handleClose();
        }}
      >
        <DialogTitle>Logout ?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure want to logout?</Typography>
          {isError && (
            <p style={{ color: colorPalette.primary.error }}>{errorMsg}</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            disabled={disableButton}
            onClick={handleClose}
            sx={{ color: colorPalette.primary.darkGreen }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              logout();
            }}
            sx={{ color: colorPalette.primary.error }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
