import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "./models/User.js";
import { Application } from "./models/Application.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/jobhunt";

async function run() {
  await mongoose.connect(MONGODB_URI);

  const email = "demo@jobhunt.dev";
  const password = "Demo123!";
  let user = await User.findOne({ email });

  if (!user) {
    const passwordHash = await bcrypt.hash(password, 12);
    user = await User.create({ email, passwordHash });
    console.log("Created demo user:", email);
  } else {
    console.log("Demo user already exists:", email);
  }

  const userId = user._id.toString();
  const existing = await Application.countDocuments({ userId });
  if (existing === 0) {
    await Application.create([
      { userId, company: "Acme Co", role: "Junior Full-Stack Developer", location: "Sydney", status: "APPLIED", link: "https://example.com" },
      { userId, company: "Example Pty", role: "React Developer", location: "Melbourne", status: "INTERVIEW", nextActionAt: new Date(Date.now()+3*24*60*60*1000) },
      { userId, company: "Startup X", role: "Node.js Developer", location: "Brisbane", status: "REJECTED" }
    ]);
    console.log("Seeded sample applications.");
  } else {
    console.log("Applications already exist, skipping seed.");
  }

  await mongoose.disconnect();
  console.log("Done.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
