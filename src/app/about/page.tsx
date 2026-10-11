"use client"

import { Split, Heart, Code2, Sparkles, Shield, Palette } from "lucide-react"
import { socialLinks } from "@/components/Footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-4xl space-y-16 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        {/* Hero Section */}
        <section className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex w-fit items-center justify-center rounded-xl border-2 border-border bg-accent p-4 shadow-brutal">
            <Split className="h-10 w-10 text-foreground" strokeWidth={2.5} />
          </div>
          <h1 className="max-w-2xl text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl">
            Financial clarity,{" "}
            <span className="inline-block rounded-base border-2 border-border bg-highlight px-2">reimagined</span>{" "}
            for everyone.
          </h1>
          <p className="max-w-2xl text-xl leading-relaxed">
            SalarySplit was born from a simple need: to know exactly what a salary means in the context of daily life. No fluff, no ads, just precision.
          </p>
        </section>

        {/* Vision Statement */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <div className="space-y-4 rounded-xl border-2 border-border bg-accent p-6 shadow-brutal sm:p-8">
            <h2 className="w-fit rounded-base border-2 border-border bg-card px-2.5 py-0.5 text-xs font-bold uppercase tracking-[0.16em]">Our Mission</h2>
            <p className="text-xl font-medium leading-relaxed text-foreground">
              We help people compare the value of a job offer, understand what their time is worth, and make a practical plan for their monthly income.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { icon: Shield, title: "Private by default", text: "Salary inputs stay in this browser session. No account is required; currency rates are fetched from our exchange-rate service.", bg: "bg-mint" },
              { icon: Palette, title: "Calm by Design", text: "Clear sky colours and bold outlines keep every number easy to find.", bg: "bg-secondary" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 rounded-xl border-2 border-border bg-card p-5 shadow-brutal">
                <div className={`rounded-base border-2 border-border p-2 ${item.bg}`}>
                  <item.icon className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <p className="font-heading font-bold text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Stack */}
        <section className="space-y-8 rounded-xl border-2 border-border bg-muted p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <h2 className="text-3xl font-bold tracking-tight">Built with Modern Tech</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { name: "Next.js", desc: "React Framework", icon: Code2 },
              { name: "Tailwind v4", desc: "Styling", icon: Palette },
              { name: "Shadcn UI", desc: "Components", icon: Sparkles },
              { name: "Lucide", desc: "Iconography", icon: Heart }
            ].map((tech, i) => (
              <div key={i} className="space-y-3 rounded-base border-2 border-border bg-card p-5 text-center shadow-brutal transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none">
                <tech.icon className="mx-auto h-6 w-6 text-foreground" />
                <div>
                  <p className="font-heading text-sm font-bold text-foreground">{tech.name}</p>
                  <p className="text-xs uppercase tracking-wide">{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="text-center">
          <h3 className="mb-8 text-2xl font-bold">Let&apos;s Connect</h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-base border-2 border-border bg-card px-4 py-2.5 text-sm font-bold text-foreground shadow-brutal transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:bg-secondary hover:shadow-none"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
