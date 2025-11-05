import { useEffect } from "react";
import LoadingScreen from "../../component/loading-screen";
import { Typography } from "@mui/material";

export default function SplashScreenView() {
  useEffect(() => {
    setTimeout(() => {}, 2000); // simulasi delay 2 detik
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <Typography>Welcome to Stomata</Typography>
      <LoadingScreen />
    </div>
  );
}
