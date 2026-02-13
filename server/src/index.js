import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";

import { authRouter } from "./routes/auth.js";
import { applicationsRouter } from "./routes/applications.js";
import { analyticsRouter } from "./routes/analytics.js";
import { requireAuth } from "./middleware/requireAuth.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/jobhunt";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRouter);
app.use("/api/applications", requireAuth, applicationsRouter);
app.use("/api/analytics", requireAuth, analyticsRouter);

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`API listening on :${PORT}`));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
