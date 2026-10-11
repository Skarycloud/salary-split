import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-secondary animate-pulse rounded-base", className)}
      {...props}
    />
  )
}

export { Skeleton }
