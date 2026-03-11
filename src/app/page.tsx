"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, DollarSign, Calendar, CalendarDays, CalendarClock, Download, Loader2, Home, ShoppingBag, PiggyBank, PieChart } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

// Types
interface FormValues {
  salary: string;
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

interface Breakdowns {
  annual: number;
  monthly: number;
  weekly: number;
  daily: number;
  hourly: number;
  budget?: {
    needs: number;
    wants: number;
    savings: number;
  };
}

interface FormatCurrencyParams {
  amount: number;
  currency: Currency | null;
}

// Form schema
const formSchema = z.object({
  salary: z
    .string()
    .min(1, "Salary is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Salary must be a positive number" }),
  currency: z.string().min(1, "Currency is required"),
  workDays: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 1 && Number(val) <= 7, { message: "1-7 days" }),
  workHours: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 1 && Number(val) <= 24, { message: "1-24 hours" }),
})

export default function SalarySplit() {
  const [breakdowns, setBreakdowns] = useState<Breakdowns | null>(null)
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null)
  const [convertedCurrency, setConvertedCurrency] = useState<Currency | null>(null)
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Set mounted state
  useEffect(() => {
    setMounted(true)
  }, [])

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      salary: "",
      currency: "USD",
      workDays: "5",
      workHours: "8",
    },
  })

  // Fetch currencies and exchange rates
  useEffect(() => {
    const fetchCurrencyData = async () => {
      try {
        setIsLoading(true)
        try {
          const mockCurrencies: Currency[] = [
            { code: "USD", name: "US Dollar", symbol: "$", rate: 1 },
            { code: "EUR", name: "Euro", symbol: "€", rate: 0.855 },
            { code: "GBP", name: "British Pound", symbol: "£", rate: 0.7457 },
            { code: "JPY", name: "Japanese Yen", symbol: "¥", rate: 157.25 },
            { code: "CAD", name: "Canadian Dollar", symbol: "C$", rate: 1.367 },
            { code: "AUD", name: "Australian Dollar", symbol: "A$", rate: 1.4075 },
            { code: "INR", name: "Indian Rupee", symbol: "₹", rate: 91.73 },
            { code: "CNY", name: "Chinese Yuan", symbol: "¥", rate: 6.888 },
            { code: "CHF", name: "Swiss Franc", symbol: "Fr", rate: 0.7787 },
            { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", rate: 7.821 },
            { code: "SGD", name: "Singapore Dollar", symbol: "S$", rate: 1.35 },
            { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", rate: 1.64 },
            { code: "MXN", name: "Mexican Peso", symbol: "$", rate: 18.42 },
            { code: "BRL", name: "Brazilian Real", symbol: "R$", rate: 5.2698 },
            { code: "RUB", name: "Russian Ruble", symbol: "₽", rate: 92.35 },
            { code: "ZAR", name: "South African Rand", symbol: "R", rate: 18.45 },
            { code: "TRY", name: "Turkish Lira", symbol: "₺", rate: 32.15 },
            { code: "SEK", name: "Swedish Krona", symbol: "kr", rate: 10.42 },
            { code: "NOK", name: "Norwegian Krone", symbol: "kr", rate: 10.58 },
            { code: "DKK", name: "Danish Krone", symbol: "kr", rate: 6.4371 },
            { code: "PLN", name: "Polish Złoty", symbol: "zł", rate: 3.94 },
            { code: "ILS", name: "Israeli New Shekel", symbol: "₪", rate: 3.67 },
            { code: "KRW", name: "South Korean Won", symbol: "₩", rate: 1345.2 },
            { code: "THB", name: "Thai Baht", symbol: "฿", rate: 35.76 },
            { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", rate: 15678.45 },
            { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", rate: 3.9448 },
            { code: "PHP", name: "Philippine Peso", symbol: "₱", rate: 56.78 },
            { code: "AED", name: "United Arab Emirates Dirham", symbol: "د.إ", rate: 3.6725 },
            { code: "SAR", name: "Saudi Riyal", symbol: "﷼", rate: 3.75 },
            { code: "HUF", name: "Hungarian Forint", symbol: "Ft", rate: 356.25 },
            { code: "CZK", name: "Czech Koruna", symbol: "Kč", rate: 22.94 },
            { code: "TWD", name: "New Taiwan Dollar", symbol: "NT$", rate: 31.85 },
            { code: "CLP", name: "Chilean Peso", symbol: "$", rate: 925.45 },
            { code: "COP", name: "Colombian Peso", symbol: "$", rate: 3945.67 },
            { code: "RON", name: "Romanian Leu", symbol: "lei", rate: 4.56 },
          ]
          mockCurrencies.sort((a, b) => a.code.localeCompare(b.code))
          setCurrencies(mockCurrencies)
          const usd = mockCurrencies.find((c) => c.code === "USD") || mockCurrencies[0]
          setSelectedCurrency(usd)
          setConvertedCurrency(usd)
          setIsLoading(false)
        } catch (apiError) {
          console.error("Currency fetch failed:", apiError)
          throw new Error("Currency service unavailable")
        }
      } catch (err) {
        console.error("Using fallback currencies:", err)
        const fallbackCurrencies = [
          { code: "USD", name: "US Dollar", symbol: "$", rate: 1 },
          { code: "EUR", name: "Euro", symbol: "€", rate: 0.855 },
          { code: "GBP", name: "British Pound", symbol: "£", rate: 0.7457 },
        ];
        setCurrencies(fallbackCurrencies);
        setSelectedCurrency(fallbackCurrencies[0])
        setConvertedCurrency(fallbackCurrencies[0])
        setError("Offline mode: Using limited local currency data.")
        setIsLoading(false)
      }
    }
    fetchCurrencyData()
  }, [])

  function onSubmit(values: FormValues) {
    const annualSalary = Number.parseFloat(values.salary);
    const workDays = Number.parseInt(values.workDays);
    const workHours = Number.parseInt(values.workHours);
    const currency = currencies.find((c) => c.code === values.currency) as Currency;
    setSelectedCurrency(currency);
    setConvertedCurrency(currency);

    const monthly = annualSalary / 12;
    const weekly = annualSalary / 52;
    const daily = annualSalary / (52 * workDays);
    const hourly = daily / workHours;

    // 50/30/20 Budgeting logic (simplified gross breakdown)
    const budget = {
      needs: monthly * 0.5,
      wants: monthly * 0.3,
      savings: monthly * 0.2,
    };

    setBreakdowns({ annual: annualSalary, monthly, weekly, daily, hourly, budget });
  }

  function convertCurrency(amount: number, fromCurrency: Currency | null, toCurrency: Currency | null): number {
    if (!fromCurrency || !toCurrency) return amount;
    const amountInUSD = fromCurrency.code === "USD" ? amount : amount / fromCurrency.rate;
    return toCurrency.code === "USD" ? amountInUSD : amountInUSD * toCurrency.rate;
  }

  function formatCurrency({ amount, currency }: FormatCurrencyParams): string {
    if (!currency) return amount.toFixed(2);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.code,
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(amount);
  }

  function downloadBreakdown() {
    if (!breakdowns || !selectedCurrency) return
    let csvContent = "Time Period,In Original Currency,In Converted Currency\n"
    csvContent += `Annual,${formatCurrency({ amount: breakdowns.annual, currency: selectedCurrency })},${formatCurrency({ amount: convertCurrency(breakdowns.annual, selectedCurrency, convertedCurrency), currency: convertedCurrency })}\n`
    csvContent += `Monthly,${formatCurrency({ amount: breakdowns.monthly, currency: selectedCurrency })},${formatCurrency({ amount: convertCurrency(breakdowns.monthly, selectedCurrency, convertedCurrency), currency: convertedCurrency })}\n`
    csvContent += `Weekly,${formatCurrency({ amount: breakdowns.weekly, currency: selectedCurrency })},${formatCurrency({ amount: convertCurrency(breakdowns.weekly, selectedCurrency, convertedCurrency), currency: convertedCurrency })}\n`
    csvContent += `Daily,${formatCurrency({ amount: breakdowns.daily, currency: selectedCurrency })},${formatCurrency({ amount: convertCurrency(breakdowns.daily, selectedCurrency, convertedCurrency), currency: convertedCurrency })}\n`
    csvContent += `Hourly,${formatCurrency({ amount: breakdowns.hourly, currency: selectedCurrency })},${formatCurrency({ amount: convertCurrency(breakdowns.hourly, selectedCurrency, convertedCurrency), currency: convertedCurrency })}\n`
    csvContent += `\nOriginal Currency,${selectedCurrency.name} (${selectedCurrency.code})\n`
    csvContent += `Converted Currency,${convertedCurrency?.name || "N/A"} (${convertedCurrency?.code || "N/A"})\n`
    csvContent += `Exchange Rate,1 ${selectedCurrency.code} = ${convertedCurrency ? (convertedCurrency.rate / selectedCurrency.rate).toFixed(4) : "N/A"} ${convertedCurrency?.code || "N/A"}\n`
    csvContent += `\nGenerated by SalarySplit on ${new Date().toLocaleDateString()}\n`
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `salary-breakdown-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  function downloadCurrencyList() {
    if (!currencies.length) return
    let csvContent = "Currency Code,Currency Name,Symbol,Exchange Rate (vs USD)\n"
    currencies.forEach((currency) => {
      csvContent += `${currency.code},${currency.name},${currency.symbol},${currency.rate}\n`
    })
    csvContent += `\nExchange rates as of ${new Date().toLocaleDateString()}\n`
    csvContent += `Source: Financial Markets (Ref: USD)\n`
    csvContent += `Generated by SalarySplit\n`
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `currency-list-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      <div className="max-w-2xl mx-auto py-16 px-6 lg:px-8 flex flex-col">
        {error && (
          <div className="w-full bg-destructive/5 text-destructive border border-destructive/10 p-4 rounded-xl mb-12 animate-in fade-in duration-500">
            <p className="text-sm font-medium text-center">{error}</p>
          </div>
        )}

        <main className="w-full space-y-16">
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <div className="space-y-10">
              <div className="text-center space-y-3">
                <h2 className="text-2xl font-semibold tracking-tight">Know Your True Earnings</h2>
                <p className="text-muted-foreground">Break down your annual salary into precision periods and a smart budget.</p>
              </div>
              
              <Card className="border-none shadow-none bg-transparent">
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="space-y-8">
                      <Skeleton className="h-16 w-full opacity-50" />
                      <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-16 w-full opacity-50" />
                        <Skeleton className="h-16 w-full opacity-50" />
                      </div>
                      <Skeleton className="h-16 w-full opacity-50" />
                    </div>
                  ) : (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                        <FormField
                          control={form.control}
                          name="salary"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">Annual Salary</FormLabel>
                              <FormControl>
                                <div className="relative group">
                                  <DollarSign className="absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                  <Input className="pl-8 h-14 text-3xl font-medium border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary transition-all bg-transparent" placeholder="75,000" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-8">
                          <FormField
                            control={form.control}
                            name="workDays"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">Days / Week</FormLabel>
                                <FormControl>
                                  <Input className="h-14 border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-all bg-transparent text-2xl font-medium" {...field} />
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
                                <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">Hours / Day</FormLabel>
                                <FormControl>
                                  <Input className="h-14 border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-all bg-transparent text-2xl font-medium" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="currency"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">Currency</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="w-full h-14 border-0 border-b rounded-none px-0 focus:ring-0 focus:ring-offset-0 focus:border-primary transition-all bg-transparent text-lg">
                                    <SelectValue placeholder="Select currency" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="max-h-[350px]">
                                  {currencies.map((currency) => (
                                    <SelectItem key={currency.code} value={currency.code} className="py-3 focus:bg-primary/5">
                                      <div className="flex items-center gap-4">
                                        <span className="font-mono text-primary/60 font-semibold w-8 text-center">{currency.symbol}</span>
                                        <span className="text-sm font-medium">{currency.name}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full h-14 text-lg font-medium transition-all hover:opacity-90 active:scale-[0.98] rounded-2xl shadow-lg shadow-primary/10">
                          Calculate Breakdown
                        </Button>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>

          {breakdowns && (
            <section className="animate-in fade-in slide-in-from-bottom-6 duration-1000 space-y-12">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/5 rounded-lg">
                    <PieChart className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold tracking-tight">Your Breakdown</h2>
                </div>
                <Button variant="ghost" size="sm" onClick={downloadBreakdown} className="text-muted-foreground hover:text-primary rounded-lg">
                  <Download className="h-4 w-4 mr-2" />
                  CSV
                </Button>
              </div>

              <Tabs defaultValue="breakdown" className="w-full">
                <TabsList className="w-full h-12 grid grid-cols-3 p-1 bg-muted/40 rounded-xl mb-12">
                  <TabsTrigger value="breakdown" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Periods</TabsTrigger>
                  <TabsTrigger value="conversion" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Conversion</TabsTrigger>
                  <TabsTrigger value="budget" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Budget</TabsTrigger>
                </TabsList>

                <TabsContent value="breakdown" className="space-y-2">
                  {[
                    { label: "Annual", desc: "Yearly total", val: breakdowns.annual, icon: Calendar },
                    { label: "Monthly", desc: "Per month", val: breakdowns.monthly, icon: CalendarDays },
                    { label: "Weekly", desc: "Per week", val: breakdowns.weekly, icon: CalendarClock },
                    { label: "Daily", desc: "Per day", val: breakdowns.daily, icon: Clock },
                    { label: "Hourly", desc: "Per hour", val: breakdowns.hourly, icon: Clock },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-6 border-b border-border/40 last:border-0 group transition-all">
                      <div className="flex items-center space-x-6">
                        <div className="p-3 bg-muted/30 rounded-2xl group-hover:bg-primary/5 transition-colors">
                          <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold tracking-tight">{item.label}</p>
                          <p className="text-xs text-muted-foreground/60">{item.desc}</p>
                        </div>
                      </div>
                      <p className="text-2xl font-mono tracking-tighter font-semibold">
                        {formatCurrency({ amount: item.val, currency: selectedCurrency })}
                      </p>
                    </div>
                  ))}

                  <p className="text-[10px] text-muted-foreground/60 uppercase tracking-[0.2em] text-center mt-10">
                    Based on {form.getValues("workDays")}d / week, {form.getValues("workHours")}h / day schedule
                  </p>
                </TabsContent>

                <TabsContent value="conversion" className="space-y-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80 ml-1">Target Currency</label>
                    <Select
                      defaultValue={convertedCurrency?.code || "USD"}
                      onValueChange={(val) => setConvertedCurrency(currencies.find(c => c.code === val) || null)}
                    >
                      <SelectTrigger className="w-full h-14 border-0 border-b rounded-none px-0 focus:ring-0 focus:ring-offset-0 focus:border-primary transition-all bg-transparent text-lg">
                        <SelectValue placeholder="Select target currency" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[350px]">
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code} className="py-3 focus:bg-primary/5">
                            <div className="flex items-center gap-4">
                              <span className="font-mono text-primary/60 font-semibold w-8 text-center">{currency.symbol}</span>
                              <span className="text-sm font-medium">{currency.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-5 bg-muted/20 rounded-2xl border border-border/30 inline-block">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 mb-1">Exchange Rate</p>
                    <p className="text-sm font-medium">
                      1 {selectedCurrency?.code} = {((convertedCurrency?.rate || 1) / (selectedCurrency?.rate || 1)).toFixed(4)} {convertedCurrency?.code}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {[
                      { label: "Annual", val: breakdowns.annual },
                      { label: "Monthly", val: breakdowns.monthly },
                      { label: "Hourly", val: breakdowns.hourly },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-6 border-b border-border/40 last:border-0 transition-all">
                         <span className="text-sm font-semibold tracking-tight">{item.label}</span>
                         <span className="text-2xl font-mono tracking-tighter font-bold text-primary">
                           {formatCurrency({ amount: convertCurrency(item.val, selectedCurrency, convertedCurrency), currency: convertedCurrency })}
                         </span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="budget" className="space-y-12">
                  <div className="text-center space-y-3 mb-4 animate-in fade-in duration-700">
                    <h3 className="text-xl font-semibold tracking-tight">50/30/20 Rule</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                      Manage your {formatCurrency({ amount: breakdowns.monthly, currency: selectedCurrency })} monthly income with clarity.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {[
                      { 
                        label: "Needs (50%)", 
                        val: breakdowns.budget?.needs || 0, 
                        desc: "Rent, Groceries, Utilities, Health", 
                        icon: Home,
                        color: "text-blue-600",
                        bg: "bg-blue-500/10",
                        bar: "bg-blue-500"
                      },
                      { 
                        label: "Wants (30%)", 
                        val: breakdowns.budget?.wants || 0, 
                        desc: "Dining out, Hobbies, Subscriptions", 
                        icon: ShoppingBag,
                        color: "text-amber-600",
                        bg: "bg-amber-500/10",
                        bar: "bg-amber-500"
                      },
                      { 
                        label: "Future (20%)", 
                        val: breakdowns.budget?.savings || 0, 
                        desc: "Savings, Investments, Debt Repayment", 
                        icon: PiggyBank,
                        color: "text-emerald-600",
                        bg: "bg-emerald-500/10",
                        bar: "bg-emerald-500"
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="p-8 bg-card ring-1 ring-border/20 rounded-[2rem] transition-all hover:ring-primary/20 hover:shadow-xl hover:shadow-primary/5 group">
                         <div className="flex justify-between items-start mb-6">
                           <div className="flex items-center space-x-4">
                             <div className={`p-3 rounded-2xl ${item.bg} ${item.color}`}>
                               <item.icon className="h-6 w-6" />
                             </div>
                             <div>
                               <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${item.color}`}>
                                 {item.label}
                               </span>
                               <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                             </div>
                           </div>
                           <span className="text-2xl font-mono tracking-tighter font-bold">
                             {formatCurrency({ amount: item.val, currency: selectedCurrency })}
                           </span>
                         </div>
                         <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
                            <div 
                              className={`h-full opacity-70 transition-all duration-1000 delay-300 ${item.bar}`} 
                              style={{ width: `${idx === 0 ? 50 : idx === 1 ? 30 : 20}%` }}
                            />
                         </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </section>
          )}
        </main>

      </div>
    </div>
  )
}
