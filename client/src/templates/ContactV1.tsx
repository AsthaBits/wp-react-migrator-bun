import React, { useState } from "react";
import { Phone, Mail, Send, CheckCircle2 } from "lucide-react";
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

export const ContactV1: React.FC<TemplateProps> = ({ page, primary }) => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="flex flex-col">
      <div
        style={{ background: `linear-gradient(135deg, ${primary}, #0f172a)` }}
        className="px-8 py-12 text-white"
      >
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
          Contact &amp; Inquiries
        </span>
        <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">{page.headings[0] || page.title}</h1>
        <p className="mt-2 text-white/80 max-w-xl">{page.description}</p>
      </div>

      <div className="grid gap-8 p-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h2 className="font-bold text-slate-800">Direct Contact Details</h2>
            {page.phone ? (
              <div className="flex items-center gap-3 text-slate-700">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                  <Phone size={18} />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Phone</div>
                  <div className="font-semibold">{page.phone}</div>
                </div>
              </div>
            ) : null}

            {page.email ? (
              <div className="flex items-center gap-3 text-slate-700">
                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Email</div>
                  <div className="font-semibold">{page.email}</div>
                </div>
              </div>
            ) : null}

            {!page.phone && !page.email && (
              <p className="text-xs text-slate-400">No contact phone or email detected on this page.</p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="mb-4 font-bold text-slate-800">Send an Inquiry</h2>
            {submitted ? (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                <CheckCircle2 size={18} /> Thank you! Your test inquiry has been recorded.
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-3 text-sm"
              >
                <div>
                  <label className="text-xs font-semibold text-slate-600">Your Name</label>
                  <input
                    required
                    placeholder="Jane Doe"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Email Address</label>
                  <input
                    required
                    type="email"
                    placeholder="jane@example.com"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  style={{ backgroundColor: primary }}
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold text-white shadow-sm hover:opacity-95"
                >
                  <Send size={14} /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 sm:p-8">
          <ContentBody page={page} />
        </div>
      </div>
    </div>
  );
};