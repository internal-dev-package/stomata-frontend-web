import { Box, Button, TextField, Typography } from "@mui/material";
import bannerAuth from "../../assets/banner-auth.png";
import { colorPalette } from "../../theme/color-palette";
import { useNavigate } from "react-router-dom";

export default function AuthSignUpView() {
  const navigate = useNavigate();

  function goBack() {
    navigate(-1);
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
        <Box sx={{ width: "80%", maxWidth: 360 }}>
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
              variant="outlined"
              fullWidth
              margin="normal"
              sx={{
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
              variant="outlined"
              fullWidth
              margin="normal"
              sx={{
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
            variant="outlined"
            fullWidth
            margin="normal"
            sx={{
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
              variant="outlined"
              fullWidth
              margin="normal"
              sx={{
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
              variant="outlined"
              fullWidth
              margin="normal"
              sx={{
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
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            sx={{
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
          <Box
            sx={{
              paddingTop: 8,
              display: "flex",
              flexDirection: "row",
            }}
          >
            <p>have account? </p>
            <Button
              variant="text"
              onClick={goBack}
              sx={{
                color: colorPalette.primary.lightGreen,
              }}
            >
              Sign in
            </Button>
          </Box>
        </Box>
      </Box>
    </div>
  );
}
