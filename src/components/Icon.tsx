"use client";

import React, { type SVGAttributes } from "react";
import * as TablerIcons from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, "stroke"> {
  name: string; // e.g. "users", "clock", "calendar", "settings", "home"
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  stroke?: number;
}

const SIZE_MAP = {
  xs: "w-3.5 h-3.5",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-7 h-7",
};

// Convert kebab-case (e.g. "users-group" or "clock") to PascalCase with "Icon" prefix ("IconUsersGroup", "IconClock")
function toExportName(kebab: string): string {
  const pascal = kebab
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  return `Icon${pascal}`;
}

export function Icon({ name, size = "md", className = "", stroke = 1.75, ...props }: IconProps) {
  const exportName = toExportName(name);
  const Component = (TablerIcons as any)[exportName] || (TablerIcons as any)[name] || TablerIcons.IconHelp;

  return (
    <Component
      aria-hidden="true"
      className={cn(SIZE_MAP[size], className)}
      stroke={stroke}
      {...props}
    />
  );
}

export default Icon;
