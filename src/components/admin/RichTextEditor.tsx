"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { Code, Eye, FileText, Check } from "lucide-react";

// Dynamically import React Quill with SSR disabled for Next.js App Router
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-44 w-full bg-[#fbf9f6] animate-pulse border border-neutral-300 rounded flex items-center justify-center text-xs text-neutral-400">
      Loading React Quill Editor...
    </div>
  ),
});

export const DEFAULT_FABRIC_TEMPLATE = `<ul>
  <li><strong>Main Fabric:</strong> Enzyme-washed combed cotton jersey</li>
  <li><strong>Weight:</strong> 240 GSM — premium heavy texture</li>
  <li><strong>Material:</strong> 100% Cotton</li>
  <li><strong>Cuffs:</strong> Ribbed fabric that holds its shape wear after wear</li>
  <li><strong>Zipper:</strong> Hidden front zip for a clean, uninterrupted look</li>
  <li><strong>Stitching:</strong> Fine matching-colour thread throughout</li>
  <li><strong>Silhouette:</strong> Relaxed drop-shoulder streetwear cut</li>
</ul>`;

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const QUILL_MODULES = {
  toolbar: [
    [{ header: [3, 4, false] }],
    ["bold", "italic", "underline"],
    [{ list: "bullet" }, { list: "ordered" }],
    ["clean"],
  ],
};

const QUILL_FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "list",
];

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write fabric and composition details...",
}: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<"quill" | "html" | "preview">("quill");
  const [copied, setCopied] = useState(false);

  const handleCopyRawString = () => {
    navigator.clipboard.writeText(`\`${value || ""}\``);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full border border-neutral-300 rounded bg-white overflow-hidden shadow-2xs">
      {/* Top Header / Mode Switcher */}
      <div className="bg-[#faf8f5] border-b border-neutral-200 px-3 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
            Fabric &amp; Composition
          </span>
        </div>

        <div className="flex items-center gap-1 bg-neutral-200/80 p-0.5 rounded text-[10px] font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("quill")}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === "quill"
                ? "bg-white text-neutral-900 shadow-2xs font-extrabold"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <FileText size={11} />
            <span>React Quill</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("html")}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === "html"
                ? "bg-white text-neutral-900 shadow-2xs font-extrabold"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Code size={11} />
            <span>HTML String</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === "preview"
                ? "bg-white text-neutral-900 shadow-2xs font-extrabold"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Eye size={11} />
            <span>Store Preview</span>
          </button>
        </div>
      </div>

      {/* Mode 1: React Quill WYSIWYG */}
      {activeTab === "quill" && (
        <div className="bg-white [&_.ql-toolbar]:border-none [&_.ql-toolbar]:bg-[#fdfcfb] [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-neutral-200 [&_.ql-container]:border-none [&_.ql-editor]:min-h-[140px] [&_.ql-editor]:text-xs [&_.ql-editor]:text-neutral-800">
          <ReactQuill
            theme="snow"
            value={value || ""}
            onChange={onChange}
            modules={QUILL_MODULES}
            formats={QUILL_FORMATS}
            placeholder={placeholder}
          />
        </div>
      )}

      {/* Mode 2: Raw HTML Template Literal String */}
      {activeTab === "html" && (
        <div className="relative">
          <textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            rows={7}
            placeholder="`<ul><li><strong>Main Fabric:</strong> ...</li></ul>`"
            className="w-full p-3 font-mono text-[11px] bg-[#1e1e1e] text-[#d4d4d4] focus:outline-none resize-none leading-relaxed"
          />
          <div className="absolute top-2 right-2 flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopyRawString}
              className="flex items-center gap-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[9px] font-bold px-2 py-1 rounded border border-neutral-700 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check size={10} className="text-emerald-400" />
                  <span>Copied as ``</span>
                </>
              ) : (
                <>
                  <Code size={10} />
                  <span>Copy as `` string</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Mode 3: Storefront Live Preview */}
      {activeTab === "preview" && (
        <div className="min-h-[140px] max-h-[260px] overflow-y-auto p-4 bg-[#fbf9f6] text-xs text-neutral-800 border-t border-neutral-100">
          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
            Storefront Details Page Output:
          </div>
          <div
            className="prose prose-neutral max-w-none text-xs text-neutral-700 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-1.5 [&_strong]:text-neutral-900 [&_strong]:font-bold"
            dangerouslySetInnerHTML={{
              __html: value || "<p class='text-neutral-400 italic'>No fabric details entered yet.</p>",
            }}
          />
        </div>
      )}

      {/* Bottom Status bar */}
      <div className="bg-[#fcfbf9] px-3 py-1.5 border-t border-neutral-200/70 flex items-center justify-between text-[10px] text-neutral-500">
        <span>
          Storage: <strong>HTML String</strong> (Saved inside product object as a template literal string)
        </span>
        <span className="font-mono text-[9px] text-neutral-400">
          {value ? `${value.length} characters` : "Empty"}
        </span>
      </div>
    </div>
  );
}
