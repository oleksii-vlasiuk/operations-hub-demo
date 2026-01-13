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
  TableContainer,
} from "@mui/material";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import AddIcon from "@mui/icons-material/Add";
import type { User, UserStatus, CreateUserRequest } from "../types";
import { getUsers, createUser, disableUser, enableUser } from "../api";
import { useNavigate } from "react-router-dom";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";


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

  const navigate = useNavigate();

  const openUserAudit = (userId: number) => {
    navigate(`/audit?entityType=USER&entityId=${userId}`);
  };


  function actionChipColor(action: any): import("@mui/types").OverridableStringUnion<"error" | "success" | "info" | "warning" | "default" | "primary" | "secondary", import("@mui/material").ChipPropsColorOverrides> | undefined {
    throw new Error("Function not implemented.");
  }

  return (
    <Box sx={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      gap: 2,
    }}
    >
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
          <Typography variant="h1" sx={{ fontSize: 28, mb: 0.5 }}>
            Users
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage internal users, their roles and access status.
          </Typography>
        </Box>
        {/* <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="small"
          onClick={handleOpenDialog}
        >
          New user
        </Button> */}
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
          <Button
            sx={{ ml: 'auto' }}
            variant="contained"
            startIcon={<AddIcon />}
            size="small"
            onClick={handleOpenDialog}
          >
            New user
          </Button>
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
      {/* Table */}
      <Paper variant="outlined" sx={{ overflow: "hidden", flexGrow: 1 }}>
        <TableContainer sx={{ height: "100%", overflowY: "auto" }}>
          <Table stickyHeader size="small">
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
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title="View audit">
                          <IconButton size="small" onClick={() => openUserAudit(user.id)}>
                            <ReceiptLongOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

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
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
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
