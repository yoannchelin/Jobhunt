import { Router } from "express";
import { Application } from "../models/Application.js";

export const analyticsRouter = Router();

analyticsRouter.get("/summary", async (req, res) => {
  const userId = req.user.sub;
  const items = await Application.find({ userId }).select("status createdAt updatedAt nextActionAt");
  const counts = { APPLIED:0, INTERVIEW:0, OFFER:0, REJECTED:0 };
  for (const it of items) counts[it.status] = (counts[it.status] || 0) + 1;

  const total = items.length;
  const interviews = counts.INTERVIEW + counts.OFFER;
  const offerRate = total ? (counts.OFFER / total) : 0;
  const interviewRate = total ? (interviews / total) : 0;

  res.json({
    total,
    counts,
    interviewRate,
    offerRate
  });
});
