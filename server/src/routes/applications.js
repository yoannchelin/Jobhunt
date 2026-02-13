import { Router } from "express";
import { z } from "zod";
import { Application } from "../models/Application.js";

export const applicationsRouter = Router();

const AppSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  location: z.string().optional().default(""),
  link: z.string().optional().default(""),
  salaryRange: z.string().optional().default(""),
  status: z.enum(["APPLIED","INTERVIEW","OFFER","REJECTED"]).optional().default("APPLIED"),
  nextActionAt: z.string().datetime().nullable().optional().default(null),
  notes: z.string().optional().default("")
});

applicationsRouter.get("/", async (req, res) => {
  const apps = await Application.find({ userId: req.user.sub }).sort({ updatedAt: -1 });
  res.json({ items: apps });
});

applicationsRouter.post("/", async (req, res) => {
  const parsed = AppSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid payload" });

  const data = parsed.data;
  const created = await Application.create({
    userId: req.user.sub,
    ...data,
    nextActionAt: data.nextActionAt ? new Date(data.nextActionAt) : null
  });
  res.status(201).json({ item: created });
});

applicationsRouter.put("/:id", async (req, res) => {
  const parsed = AppSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid payload" });

  const update = parsed.data;
  if (update.nextActionAt !== undefined) {
    update.nextActionAt = update.nextActionAt ? new Date(update.nextActionAt) : null;
  }

  const item = await Application.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.sub },
    update,
    { new: true }
  );
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json({ item });
});

applicationsRouter.delete("/:id", async (req, res) => {
  const deleted = await Application.findOneAndDelete({ _id: req.params.id, userId: req.user.sub });
  if (!deleted) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});
