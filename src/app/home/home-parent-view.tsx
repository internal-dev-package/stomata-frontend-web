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
} from "@mui/material";

import AgricultureIcon from "@mui/icons-material/Agriculture";
import LandslideIcon from "@mui/icons-material/Landslide";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { colorPalette } from "../../theme/color-palette";
import { useEffect, useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";

import { signOut } from "firebase/auth";
import { auth } from "../../firebase-configuration";

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
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const handleClick = (menu: MenuItem, index: number) => {
    setSelected(menu.name);
    console.log("Clicked:", menu.name);
    console.log("index:", index);

    if (menu.type === "SIGNOUT") {
      // navigate(-1);
      handleOpen();
    }
    // bisa tambah navigasi atau aksi lain di sini
  };

  const handleOpen = () => setOpen(true);
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
        color="transparent"
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
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
        slotProps={{
          paper: {
            sx: {
              border: "none",
              boxShadow: "none",
            },
          },
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
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
        </Box>
        <Box
          sx={{
            padding: 2,
          }}
        >
          <Divider />
        </Box>
        <List>
          {menus.map((data, index) => (
            <ListItem key={data.name}>
              <ListItemButton
                onClick={() => handleClick(data, index)}
                selected={selected === data.name}
              >
                <ListItemIcon>{data.icon}</ListItemIcon>
                <ListItemText primary={data.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Body content letakan  sini */}

      <Dialog
        disableEscapeKeyDown
        open={open}
        onClose={(reason) => {
          if (reason === "backdropClick") return; // cegah close saat klik background
          handleClose();
        }}
      >
        <DialogTitle>Logout ?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure want to logout?</Typography>
          {isError && (
            <p
              style={{
                color: colorPalette.primary.error,
              }}
            >
              {errorMsg}
            </p>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            disabled={disableButton}
            onClick={handleClose}
            sx={{
              color: colorPalette.primary.darkGreen,
            }}
          >
            Cancel
          </Button>
          <Button
            loading={isLoading}
            onClick={() => {
              logout();
            }}
            sx={{
              color: colorPalette.primary.error,
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
