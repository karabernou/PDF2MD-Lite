# PDF2MD Lite

> Convert your PDF documents into clean, structured Markdown — ready for AI ingestion, RAG pipelines, LLM fine-tuning, and knowledge base systems.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)

---

## ✨ Features

- **Batch conversion** — Convert entire folders of PDFs to Markdown in one click
- **Recursive scanning** — Automatically discovers PDFs in nested subdirectories
- **Real-time progress** — Server-Sent Events stream live status updates per file
- **Smart defaults** — Leave the output directory empty to save `.md` files alongside your PDFs
- **Offline-ready** — Runs entirely on your local machine, no cloud services required
- **Modern UI** — Dark-themed, responsive web interface with glassmorphism design

---

## 📋 Prerequisites

- **[Node.js](https://nodejs.org/)** v18 or later

---

## 🚀 Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/pdf2md-lite.git
cd pdf2md-lite

# 2. Install dependencies
npm install

# 3. Start the server
npm run dev
```

The app will be available at **http://localhost:3456**.

---

## 📖 Usage

1. Open **http://localhost:3456** in your browser.
2. Enter the path to a folder containing PDF files.
3. *(Optional)* Enter an output directory for the Markdown files.
   - If left empty, `.md` files are saved in the same folder as the PDFs.
4. Click **Scan** to discover PDF files.
5. Click **Batch Convert** to start the conversion.

Each file's status updates in real time: `pending` → `converting` → `converted` (or `error`).

---

## 🗂 Project Structure

```
pdf2md-lite/
├── public/
│   ├── fonts/          # Inter font files
│   └── index.html      # Single-page web interface
├── server.js           # Express server + conversion API
├── package.json
├── LICENSE
└── README.md
```

---

## ⚙️ Configuration

| Option | Description | Default |
|---|---|---|
| **PDF Directory** | Path to the folder containing `.pdf` files | *(required)* |
| **Output Directory** | Path where `.md` files are written | Same as PDF directory |
| **Port** | Server port | `3456` |

To change the port, edit the `PORT` constant in `server.js`.

---

## 🛠 Tech Stack

- **[Express](https://expressjs.com/)** — Lightweight web server
- **[@opendocsg/pdf2md](https://github.com/nicholasgasior/goffern)** — PDF-to-Markdown conversion engine
- **Server-Sent Events (SSE)** — Real-time streaming of conversion progress
- **Vanilla HTML/CSS/JS** — Zero frontend dependencies

---

## 📝 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

You are free to use, modify, and distribute this software for any purpose.
