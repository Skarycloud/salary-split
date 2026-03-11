"use client"

import { Calculator, Clock, Calendar, ShieldCheck, TrendingUp, PieChart, Info, BookOpen, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10 transition-colors">
      <main className="max-w-3xl mx-auto py-24 px-6 lg:px-8 space-y-24">
        {/* Header Section */}
        <section className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center space-x-3 text-primary">
            <BookOpen className="h-6 w-6" />
            <span className="text-sm font-bold uppercase tracking-widest">Documentation</span>
          </div>
          <h1 className="text-5xl font-semibold tracking-tighter leading-tight">
            Understanding Your Financial <span className="text-primary/80">Breakdown</span>.
          </h1>
          <p className="text-muted-foreground text-xl font-light leading-relaxed max-w-2xl">
            SalarySplit is designed to provide precision insights into your earnings. 
            Here is how we calculate your rates and budget.
          </p>
        </section>

        {/* Feature Sections */}
        <div className="space-y-32">
          
          {/* Section 1: Calculations */}
          <section className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold tracking-tight">Precision Calculations</h2>
              <div className="h-1 w-12 bg-primary/20 rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Most calculators use a standard 52-week or 2080-hour baseline. SalarySplit goes further by allowing you to define your <span className="text-foreground font-medium">exact work structure</span>.
                </p>
                <ul className="space-y-4 pt-4">
                  {[
                    { icon: Calendar, title: "Annual to Monthly", text: "Linear division by 12 months." },
                    { icon: Clock, title: "Daily & Hourly", text: "Dynamically calculated based on your custom weekly days and daily hours." }
                  ].map((item, i) => (
                    <li key={i} className="flex items-start space-x-4">
                      <div className="mt-1 p-2 bg-primary/5 rounded-lg">
                        <item.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <Card className="border-none shadow-none bg-muted/20 rounded-3xl p-8 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <p className="text-4xl font-mono font-bold tracking-tighter text-primary/80">$48.08</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Example Hourly Rate</p>
                </div>
              </Card>
            </div>
          </section>

          {/* Section 2: 50/30/20 Rule */}
          <section className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold tracking-tight">The 50/30/20 Budgeting Rule</h2>
              <div className="h-1 w-12 bg-primary/20 rounded-full" />
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-2xl">
              Our smart budget tab automatically splits your monthly net income into three intuitive categories to ensure long-term financial health.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: "Needs (50%)", desc: "For survival and obligations like rent and debt.", color: "bg-blue-500/10 text-blue-600" },
                { label: "Wants (30%)", desc: "For lifestyle and entertainment choices.", color: "bg-amber-500/10 text-amber-600" },
                { label: "Future (20%)", desc: "For emergency funds and investments.", color: "bg-emerald-500/10 text-emerald-600" }
              ].map((box, i) => (
                <div key={i} className={`p-6 rounded-2xl ${box.color} border border-current/5`}>
                  <p className="font-bold text-sm mb-2">{box.label}</p>
                  <p className="text-xs opacity-80 leading-relaxed">{box.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Currency Exchange */}
          <section className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold tracking-tight">Global Support</h2>
              <div className="h-1 w-12 bg-primary/20 rounded-full" />
            </div>
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="flex-1 space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  We support real-time exchange rate simulations for over 10 major global currencies. Whether you're a digital nomad or an international professional, visualize your earnings anywhere.
                </p>
                <div className="p-4 border border-border/40 rounded-2xl bg-background/50 flex items-center justify-between group cursor-help transition-all transform hover:translate-x-1">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-primary/60" />
                    <span className="text-sm font-medium">Barchart Live Benchmarks</span>
                  </div>
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                </div>
              </div>
              <div className="w-full md:w-64 aspect-square bg-primary/5 rounded-full border-8 border-background outline-1 outline-primary/10 flex items-center justify-center p-8 text-center animate-pulse">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">Live Rates Integrated</p>
              </div>
            </div>
          </section>

        </div>

        {/* Footer Link */}
        <section className="pt-24 pb-12 text-center border-t border-border/40">
          <p className="text-muted-foreground text-sm mb-6">Ready to see your breakdown?</p>
          <a href="/" className="inline-flex items-center space-x-2 text-primary font-semibold group border-b border-primary/20 pb-1 hover:border-primary transition-all">
            <span>Back to Calculator</span>
            <Calculator className="h-4 w-4 group-hover:rotate-12 transition-transform" />
          </a>
        </section>
      </main>
    </div>
  )
}
