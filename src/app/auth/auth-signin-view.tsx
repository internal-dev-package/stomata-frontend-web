import { Box, Button, Card, TextField, Typography } from "@mui/material";
import bannerAuth from "../../assets/banner-auth.png";
import { colorPalette } from "../../theme/color-palette";
import { useNavigate } from "react-router-dom";

import { signInWithEmailAndPassword } from "firebase/auth";

import { useState } from "react";
import { auth } from "../../firebase-configuration";

export default function AuthSignInView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [disableButton, setDisableButton] = useState(true);
  const navigate = useNavigate();

  function toSignUp() {
    navigate("/auth-signup");
  }

  async function login() {
    console.log("email: ", email);
    console.log("password: ", password);

    setLoading(true);

    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigate("/home");

        return user;
      })
      .catch((error) => {
        // const errorCode = error.code;
        // const errorMessage = error.message;

        setError(true);
        setErrorMsg(error.message);
      });

    setLoading(false);
  }

  const emailInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);

    if (email !== "" && password !== "") {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }

    setError(false);
  };

  const passwordInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);

    if (email !== "" && password !== "") {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }

    setError(false);
  };

  // if (isLoading) {
  //   return <Skeleton animation="wave" />;
  // }

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
              onChange={emailInput}
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
              onChange={passwordInput}
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
              loading={isLoading}
              disabled={disableButton}
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

            {isError && (
              <p
                style={{
                  color: colorPalette.primary.error,
                }}
              >
                {errorMsg}
              </p>
            )}

            <Box
              sx={{
                paddingTop: 8,
                display: "flex",
                flexDirection: "row",
              }}
            >
              <p>Don't have account? </p>
              <Button
                loading={isLoading}
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
