import React, { useState } from "react";
import type { Page, SiteConfig } from "../type";
import { resolveTemplate } from "../templates";
import { Monitor, Smartphone, Tablet, Menu, X } from "lucide-react";

type PreviewProps = {
  page?: Page;
  device: "desktop" | "tablet" | "mobile";
  setDevice: (d: "desktop" | "tablet" | "mobile") => void;
  config: SiteConfig;
  onNavigate: (path: string) => void;
};

export const Preview: React.FC<PreviewProps> = ({
  page,
  device,
  setDevice,
  config,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!page) {
    return <div className="p-12 text-center text-slate-400">No page selected.</div>;
  }

  const width =
    device === "mobile"
      ? "max-w-[390px]"
      : device === "tablet"
      ? "max-w-[768px]"
      : "max-w-full";

  const primary = config.branding.primaryColor || "#2563eb";
  const TemplateComponent = resolveTemplate(page.template);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
      {/* Top Device Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Live Component Preview</h2>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Path: <b>{page.path}</b></span>
            <span>·</span>
            <span>Template: <b className="font-mono text-blue-600">{page.template}</b></span>
          </div>
        </div>

        <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
          {[
            { key: "desktop", icon: Monitor },
            { key: "tablet", icon: Tablet },
            { key: "mobile", icon: Smartphone },
          ].map(({ key, icon: Icon }) => (
            <button
              key={key}
              onClick={() => {
                setDevice(key as any);
                setMobileMenuOpen(false);
              }}
              className={`rounded-lg p-2 text-xs font-semibold transition-colors ${
                device === key
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Icon size={15} />
            </button>
          ))}
        </div>
      </div>

      {/* Frame Device Container */}
      <div className={`mx-auto overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 ${width}`}>
        {/* Responsive Chrome Header */}
        <header className="border-b border-slate-100 bg-white px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between relative">
          {page.logo ? (
            <img
              src={page.logo}
              className="h-7 sm:h-9 max-w-[120px] sm:max-w-[150px] object-contain"
              alt="Site Logo"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          ) : (
            <span className="font-bold text-slate-900 text-xs sm:text-sm truncate max-w-[160px]">
              {new URL(page.url).hostname}
            </span>
          )}

          {/* Desktop Navigation (Hidden on Mobile) */}
          <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-600">
            {(config.navigation || []).slice(0, 4).map((item) => (
              <a
                key={item.url}
                href={item.url}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(item.url);
                }}
                className="hover:text-blue-600 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Mobile Hamburger Button (Only on Mobile/Tablet) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Collapsible Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 z-20 border-b border-slate-200 bg-white p-4 shadow-lg md:hidden flex flex-col gap-2.5">
              {(config.navigation || []).slice(0, 6).map((item) => (
                <a
                  key={item.url}
                  href={item.url}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(item.url);
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </header>

        {/* Dynamically Resolved Template Body */}
        <TemplateComponent page={page} config={config} primary={primary} />
      </div>
    </div>
  );
};