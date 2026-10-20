"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
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

        {/* SmartHR 404 Illustration */}
        <div className="relative w-full max-w-sm sm:max-w-md mx-auto aspect-[4/3] flex items-center justify-center">
          <img
            src="/assets/img/error-404.svg"
            alt="Error 404 Page Not Found"
            className="w-full h-auto object-contain max-h-72 drop-shadow-sm"
          />
        </div>

        {/* Text Details (SmartHR Benchmark Style) */}
        <div className="space-y-2.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Oops, something went wrong
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Error 404 Page not found. Sorry the page you looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>

        {/* Action Button (SmartHR Benchmark Style) */}
        <div className="flex justify-center pt-2">
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
