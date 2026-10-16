"use client";

import React, { useState, useRef, useEffect, type ReactNode } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "../utils/cn";

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
  badge?: string;
  icon?: ReactNode;
}

export interface CustomSelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  dropdownClassName?: string;
  disabled?: boolean;
}

export function CustomSelect({
  value,
  options = [],
  onChange,
  placeholder = "Pilih opsi...",
  className,
  triggerClassName,
  dropdownClassName,
  disabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Click outside listener to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div ref={containerRef} className={cn("relative inline-block text-left", className)}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-md text-xs font-semibold transition-all duration-150 border shadow-xs focus:outline-none",
          "bg-white dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-white/10 hover:border-indigo-500/60 dark:hover:border-indigo-500/60",
          isOpen ? "border-indigo-500 ring-2 ring-indigo-500/10 dark:ring-indigo-500/20" : "",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          triggerClassName
        )}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className="text-[9px] font-sans tabular-nums px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 shrink-0">
              {selectedOption.badge}
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200",
            isOpen ? "transform rotate-180 text-indigo-500" : ""
          )}
        />
      </button>

      {/* Floating Anchored Popover Menu */}
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-1.5 w-full min-w-[210px] rounded-md p-1.5 shadow-xl border backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150",
            "bg-white/95 dark:bg-[#111315]/95 border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 shadow-slate-300/40 dark:shadow-black/60",
            "max-h-64 overflow-y-auto scrollbar-thin",
            dropdownClassName
          )}
        >
          {options.length === 0 ? (
            <div className="py-4 text-center text-xs text-slate-400 italic">
              Tidak ada opsi tersedia
            </div>
          ) : (
            options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-left transition-colors duration-100",
                    isSelected
                      ? "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 font-bold"
                      : "hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300"
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {option.icon && <span className="shrink-0">{option.icon}</span>}
                    <div className="truncate">
                      <div className="truncate">{option.label}</div>
                      {option.sublabel && (
                        <div className="text-[10px] text-slate-400 font-sans tabular-nums truncate">
                          {option.sublabel}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {option.badge && (
                      <span className="text-[9px] font-sans tabular-nums px-1.5 py-0.2 rounded bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400">
                        {option.badge}
                      </span>
                    )}
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
