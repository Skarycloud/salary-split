"use client"

import { Split, Github, Linkedin, Mail, Heart, Code2, Sparkles, Shield, Palette } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10 transition-colors">
      <main className="max-w-3xl mx-auto py-24 px-6 lg:px-8 space-y-32">
        {/* Hero Section */}
        <section className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="p-4 bg-primary/5 rounded-3xl w-fit flex items-center justify-center border border-primary/10">
            <Split className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-6xl font-semibold tracking-tighter leading-[0.9] max-w-xl">
            Financial clarity, <span className="text-muted-foreground">reimagined for everyone.</span>
          </h1>
          <p className="text-muted-foreground text-2xl font-light leading-relaxed max-w-2xl">
            SalarySplit was born from a simple need: to know exactly what a salary means in the context of daily life. No fluff, no ads, just precision.
          </p>
        </section>

        {/* Vision Statement */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-16 py-12 border-y border-border/40 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-primary/60">Our Mission</h2>
            <p className="text-xl font-medium leading-relaxed">
              We believe financial empowerment starts with understanding. Our goal is to provide a world-class, minimal tool that does one thing perfectly: Salary calculations.
            </p>
          </div>
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <Shield className="h-5 w-5 text-emerald-500 mt-1" />
              <div>
                <p className="font-semibold text-sm">Privacy First</p>
                <p className="text-xs text-muted-foreground">Your financial data never leaves your browser. No accounts, no tracking.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Palette className="h-5 w-5 text-purple-500 mt-1" />
              <div>
                <p className="font-semibold text-sm">Minimalist Aesthetic</p>
                <p className="text-xs text-muted-foreground">Inspired by high-end tech design to ensure zero cognitive load while planning.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight">Built with Modern Tech</h2>
            <div className="h-1 w-12 bg-primary/20 rounded-full" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: "Next.js", desc: "React Framework", icon: Code2 },
              { name: "Tailwind v4", desc: "Styling", icon: Palette },
              { name: "Shadcn UI", desc: "Components", icon: Sparkles },
              { name: "Lucide", desc: "Iconography", icon: Heart }
            ].map((tech, i) => (
              <div key={i} className="p-6 bg-muted/20 rounded-2xl border border-border/20 text-center space-y-3 group hover:border-primary/20 transition-all">
                <tech.icon className="h-5 w-5 mx-auto text-muted-foreground group-hover:text-primary transition-colors" />
                <div>
                  <p className="font-bold text-sm tracking-tight">{tech.name}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact / Footer */}
        <section className="pt-24 pb-12 text-center">
          <h3 className="text-xl font-semibold mb-8">Let&apos;s Connect</h3>
          <div className="flex items-center justify-center space-x-12">
            {[
              { icon: Github, label: "Code", href: "#" },
              { icon: Linkedin, label: "Network", href: "#" },
              { icon: Mail, label: "Message", href: "#" }
            ].map((item, i) => (
              <a key={i} href={item.href} className="group flex flex-col items-center space-y-2 opacity-60 hover:opacity-100 transition-opacity">
                <item.icon className="h-5 w-5 group-hover:text-primary transition-colors" />
                <span className="text-[10px] uppercase font-bold tracking-widest">{item.label}</span>
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
