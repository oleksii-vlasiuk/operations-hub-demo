import {
  Box,
  Typography,
} from "@mui/material";

const HomePage = () => {

  return (
    <Box sx={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      gap: 2,
    }}
    >
      <Box
        sx={{
          mb: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h1" sx={{ fontSize: 28, mb: 0.5 }}>
            Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Internal operations tool for managing users and future business
            modules like tasks, requests and orders.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
