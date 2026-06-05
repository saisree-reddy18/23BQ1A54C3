"use client";
import { useEffect, useState } from "react";
import {
  Container, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip,
  Select, MenuItem, FormControl, InputLabel, Pagination,
  Box, Button, Stack
} from "@mui/material";

const API = "http://4.224.186.213/evaluation-service/notifications";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJoYXJ1bnNhbmF5YXBhbGxpQGdtYWlsLmNvbSIsImV4cCI6MTc4MDYzODYxMCwiaWF0IjoxNzgwNjM3NzEwLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMDVkYTE2ZmQtYjFiYS00NmZlLTk0ODEtZTI4YjQ3ZWJlMjM1IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoicy5zYWkgc3JlZSByZWRkeSIsInN1YiI6IjdhMGI4Y2U1LTlmNzUtNDVhZi05ZjdlLTQ3NDc5MjM4NjU1NSJ9LCJlbWFpbCI6ImhhcnVuc2FuYXlhcGFsbGlAZ21haWwuY29tIiwibmFtZSI6InMuc2FpIHNyZWUgcmVkZHkiLCJyb2xsTm8iOiIyM2JxMWE1NGMzIiwiYWNjZXNzQ29kZSI6IlFRZEVZeSIsImNsaWVudElEIjoiN2EwYjhjZTUtOWY3NS00NWFmLTlmN2UtNDc0NzkyMzg2NTU1IiwiY2xpZW50U2VjcmV0IjoiRlh4amt1Y1J5Uk5tZFZOeiJ9.R9Gsac8pe-N3iot4BysgQHPITyO-l4t25VkbxU8a2e8";

interface Notification {
  ID?: string;
  Id?: string;
  Type: string;
  Message: string;
  Timestamp?: string;
  TimeStamp?: string;
}

export default function Home() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [viewed, setViewed] = useState<Set<string>>(new Set());
  const limit = 5;

  useEffect(() => {
    fetchNotifications();
  }, [filter, page]);

  const fetchNotifications = async () => {
    try {
      let url = `${API}?limit=${limit}&page=${page}`;
      if (filter !== "All") url += `&notification_type=${filter}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${TOKEN}` }
      });
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : data.notifications || []);
    } catch (err) {
      console.error(err);
    }
  };

  const markViewed = (id: string) => {
    setViewed(prev => new Set(prev).add(id));
  };

  const getChipColor = (type: string): "error" | "warning" | "success" | "default" => {
    switch (type.toLowerCase()) {
      case "placement": return "error";
      case "result": return "warning";
      case "event": return "success";
      default: return "default";
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={1}>
        📬 Campus Notifications
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        All notifications — blue rows are unread, click to mark as viewed
      </Typography>

<Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Filter by Type</InputLabel>
          <Select value={filter} label="Filter by Type" onChange={e => { setFilter(e.target.value); setPage(1); }}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
        </FormControl>
        <Button variant="outlined" href="/priority-inbox">View Priority Inbox →</Button>
      </Stack>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: "#1976d2" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>#</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Type</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Message</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Timestamp</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notifications.map((n, i) => {
              const id = n.ID || n.Id || `${i}`;
              const timestamp = n.Timestamp || n.TimeStamp || "N/A";
              const isViewed = viewed.has(id);
              return (
                <TableRow
                  key={id}
                  sx={{ background: isViewed ? "white" : "#e3f2fd", cursor: "pointer" }}
                  onClick={() => markViewed(id)}
                >
                  <TableCell>{(page - 1) * limit + i + 1}</TableCell>
                  <TableCell sx={{ fontSize: 12, color: "#666" }}>{id}</TableCell>
                  <TableCell>
                    <Chip label={n.Type} color={getChipColor(n.Type)} size="small" />
                  </TableCell>
                  <TableCell><strong>{n.Message}</strong></TableCell>
                  <TableCell>{timestamp}</TableCell>
                  <TableCell>
                    <Chip label={isViewed ? "Viewed" : "New"} color={isViewed ? "default" : "primary"} size="small" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack alignItems="center" mt={3}>
        <Pagination count={10} page={page} onChange={(_, v) => setPage(v)} color="primary" />
      </Stack>
    </Container>
  );
}