const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    // Set deployment time on first start if not set
    initDeploymentTime();
  })
  .catch((err) => console.error("MongoDB error:", err));

const initDeploymentTime = async () => {
  const Config = require("./models/Config");
  const now = new Date();
  const existing = await Config.findOne({ key: "deploymentTime" });

  if (!existing) {
    // Very first run ever
    await Config.create({ key: "deploymentTime", value: now.toISOString() });
    console.log("[TIMER] First start — timer set to:", now.toISOString());
    return;
  }

  const diffMinutes = (now - new Date(existing.value)) / (1000 * 60);

  if (diffMinutes > 20) {
    // Previous window already expired — this is a fresh deployment, reset the timer
    await Config.findOneAndUpdate(
      { key: "deploymentTime" },
      { value: now.toISOString() },
    );
    console.log(
      "[TIMER] Fresh deployment — timer reset to:",
      now.toISOString(),
    );
  } else {
    // Still within an active window — do NOT reset, preserve remaining time
    const remaining = Math.ceil(20 - diffMinutes);
    console.log(
      `[TIMER] Server restarted within active window — ${remaining} min remaining, timer unchanged.`,
    );
  }
};

// Routes
app.use("/api/config", require("./routes/config"));
app.use("/api/resume", require("./routes/resume"));
app.use("/api/admin", require("./routes/admin"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// nodemon trigger
