import type * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-white text-black hover:bg-gray-200",
    secondary: "border-transparent bg-gray-800 text-white hover:bg-gray-700",
    destructive: "border-transparent bg-red-500 text-white hover:bg-red-600",
    outline: "border-gray-700 text-white",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}

export { Badge }
