"use client"

import Link from "next/link"
import { Split, BookOpen, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="max-w-2xl mx-auto h-16 px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/5 group-hover:bg-primary/10 transition-all group-hover:scale-105 shadow-sm shadow-primary/5 border border-primary/10">
            <Split className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xl font-semibold tracking-tight">SalarySplit</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/docs">
            <Button variant="ghost" size="sm" className="text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-primary flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Docs
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="ghost" size="sm" className="text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-primary flex items-center gap-2">
              <Info className="h-4 w-4" />
              About
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
