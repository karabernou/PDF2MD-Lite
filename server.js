const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3456;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Recursively collect PDF files from a directory
function collectPdfs(dir, baseDir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(collectPdfs(fullPath, baseDir));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".pdf")) {
      results.push(path.relative(baseDir, fullPath));
    }
  }
  return results;
}

// Scan a directory (and subfolders) for PDF files
app.post("/api/scan", (req, res) => {
  const { pdfDir } = req.body;

  if (!pdfDir) {
    return res.status(400).json({ error: "pdfDir is required" });
  }

  const resolvedDir = path.resolve(pdfDir);

  if (!fs.existsSync(resolvedDir)) {
    return res.status(400).json({ error: `Directory not found: ${resolvedDir}` });
  }

  try {
    const files = collectPdfs(resolvedDir, resolvedDir).sort();
    res.json({ dir: resolvedDir, files });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Batch convert PDFs to Markdown using SSE
app.post("/api/convert", async (req, res) => {
  const { pdfDir, mdDir, files } = req.body;

  if (!pdfDir || !files || !files.length) {
    return res.status(400).json({ error: "pdfDir and files are required" });
  }

  const resolvedPdfDir = path.resolve(pdfDir);
  const resolvedMdDir = path.resolve(mdDir || pdfDir);

  // Create output directory if needed
  if (!fs.existsSync(resolvedMdDir)) {
    fs.mkdirSync(resolvedMdDir, { recursive: true });
  }

  // Set up SSE headers
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  // Dynamically import pdf2md (ESM module)
  let pdf2md;
  try {
    const mod = await import("@opendocsg/pdf2md");
    pdf2md = mod.default;
  } catch (err) {
    res.write(
      `data: ${JSON.stringify({ type: "fatal", error: "Failed to load pdf2md library: " + err.message })}\n\n`
    );
    res.end();
    return;
  }

  // Send initial status
  for (const file of files) {
    res.write(`data: ${JSON.stringify({ type: "status", file, status: "pending" })}\n\n`);
  }

  // Convert each file sequentially
  for (const file of files) {
    const pdfPath = path.join(resolvedPdfDir, file);
    const mdName = file.replace(/\.pdf$/i, ".md");
    const mdPath = path.join(resolvedMdDir, mdName);

    try {
      res.write(`data: ${JSON.stringify({ type: "status", file, status: "converting" })}\n\n`);

      const pdfBuffer = fs.readFileSync(pdfPath);
      const markdown = await pdf2md(pdfBuffer.buffer);

      // Ensure subdirectory exists in output folder
      const mdParent = path.dirname(mdPath);
      if (!fs.existsSync(mdParent)) {
        fs.mkdirSync(mdParent, { recursive: true });
      }

      fs.writeFileSync(mdPath, markdown, "utf-8");

      res.write(`data: ${JSON.stringify({ type: "status", file, status: "converted" })}\n\n`);
    } catch (err) {
      res.write(
        `data: ${JSON.stringify({ type: "status", file, status: "error", error: err.message })}\n\n`
      );
    }
  }

  res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
  res.end();
});

app.listen(PORT, () => {
  console.log(`\n  ⚡ PDF2MD Lite running at http://localhost:${PORT}\n`);
});
