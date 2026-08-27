import React from "react";
import type { Page } from "../type";
import { FileText } from "lucide-react";

type PageListProps = {
  pages: Page[];
  selectedPath: string;
  onSelect: (path: string) => void;
};

export const PageList: React.FC<PageListProps> = ({
  pages,
  selectedPath,
  onSelect,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
      <div className="mb-3 flex items-center justify-between font-bold text-slate-800">
        <span className="flex items-center gap-2 text-sm">
          <FileText size={16} /> Extracted Pages
        </span>
        <span className="text-xs text-slate-400">{pages.length}</span>
      </div>
      <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
        {pages.map((p) => {
          const isSelected = selectedPath === p.path;
          return (
            <button
              key={p.path}
              onClick={() => onSelect(p.path)}
              className={`w-full rounded-xl p-3 text-left transition-all ${
                isSelected
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-800"
              }`}
            >
              <div className="truncate font-semibold text-xs sm:text-sm">{p.title}</div>
              <div className="mt-1 flex items-center justify-between text-[11px] opacity-75">
                <span className="capitalize">{p.type}</span>
                <span className="truncate max-w-[140px]">{p.path}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};