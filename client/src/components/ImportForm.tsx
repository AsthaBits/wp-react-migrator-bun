import React from "react";
import { Upload, AlertCircle } from "lucide-react";

type ImportFormProps = {
  url: string;
  setUrl: (url: string) => void;
  loading: boolean;
  error: string;
  onImport: () => void;
};

export const ImportForm: React.FC<ImportFormProps> = ({
  url,
  setUrl,
  loading,
  error,
  onImport,
}) => {
  return (
    <section className="mx-auto max-w-3xl pt-12 sm:pt-16">
      <div className="text-center">
        <div className="mx-auto mb-5 w-fit rounded-2xl bg-blue-50 p-4 text-blue-600 shadow-xs">
          <Upload size={32} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900">
          Migrate WordPress to React
        </h1>
        <p className="mt-3 text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
          Import any WordPress site, auto-classify content, extract styling tokens, and preview reusable React templates.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!loading) onImport();
        }}
        className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8"
      >
        <label className="text-sm font-semibold text-slate-700">
          Existing WordPress Website URL
        </label>
        <div className="mt-2 flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="https://your-wordpress-site.com"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white shadow-md hover:bg-slate-800 disabled:opacity-50 transition-colors"
          >
            {loading ? "Crawling & Analyzing..." : "Import Website"}
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-red-50 p-3.5 text-sm text-red-700 border border-red-200">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">Import Error</div>
              <div>{error}</div>
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { title: "Sitemap Discovery", desc: "Crawls XML sitemaps & feeds" },
            { title: "Branding Extraction", desc: "Parses CSS colors & fonts" },
            { title: "Template Resolution", desc: "Auto-maps to modern React UI" },
          ].map((item) => (
            <div key={item.title} className="rounded-xl bg-slate-50 p-4 border border-slate-100">
              <div className="font-semibold text-slate-800 text-xs">{item.title}</div>
              <div className="mt-1 text-[11px] text-slate-500">{item.desc}</div>
            </div>
          ))}
        </div>
      </form>
    </section>
  );
};