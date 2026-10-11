"use client"

import { Clock, Calendar, ShieldCheck, TrendingUp, BookOpen, Scale } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DocsPage() {
  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-4xl space-y-16 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        {/* Header Section */}
        <section className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex w-fit items-center gap-2 rounded-base border-2 border-border bg-accent px-3 py-1 text-foreground shadow-brutal-sm">
            <BookOpen className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-[0.16em]">How it works</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Choose a job with a clearer view of what it asks{" "}
            <span className="inline-block rounded-base border-2 border-border bg-highlight px-2">of you.</span>
          </h1>
          <p className="max-w-2xl text-xl leading-relaxed">
            Salary alone is only part of an offer. Compare the pay with the time you commit, then understand your earnings across the week and month.
          </p>
        </section>

        <section className="grid gap-5 rounded-xl border-2 border-border bg-accent p-6 shadow-brutal-lg sm:grid-cols-[auto_1fr] sm:items-center sm:p-8">
          <div className="w-fit rounded-base border-2 border-border bg-card p-3"><Scale className="h-6 w-6 text-foreground" /></div>
          <div className="space-y-2"><h2 className="text-2xl font-bold tracking-tight">Compare offers by value and time</h2><p className="leading-relaxed">Enter salary, weekly hours, annual and sign-on bonuses, optional benefits value, and monthly commute costs. Compare estimated first-year and ongoing value alongside value per work hour.</p><p className="text-sm font-medium text-foreground">These are user-entered planning estimates. SalarySplit does not estimate taxes or value paid leave for you.</p></div>
        </section>

        {/* Section 1: Calculations */}
        <section className="space-y-8 rounded-xl border-2 border-border bg-card p-6 shadow-brutal-lg sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <h2 className="text-3xl font-bold tracking-tight">Understand one salary</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <p className="leading-relaxed">
                See how a salary translates into different pay periods. Customize your <span className="font-semibold text-foreground">work days and hours</span> to estimate your daily and hourly gross pay.
              </p>
              <ul className="space-y-4 pt-2">
                {[
                  { icon: Calendar, title: "Annual to Monthly", text: "Linear division by 12 months." },
                  { icon: Clock, title: "Daily & Hourly", text: "Dynamically calculated based on your custom weekly days and daily hours." }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="mt-0.5 rounded-base border-2 border-border bg-secondary p-2">
                      <item.icon className="h-4 w-4 text-foreground" />
                    </div>
                    <div>
                      <p className="font-heading font-bold text-foreground">{item.title}</p>
                      <p className="text-sm">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <Card className="flex items-center justify-center rounded-xl bg-secondary p-8">
              <div className="space-y-2 text-center">
                <p className="font-mono text-4xl font-bold tracking-tighter text-foreground">$48.08</p>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-foreground">Example Hourly Rate</p>
              </div>
            </Card>
          </div>
        </section>

        {/* Section 2: 50/30/20 Rule */}
        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tight">The 50/30/20 Budgeting Rule</h2>
            <p className="max-w-2xl leading-relaxed">
              Use a flexible percentage plan, then enter your take-home pay and monthly expenses to estimate what remains. You can also estimate how long a savings target may take.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {[
              { label: "Needs (50%)", desc: "For survival and obligations like rent and debt.", bg: "bg-accent" },
              { label: "Wants (30%)", desc: "For lifestyle and entertainment choices.", bg: "bg-sunrise" },
              { label: "Future (20%)", desc: "For emergency funds and investments.", bg: "bg-mint" }
            ].map((box, i) => (
              <div key={i} className={`rounded-xl border-2 border-border p-6 shadow-brutal ${box.bg}`}>
                <p className="mb-2 font-heading text-lg font-bold text-foreground">{box.label}</p>
                <p className="text-sm leading-relaxed text-foreground/80">{box.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Currency Exchange */}
        <section className="space-y-8 rounded-xl border-2 border-border bg-muted p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <h2 className="text-3xl font-bold tracking-tight">Global Support</h2>
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center">
            <div className="flex-1 space-y-6">
              <p className="leading-relaxed">
                Currency conversions use daily reference rates from Frankfurter, a free service that aggregates official sources. Rates can differ from the rates used by banks or card providers.
              </p>
              <div className="flex items-center justify-between rounded-base border-2 border-border bg-card p-4 shadow-brutal-sm">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-foreground" />
                  <span className="text-sm font-semibold text-foreground">Dated reference rates</span>
                </div>
                <ShieldCheck className="h-5 w-5 text-foreground" />
              </div>
            </div>
            <div className="mx-auto flex aspect-square w-48 shrink-0 items-center justify-center rounded-full border-2 border-border bg-accent p-8 text-center shadow-brutal">
              <p className="font-heading text-sm font-bold uppercase tracking-[0.14em] text-foreground">Updated daily</p>
            </div>
          </div>
        </section>

        {/* Footer Link */}
        <section className="pt-8 text-center">
          <p className="mb-6 text-base">Ready to make a clearer decision?</p>
          <Button asChild size="lg">
            <Link href="/compare">
              Compare two offers
              <Scale className="h-4 w-4" />
            </Link>
          </Button>
          <p className="mt-4 text-sm"><Link href="/" className="font-semibold text-foreground underline underline-offset-4">Or break down one salary</Link></p>
        </section>
      </main>
    </div>
  )
}
