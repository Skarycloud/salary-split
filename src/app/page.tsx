"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { CurrencyPicker } from "@/components/CurrencyPicker"
import { ArrowRight, CalendarDays, ChevronDown, Clock3, Coins } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

interface FormValues {
  salary: string;
  salaryPeriod: "annual" | "monthly";
  currency: string;
  workDays: string;
  workHours: string;
}

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

const formSchema = z.object({
  salary: z
    .string()
    .min(1, "Salary is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Salary must be a positive number" }),
  salaryPeriod: z.enum(["annual", "monthly"]),
  currency: z.string().min(1, "Currency is required"),
  workDays: z.string().refine((val) => val === "" || (!isNaN(Number(val)) && Number(val) >= 1 && Number(val) <= 7), { message: "1-7 days" }),
  workHours: z.string().refine((val) => val === "" || (!isNaN(Number(val)) && Number(val) >= 1 && Number(val) <= 24), { message: "1-24 hours" }),
})

export default function SalarySplit() {
  const router = useRouter()
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      salary: "",
      salaryPeriod: "monthly",
      currency: "INR",
      workDays: "",
      workHours: "",
    },
  })
  const salaryPeriod = useWatch({ control: form.control, name: "salaryPeriod" })
  const selectedCurrencyCode = useWatch({ control: form.control, name: "currency" })
  const selectedCurrencySymbol = currencies.find((item) => item.code === selectedCurrencyCode)?.symbol || "¤"

  useEffect(() => {
    const fetchCurrencyData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/exchange-rates")
        if (!response.ok) throw new Error("Currency service unavailable")

        const data = (await response.json()) as ExchangeRatesResponse
        setCurrencies(data.currencies)
        setError(data.live ? null : "Live exchange rates are unavailable. Currency conversions are using fallback rates.")
      } catch (err) {
        console.error("Currency fetch failed:", err)
        setError("Currency service unavailable.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCurrencyData()
  }, [])

  function onSubmit(values: FormValues) {
    sessionStorage.setItem("salarysplit:salary-input", JSON.stringify(values))
    router.push("/results")
  }

  const labelClass = "text-xs font-bold uppercase tracking-[0.14em] text-foreground"

  return (
    <div className="min-h-screen">
      <div className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14 lg:px-8 lg:py-16">
        {error && (
          <div role="status" className="col-span-full rounded-base border-2 border-border bg-destructive-soft p-4 shadow-brutal-sm">
            <p className="text-center text-sm font-semibold text-foreground">{error}</p>
          </div>
        )}

        <section className="space-y-6 lg:py-8">
          <p className="w-fit rounded-base border-2 border-border bg-accent px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-foreground shadow-brutal-sm">Make your next move with clarity</p>
          <h1 className="max-w-xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Know what a job offer is <span className="inline-block -rotate-1 rounded-base border-2 border-border bg-highlight px-2">really worth.</span>
          </h1>
          <p className="max-w-lg text-base leading-7 sm:text-lg">Compare pay with the hours it asks of you. See which offer pays more per hour, then turn your salary into a practical monthly breakdown.</p>
          <Button asChild variant="neutral" className="w-fit">
            <Link href="/compare">Compare two offers <ArrowRight className="h-4 w-4" /></Link>
          </Button>
          <div className="grid gap-3 pt-1 sm:grid-cols-3 lg:grid-cols-1">
            {[
              { icon: CalendarDays, title: "Compare offers", detail: "See pay beside time worked" },
              { icon: Coins, title: "Know your rate", detail: "See what each work hour pays" },
              { icon: Clock3, title: "Plan your month", detail: "See a clear salary breakdown" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3 rounded-base border-2 border-border bg-card p-3 shadow-brutal-sm">
                <span className="rounded-base border-2 border-border bg-secondary p-2"><item.icon className="h-4 w-4 text-foreground" /></span>
                <span><span className="block text-sm font-bold text-foreground">{item.title}</span><span className="text-xs">{item.detail}</span></span>
              </div>
            ))}
          </div>
        </section>

        <Card className="rounded-xl p-0 shadow-brutal-lg">
          <CardContent className="p-5 sm:p-8">
            <div className="mb-7 space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">Start with your salary</h2>
              <p className="text-sm">Enter your gross pay and choose how often you receive it.</p>
            </div>
            {isLoading ? (
              <div className="space-y-8">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-16 w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                </div>
                <Skeleton className="h-14 w-full" />
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
                  <FormField
                    control={form.control}
                    name="salaryPeriod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className={labelClass}>How often are you paid?</FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { label: "Monthly", value: "monthly" as const },
                              { label: "Annual", value: "annual" as const },
                            ].map((option) => (
                              <label
                                key={option.value}
                                className={`flex cursor-pointer items-center justify-center gap-3 rounded-base border-2 border-border px-4 py-3 text-sm font-bold transition-all has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-ring ${
                                  field.value === option.value
                                    ? "translate-x-[2px] translate-y-[2px] bg-accent text-foreground shadow-brutal-sm"
                                    : "bg-card text-muted-foreground shadow-brutal hover:bg-secondary hover:text-foreground"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={field.name}
                                  value={option.value}
                                  checked={field.value === option.value}
                                  onChange={() => field.onChange(option.value)}
                                  className="h-4 w-4 accent-[var(--color-ink)]"
                                />
                                <span>{option.label}</span>
                              </label>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className={labelClass}>
                          {salaryPeriod === "monthly" ? "Monthly Salary" : "Annual Salary"}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 font-heading text-xl font-bold text-foreground">{selectedCurrencySymbol}</span>
                            <Input
                              inputMode="decimal"
                              className="h-16 pl-12 pr-4 font-heading text-3xl font-bold placeholder:font-medium md:text-3xl"
                              placeholder={salaryPeriod === "monthly" ? "6,250" : "75,000"}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <details className="group rounded-base border-2 border-border bg-muted p-4 sm:p-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-sm text-left outline-none focus-visible:ring-4 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                      <span><span className="block text-sm font-bold text-foreground">Your work week <span className="font-normal text-muted-foreground">· optional</span></span><span className="mt-1 block text-xs">Defaults to 5 days and 8 hours. Customize your daily and hourly estimates.</span></span>
                      <ChevronDown className="h-5 w-5 shrink-0 text-foreground transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="mt-4 grid grid-cols-2 gap-4 border-t-2 border-border/20 pt-4 sm:gap-5">
                    <FormField
                      control={form.control}
                      name="workDays"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className={labelClass}>Days / Week</FormLabel>
                          <FormControl>
                            <Input
                              inputMode="numeric"
                              className="h-14 px-4 font-heading text-2xl font-bold placeholder:font-medium md:text-2xl"
                              placeholder="5"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="workHours"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className={labelClass}>Hours / Day</FormLabel>
                          <FormControl>
                            <Input
                              inputMode="numeric"
                              className="h-14 px-4 font-heading text-2xl font-bold placeholder:font-medium md:text-2xl"
                              placeholder="8"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    </div>
                  </details>

                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className={labelClass}>Currency</FormLabel>
                        <FormControl>
                          <CurrencyPicker currencies={currencies} value={field.value} onChange={field.onChange} label="Salary currency" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" size="lg" className="h-14 w-full text-lg">
                    Show my salary breakdown <ArrowRight className="h-5 w-5" />
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
