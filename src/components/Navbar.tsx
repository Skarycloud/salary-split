"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { BadgeInfo, CircleHelp, Split } from "lucide-react"
import { cn } from "@/lib/utils"

const mainPages = [
  { href: "/", label: "Salary breakdown", compactLabel: "Breakdown" },
  { href: "/compare", label: "Compare offers", compactLabel: "Compare" },
]

const secondaryLinks = [
  { href: "/docs", label: "Guide", icon: CircleHelp },
  { href: "/about", label: "About", icon: BadgeInfo },
]

export function Navbar() {
  const pathname = usePathname()
  const [lastPrimaryTabIsCompare, setLastPrimaryTabIsCompare] = useState(pathname === "/compare")
  const compareTabActive = pathname === "/compare"
    ? true
    : pathname === "/" || pathname === "/results"
      ? false
      : lastPrimaryTabIsCompare

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <nav aria-label="Main navigation" className="mx-auto flex min-h-14 w-fit max-w-full items-center justify-start gap-3 rounded-2xl border-2 border-border/15 bg-card/95 px-3 shadow-sm backdrop-blur-xl sm:min-h-16 sm:gap-8 sm:px-4">
        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <Link href="/" onClick={() => setLastPrimaryTabIsCompare(false)} aria-label="SalarySplit home" aria-current={pathname === "/" ? "page" : undefined} className="group flex shrink-0 items-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-foreground transition-colors group-hover:bg-accent sm:h-9 sm:w-9">
              <Split className="h-[17px] w-[17px]" strokeWidth={2.25} />
            </span>
            <span className="font-heading text-base font-bold tracking-tight text-foreground sm:text-lg">SalarySplit</span>
          </Link>

          <div role="group" aria-label="Choose a tool" className="relative grid w-44 shrink-0 grid-cols-2 items-center rounded-xl bg-accent p-1 sm:w-[280px]">
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-lg border-2 border-border bg-card shadow-brutal-sm transition-transform duration-250 [transition-timing-function:cubic-bezier(0.77,0,0.175,1)] motion-reduce:transition-none",
                compareTabActive ? "translate-x-full" : "translate-x-0"
              )}
            />
            {mainPages.map(({ href, label, compactLabel }) => {
              const active = href === "/" ? !compareTabActive : compareTabActive
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setLastPrimaryTabIsCompare(href === "/compare")}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative z-10 flex min-w-0 items-center justify-center whitespace-nowrap rounded-lg px-2.5 py-2 text-[11px] font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:px-4 sm:py-2 sm:text-sm",
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="sm:hidden">{compactLabel}</span>
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-1 sm:flex">
          {secondaryLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                pathname === href
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              )}
            >
              <Icon aria-hidden="true" className="h-4 w-4 shrink-0" strokeWidth={1.8} />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
