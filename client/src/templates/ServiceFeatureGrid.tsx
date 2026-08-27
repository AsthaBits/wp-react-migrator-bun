import React from "react";
import { CheckCircle2, Layers } from "lucide-react";
import type { TemplateProps, Page } from "../type";

function ContentBody({ page }: { page: Page }) {
  if (page.contentHtml) {
    return (
      <div
        className="space-y-4 text-base leading-relaxed text-slate-700 [&>h1]:text-2xl [&>h1]:font-bold [&>h2]:text-xl [&>h2]:font-bold [&>a]:text-blue-600 [&>img]:rounded-lg [&>img]:mt-4"
        dangerouslySetInnerHTML={{ __html: page.contentHtml }}
      />
    );
  }
  return <p className="text-slate-500">No content extracted for this page.</p>;
}

export const ServiceFeatureGrid: React.FC<TemplateProps> = ({ page, primary }) => {
  const items = page.headings.length > 1 ? page.headings.slice(1) : page.headings.length === 1 ? page.headings : [page.title];

  return (
    <div className="flex flex-col">
      <div
        className="px-8 py-14 text-center text-white"
        style={{ background: `linear-gradient(135deg, ${primary}, #0f172a)` }}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider">
          <Layers size={13} /> Feature Directory
        </span>
        <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">{page.title}</h1>
        <p className="mt-2 max-w-xl mx-auto text-sm text-white/80 sm:text-base">
          {page.description || "Overview of service features and technical capabilities."}
        </p>
      </div>

      <div className="p-8">
        <h2 className="mb-4 text-lg font-bold text-slate-900">Key Features &amp; Offerings</h2>
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 6).map((heading, i) => {
            const img = page.images[i];
            return (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all"
              >
                {img && (
                  <img
                    src={img.src}
                    alt={img.alt || heading}
                    className="mb-3 h-32 w-full rounded-xl object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
                <div className="flex items-start gap-2.5 font-bold text-slate-800">
                  <CheckCircle2 size={18} className="shrink-0 mt-0.5" style={{ color: primary }} />
                  <span>{heading}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 sm:p-8">
          <ContentBody page={page} />
        </div>
      </div>
    </div>
  );
};