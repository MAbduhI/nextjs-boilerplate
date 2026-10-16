"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `Error: ${error.message}\nDigest: ${error.digest || "-"}\nStack: ${error.stack || "-"}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#08090A] text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 transition-colors duration-200">
      <div className="w-full max-w-xl text-center space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-2.5">
          <div className="w-10 h-10 rounded-sm bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-lg shadow-indigo-600/30 text-white font-black text-base flex items-center justify-center">
            HR
          </div>
          <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">
            SmartHR <span className="text-indigo-600 dark:text-indigo-400">Pro</span>
          </span>
        </div>

        {/* SmartHR 500 Illustration */}
        <div className="relative w-full max-w-sm sm:max-w-md mx-auto aspect-[4/3] flex items-center justify-center">
          <img
            src="/assets/img/error-500.svg"
            alt="Error 500 Server Error"
            className="w-full h-auto object-contain max-h-72 drop-shadow-sm"
          />
        </div>

        {/* Text Details (SmartHR Benchmark Style) */}
        <div className="space-y-2.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Oops, something went wrong
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Server Error 500. We apologise and are fixing the problem. Please try again at a later stage.
          </p>
        </div>

        {/* Action Buttons (SmartHR Benchmark Style) */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-sm border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/dashboard"
            className="px-6 py-2.5 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Diagnostic Toggle */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-[11px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition cursor-pointer inline-flex items-center gap-1"
          >
            <span>Technical Details</span>
            {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {showDetails && (
            <div className="mt-3 p-3.5 rounded-sm bg-slate-950 text-slate-300 font-sans tabular-nums text-[11px] text-left space-y-2 border border-slate-800 max-w-md mx-auto">
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1.5">
                <span className="truncate">{error.message || "Unknown error"}</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1 text-slate-400 hover:text-white cursor-pointer flex items-center gap-1 shrink-0"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span className="text-[10px]">{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
              {error.digest && <div className="text-[10px] text-indigo-400">Digest: {error.digest}</div>}
              <pre className="max-h-28 overflow-y-auto text-[10px] text-slate-400 whitespace-pre-wrap leading-tight">
                {error.stack || "No stack trace available"}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
