const express = require("express");
const cfg = require("./config/env");
const { ensureUploadDir } = require("./services/storage.service");
const reviewRoutes = require("./routes/review.routes");
const { errorHandler } = require("./middleware/error-handler");

const app = express();

ensureUploadDir();
app.use(express.json());

// // Public serve uploaded files (tuỳ chọn)
// app.use("/uploads", express.static(cfg.uploadDir));

// Health check
app.get("/health", (req, res) => res.json({ ok: true }));

// API
app.use("/api", reviewRoutes);

// Error handler cuối
app.use(errorHandler);

module.exports = app;
