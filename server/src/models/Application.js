import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  location: { type: String, default: "" },
  link: { type: String, default: "" },
  salaryRange: { type: String, default: "" },
  status: { type: String, enum: ["APPLIED","INTERVIEW","OFFER","REJECTED"], default: "APPLIED" },
  nextActionAt: { type: Date, default: null },
  notes: { type: String, default: "" }
}, { timestamps: true });

export const Application = mongoose.model("Application", ApplicationSchema);
