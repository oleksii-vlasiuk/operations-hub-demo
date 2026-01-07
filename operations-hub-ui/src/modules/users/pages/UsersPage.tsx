import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  CircularProgress,
} from "@mui/material";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import AddIcon from "@mui/icons-material/Add";
import type { User, UserStatus, CreateUserRequest } from "../types";
import { getUsers, createUser, disableUser, enableUser } from "../api";

type StatusFilter = "ALL" | UserStatus;

const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
};

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // state for dialog "New user"
  const [dialogOpen, setDialogOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const loadUsers = async (status?: UserStatus) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUsers(status);
      setUsers(response.data);
    } catch (e) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (statusFilter === "ALL") {
      void loadUsers();
    } else {
      void loadUsers(statusFilter);
    }
  }, [statusFilter]);

  const handleFilterChange = (
    _event: React.MouseEvent<HTMLElement>,
    value: StatusFilter | null
  ) => {
    if (!value) return;
    setStatusFilter(value);
  };

  const handleOpenDialog = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setDialogOpen(true);
  };

  const handleCreateUser = async () => {
    if (!firstName || !lastName || !email) return;
    const request: CreateUserRequest = { firstName, lastName, email };

    try {
      setLoading(true);
      setError(null);
      await createUser(request);
      setDialogOpen(false);
      if (statusFilter === "ALL") {
        void loadUsers();
      } else {
        void loadUsers(statusFilter);
      }
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
          "Failed to create user. Please check input values."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      setLoading(true);
      setError(null);
      if (user.status === "DISABLED") {
        await enableUser(user.id);
      } else {
        await disableUser(user.id);
      }
      if (statusFilter === "ALL") {
        void loadUsers();
      } else {
        void loadUsers(statusFilter);
      }
    } catch {
      setError("Failed to update user status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto" }}>
      {/* Page Title */}
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
          <Typography variant="h1" sx={{ fontSize: 24, mb: 0.5 }}>
            Users
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage internal users, their roles and access status.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="small"
          onClick={handleOpenDialog}
        >
          New user
        </Button>
      </Box>
        {/*Filters and state*/}
        <Box
          sx={{
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Status:
            </Typography>
            <ToggleButtonGroup
              size="small"
              exclusive
              value={statusFilter}
              onChange={handleFilterChange}
            >
              <ToggleButton value="ALL">All</ToggleButton>
              <ToggleButton value="ACTIVE">Active</ToggleButton>
              <ToggleButton value="DISABLED">Disabled</ToggleButton>
            </ToggleButtonGroup>
          </Stack>

          {loading && (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={18} />
              <Typography variant="caption" color="text.secondary">
                Updating…
              </Typography>
            </Stack>
          )}
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Users */}
        {/* <Box sx={{ width: "100%", overflowX: "auto" }}> */}
        <Paper
        sx={{
          maxWidth: 900,
          mx: "auto",
          borderRadius: 2,
          overflow: "hidden",              // ✅ сохраняет скругления
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        {/* (optional) padding around the table, but NOT on the scroll container */}
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              maxHeight: 466,
              overflow: "auto",
              "&::-webkit-scrollbar": { width: 10, height: 10 },
              "&::-webkit-scrollbar-track": { background: "transparent" },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0,0,0,0.18)",
                borderRadius: 999,
                border: "3px solid transparent",
                backgroundClip: "content-box",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "rgba(0,0,0,0.28)",
              },

              // ✅ Firefox
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(0,0,0,0.25) transparent",
            }}
          >
            <Table
              stickyHeader
              size="small" 
              sx={{
                "& .MuiTableCell-root": { py: 0.8, px: 1.5, whiteSpace: "nowrap" },
                "& .MuiTableCell-head": { fontWeight: 600 },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                        No users found for the selected filter.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Typography variant="body2">
                          {user.firstName} {user.lastName}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">{user.email}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">{user.role || "—"}</Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={user.status === "ACTIVE" ? "Active" : "Disabled"}
                          size="small"
                          color={user.status === "ACTIVE" ? "success" : "default"}
                          variant={user.status === "ACTIVE" ? "filled" : "outlined"}
                          sx={{ height: 22 }} // ✅ чуть компактнее
                        />
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">{formatDate(user.createdAt)}</Typography>
                      </TableCell>

                      <TableCell align="right">
                        <Tooltip
                          title={user.status === "ACTIVE" ? "Disable user" : "Enable user"}
                        >
                          <IconButton size="small" onClick={() => handleToggleStatus(user)}>
                            {user.status === "ACTIVE" ? (
                              <BlockOutlinedIcon fontSize="small" />
                            ) : (
                              <CheckCircleOutlineOutlinedIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Box>
        </Box>
      </Paper>

      {/* Create user dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>New user</DialogTitle>
        <DialogContent sx={{ pt: 1.5 }}>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            <TextField
              label="First name"
              size="small"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoFocus
            />
            <TextField
              label="Last name"
              size="small"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
              label="Email"
              size="small"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)} color="inherit" size="small">
            Cancel
          </Button>
          <Button onClick={handleCreateUser} variant="contained" size="small">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersPage;
