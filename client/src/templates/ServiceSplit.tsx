import React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
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

export const ServiceSplitHero: React.FC<TemplateProps> = ({ page, primary }) => {
  const [firstImage] = page.images;

  return (
    <div className="flex flex-col">
      <div
        className="flex flex-wrap items-center gap-8 p-8 sm:p-12 border-b border-slate-100"
        style={{ background: `linear-gradient(135deg, ${primary}15, #ffffff)` }}
      >
        <div className="flex-1 min-w-[280px]">
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
            style={{ backgroundColor: `${primary}20`, color: primary }}
          >
            Service
          </span>
          <h1 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            {page.headings[0] || page.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            {page.description || "Professional service solutions tailored to your requirements."}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-md hover:opacity-90 transition-opacity"
              style={{ backgroundColor: primary }}
            >
              Get a Quote <ArrowRight size={16} />
            </button>
            {page.phone && (
              <span className="text-xs font-semibold text-slate-600">
                or call <span className="text-slate-900">{page.phone}</span>
              </span>
            )}
          </div>
        </div>

        {firstImage && (
          <div className="flex-1 min-w-[280px]">
            <img
              src={firstImage.src}
              alt={firstImage.alt || page.title}
              className="h-64 w-full rounded-2xl object-cover shadow-md"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </div>
        )}
      </div>

      <div className="p-8">
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 sm:p-8">
          <ContentBody page={page} />
        </div>
      </div>
    </div>
  );
};