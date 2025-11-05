import { useEffect } from "react";
import LoadingScreen from "../../component/loading-screen";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function SplashScreenView() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/auth-signin");
    }, 1000);
  }, [navigate]);

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
      <LoadingScreen />
    </div>
  );
}
