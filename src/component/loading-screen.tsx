// src/components/LoadingScreen.tsx
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export default function LoadingScreen() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress
        sx={{
          color: "#157A6E",
        }}
      />
    </Box>
  );
}
