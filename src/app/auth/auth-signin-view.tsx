import { Box, Button, Card, TextField, Typography } from "@mui/material";
import bannerAuth from "../../assets/banner-auth.png";
import { colorPalette } from "../../theme/color-palette";
import { useNavigate } from "react-router-dom";

export default function AuthSignInView() {
  const navigate = useNavigate();

  function toSignUp() {
    navigate("/auth-signup");
  }

  function login() {
    navigate("/home");
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Box
        sx={{
          flex: 1,
        }}
      >
        <img
          src={bannerAuth}
          alt="Stomata Logo"
          style={{
            height: "100%", // penuh secara vertikal
            objectFit: "cover", // biar gambar proporsional (tidak gepeng)
          }}
        />
      </Box>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          pr: 20,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          elevation={4}
          sx={{
            padding: 10,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
            borderRadius: 5,
          }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Typography
                variant="h6"
                color={colorPalette.primary.lightGreen}
                fontWeight={600}
                textAlign="center"
                mb={2}
                paddingRight={1}
              >
                SignIn
              </Typography>
              <Typography
                variant="h6"
                color="#000000ff"
                fontWeight={600}
                textAlign="center"
                mb={2}
              >
                STOMATA App
              </Typography>
            </Box>

            <TextField
              label="Email Address"
              variant="outlined"
              fullWidth
              margin="normal"
              sx={{
                borderRadius: 1,
                backgroundColor: "#EBF5EE",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#ccc",
                  },
                  "&:hover fieldset": {
                    borderColor: colorPalette.primary.lightGreen,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: colorPalette.primary.lightGreen,
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: colorPalette.primary.lightGreen,
                },
              }}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              sx={{
                borderRadius: 1,
                backgroundColor: "#EBF5EE",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#ccc",
                  },
                  "&:hover fieldset": {
                    borderColor: colorPalette.primary.lightGreen,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: colorPalette.primary.lightGreen,
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: colorPalette.primary.lightGreen,
                },
              }}
            />
            <Button
              onClick={login}
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                bgcolor: colorPalette.primary.lightGreen,
                color: colorPalette.primary.white,
                "&:hover": { bgcolor: colorPalette.primary.darkGreen },
              }}
            >
              Sign in
            </Button>
            <Box
              sx={{
                paddingTop: 8,
                display: "flex",
                flexDirection: "row",
              }}
            >
              <p>Don't have account? </p>
              <Button
                variant="text"
                onClick={toSignUp}
                sx={{
                  color: colorPalette.primary.lightGreen,
                }}
              >
                Sign up
              </Button>
            </Box>
          </Box>
        </Card>
      </Box>
    </div>
  );
}
