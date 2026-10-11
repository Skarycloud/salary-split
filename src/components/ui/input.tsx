import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground/60 selection:bg-highlight selection:text-foreground border-input flex h-10 w-full min-w-0 rounded-base border-2 bg-card px-3 py-1 text-base font-medium text-foreground transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:-translate-x-[2px] focus-visible:-translate-y-[2px] focus-visible:shadow-brutal",
        "aria-invalid:border-destructive aria-invalid:bg-destructive-soft/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
