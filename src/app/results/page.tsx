"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CurrencyPicker } from "@/components/CurrencyPicker"
import { Calendar, CalendarClock, CalendarDays, ChevronLeft, Clock, Download, Home, PiggyBank, ShoppingBag, Wallet, Hourglass, Target } from "lucide-react"

interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number;
}

interface ExchangeRatesResponse {
  currencies: Currency[];
  live: boolean;
  updatedAt: string | null;
  provider: string;
}

interface Breakdowns {
  annual: number;
  monthly: number;
  weekly: number;
  daily: number;
  hourly: number;
  budget: {
    needs: number;
    wants: number;
    savings: number;
  };
}

function ResultsContent() {
  const router = useRouter()
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null)
  const [convertedCurrency, setConvertedCurrency] = useState<Currency | null>(null)
  const [ratesUpdatedAt, setRatesUpdatedAt] = useState<string | null>(null)
  const [rateProvider, setRateProvider] = useState("Exchange rates")
  const [budgetSplit, setBudgetSplit] = useState({ needs: 50, wants: 30, savings: 20 })
  const [budgetAmount, setBudgetAmount] = useState("")
  const [monthlyExpenses, setMonthlyExpenses] = useState("")
  const [purchaseCost, setPurchaseCost] = useState("")
  const [savingsGoal, setSavingsGoal] = useState("")
  const [monthlySaving, setMonthlySaving] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [salary, setSalary] = useState("")
  const [salaryPeriod, setSalaryPeriod] = useState<"annual" | "monthly">("monthly")
  const [currencyCode, setCurrencyCode] = useState("INR")
  const [workDays, setWorkDays] = useState("5")
  const [workHours, setWorkHours] = useState("8")
  const [inputLoaded, setInputLoaded] = useState(false)

  // Hydrate private salary inputs from this tab's session storage after the server render.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const savedInput = sessionStorage.getItem("salarysplit:salary-input")
      if (!savedInput) return
      const input = JSON.parse(savedInput) as { salary?: string; salaryPeriod?: string; currency?: string; workDays?: string; workHours?: string }
      if (input.salary && Number(input.salary) > 0) setSalary(input.salary)
      if (input.salaryPeriod === "annual" || input.salaryPeriod === "monthly") setSalaryPeriod(input.salaryPeriod)
      if (input.currency) setCurrencyCode(input.currency)
      if (input.workDays) setWorkDays(input.workDays)
      if (input.workHours) setWorkHours(input.workHours)
    } catch {
      sessionStorage.removeItem("salarysplit:salary-input")
    } finally {
      setInputLoaded(true)
    }
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    const fetchCurrencyData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/exchange-rates")
        if (!response.ok) throw new Error("Currency service unavailable")

        const data = (await response.json()) as ExchangeRatesResponse
        const loadedCurrencies = data.currencies
        const baseCurrency = loadedCurrencies.find((item) => item.code === currencyCode) || loadedCurrencies[0] || null

        setCurrencies(loadedCurrencies)
        setSelectedCurrency(baseCurrency)
        setConvertedCurrency(baseCurrency)
        setRatesUpdatedAt(data.updatedAt)
        setRateProvider(data.provider)
        setError(data.live ? null : "Live exchange rates are unavailable. Currency conversions are using fallback rates.")
      } catch (err) {
        console.error("Currency fetch failed:", err)
        setError("Currency service unavailable.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCurrencyData()
  }, [currencyCode])

  const breakdowns = useMemo<Breakdowns | null>(() => {
    const inputSalary = Number.parseFloat(salary)
    const parsedWorkDays = Number.parseInt(workDays || "5")
    const parsedWorkHours = Number.parseInt(workHours || "8")

    if (!Number.isFinite(inputSalary) || inputSalary <= 0 || !Number.isFinite(parsedWorkDays) || !Number.isFinite(parsedWorkHours)) {
      return null
    }

    const annualSalary = salaryPeriod === "monthly" ? inputSalary * 12 : inputSalary
    const monthly = annualSalary / 12
    const weekly = annualSalary / 52
    const daily = annualSalary / (52 * parsedWorkDays)
    const hourly = daily / parsedWorkHours

    return {
      annual: annualSalary,
      monthly,
      weekly,
      daily,
      hourly,
      budget: {
        needs: monthly * 0.5,
        wants: monthly * 0.3,
        savings: monthly * 0.2,
      },
    }
  }, [salary, salaryPeriod, workDays, workHours])

  function convertCurrency(amount: number, fromCurrency: Currency | null, toCurrency: Currency | null): number {
    if (!fromCurrency || !toCurrency) return amount
    const amountInUSD = fromCurrency.code === "USD" ? amount : amount / fromCurrency.rate
    return toCurrency.code === "USD" ? amountInUSD : amountInUSD * toCurrency.rate
  }

  function formatCurrency(amount: number, currency: Currency | null): string {
    if (!currency) return amount.toFixed(2)
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.code,
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(amount)
  }

  function downloadBreakdown() {
    if (!breakdowns || !selectedCurrency) return

    let csvContent = "Time Period,In Original Currency,In Converted Currency\n"
    csvContent += `Annual,${formatCurrency(breakdowns.annual, selectedCurrency)},${formatCurrency(convertCurrency(breakdowns.annual, selectedCurrency, convertedCurrency), convertedCurrency)}\n`
    csvContent += `Monthly,${formatCurrency(breakdowns.monthly, selectedCurrency)},${formatCurrency(convertCurrency(breakdowns.monthly, selectedCurrency, convertedCurrency), convertedCurrency)}\n`
    csvContent += `Weekly,${formatCurrency(breakdowns.weekly, selectedCurrency)},${formatCurrency(convertCurrency(breakdowns.weekly, selectedCurrency, convertedCurrency), convertedCurrency)}\n`
    csvContent += `Daily,${formatCurrency(breakdowns.daily, selectedCurrency)},${formatCurrency(convertCurrency(breakdowns.daily, selectedCurrency, convertedCurrency), convertedCurrency)}\n`
    csvContent += `Hourly,${formatCurrency(breakdowns.hourly, selectedCurrency)},${formatCurrency(convertCurrency(breakdowns.hourly, selectedCurrency, convertedCurrency), convertedCurrency)}\n`
    csvContent += `\nGenerated by SalarySplit on ${new Date().toLocaleDateString()}\n`

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `salary-breakdown-${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formattedRateDate = ratesUpdatedAt
    ? new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${ratesUpdatedAt.slice(0, 10)}T12:00:00Z`))
    : null

  const plannedMonthlyIncome = Number(budgetAmount) > 0 ? Number(budgetAmount) : breakdowns?.monthly ?? 0
  const purchaseWorkHours = Number(purchaseCost) > 0 && breakdowns ? Number(purchaseCost) / breakdowns.hourly : 0
  const savingsMonths = Number(savingsGoal) > 0 && Number(monthlySaving) > 0 ? Math.ceil(Number(savingsGoal) / Number(monthlySaving)) : 0
  const monthlyRemainder = monthlyExpenses ? plannedMonthlyIncome - Number(monthlyExpenses) : null

  function setBudgetPreset(needs: number, wants: number, savings: number) {
    setBudgetSplit({ needs, wants, savings })
  }

  function updateNeeds(value: number) {
    const wants = Math.min(budgetSplit.wants, 100 - value)
    setBudgetSplit({ needs: value, wants, savings: 100 - value - wants })
  }

  function updateWants(value: number) {
    setBudgetSplit({ ...budgetSplit, wants: value, savings: 100 - budgetSplit.needs - value })
  }

  const labelClass = "ml-1 text-xs font-bold uppercase tracking-[0.14em] text-foreground"
  const eyebrowClass = "w-fit rounded-base border-2 border-border bg-card px-2.5 py-0.5 text-xs font-bold uppercase tracking-[0.16em] text-foreground"

  if (!inputLoaded) return <main className="min-h-screen" aria-label="Loading salary breakdown" />

  if (!salary || !breakdowns) {
    return (
      <div className="min-h-screen px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-xl border-2 border-border bg-card p-8 text-center shadow-brutal-lg sm:p-10">
          <h1 className="text-3xl font-bold tracking-tight">No salary input found.</h1>
          <p className="mt-4 text-sm leading-6">
            Start from the calculator page and submit the form to view your breakdown.
          </p>
          <Button size="lg" className="mt-8" onClick={() => router.push("/")}>
            Back to Calculator
          </Button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {error && <div role="status" className="mb-6 rounded-base border-2 border-border bg-destructive-soft p-4 shadow-brutal-sm"><p className="text-sm font-semibold text-foreground">{error}</p></div>}

        <div className="mb-7 flex items-center justify-between gap-3">
          <Button asChild variant="neutral" size="sm"><Link href="/"><ChevronLeft className="h-4 w-4" />Back to calculator</Link></Button>
          <Button variant="neutral" size="sm" onClick={downloadBreakdown}><Download className="h-4 w-4" />Export CSV</Button>
        </div>

        {isLoading || !selectedCurrency ? (
          <div className="space-y-5"><div className="h-64 animate-pulse rounded-xl border-2 border-border bg-secondary" /><div className="h-96 animate-pulse rounded-xl border-2 border-border bg-card" /></div>
        ) : (
          <div className="space-y-10">
            <section className="rounded-xl border-2 border-border bg-accent p-6 shadow-brutal-lg sm:p-9">
              <p className={eyebrowClass}>Your salary snapshot</p>
              <div className="mt-5 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Here&apos;s what your pay looks like.</h1>
                  <p className="mt-3 text-sm leading-6 text-foreground">Based on {formatCurrency(Number(salary), selectedCurrency)} {salaryPeriod}, before tax and deductions. Your estimate uses {workDays} work days a week and {workHours} hours a day.</p>
                  <div className="mt-7 rounded-base border-2 border-border bg-white p-5 sm:p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-foreground">Monthly gross pay</p>
                    <p className="mt-2 break-all font-mono text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{formatCurrency(breakdowns.monthly, selectedCurrency)}</p>
                    <p className="mt-2 text-sm">A monthly equivalent, before tax and other deductions.</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-base border-2 border-border bg-mint p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-foreground">Per work hour</p>
                    <p className="mt-2 break-all font-mono text-2xl font-bold text-foreground">{formatCurrency(breakdowns.hourly, selectedCurrency)}</p>
                  </div>
                  <div className="rounded-base border-2 border-border bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-foreground">Per work day</p>
                    <p className="mt-2 break-all font-mono text-2xl font-bold text-foreground">{formatCurrency(breakdowns.daily, selectedCurrency)}</p>
                  </div>
                  <div className="col-span-2 rounded-base border-2 border-border bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-foreground">Per week</p>
                    <p className="mt-2 break-all font-mono text-2xl font-bold text-foreground">{formatCurrency(breakdowns.weekly, selectedCurrency)}</p>
                  </div>
                </div>
              </div>
            </section>

            <nav aria-label="On this page" className="flex flex-wrap gap-2">
              {[["#pay-breakdown", "Pay breakdown"], ["#currency", "Currency conversion"], ["#budget", "Monthly plan"], ["#tools", "Work & savings tools"]].map(([href, label]) => (
                <a key={href} href={href} className="rounded-base border-2 border-border bg-card px-3 py-2 text-sm font-semibold text-foreground shadow-brutal-sm transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">{label}</a>
              ))}
            </nav>

            <section id="pay-breakdown" className="scroll-mt-24 space-y-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div><p className={eyebrowClass}>Your pay, by timeframe</p><h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">One salary. Five useful views.</h2></div>
                <p className="text-sm">All amounts shown in {selectedCurrency.code}.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {[
                  { label: "Annual", note: "Full year", amount: breakdowns.annual, icon: Calendar, style: "bg-card" },
                  { label: "Monthly", note: "Budget from this", amount: breakdowns.monthly, icon: CalendarDays, style: "bg-secondary" },
                  { label: "Weekly", note: "Per week", amount: breakdowns.weekly, icon: CalendarClock, style: "bg-card" },
                  { label: "Daily", note: `${workDays} days / week`, amount: breakdowns.daily, icon: Clock, style: "bg-card" },
                  { label: "Hourly", note: `${workHours} hours / day`, amount: breakdowns.hourly, icon: Clock, style: "bg-mint" },
                ].map((item) => (
                  <article key={item.label} className={`rounded-xl border-2 border-border p-4 shadow-brutal-sm ${item.style}`}>
                    <item.icon className="h-5 w-5 text-foreground" />
                    <p className="mt-4 text-sm font-bold text-foreground">{item.label}</p>
                    <p className="mt-1 break-all font-mono text-xl font-bold tracking-tight text-foreground">{formatCurrency(item.amount, selectedCurrency)}</p>
                    <p className="mt-1 text-xs">{item.note}</p>
                  </article>
                ))}
              </div>
            </section>

            <section id="currency" className="scroll-mt-24 rounded-xl border-2 border-border bg-white p-5 shadow-brutal-lg sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div><p className={eyebrowClass}>Take your pay with you</p><h2 className="mt-3 text-2xl font-bold tracking-tight">Convert your salary</h2><p className="mt-2 max-w-xl text-sm leading-6">See what your earnings look like in another currency, using the exchange rate available to SalarySplit.</p></div>
                <div className="w-full space-y-2 sm:max-w-xs">
                  <p className={labelClass}>Show amounts in</p>
                  <CurrencyPicker currencies={currencies} value={convertedCurrency?.code || selectedCurrency.code} onChange={(code) => setConvertedCurrency(currencies.find((item) => item.code === code) || null)} label="Display currency" />
                </div>
              </div>
              <div className="mt-6 rounded-base border-2 border-dashed border-border bg-muted p-3 text-sm font-semibold text-foreground">1 {selectedCurrency.code} = {((convertedCurrency?.rate || selectedCurrency.rate) / selectedCurrency.rate).toFixed(4)} {convertedCurrency?.code || selectedCurrency.code}</div>
              <p className="mt-2 text-xs leading-5">Rate source: {rateProvider}. {formattedRateDate ? `Last available update: ${formattedRateDate}.` : "Update date unavailable."} Reference mid-market rates are estimates, not card or bank transaction rates. {rateProvider.startsWith("Frankfurter") && <a href="https://frankfurter.dev/" target="_blank" rel="noreferrer" className="font-semibold text-foreground underline underline-offset-2">About Frankfurter</a>}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[{ label: "Annual", amount: breakdowns.annual }, { label: "Monthly", amount: breakdowns.monthly }, { label: "Hourly", amount: breakdowns.hourly }].map((item) => (
                  <div key={item.label} className="rounded-base border-2 border-border bg-secondary p-4"><p className="text-xs font-bold uppercase tracking-[0.12em] text-foreground">{item.label}</p><p className="mt-2 break-all font-mono text-xl font-bold text-foreground">{formatCurrency(convertCurrency(item.amount, selectedCurrency, convertedCurrency), convertedCurrency)}</p></div>
                ))}
              </div>
            </section>

            <section id="budget" className="scroll-mt-24 rounded-xl border-2 border-border bg-card p-5 shadow-brutal-lg sm:p-7">
              <div><p className={eyebrowClass}>Make it yours</p><h2 className="mt-3 text-2xl font-bold tracking-tight">Plan your month</h2><p className="mt-2 max-w-xl text-sm leading-6">Start with a common 50/30/20 split, then adjust the amounts to fit your priorities.</p></div>
              <div className="mt-5 grid gap-3 rounded-base border-2 border-border bg-muted p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                <div className="space-y-2"><label htmlFor="monthly-expenses" className={labelClass}>My monthly bills and spending</label><Input id="monthly-expenses" type="number" min="0" step="any" inputMode="decimal" placeholder="Enter your monthly expenses" value={monthlyExpenses} onChange={(event) => setMonthlyExpenses(event.target.value)} className="h-11 font-mono font-bold" /></div>
                <div className="space-y-2"><label htmlFor="take-home" className={labelClass}>Monthly take-home pay (optional)</label><Input id="take-home" type="number" min="1" step="any" inputMode="decimal" placeholder={breakdowns.monthly.toFixed(0)} value={budgetAmount} onChange={(event) => setBudgetAmount(event.target.value)} className="h-11 font-mono font-bold" /></div>
                {monthlyRemainder !== null && <p className={`rounded-base border-2 border-border p-3 text-sm font-bold text-foreground ${monthlyRemainder >= 0 ? "bg-mint" : "bg-destructive-soft"}`}>{monthlyRemainder >= 0 ? `${formatCurrency(monthlyRemainder, selectedCurrency)} left after entered spending` : `${formatCurrency(Math.abs(monthlyRemainder), selectedCurrency)} above entered monthly pay`}</p>}
              </div>
              <p className="mt-2 text-xs">Enter take-home pay and real monthly expenses for a more realistic estimate. Values stay in this page and are not saved.</p>
              <div className="mt-5 flex flex-wrap gap-2" aria-label="Budget presets">
                {[[50, 30, 20, "Balanced"], [50, 20, 30, "Save more"], [60, 30, 10, "Essentials first"]].map(([needs, wants, savings, label]) => {
                  const selected = budgetSplit.needs === needs && budgetSplit.wants === wants && budgetSplit.savings === savings
                  return <button key={label} type="button" onClick={() => setBudgetPreset(Number(needs), Number(wants), Number(savings))} aria-pressed={selected} className={`rounded-base border-2 border-border px-3 py-2 text-sm font-semibold transition-all ${selected ? "translate-x-[2px] translate-y-[2px] bg-secondary text-foreground shadow-brutal-sm" : "bg-white text-foreground shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"}`}>{label}</button>
                })}
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                {[
                  { key: "needs" as const, label: "Needs", description: "Housing, bills, groceries", icon: Home, background: "bg-accent", value: budgetSplit.needs },
                  { key: "wants" as const, label: "Wants", description: "Lifestyle and fun", icon: ShoppingBag, background: "bg-sunrise", value: budgetSplit.wants },
                  { key: "savings" as const, label: "Future", description: "Savings and debt goals", icon: PiggyBank, background: "bg-mint", value: budgetSplit.savings },
                ].map((item) => (
                  <article key={item.key} className={`rounded-xl border-2 border-border p-4 ${item.background}`}>
                    <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><span className="rounded-base border-2 border-border bg-white p-2"><item.icon className="h-4 w-4 text-foreground" /></span><div><h3 className="text-sm font-bold text-foreground">{item.label}</h3><p className="text-xs text-foreground">{item.description}</p></div></div><span className="font-mono text-xl font-bold text-foreground">{item.value}%</span></div>
                    <p className="mt-4 break-all font-mono text-2xl font-bold tracking-tight text-foreground">{formatCurrency(plannedMonthlyIncome * item.value / 100, selectedCurrency)}</p>
                    {item.key !== "savings" ? <label className="mt-4 block text-xs font-semibold text-foreground">Adjust {item.label.toLowerCase()} share<input type="range" min="0" max={item.key === "needs" ? 100 - budgetSplit.wants : 100 - budgetSplit.needs} value={item.value} onChange={(event) => item.key === "needs" ? updateNeeds(Number(event.target.value)) : updateWants(Number(event.target.value))} className="mt-2 block w-full accent-ink" aria-label={`${item.label} percentage`} /></label> : <p className="mt-4 text-xs font-medium text-foreground">Your remaining share. The plan always adds up to 100%.</p>}
                  </article>
                ))}
              </div>
              <p className="mt-4 text-xs leading-5">The 50/30/20 split is a starting point, not a rule. It applies your entered monthly pay; enter take-home pay above for a more realistic plan.</p>
            </section>

            <section id="tools" className="scroll-mt-24 space-y-5">
              <div><p className={eyebrowClass}>Make your numbers practical</p><h2 className="mt-3 text-2xl font-bold tracking-tight">Tools for the choices ahead</h2><p className="mt-2 max-w-2xl text-sm leading-6">Use your hourly pay to put a price in work time, or set a savings target and monthly contribution.</p></div>
              <div className="grid gap-4 lg:grid-cols-2">
                <article className="space-y-4 rounded-xl border-2 border-border bg-secondary p-5 shadow-brutal">
                  <div className="flex items-center gap-3"><span className="rounded-base border-2 border-border bg-white p-2"><Hourglass className="h-5 w-5 text-foreground" /></span><div><h3 className="font-heading text-lg font-bold text-foreground">What does it cost in work time?</h3><p className="text-sm">Based on gross hourly pay and your work week.</p></div></div>
                  <label htmlFor="purchase-cost" className={labelClass}>Item price ({selectedCurrency.code})</label><Input id="purchase-cost" type="number" min="0" step="any" inputMode="decimal" placeholder="For example, 800" value={purchaseCost} onChange={(event) => setPurchaseCost(event.target.value)} className="h-12 font-mono text-lg font-bold" />
                  {purchaseWorkHours > 0 && <p aria-live="polite" className="rounded-base border-2 border-border bg-white p-4 text-sm font-semibold text-foreground">That is about <strong>{purchaseWorkHours.toLocaleString("en", { maximumFractionDigits: 1 })} work hours</strong> or {(purchaseWorkHours / Number(workHours)).toLocaleString("en", { maximumFractionDigits: 1 })} workdays.</p>}
                </article>
                <article className="space-y-4 rounded-xl border-2 border-border bg-mint p-5 shadow-brutal">
                  <div className="flex items-center gap-3"><span className="rounded-base border-2 border-border bg-white p-2"><Target className="h-5 w-5 text-foreground" /></span><div><h3 className="font-heading text-lg font-bold text-foreground">Savings goal timeline</h3><p className="text-sm text-foreground">Estimate a timeline from the amount you can set aside.</p></div></div>
                  <div className="grid gap-3 sm:grid-cols-2"><div><label htmlFor="savings-goal" className={labelClass}>Target ({selectedCurrency.code})</label><Input id="savings-goal" type="number" min="1" step="any" inputMode="decimal" placeholder="10,000" value={savingsGoal} onChange={(event) => setSavingsGoal(event.target.value)} className="mt-2 h-12 bg-white font-mono font-bold" /></div><div><label htmlFor="monthly-saving" className={labelClass}>Save each month</label><Input id="monthly-saving" type="number" min="1" step="any" inputMode="decimal" placeholder="500" value={monthlySaving} onChange={(event) => setMonthlySaving(event.target.value)} className="mt-2 h-12 bg-white font-mono font-bold" /></div></div>
                  {savingsMonths > 0 && <p aria-live="polite" className="rounded-base border-2 border-border bg-white p-4 text-sm font-semibold text-foreground">At that pace, you could reach this target in <strong>{savingsMonths} {savingsMonths === 1 ? "month" : "months"}</strong>.</p>}
                </article>
              </div>
            </section>
            <div className="flex justify-center pt-2"><Button asChild variant="neutral"><Link href="/compare"><Wallet className="h-4 w-4" />Compare another offer</Link></Button></div>
          </div>
        )}
      </div>
    </main>
  )
}

export default function ResultsPage() { return <ResultsContent /> }
