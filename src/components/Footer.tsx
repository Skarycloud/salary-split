"use client"

import { useState, useEffect } from "react"
import { Mail, Github, Linkedin } from "lucide-react"

export function Footer() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <footer className="mt-24 w-full border-t border-border/30 pt-12 pb-16 text-center space-y-10 animate-in fade-in duration-1000 delay-500">
      <div className="flex flex-col items-center space-y-6">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary/80">Sumanth Kumar</p>
          <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest">Fullstack Dev</p>
        </div>
        <div className="flex items-center space-x-8">
          {[
            { icon: Mail, href: "mailto:Sumanth.k.0202@gmail.com" },
            { icon: Github, href: "https://github.com/Skarycloud" },
            { icon: Linkedin, href: "https://www.linkedin.com/in/sumanth-kumar-230194294" }
          ].map((social, idx) => (
            <social.icon 
              key={idx} 
              size={20} 
              strokeWidth={1.5} 
              className="text-muted-foreground hover:text-primary transition-all hover:scale-125 cursor-pointer"
              onClick={() => window.open(social.href, "_blank")}
            />
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        <p className="text-[10px] text-muted-foreground/40 leading-relaxed uppercase tracking-[0.25em] max-w-xs mx-auto">
          Currency Benchmark March 2026 • Gross Earnings Projection
        </p>
        <p className="text-[10px] text-muted-foreground/30 font-mono tracking-widest">
          © {mounted ? new Date().getFullYear() : ""} SALARYSPLIT · CORE_V2
        </p>
      </div>
    </footer>
  )
}
