import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import type { User } from "../types";
import { useAuth } from "../../../core/auth/AuthContext";
import { canManageUsers } from "../../../core/auth/permissions";

type UsersTableProps = {
  rows: User[];
  loading: boolean;
  error: string | null;

  sortField: "name";
  sortOrder: "asc" | "desc";

  onSort: (field: "name") => void;
  onOpenAudit: (userId: number) => void;
  onToggleStatus: (user: User) => void;

  height?: number | string; // чтобы ты мог делать full-height
};

const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
};

export default function UsersTable({
  rows = [],
  loading,
  error,
  sortField,
  sortOrder,
  onSort,
  onOpenAudit,
  onToggleStatus,
  height = "100%",
}: UsersTableProps) {

  const { user: currentUser } = useAuth();
  const isAdmin = canManageUsers(currentUser?.role as any);

  return (
    <Paper variant="outlined" sx={{ overflow: "hidden", flexGrow: 1, height }}>
      <TableContainer sx={{ height: "100%", overflowY: "auto" }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sortDirection={sortField === "name" ? sortOrder : false}>
                <TableSortLabel
                  active={sortField === "name"}
                  direction={sortField === "name" ? sortOrder : "asc"}
                  onClick={() => onSort("name")}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
                    <CircularProgress size={18} />
                    <Typography variant="body2" color="text.secondary">
                      Loading…
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}

            {error && !loading && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Alert severity="error">{error}</Alert>
                </TableCell>
              </TableRow>
            )}

            {!loading && !error && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                    No users found for the selected filter.
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              !error &&
              rows.map((user) => (
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
                      sx={{ height: 22 }}
                    />
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">{formatDate(user.createdAt)}</Typography>
                  </TableCell>

                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      <Tooltip title="View audit">
                        <IconButton size="small" onClick={() => onOpenAudit(user.id)}>
                          <ReceiptLongOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      
                      
                      {isAdmin && (
                        <Tooltip title={user.status === "ACTIVE" ? "Disable user" : "Enable user"}>
                          <IconButton size="small" onClick={() => onToggleStatus(user)}>
                            {user.status === "ACTIVE" ? (
                              <BlockOutlinedIcon fontSize="small" />
                            ) : (
                              <CheckCircleOutlineOutlinedIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Tooltip>
                      )}

                      {/* <Tooltip title={user.status === "ACTIVE" ? "Disable user" : "Enable user"}>
                        <IconButton size="small" onClick={() => onToggleStatus(user)}>
                          {user.status === "ACTIVE" ? (
                            <BlockOutlinedIcon fontSize="small" />
                          ) : (
                            <CheckCircleOutlineOutlinedIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip> */}

                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
