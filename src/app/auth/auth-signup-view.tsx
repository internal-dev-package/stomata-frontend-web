import { Box, Button, Card, TextField, Typography } from "@mui/material";
import bannerAuth from "../../assets/banner-auth.png";
import { colorPalette } from "../../theme/color-palette";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase-configuration";

export default function AuthSignUpView() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [disableButton, setDisableButton] = useState(true);
  const navigate = useNavigate();

  function goBack() {
    navigate(-1);
  }

  async function signup() {
    setLoading(true);
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigate(-1);

        return user;
      })
      .catch((error) => {
        setError(true);
        setErrorMsg(error.message);
      });
    setLoading(false);
  }

  function validateInput() {
    if (
      email !== "" &&
      password !== "" &&
      fullname !== "" &&
      phoneNumber !== "" &&
      companyName !== "" &&
      companyAddress !== ""
    ) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }

    setError(false);
  }

  const emailInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);

    validateInput();
  };

  const passwordInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);

    validateInput();
  };

  const fullNameInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFullname(event.target.value);

    validateInput();
  };

  const phoneNumberInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(event.target.value);

    validateInput();
  };

  const companyNameInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyName(event.target.value);

    validateInput();
  };

  const companyAddressInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyAddress(event.target.value);

    validateInput();
  };

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
                Create account for
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

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
              }}
              gap={2}
            >
              <TextField
                label="Full name"
                onChange={fullNameInput}
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
                label="Email Address"
                onChange={emailInput}
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
            </Box>

            <TextField
              label="Phone Number"
              onChange={phoneNumberInput}
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

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
              }}
              gap={2}
            >
              <TextField
                label="Company Name"
                onChange={companyNameInput}
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
                label="Company Address"
                onChange={companyAddressInput}
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
            </Box>

            <TextField
              label="Password"
              onChange={passwordInput}
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

            <TextField
              label="Confirm Password"
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
              fullWidth
              onClick={signup}
              loading={isLoading}
              disabled={disableButton}
              variant="contained"
              sx={{
                mt: 3,
                bgcolor: colorPalette.primary.lightGreen,
                color: colorPalette.primary.white,
                "&:hover": { bgcolor: colorPalette.primary.darkGreen },
              }}
            >
              Sign up
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
                // paddingTop: 8,
                display: "flex",
                flexDirection: "row",
              }}
            >
              <p>have account? </p>
              <Button
                variant="text"
                loading={isLoading}
                onClick={goBack}
                sx={{
                  color: colorPalette.primary.lightGreen,
                }}
              >
                Sign in
              </Button>
            </Box>
          </Box>
        </Card>
      </Box>
    </div>
  );
}
