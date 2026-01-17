import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import { getAuditEvents, type AuditQuery } from "../api";
import type { AuditEvent } from "../types";
import AuditTable from "./AuditTable";

type Filters = {
  entityType: string;
  entityId: string;
  action: string;
  actorUserId: string;
  from: string;
  to: string;
};

const emptyFilters: Filters = {
  entityType: "",
  entityId: "",
  action: "",
  actorUserId: "",
  from: "",
  to: "",
};

const DEFAULT_ENTITY_TYPES = ["USER", "TASK", "TEAM"];

const DEFAULT_ACTIONS = [
  "USER_CREATED",
  "USER_ENABLED",
  "USER_DISABLED",
  "TASK_CREATED",
  "TASK_ASSIGNED",
  "TASK_DONE",
];

export default function AuditPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // state
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  const [rows, setRows] = useState<AuditEvent[]>([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1) прочитать URL → заполнить filters/page/pageSize
  useEffect(() => {
    const next: Filters = {
      entityType: searchParams.get("entityType") ?? "",
      entityId: searchParams.get("entityId") ?? "",
      action: searchParams.get("action") ?? "",
      actorUserId: searchParams.get("actorUserId") ?? "",
      from: searchParams.get("from") ?? "",
      to: searchParams.get("to") ?? "",
    };
    setFilters(next);

    const p = searchParams.get("page");
    const s = searchParams.get("size");
    setPage(p ? Math.max(0, parseInt(p, 10) || 0) : 0);
    setPageSize(s ? Math.max(1, parseInt(s, 10) || 20) : 20);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // 2) построить query для API
  const query: AuditQuery = useMemo(() => {
    const q: AuditQuery = { page, size: pageSize };

    if (filters.entityType) q.entityType = filters.entityType;
    if (filters.entityId) q.entityId = filters.entityId;
    if (filters.action) q.action = filters.action;
    if (filters.actorUserId) q.actorUserId = filters.actorUserId;
    if (filters.from) q.from = filters.from;
    if (filters.to) q.to = filters.to;

    return q;
  }, [filters, page, pageSize]);

  // 3) загрузка при изменении query
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getAuditEvents(query);
        if (cancelled) return;

        setRows(res.data.content);
        setTotal(res.data.totalElements);
      } catch (e) {
        if (!cancelled) setError("Failed to load audit events");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [query]);

  // helpers: применить/очистить (синхроним URL)
  const applyToUrl = (nextFilters: Filters, nextPage: number, nextSize: number) => {
    const sp = new URLSearchParams();

    if (nextFilters.entityType) sp.set("entityType", nextFilters.entityType);
    if (nextFilters.entityId) sp.set("entityId", nextFilters.entityId);
    if (nextFilters.action) sp.set("action", nextFilters.action);
    if (nextFilters.actorUserId) sp.set("actorUserId", nextFilters.actorUserId);
    if (nextFilters.from) sp.set("from", nextFilters.from);
    if (nextFilters.to) sp.set("to", nextFilters.to);

    sp.set("page", String(nextPage));
    sp.set("size", String(nextSize));

    setSearchParams(sp);
  };

  const handleApply = () => applyToUrl(filters, 0, pageSize);
  const handleClear = () => applyToUrl(emptyFilters, 0, pageSize);

  // controlled callbacks для таблицы:
  const handlePageChange = (nextPage: number) => applyToUrl(filters, nextPage, pageSize);
  const handlePageSizeChange = (nextSize: number) => applyToUrl(filters, 0, nextSize);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box>
        <Typography variant="h1" sx={{ fontSize: 28, mb: 0.5 }}>
          Audit
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Track important system actions. Use filters to narrow down events.
        </Typography>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap alignItems="center">
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Entity type</InputLabel>
            <Select
              label="Entity type"
              value={filters.entityType}
              onChange={(e) => setFilters((p) => ({ ...p, entityType: e.target.value }))}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {DEFAULT_ENTITY_TYPES.map((a) => (
                <MenuItem key={a} value={a}>
                  {a}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Entity id"
            size="small"
            value={filters.entityId}
            onChange={(e) => setFilters((p) => ({ ...p, entityId: e.target.value }))}
          />
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Action</InputLabel>
            <Select
              label="Action"
              value={filters.action}
              onChange={(e) => setFilters((p) => ({ ...p, action: e.target.value }))}
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
            label="Actor user id"
            size="small"
            value={filters.actorUserId}
            onChange={(e) => setFilters((p) => ({ ...p, actorUserId: e.target.value }))}
          />

          <Box sx={{ flexGrow: 1 }} />

          <Button variant="outlined" onClick={handleClear}>
            Clear
          </Button>
          <Button variant="contained" onClick={handleApply}>
            Apply
          </Button>
        </Stack>
      </Paper>

      <AuditTable
        rows={rows}
        loading={loading}
        error={error}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </Box>
  );
}