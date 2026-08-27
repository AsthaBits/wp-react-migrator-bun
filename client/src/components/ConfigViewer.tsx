import React from "react";
import type { SiteConfig } from "../type";
import { Code2 } from "lucide-react";

export const ConfigViewer: React.FC<{ config: SiteConfig }> = ({ config }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="mb-4 flex items-center justify-between font-bold text-slate-800 text-sm">
        <span className="flex items-center gap-2">
          <Code2 size={16} /> Site Config Schema
        </span>
        <span className="text-xs text-slate-400 font-mono">site-config.json</span>
      </div>
      <pre className="max-h-64 overflow-auto rounded-xl bg-slate-950 p-4 text-[11px] font-mono leading-relaxed text-slate-200">
        {JSON.stringify(config, null, 2)}
      </pre>
    </div>
  );
};