import React, { useMemo, useState } from "react";
import { Globe, Download, RefreshCw, CheckCircle2, AlertTriangle } from "lucide-react";
import type { Page, MigrationResult } from "./type";
import { ImportForm } from "./components/ImportForm";
import { Dashboard } from "./components/Dashboard";
import { PageList } from "./components/PageList";
import { TemplatePicker } from "./components/TemplatePicker";
import { Preview } from "./components/Preview";
import { Branding } from "./components/Branding";
import { ConfigViewer } from "./components/ConfigViewer";

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function App() {
  const [url, setUrl] = useState("https://example.com");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MigrationResult | null>(null);
  const [selectedPath, setSelectedPath] = useState<string>("");
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [error, setError] = useState("");
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  async function importSite() {
    setLoading(true);
    setError("");
    setExportNotice(null);
    try {
      const res = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Website import failed");

      setResult(data);
      const homePage = data.pages.find((p: Page) => p.type === "home") || data.pages[0];
      setSelectedPath(homePage?.path || "");
    } catch (err: any) {
      setError(err.message || "Failed to communicate with import backend.");
    } finally {
      setLoading(false);
    }
  }

  function updateTemplate(path: string, template: string) {
    if (!result) return;
    setResult({
      ...result,
      pages: result.pages.map((p) => (p.path === path ? { ...p, template } : p)),
      config: {
        ...result.config,
        templates: { ...result.config.templates, [path]: template },
      },
    });
  }

  async function confirmMigration() {
    if (!result) return;
    setIsExporting(true);
    try {
      // 1. Persist to server disk via /api/confirm
      const res = await fetch("/api/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pages: result.pages, config: result.config }),
      });
      const data = await res.json();

      // 2. Download JSON client-side
      downloadJson("content.json", result.pages);
      downloadJson("site-config.json", result.config);

      setExportNotice(
        `Migration confirmed at ${new Date().toLocaleTimeString()}. Saved to server (${data.savedAt || "disk"}) and downloaded client-side.`
      );
    } catch (err: any) {
      // Fallback: download client-side even if server write fails
      downloadJson("content.json", result.pages);
      downloadJson("site-config.json", result.config);
      setExportNotice(`Downloaded client-side at ${new Date().toLocaleTimeString()}.`);
    } finally {
      setIsExporting(false);
    }
  }

  const selectedPage = useMemo(() => {
    if (!result) return undefined;
    return result.pages.find((p) => p.path === selectedPath) || result.pages[0];
  }, [result, selectedPath]);

  return (
    <div className="min-h-screen pb-16">
      <header className="border-b border-slate-200 bg-white shadow-xs sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-900 p-2 text-white shadow-xs">
              <Globe size={20} />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-base">WP → React Migrator</div>
              <div className="text-xs text-slate-500">Full Template Resolution Engine</div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {!result ? (
          <ImportForm
            url={url}
            setUrl={setUrl}
            loading={loading}
            error={error}
            onImport={importSite}
          />
        ) : (
          <div className="space-y-6">
            <Dashboard stats={result.stats} sitemap={result.sitemap} />

            <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
              <aside className="space-y-4">
                <PageList
                  pages={result.pages}
                  selectedPath={selectedPath}
                  onSelect={setSelectedPath}
                />

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                  <div className="mb-2 font-bold text-slate-800 text-xs uppercase tracking-wider">
                    Workflow Progress
                  </div>
                  {[
                    "Sitemap discovered",
                    "Content extracted",
                    "Branding parsed",
                    "Templates mapped",
                    "Preview ready",
                  ].map((step) => (
                    <div key={step} className="flex items-center gap-2 py-1.5 text-xs text-slate-700 font-medium">
                      <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                      {step}
                    </div>
                  ))}
                </div>
              </aside>

              <section className="space-y-6">
                <TemplatePicker
                  page={selectedPage}
                  onSelectTemplate={(templateId) => {
                    if (selectedPage) updateTemplate(selectedPage.path, templateId);
                  }}
                />

                <Preview
                  page={selectedPage}
                  device={device}
                  setDevice={setDevice}
                  config={result.config}
                  onNavigate={setSelectedPath}
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <Branding config={result.config} />
                  <ConfigViewer config={result.config} />
                </div>

                {result.failures.length > 0 && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 flex items-start gap-2.5">
                    <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                    <div>
                      <b>{result.failures.length} Page(s) could not be parsed:</b> Some pages may be protected by Cloudflare or require client-side execution.
                    </div>
                  </div>
                )}

                {/* Confirm & Export Actions */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={confirmMigration}
                    disabled={isExporting}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                    <Download size={16} />
                    {isExporting ? "Persisting..." : "Confirm & Export Migration"}
                  </button>

                  <button
                    onClick={() => setResult(null)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    <RefreshCw size={15} />
                    Import Another Website
                  </button>
                </div>

                {exportNotice && (
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 border border-emerald-200">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    {exportNotice}
                  </div>
                )}
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}