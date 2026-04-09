"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: number) => void;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, onValueChange, onChange, ...props }, ref) => (
    <input
      type="range"
      ref={ref}
      className={cn(
        "w-full h-1.5 rounded-full appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700",
        "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:shadow",
        "[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-indigo-600 [&::-moz-range-thumb]:border-0",
        className
      )}
      onChange={(e) => {
        onChange?.(e);
        onValueChange?.(Number(e.target.value));
      }}
      {...props}
    />
  )
);
Slider.displayName = "Slider";

export { Slider };
