"use client";
import { useEffect, useState } from "react";
import {
  Container, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip,
  Select, MenuItem, FormControl, InputLabel, Box, Button
} from "@mui/material";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJoYXJ1bnNhbmF5YXBhbGxpQGdtYWlsLmNvbSIsImV4cCI6MTc4MDYzODYxMCwiaWF0IjoxNzgwNjM3NzEwLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMDVkYTE2ZmQtYjFiYS00NmZlLTk0ODEtZTI4YjQ3ZWJlMjM1IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoicy5zYWkgc3JlZSByZWRkeSIsInN1YiI6IjdhMGI4Y2U1LTlmNzUtNDVhZi05ZjdlLTQ3NDc5MjM4NjU1NSJ9LCJlbWFpbCI6ImhhcnVuc2FuYXlhcGFsbGlAZ21haWwuY29tIiwibmFtZSI6InMuc2FpIHNyZWUgcmVkZHkiLCJyb2xsTm8iOiIyM2JxMWE1NGMzIiwiYWNjZXNzQ29kZSI6IlFRZEVZeSIsImNsaWVudElEIjoiN2EwYjhjZTUtOWY3NS00NWFmLTlmN2UtNDc0NzkyMzg2NTU1IiwiY2xpZW50U2VjcmV0IjoiRlh4amt1Y1J5Uk5tZFZOeiJ9.R9Gsac8pe-N3iot4BysgQHPITyO-l4t25VkbxU8a2e8";


interface Notification {
  ID?: string;
  Id?: string;
  Type: string;
  Message: string;
  Timestamp?: string;
  TimeStamp?: string;
}

function getWeight(type: string): number {
  switch (type.toLowerCase()) {
    case "placement": return 3;
    case "result": return 2;
    case "event": return 1;
    default: return 0;
  }
}

function getPriorityScore(n: Notification): number {
  const weight = getWeight(n.Type);
  const timestamp = n.Timestamp || n.TimeStamp || "";
  const ageMs = Date.now() - new Date(timestamp).getTime();
  return weight + 1 / (ageMs + 1);
}

export default function PriorityInbox() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [topN, setTopN] = useState(10);
  const [viewed, setViewed] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("http://4.224.186.213/evaluation-service/notifications", {
        headers: { Authorization: `Bearer ${TOKEN}` }
      });
      const data = await res.json();
      const all: Notification[] = Array.isArray(data) ? data : data.notifications || [];
      const sorted = all.sort((a, b) => getPriorityScore(b) - getPriorityScore(a));
      setNotifications(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  const markViewed = (id: string) => {
    setViewed(prev => new Set(prev).add(id));
  };

  const getChipColor = (type: string) => {
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
        🏆 Priority Inbox
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Top notifications ranked by Placement &gt; Result &gt; Event + Recency
      </Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Show Top</InputLabel>
          <Select value={topN} label="Show Top" onChange={e => setTopN(Number(e.target.value))}>
            <MenuItem value={10}>Top 10</MenuItem>
            <MenuItem value={15}>Top 15</MenuItem>
            <MenuItem value={20}>Top 20</MenuItem>
          </Select>
        </FormControl>
        <Button variant="outlined" href="/">← All Notifications</Button>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: "#1976d2" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>#</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Type</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Message</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Timestamp</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Weight</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notifications.slice(0, topN).map((n, i) => {
              const id = n.ID || n.Id || `${i}`;
              const timestamp = n.Timestamp || n.TimeStamp || "N/A";
              const isViewed = viewed.has(id);
              return (
                <TableRow
                  key={id}
                  sx={{ background: isViewed ? "white" : "#e3f2fd", cursor: "pointer" }}
                  onClick={() => markViewed(id)}
                >
                  <TableCell>{i + 1}</TableCell>
                  <TableCell sx={{ fontSize: 12, color: "#666" }}>{id}</TableCell>
                  <TableCell>
                    <Chip label={n.Type} color={getChipColor(n.Type) as any} size="small" />
                  </TableCell>
                  <TableCell><strong>{n.Message}</strong></TableCell>
                  <TableCell>{timestamp}</TableCell>
                  <TableCell>{getWeight(n.Type)}</TableCell>
                  <TableCell>
                    <Chip label={isViewed ? "Viewed" : "New"} color={isViewed ? "default" : "primary"} size="small" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}