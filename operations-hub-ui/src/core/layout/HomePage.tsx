import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ px: 0 }}>
      {/* Hero / Intro */}
      <Paper elevation={1} sx={{ mb: 3, p: 3 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h1" sx={{ fontSize: 28, mb: 0.5 }}>
              Operations Hub
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 600 }}
            >
              Internal operations tool for managing users and future business
              modules like tasks, requests and orders.
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/users")}
              size="small"
            >
              Open Users module
            </Button>
            <Typography variant="body2" color="text.secondary">
              Start with user management — the core of any internal system.
            </Typography>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
};

export default HomePage;
