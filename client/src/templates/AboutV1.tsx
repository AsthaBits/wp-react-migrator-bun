import React from "react";
import { Users, Award, ShieldCheck } from "lucide-react";
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

export const AboutV1: React.FC<TemplateProps> = ({ page, primary }) => {
  return (
    <div className="flex flex-col">
      <div
        style={{ background: `linear-gradient(135deg, ${primary}, #1e293b)` }}
        className="px-8 py-12 text-white sm:px-12"
      >
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
          About Us
        </span>
        <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">{page.headings[0] || page.title}</h1>
        <p className="mt-2 max-w-2xl text-white/80">{page.description}</p>
      </div>

      <div className="grid gap-8 p-8 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 sm:p-8">
          <ContentBody page={page} />
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="mb-4 flex items-center gap-2 font-bold text-slate-800">
              <Users size={18} style={{ color: primary }} /> Team &amp; Media
            </div>
            {page.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {page.images.slice(0, 4).map((img, i) => (
                  <div key={i} className="overflow-hidden rounded-xl bg-slate-100">
                    <img
                      src={img.src}
                      alt={img.alt || `Team photo ${i + 1}`}
                      className="h-28 w-full object-cover"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                    {img.alt && <div className="p-1.5 text-center text-[10px] text-slate-500 truncate">{img.alt}</div>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No team or media assets extracted.</p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <ShieldCheck size={16} className="text-emerald-600" /> Verified Experience
            </div>
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <Award size={16} className="text-amber-600" /> Quality Commitment
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};