import express from "express";
import cors from "cors";
import { portfolioData } from "./data/portfolioData.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "Portfolio server is running" });
});

app.get("/api/portfolio", (_req, res) => {
  res.json(portfolioData);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
