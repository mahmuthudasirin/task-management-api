const express = require("express");
const cors = require("cors");
const { logger } = require("./middleware/logger");
const { notFound } = require("./middleware/notFound");
const { errorHandler } = require("./middleware/errorHandler");
const apiRoutes = require("./routes");

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(logger);

  app.get("/health", (req, res) => {
    res.json({
      success: true,
      message: "API çalışıyor",
      timestamp: new Date().toISOString(),
    });
  });

  app.use("/api", apiRoutes);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
