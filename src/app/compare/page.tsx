"use client"

import { useEffect, useMemo, useState, type FormEvent } from "react"
import Link from "next/link"
import { ArrowRight, BriefcaseBusiness, Clock3, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CurrencyPicker } from "@/components/CurrencyPicker"

interface Offer {
  salary: string
  period: "annual" | "monthly"
  hours: string
  annualBonus: string
  signOnBonus: string
  annualBenefits: string
  commuteCostMonthly: string
  commuteHoursWeekly: string
  unpaidLeaveDays: string
}
interface Currency { code: string; name: string; symbol: string; rate: number }
const initialOffer: Offer = { salary: "", period: "annual", hours: "40", annualBonus: "", signOnBonus: "", annualBenefits: "", commuteCostMonthly: "", commuteHoursWeekly: "", unpaidLeaveDays: "" }
function evaluateOffer(offer: Offer) {
  const base = Number(offer.salary) * (offer.period === "monthly" ? 12 : 1)
  const annualBonus = Number(offer.annualBonus || 0)
  const signOnBonus = Number(offer.signOnBonus || 0)
  const benefits = Number(offer.annualBenefits || 0)
  const commute = Number(offer.commuteCostMonthly || 0) * 12
  const commuteHours = Number(offer.commuteHoursWeekly || 0)
  const unpaidLeaveDays = Number(offer.unpaidLeaveDays || 0)
  const hours = Number(offer.hours)
  const unpaidDeduction = base / 260 * unpaidLeaveDays
  const effectiveWorkHours = Math.max(1, hours * 52 - unpaidLeaveDays * hours / 5 + commuteHours * 52)
  const firstYearCashAfterCommute = base + annualBonus + signOnBonus - commute - unpaidDeduction
  const ongoingCashAfterCommute = base + annualBonus - commute - unpaidDeduction
  const totalFirstYearValue = firstYearCashAfterCommute + benefits
  return { base, annualBonus, signOnBonus, benefits, commute, commuteHours, unpaidLeaveDays, unpaidDeduction, hours, firstYearCashAfterCommute, ongoingCashAfterCommute, totalFirstYearValue, hourly: totalFirstYearValue / effectiveWorkHours }
}

export default function ComparePage() {
  const [offerA, setOfferA] = useState<Offer>(initialOffer)
  const [offerB, setOfferB] = useState<Offer>(initialOffer)
  const [currency, setCurrency] = useState("USD")
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    fetch("/api/exchange-rates").then((response) => response.json()).then((data: { currencies?: Currency[] }) => {
      if (data.currencies?.length) setCurrencies(data.currencies)
    }).catch(() => undefined)
  }, [])

  const comparison = useMemo(() => ({ a: evaluateOffer(offerA), b: evaluateOffer(offerB) }), [offerA, offerB])
  const format = (amount: number) => new Intl.NumberFormat("en", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount)
  function updateOffer<K extends keyof Offer>(which: "a" | "b", key: K, value: Offer[K]) {
    const setOffer = which === "a" ? setOfferA : setOfferB
    setOffer((current) => ({ ...current, [key]: value }))
    setShowResults(false)
  }
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setShowResults(true) }
  const winner = comparison.a.hourly === comparison.b.hourly ? "tie" : comparison.a.hourly > comparison.b.hourly ? "a" : "b"
  const lower = Math.min(comparison.a.hourly, comparison.b.hourly)
  const rateDifference = lower > 0 ? Math.abs(comparison.a.hourly - comparison.b.hourly) / lower * 100 : 0

  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <header className="mb-8 max-w-3xl space-y-4">
        <p className="w-fit rounded-base border-2 border-border bg-accent px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-foreground shadow-brutal-sm">A clearer way to choose</p>
        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">Compare the offer, <span className="inline-block -rotate-1 rounded-base border-2 border-border bg-highlight px-2">not just the salary.</span></h1>
        <p className="max-w-2xl text-base leading-7 sm:text-lg">Include bonuses, benefits, commute costs and weekly hours to see what each offer could mean in year one.</p>
        <p className="text-xs font-medium text-muted-foreground"><span className="font-bold text-foreground">*</span> Required. Leave fields showing “Optional” blank if you don&apos;t have those figures.</p>
      </header>
      <form onSubmit={submit} className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          {(["a", "b"] as const).map((which) => {
            const offer = which === "a" ? offerA : offerB
            const title = which === "a" ? "Offer A" : "Offer B"
            const accent = which === "a" ? "bg-card" : "bg-secondary"
            return <section key={which} className={`space-y-5 rounded-xl border-2 border-border p-5 shadow-brutal sm:p-6 ${accent}`}>
              <div className="flex items-center gap-3"><span className="rounded-base border-2 border-border bg-white p-2"><BriefcaseBusiness className="h-5 w-5 text-foreground" /></span><div><h2 className="font-heading text-xl font-bold text-foreground">{title}</h2><p className="text-sm">Use the figures in the offer.</p></div></div>
              <div className="space-y-2"><label htmlFor={`${which}-salary`} className="text-xs font-bold uppercase tracking-[0.14em] text-foreground">Base salary ({currency})<span aria-hidden="true" className="ml-1">*</span><span className="sr-only">, required</span></label><div className="grid grid-cols-[minmax(0,1fr)_7.5rem] gap-2"><Input id={`${which}-salary`} required min="1" step="any" type="number" inputMode="decimal" placeholder={offer.period === "monthly" ? "6,250" : "75,000"} value={offer.salary} onChange={(event) => updateOffer(which, "salary", event.target.value)} className="h-14 font-mono text-lg font-bold" /><Select value={offer.period} onValueChange={(period) => updateOffer(which, "period", period as Offer["period"])}><SelectTrigger size="lg" aria-label={`${title} pay frequency`} className="h-14 w-full px-2"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="annual">/ year</SelectItem><SelectItem value="monthly">/ month</SelectItem></SelectContent></Select></div></div>
              <div className="grid gap-4 sm:grid-cols-2">
                {([{ key: "hours", label: "Hours worked / week", placeholder: "40", min: "1", max: "168" }, { key: "annualBonus", label: "Expected annual bonus", placeholder: "Optional", min: "0" }, { key: "signOnBonus", label: "One-time sign-on bonus", placeholder: "Optional", min: "0" }, { key: "annualBenefits", label: "Benefits value / year", placeholder: "Optional", min: "0" }, { key: "commuteCostMonthly", label: "Commute cost / month", placeholder: "Optional", min: "0" }, { key: "commuteHoursWeekly", label: "Commute time / week", placeholder: "Optional", min: "0", max: "168" }, { key: "unpaidLeaveDays", label: "Unpaid leave days / year", placeholder: "Optional", min: "0", max: "260" }] as const).map((field) => <div key={field.key} className={`space-y-2 ${field.key === "unpaidLeaveDays" ? "sm:col-span-2" : ""}`}><label htmlFor={`${which}-${field.key}`} className="flex h-10 items-end pb-1 text-xs font-bold uppercase leading-4 tracking-[0.12em] text-foreground">{field.label}{field.key === "hours" && <><span aria-hidden="true" className="ml-1">*</span><span className="sr-only">, required</span></>}</label><div className={field.key === "hours" ? "relative" : ""}>{field.key === "hours" && <Clock3 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground" />}<Input id={`${which}-${field.key}`} required={field.key === "hours"} min={field.min} max={"max" in field ? field.max : undefined} step="any" type="number" inputMode="decimal" placeholder={field.placeholder} value={offer[field.key]} onChange={(event) => updateOffer(which, field.key, event.target.value)} className={`h-12 font-mono font-bold ${field.key === "hours" ? "pl-10" : ""}`} /></div></div>)}
              </div>
            </section>
          })}
        </div>
        <div className="flex flex-col gap-4 rounded-xl border-2 border-border bg-card p-5 shadow-brutal sm:flex-row sm:items-center sm:justify-between sm:p-6"><div className="w-full max-w-md space-y-2"><p className="text-xs font-bold uppercase tracking-[0.14em] text-foreground">Both offers use</p><CurrencyPicker currencies={currencies} value={currency} onChange={setCurrency} label="Offer currency" /><p className="text-xs leading-5">Enter both salaries and all extra values in the same currency.</p></div><Button type="submit" size="lg" className="h-14 w-full shrink-0 sm:w-auto">Compare total value <ArrowRight className="h-4 w-4" /></Button></div>
      </form>
      {showResults && <section aria-live="polite" className="mt-8 space-y-5 rounded-xl border-2 border-border bg-accent p-5 shadow-brutal-lg sm:p-8">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-foreground"><Sparkles className="h-4 w-4" /> Your first-year comparison</div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{winner === "tie" ? "Both offers have a similar estimated hourly value." : `Offer ${winner.toUpperCase()} has ${rateDifference.toLocaleString("en", { maximumFractionDigits: 1 })}% higher estimated value per work hour.`}</h2>
        <div className="grid gap-3 sm:grid-cols-2">{([{ name: "Offer A", ...comparison.a }, { name: "Offer B", ...comparison.b }]).map((item) => <article key={item.name} className="rounded-base border-2 border-border bg-white p-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-foreground">{item.name}</p><div className="mt-3 grid grid-cols-2 gap-3"><div><p className="text-xs">First-year cash after commute</p><p className="break-all font-mono text-lg font-bold text-foreground">{format(item.firstYearCashAfterCommute)}</p></div><div><p className="text-xs">With entered benefits</p><p className="break-all font-mono text-lg font-bold text-foreground">{format(item.totalFirstYearValue)}</p></div><div><p className="text-xs">Ongoing annual value*</p><p className="break-all font-mono text-lg font-bold text-foreground">{format(item.ongoingCashAfterCommute + item.benefits)}</p></div><div><p className="text-xs">Estimated value / work hour</p><p className="break-all font-mono text-lg font-bold text-foreground">{format(item.hourly)}</p></div></div></article>)}</div>
        <p className="text-xs leading-5 text-foreground">*Ongoing value excludes the one-time sign-on bonus. Benefits are valued only as you entered them; this estimate does not include taxes, investment returns, or paid leave differences.</p>
        <Button asChild variant="neutral" size="sm"><Link href="/">Break down one salary <ArrowRight className="h-4 w-4" /></Link></Button>
      </section>}
      <p className="mt-8 rounded-base border-2 border-dashed border-border bg-muted p-4 text-sm leading-6">This is a planning estimate, not take-home pay. Unpaid leave uses a five-day, 260-workday year; commute time is added to annual committed hours. Benefits are user-valued, and differences in paid leave, taxes or investment returns are not estimated.</p>
    </main>
  )
}
