"use client"

import { Mail, Github, Linkedin } from "lucide-react"

export const socialLinks = [
  { icon: Mail, label: "Email", href: "mailto:Sumanth.k.0202@gmail.com" },
  { icon: Github, label: "GitHub", href: "https://github.com/Skarycloud" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/sumanth-kumar-230194294" },
]

export function Footer() {
  return (
    <footer className="mt-24 w-full border-t-2 border-border bg-accent">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-12 text-center sm:px-6 lg:flex-row lg:justify-between lg:text-left">
        <div className="space-y-1">
          <p className="font-heading text-lg font-bold text-foreground">Sumanth Kumar</p>
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground/80">Fullstack Dev</p>
        </div>

        <div className="flex items-center gap-4">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target={social.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              aria-label={social.label}
              className="flex h-11 w-11 items-center justify-center rounded-base border-2 border-border bg-card text-foreground shadow-brutal transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none"
            >
              <social.icon size={20} strokeWidth={2} />
            </a>
          ))}
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-foreground/80">
            A clearer view of your earnings
          </p>
          <p className="font-mono text-xs text-foreground/70">
            © 2026 SalarySplit
          </p>
        </div>
      </div>
    </footer>
  )
}
