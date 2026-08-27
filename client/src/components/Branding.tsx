import React from "react";
import type { SiteConfig } from "../type";
import { Palette, Sparkles } from "lucide-react";

export const Branding: React.FC<{ config: SiteConfig }> = ({ config }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="mb-4 flex items-center justify-between font-bold text-slate-800">
        <span className="flex items-center gap-2 text-sm">
          <Palette size={16} /> Extracted Branding
        </span>
        {config.branding.confidence === "high" ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
            <Sparkles size={10} /> CSS Extracted
          </span>
        ) : (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
            Fallback Theme
          </span>
        )}
      </div>

      {config.branding.logo && (
        <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50 p-3 flex items-center justify-center">
          <img
            src={config.branding.logo}
            alt="Extracted Logo"
            className="h-10 max-w-[160px] object-contain"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
          <span className="text-slate-400 font-medium">Primary Color</span>
          <div className="mt-1.5 flex items-center gap-2 font-mono font-bold text-slate-800">
            <span
              className="h-4 w-4 rounded-md border border-black/10"
              style={{ backgroundColor: config.branding.primaryColor }}
            />
            {config.branding.primaryColor}
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
          <span className="text-slate-400 font-medium">Secondary Color</span>
          <div className="mt-1.5 flex items-center gap-2 font-mono font-bold text-slate-800">
            <span
              className="h-4 w-4 rounded-md border border-black/10"
              style={{ backgroundColor: config.branding.secondaryColor }}
            />
            {config.branding.secondaryColor}
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
          <span className="text-slate-400 font-medium">Typography</span>
          <div className="mt-1 font-semibold text-slate-800 truncate">{config.branding.font}</div>
        </div>

        <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
          <span className="text-slate-400 font-medium">Contact Email</span>
          <div className="mt-1 font-semibold text-slate-800 truncate">
            {config.contact.email || "Not extracted"}
          </div>
        </div>
      </div>
    </div>
  );
};