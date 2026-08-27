import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import type { TemplateProps, Page } from "../type";

function ContentBody({ page }: { page: Page }) {
  if (page.contentHtml) {
    return (
      <div
        className="space-y-4 text-base leading-relaxed text-slate-700 [&>h1]:text-2xl [&>h1]:font-bold [&>h2]:text-xl [&>h2]:font-bold [&>h3]:text-lg [&>a]:text-blue-600 [&>img]:rounded-lg [&>img]:mt-4"
        dangerouslySetInnerHTML={{ __html: page.contentHtml }}
      />
    );
  }
  return <p className="text-slate-500">No content extracted for this page.</p>;
}

export const HomeV1: React.FC<TemplateProps> = ({ page, config, primary }) => {
  return (
    <div className="flex flex-col">
      {/* Modern Gradient Hero */}
      <div
        style={{ background: `linear-gradient(135deg, ${primary}, #0f172a)` }}
        className="px-8 py-14 text-white sm:px-12 sm:py-20"
      >
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
            <Sparkles size={13} /> Home Page
          </span>
          <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:text-5xl">
            {page.headings[0] || page.title}
          </h1>
          <p className="mt-4 text-base text-white/85 sm:text-lg">
            {page.description || "Welcome to our newly migrated web presence."}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-slate-900 shadow-lg hover:bg-slate-50 transition-colors"
            >
              Explore Services <ArrowRight size={16} />
            </button>
            <button className="rounded-xl border border-white/30 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* Featured Navigation Links */}
      <div className="p-8">
        <h2 className="mb-4 text-lg font-bold text-slate-800">Quick Navigation</h2>
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {(config.navigation || []).slice(0, 3).map((item) => (
            <div
              key={item.url}
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition-all"
            >
              <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                {item.label}
              </div>
              <div className="mt-2 text-xs font-medium text-slate-400 group-hover:text-blue-500">
                Explore section →
              </div>
            </div>
          ))}
        </div>

        {/* Extracted Body Content */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 sm:p-8">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Page Content</h3>
          <ContentBody page={page} />
        </div>
      </div>
    </div>
  );
};