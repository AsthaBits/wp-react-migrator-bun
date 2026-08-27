A template-driven migration engine that crawls existing WordPress websites, extracts content, images, and brand tokens, auto-classifies pages, and maps them to reusable modern React templates — with 100% decoupling from WordPress at runtime.


---

## 🛠 Architecture & Tech Stack

| Layer | Technologies | Purpose |
| :--- | :--- | :--- |
| **Runtime & Tooling** | Bun (1.1+) | Fast dependency management and unified dev orchestration. |
| **Backend API** | Express, Cheerio, xml2js, sanitize-html | Batched concurrent crawler, XML sitemap parser, HTML sanitizer, CSS token extractor. |
| **Frontend UI** | React, Vite, TypeScript, Tailwind CSS v4 | Live interactive dashboard, responsive device switcher, and dynamic component resolver. |
| **Icons** | Lucide React | Modern SVG icons across dashboard and template components. |

---

## Quick Start

### Prerequisites
- **[Bun](https://bun.sh/)** (version 1.1 or higher) or Node.js 20+

### Installation & Execution

Run the following commands **at the root of the project**:

```bash
# 1. Install dependencies across root, server, and client
bun install

# 2. Start both backend API (port 4000) and frontend Vite server (port 5173) simultaneously
bun run dev