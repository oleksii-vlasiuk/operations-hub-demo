import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Chip,
  Tooltip,
} from "@mui/material";

export type AuditEvent = {
  id: number;
  occurredAt: string;
  entityType: string;
  entityId: string;
  action: string;
  summary: string;
  actorEmail?: string | null;
};

type AuditTableProps = {
  rows: AuditEvent[];
  loading: boolean;
  error: string | null;

  page: number;
  pageSize: number;
  total: number;

  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;

  maxHeight?: number;
  hidePagination?: boolean;
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function AuditTable({
  rows = [],
  loading,
  error,
  page,
  pageSize,
  total = 1,
  onPageChange,
  onPageSizeChange,
  maxHeight = 520,
  hidePagination = false,
}: AuditTableProps) {
  return (
    <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
      <TableContainer sx={{ maxHeight, overflowY: "auto" }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell width={170}>Time</TableCell>
              <TableCell width={160}>Entity</TableCell>
              <TableCell width={210}>Action</TableCell>
              <TableCell>Summary</TableCell>
              <TableCell width={160}>Actor</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
                    <CircularProgress size={18} />
                    <Typography variant="body2" color="text.secondary">
                      Loading audit…
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}

            {error && !loading && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Alert severity="error">{error}</Alert>
                </TableCell>
              </TableRow>
            )}

            {!loading && !error && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                    No audit events found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              !error &&
              rows.map((ev) => (
                <TableRow key={ev.id} hover>
                  <TableCell>
                    <Typography variant="body2">{formatDate(ev.occurredAt)}</Typography>
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap" }}>
                      <Chip size="small" label={ev.entityType} variant="outlined" />
                      <Typography variant="caption" color="text.secondary">
                        #{ev.entityId}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Tooltip title={ev.action}>
                      <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                        {ev.action}
                      </Typography>
                    </Tooltip>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">{ev.summary}</Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {ev.actorEmail ?? "System"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {!hidePagination && (
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, next) => onPageChange(next)}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
          rowsPerPageOptions={[10, 20, 50, 100]}
        />
      )}
    </Paper>
  );
}
