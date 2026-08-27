import React from "react";
import type { Page } from "../type";
import { CheckCircle2, Sparkles } from "lucide-react";
import { TEMPLATE_OPTIONS } from "../templates";

type TemplatePickerProps = {
  page?: Page;
  onSelectTemplate: (templateId: string) => void;
};

export const TemplatePicker: React.FC<TemplatePickerProps> = ({
  page,
  onSelectTemplate,
}) => {
  if (!page) return null;

  const relevantTemplates = TEMPLATE_OPTIONS.filter((t) =>
    page.type === "service" ? t.id.startsWith("service") : t.id.startsWith(page.type)
  );

  const displayTemplates = relevantTemplates.length > 0 ? relevantTemplates : TEMPLATE_OPTIONS;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Template Layout Selection</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Switching templates dynamically updates the component tree below.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {displayTemplates.map((template) => {
          const isActive = page.template === template.id;
          const isSystemRecommended = page.recommendedTemplate === template.id;

          return (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template.id)}
              className={`flex flex-col text-left p-4 rounded-xl border transition-all duration-150 ${
                isActive
                  ? "border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-xs sm:text-sm text-slate-900">{template.name}</span>
                {isActive && <CheckCircle2 size={16} className="text-blue-600 shrink-0" />}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{template.description}</p>
              
              <div className="mt-3 flex items-center gap-2">
                {isSystemRecommended && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 uppercase tracking-wide">
                    <Sparkles size={10} /> Recommended
                  </span>
                )}
                {isActive && (
                  <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wide">
                    Active
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};