import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tooltip,
} from "@mui/material";
import type { AuditEvent, Page } from "../types";
import { getAudit } from "../api";

const DEFAULT_ENTITY_TYPES = ["USER", "TASK", "TEAM"];
const DEFAULT_ACTIONS = [
  "USER_CREATED",
  "USER_ENABLED",
  "USER_DISABLED",
  "TASK_CREATED",
  "TASK_ASSIGNED",
  "TASK_DONE",
];

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString();
}

function actionChipColor(action: string):
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error" {
  if (action.includes("CREATED")) return "primary";
  if (action.includes("ENABLED")) return "success";
  if (action.includes("DISABLED")) return "warning";
  if (action.includes("DONE")) return "success";
  return "default";
}

const AuditPage = () => {
  const [data, setData] = useState<Page<AuditEvent> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // filters
  const [entityType, setEntityType] = useState<string>("USER");
  const [entityId, setEntityId] = useState<string>("");
  const [action, setAction] = useState<string>("");
  const [actorUserId, setActorUserId] = useState<string>("");

  // pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const query = useMemo(() => {
    const q: any = {
      page,
      size: rowsPerPage,
    };

    if (entityType) q.entityType = entityType;
    if (entityId.trim()) q.entityId = entityId.trim();
    if (action) q.action = action;
    if (actorUserId.trim()) q.actorUserId = Number(actorUserId.trim());

    return q;
  }, [entityType, entityId, action, actorUserId, page, rowsPerPage]);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAudit(query);
      setData(res.data);
    } catch (e: any) {
      setError("Failed to load audit events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const events = data?.content ?? [];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      {/* Header */}
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          Audit log
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Track important system actions. Use filters to narrow down events.
        </Typography>
      </Box>

      {/* Filters */}
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", md: "center" }}
        >
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Entity</InputLabel>
            <Select
              label="Entity"
              value={entityType}
              onChange={(e) => {
                setPage(0);
                setEntityType(e.target.value);
              }}
            >
              {DEFAULT_ENTITY_TYPES.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            size="small"
            label="Entity ID"
            placeholder="e.g. 4"
            value={entityId}
            onChange={(e) => {
              setPage(0);
              setEntityId(e.target.value);
            }}
            sx={{ width: { xs: "100%", md: 180 } }}
          />

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Action</InputLabel>
            <Select
              label="Action"
              value={action}
              onChange={(e) => {
                setPage(0);
                setAction(e.target.value);
              }}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {DEFAULT_ACTIONS.map((a) => (
                <MenuItem key={a} value={a}>
                  {a}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            size="small"
            label="Actor user ID"
            placeholder="e.g. 1"
            value={actorUserId}
            onChange={(e) => {
              setPage(0);
              setActorUserId(e.target.value);
            }}
            sx={{ width: { xs: "100%", md: 160 } }}
          />

          <Box sx={{ flexGrow: 1 }} />

          <Typography variant="caption" color="text.secondary">
            {data ? `${data.totalElements} events` : "—"}
          </Typography>
        </Stack>
      </Paper>

      {/* States */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Table */}
      <Paper variant="outlined" sx={{ overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 560 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 180 }}>Time</TableCell>
                <TableCell sx={{ width: 200 }}>Action</TableCell>
                <TableCell sx={{ width: 160 }}>Entity</TableCell>
                <TableCell>Summary</TableCell>
                <TableCell sx={{ width: 140 }} align="right">
                  Actor
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Box sx={{ py: 3, display: "flex", justifyContent: "center" }}>
                      <CircularProgress size={22} />
                    </Box>
                  </TableCell>
                </TableRow>
              ) : events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Box sx={{ py: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        No audit events found for the selected filters.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                events.map((e) => (
                  <TableRow key={e.id} hover>
                    <TableCell>
                      <Typography variant="body2">{formatDateTime(e.occurredAt)}</Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={e.action}
                        color={actionChipColor(e.action)}
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip size="small" label={e.entityType} variant="outlined" />
                        <Typography variant="body2" color="text.secondary">
                          #{e.entityId}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">{e.summary}</Typography>
                      {e.metadata && e.metadata !== "{}" ? (
                        <>
                          <Divider sx={{ my: 0.75 }} />
                          <Tooltip title="Raw metadata JSON">
                            <Typography
                              variant="caption"
                              sx={{
                                fontFamily: "monospace",
                                color: "text.secondary",
                                display: "inline-block",
                                maxWidth: "100%",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "help",
                              }}
                            >
                              {e.metadata}
                            </Typography>
                          </Tooltip>
                        </>
                      ) : null}
                    </TableCell>

                    <TableCell align="right">
                      <Typography variant="body2" color="text.secondary">
                        {e.actorUserId ?? "—"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={data?.totalElements ?? 0}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 20, 50, 100]}
        />
      </Paper>
    </Box>
  );
};

export default AuditPage;
