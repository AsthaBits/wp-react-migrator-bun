import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { crawlWordPress } from "./crawler.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.post("/api/import", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ message: "Website URL is required." });
    }

    const result = await crawlWordPress(url);
    res.json(result);
  } catch (error) {
    console.error("Import error:", error);
    res.status(500).json({
      message: error.message || "Unable to import website.",
      hint: "The site may block bot requests, require JavaScript rendering, or expose a non-standard sitemap.",
    });
  }
});

// Confirm & complete endpoint (persists final config and pages to disk)
app.post("/api/confirm", async (req, res) => {
  try {
    const { pages, config } = req.body;
    if (!pages || !config) {
      return res.status(400).json({ message: "pages and config are required." });
    }

    const exportsDir = path.join(process.cwd(), "exports");
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    const timestamp = Date.now();
    const contentPath = path.join(exportsDir, `content-${timestamp}.json`);
    const configPath = path.join(exportsDir, `site-config-${timestamp}.json`);
    const latestContentPath = path.join(exportsDir, "content.json");
    const latestConfigPath = path.join(exportsDir, "site-config.json");

    fs.writeFileSync(contentPath, JSON.stringify(pages, null, 2), "utf8");
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf8");
    fs.writeFileSync(latestContentPath, JSON.stringify(pages, null, 2), "utf8");
    fs.writeFileSync(latestConfigPath, JSON.stringify(config, null, 2), "utf8");

    res.json({
      ok: true,
      message: "Migration state successfully confirmed and written to disk.",
      savedAt: new Date().toISOString(),
      files: {
        contentJson: latestContentPath,
        siteConfigJson: latestConfigPath,
        versioned: [contentPath, configPath],
      },
    });
  } catch (error) {
    console.error("Export save error:", error);
    res.status(500).json({ message: "Failed to write migration files to disk.", error: error.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Migration API running at http://localhost:${PORT}`);
});