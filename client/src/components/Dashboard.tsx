import React from "react";
import type { MigrationStats, SitemapData } from "../type";

type DashboardProps = {
  stats: MigrationStats;
  sitemap: SitemapData;
};

export const Dashboard: React.FC<DashboardProps> = ({ stats, sitemap }) => {
  return (
    <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pages Discovered</div>
        <div className="mt-2 text-3xl font-extrabold text-slate-900">{stats.discovered}</div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pages Migrated</div>
        <div className="mt-2 text-3xl font-extrabold text-emerald-600">{stats.migrated}</div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Failed Requests</div>
        <div className={`mt-2 text-3xl font-extrabold ${stats.failed > 0 ? "text-amber-600" : "text-slate-900"}`}>
          {stats.failed}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sitemap URLs</span>
          {sitemap.truncated && (
            <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
              Capped
            </span>
          )}
        </div>
        <div className="mt-2 text-3xl font-extrabold text-slate-900">{sitemap.urlCount}</div>
      </div>
    </section>
  );
};