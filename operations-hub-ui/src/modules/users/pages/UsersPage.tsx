import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import type { User, UserStatus, CreateUserRequest } from "../types";
import { getUsers, createUser, disableUser, enableUser } from "../api";
import { useNavigate, useSearchParams } from "react-router-dom";
import UsersTable from "./UsersTable";


type StatusFilter = "ALL" | UserStatus;

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // state for dialog "New user"
  const [dialogOpen, setDialogOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  type SortOrder = "asc" | "desc";
  type SortField = "name"; 

  const parseStatus = (v: string | null): StatusFilter => {
    if (v === "ACTIVE" || v === "DISABLED" || v === "ALL") return v;
    return "ALL";
    };

    const parseSortField = (v: string | null): SortField => {
    if (v === "name") return "name";
    return "name";
    };

    const parseOrder = (v: string | null): SortOrder => {
    if (v === "asc" || v === "desc") return v;
    return "asc";
  };

  const [statusFilter, setStatusFilter] = useState<StatusFilter>(() =>
    parseStatus(searchParams.get("status"))
  );

  const [sortField, setSortField] = useState<SortField>(() =>
    parseSortField(searchParams.get("sort"))
  );

  const [sortOrder, setSortOrder] = useState<SortOrder>(() =>
    parseOrder(searchParams.get("order"))
  );

  useEffect(() => {
    const next = new URLSearchParams(searchParams);

    next.set("status", statusFilter);
    next.set("sort", sortField);
    next.set("order", sortOrder);

    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, sortField, sortOrder]);


  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
};

  const sortedUsers = [...users].sort((a, b) => {
    if (sortField === "name") {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();

      if (nameA < nameB) return sortOrder === "asc" ? -1 : 1;
      if (nameA > nameB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    }

    return 0;
  });

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
    if (statusFilter === "ALL") void loadUsers();
    else void loadUsers(statusFilter);
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

    <UsersTable
      rows={sortedUsers}
      loading={loading}
      error={error}
      sortField={sortField}
      sortOrder={sortOrder}
      onSort={handleSort}
      onOpenAudit={openUserAudit}
      onToggleStatus={handleToggleStatus}
    />
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
