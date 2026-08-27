import React from "react";
import { MapPin, Phone, Building2, Clock } from "lucide-react";
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

export const LocationV1: React.FC<TemplateProps> = ({ page, primary }) => {
  return (
    <div className="flex flex-col">
      <div
        style={{ background: `linear-gradient(135deg, ${primary}, #0f172a)` }}
        className="px-8 py-12 text-white"
      >
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
          Office &amp; Location
        </span>
        <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">{page.headings[0] || page.title}</h1>
        <p className="mt-2 text-white/80 max-w-xl">{page.description}</p>
      </div>

      <div className="grid gap-8 p-8 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                <MapPin size={20} />
              </div>
              <div>
                <div className="text-xs text-slate-400">Address</div>
                <div className="font-semibold text-slate-800">{page.title}</div>
              </div>
            </div>

            {page.phone && (
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                  <Phone size={20} />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Phone</div>
                  <div className="font-semibold text-slate-800">{page.phone}</div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
                <Clock size={20} />
              </div>
              <div>
                <div className="text-xs text-slate-400">Hours</div>
                <div className="font-semibold text-slate-800">Mon - Fri: 9:00 AM - 5:00 PM</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
            <Building2 size={32} className="mx-auto mb-2 text-slate-400" />
            <div className="text-xs font-semibold">Map Placeholder</div>
            <div className="text-[11px] text-slate-400">Interactive map widget available on deploy</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 sm:p-8">
          <ContentBody page={page} />
        </div>
      </div>
    </div>
  );
};