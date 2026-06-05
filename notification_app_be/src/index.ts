import express from "express";
import { Log } from "C:/23BQ1A54C3/23BQ1A54C3/logging-middleware/src/index";

const app = express();
const PORT = 3000;

interface Notification {
  Id?: string;
  ID?: string;
  Type: string;
  Message: string;
  Timestamp?: string;
  TimeStamp?: string;
}

const notifications: Notification[] = [
  { Id: "d146095a-0d86-4a34-9e69-3900a14576bc", Type: "Result", Message: "mid-sem", Timestamp: "2026-04-22 17:51:30" },
  { Id: "b283218f-ea5a-4b7c-93a9-1f2f240d64b0", Type: "Placement", Message: "CSX Corporation hiring", Timestamp: "2026-04-22 17:51:18" },
  { Id: "81589ada-0ad3-4f77-9554-f52fb558e09d", Type: "Event", Message: "farewell", Timestamp: "2026-04-22 17:51:06" },
  { ID: "0005513a-142b-4bbc-8678-eefec65e1ede", Type: "Result", Message: "mid-sem", TimeStamp: "2026-04-22 17:50:54" },
  { ID: "e5c4ff20-31bf-4d40-8f02-72fda59e8918", Type: "Result", Message: "project-review", Timestamp: "2026-04-22 17:50:42" },
  { ID: "ea836726-c25e-4f21-a72f-544a6af8a37f", Type: "Result", Message: "project-review", Timestamp: "2026-04-22 17:50:42" },
  { ID: "003cb427-8fc6-47f7-bb00-be228f6b0d2c", Type: "Result", Message: "external", Timestamp: "2026-04-22 17:50:30" },
  { ID: "1cfc5ee-ad37-4894-8946-d707627176a5", Type: "Event", Message: "tech-fest", Timestamp: "2026-04-22 17:50:06" },
  { ID: "cf2885a6-45ac-4ba0-b548-6e9e9d4c52c8", Type: "Result", Message: "project-review", Timestamp: "2026-04-22 17:49:54" },
  { ID: "8a7412bd-6065-4d09-8501-a37f11cc848b", Type: "Placement", Message: "Advanced Micro Devices Inc. hiring", Timestamp: "2026-04-22 17:49:42" }
];

function getWeight(type: string): number {
  switch (type.toLowerCase()) {
    case "placement": return 3;
    case "result":    return 2;
    case "event":     return 1;
    default:          return 0;
  }
}

function getPriorityScore(notification: Notification): number {
  const weight = getWeight(notification.Type);
  const timestamp = notification.Timestamp || notification.TimeStamp || "";
  const ageMs = Date.now() - new Date(timestamp).getTime();
  const recency = 1 / (ageMs + 1);
  return weight + recency;
}

function getBadge(type: string): string {
  switch (type.toLowerCase()) {
    case "placement": return `<span style="background:#ff4757;color:white;padding:3px 10px;border-radius:20px;font-size:12px;">🔴 Placement</span>`;
    case "result":    return `<span style="background:#ffa502;color:white;padding:3px 10px;border-radius:20px;font-size:12px;">🟡 Result</span>`;
    case "event":     return `<span style="background:#2ed573;color:white;padding:3px 10px;border-radius:20px;font-size:12px;">🟢 Event</span>`;
    default:          return type;
  }
}

app.get("/priority-inbox", (req, res) => {
  const n = parseInt(req.query.n as string) || 10;

  Log("backend", "info", "notification_app_be",
    `Priority inbox requested for top ${n} notifications`);

  const sorted = [...notifications].sort((a, b) =>
    getPriorityScore(b) - getPriorityScore(a)
  );

  const topN = sorted.slice(0, n);

  Log("backend", "info", "notification_app_be",
    `Returning top ${topN.length} priority notifications`);

  const rows = topN.map((notif, index) => {
    const id = notif.ID || notif.Id || "N/A";
    const timestamp = notif.Timestamp || notif.TimeStamp || "N/A";
    return `
      <tr>
        <td>${index + 1}</td>
        <td style="font-size:12px;color:#666;">${id}</td>
        <td>${getBadge(notif.Type)}</td>
        <td><strong>${notif.Message}</strong></td>
        <td>${timestamp}</td>
        <td>${getWeight(notif.Type)}</td>
      </tr>`;
  }).join("");

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Priority Inbox</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f2f5; padding: 30px; }
        h1 { color: #333; margin-bottom: 5px; }
        p { color: #888; margin-bottom: 20px; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; background: white;
                border-radius: 12px; overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        th { background: #4a90e2; color: white; padding: 14px 16px; text-align: left; font-size: 14px; }
        td { padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #f9f9f9; }
      </style>
    </head>
    <body>
      <h1>📬 Campus Notification Priority Inbox</h1>
      <p>Showing top ${topN.length} notifications ranked by Priority (Placement > Result > Event) + Recency</p>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Type</th>
            <th>Message</th>
            <th>Timestamp</th>
            <th>Weight</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  Log("backend", "info", "notification_app_be",
    `Server started on port ${PORT}`);
  console.log(`Server running on http://localhost:${PORT}`);
});