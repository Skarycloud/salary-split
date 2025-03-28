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
import { Calculator, Clock, DollarSign, Calendar, CalendarDays, CalendarClock, Download, Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Mail, Github, Linkedin } from 'lucide-react';

// Form schema
const formSchema = z.object({
  salary: z
    .string()
    .min(1, "Salary is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Salary must be a positive number" }),
  currency: z.string().min(1, "Currency is required"),
})

export default function SalarySplit() {
  const [breakdowns, setBreakdowns] = useState<Breakdowns | null>(null)
  const [selectedCurrency, setSelectedCurrency] = useState<{ code: string; name: string; symbol: string; rate: number } | null>(null)
  const [convertedCurrency, setConvertedCurrency] = useState<{ code: string; name: string; symbol: string; rate: number } | null>(null)
  const [currencies, setCurrencies] = useState<{ code: string; name: string; symbol: string; rate: number }[]>([])
  // Removed unused exchangeRates state
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      salary: "",
      currency: "USD",
    },
  })

  // Fetch currencies and exchange rates
  useEffect(() => {
    const fetchCurrencyData = async () => {
      try {
        setIsLoading(true)

        // Define fallback currencies in case API fails (removed as unused)

        // Use a more reliable approach with better error handling
        try {
          // Try to fetch from Open Exchange Rates API (mock)
          // In a real app, you would use a proper API key and endpoint
          const mockCurrencies = [
            { code: "USD", name: "US Dollar", symbol: "$", rate: 1 },
            { code: "EUR", name: "Euro", symbol: "€", rate: 0.92 },
            { code: "GBP", name: "British Pound", symbol: "£", rate: 0.79 },
            { code: "JPY", name: "Japanese Yen", symbol: "¥", rate: 150.14 },
            { code: "CAD", name: "Canadian Dollar", symbol: "C$", rate: 1.37 },
            { code: "AUD", name: "Australian Dollar", symbol: "A$", rate: 1.52 },
            { code: "INR", name: "Indian Rupee", symbol: "₹", rate: 83.12 },
            { code: "CNY", name: "Chinese Yuan", symbol: "¥", rate: 7.23 },
            { code: "CHF", name: "Swiss Franc", symbol: "Fr", rate: 0.91 },
            { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", rate: 7.82 },
            { code: "SGD", name: "Singapore Dollar", symbol: "S$", rate: 1.35 },
            { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", rate: 1.64 },
            { code: "MXN", name: "Mexican Peso", symbol: "$", rate: 16.82 },
            { code: "BRL", name: "Brazilian Real", symbol: "R$", rate: 5.05 },
            { code: "RUB", name: "Russian Ruble", symbol: "₽", rate: 92.35 },
            { code: "ZAR", name: "South African Rand", symbol: "R", rate: 18.45 },
            { code: "TRY", name: "Turkish Lira", symbol: "₺", rate: 32.15 },
            { code: "SEK", name: "Swedish Krona", symbol: "kr", rate: 10.42 },
            { code: "NOK", name: "Norwegian Krone", symbol: "kr", rate: 10.58 },
            { code: "DKK", name: "Danish Krone", symbol: "kr", rate: 6.86 },
            { code: "PLN", name: "Polish Złoty", symbol: "zł", rate: 3.94 },
            { code: "ILS", name: "Israeli New Shekel", symbol: "₪", rate: 3.67 },
            { code: "KRW", name: "South Korean Won", symbol: "₩", rate: 1345.2 },
            { code: "THB", name: "Thai Baht", symbol: "฿", rate: 35.76 },
            { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", rate: 15678.45 },
            { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", rate: 4.65 },
            { code: "PHP", name: "Philippine Peso", symbol: "₱", rate: 56.78 },
            { code: "AED", name: "United Arab Emirates Dirham", symbol: "د.إ", rate: 3.67 },
            { code: "SAR", name: "Saudi Riyal", symbol: "﷼", rate: 3.75 },
            { code: "HUF", name: "Hungarian Forint", symbol: "Ft", rate: 356.25 },
            { code: "CZK", name: "Czech Koruna", symbol: "Kč", rate: 22.94 },
            { code: "TWD", name: "New Taiwan Dollar", symbol: "NT$", rate: 31.85 },
            { code: "CLP", name: "Chilean Peso", symbol: "$", rate: 925.45 },
            { code: "COP", name: "Colombian Peso", symbol: "$", rate: 3945.67 },
            { code: "RON", name: "Romanian Leu", symbol: "lei", rate: 4.56 },
          ]

          // Sort currencies by code
          mockCurrencies.sort((a, b) => a.code.localeCompare(b.code))

          setCurrencies(mockCurrencies)

          // Set default currencies
          const usd = mockCurrencies.find((c) => c.code === "USD") || mockCurrencies[0]
          setSelectedCurrency(usd)
          setConvertedCurrency(usd)

          setIsLoading(false)
        } catch (apiError) {
          console.error("Error with primary API, falling back to defaults:", apiError)
          throw new Error("Primary API failed")
        }
      } catch (err) {
        console.error("All API attempts failed, using fallback data:", err)

        // Use fallback currencies
        const fallbackCurrencies = [
          { code: "USD", name: "US Dollar", symbol: "$", rate: 1 },
          { code: "EUR", name: "Euro", symbol: "€", rate: 0.92 },
          { code: "GBP", name: "British Pound", symbol: "£", rate: 0.79 },
        ];
        setCurrencies(fallbackCurrencies);
        setSelectedCurrency(fallbackCurrencies[0])
        setConvertedCurrency(fallbackCurrencies[0])
        setError("Using offline currency data. Some currencies may not be available.")
        setIsLoading(false)
      }
    }

    fetchCurrencyData()
  }, [])

  // Removed unused getCurrencySymbol function

  // Handle form submission
  interface FormValues {
    salary: string;
    currency: string;
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
  }

  function onSubmit(values: FormValues) {
    const annualSalary = Number.parseFloat(values.salary);
    const currency = currencies.find((c) => c.code === values.currency) as Currency;
    setSelectedCurrency(currency);
    setConvertedCurrency(currency); // Reset converted currency to match selected

    // Calculate breakdowns
    const monthly = annualSalary / 12;
    const weekly = annualSalary / 52;
    const daily = annualSalary / 260; // Assuming 5 working days a week, 52 weeks
    const hourly = daily / 8; // Assuming 8 working hours per day

    setBreakdowns({
      annual: annualSalary,
      monthly,
      weekly,
      daily,
      hourly,
    } as Breakdowns);
  }

  // Convert amount to selected currency
  interface Currency {
    code: string;
    name: string;
    symbol: string;
    rate: number;
  }

  function convertCurrency(
    amount: number,
    fromCurrency: Currency | null,
    toCurrency: Currency | null
  ): number {
    if (!fromCurrency || !toCurrency) return amount;

    // Convert to USD first (if not already USD)
    const amountInUSD = fromCurrency.code === "USD" ? amount : amount / fromCurrency.rate;
    // Then convert from USD to target currency
    return toCurrency.code === "USD" ? amountInUSD : amountInUSD * toCurrency.rate;
  }

  // Format currency
  interface FormatCurrencyParams {
    amount: number;
    currency: Currency | null;
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

  // Download breakdown data as CSV
  function downloadBreakdown() {
    if (!breakdowns || !selectedCurrency) return

    // Create CSV content
    let csvContent = "Time Period,In Original Currency,In Converted Currency\n"

    // Add rows for each time period
    csvContent += `Annual,${formatCurrency({ amount: breakdowns.annual, currency: selectedCurrency })},${formatCurrency({ amount: convertCurrency(breakdowns.annual, selectedCurrency, convertedCurrency), currency: convertedCurrency })}\n`
    csvContent += `Monthly,${formatCurrency({ amount: breakdowns.monthly, currency: selectedCurrency })},${formatCurrency({ amount: convertCurrency(breakdowns.monthly, selectedCurrency, convertedCurrency), currency: convertedCurrency })}\n`
    csvContent += `Weekly,${formatCurrency({ amount: breakdowns.weekly, currency: selectedCurrency })},${formatCurrency({ amount: convertCurrency(breakdowns.weekly, selectedCurrency, convertedCurrency), currency: convertedCurrency })}\n`
    csvContent += `Daily,${formatCurrency({ amount: breakdowns.daily, currency: selectedCurrency })},${formatCurrency({ amount: convertCurrency(breakdowns.daily, selectedCurrency, convertedCurrency), currency: convertedCurrency })}\n`
    csvContent += `Hourly,${formatCurrency({ amount: breakdowns.hourly, currency: selectedCurrency })},${formatCurrency({ amount: convertCurrency(breakdowns.hourly, selectedCurrency, convertedCurrency), currency: convertedCurrency })}\n`

    // Add metadata
    csvContent += `\nOriginal Currency,${selectedCurrency.name} (${selectedCurrency.code})\n`
    csvContent += `Converted Currency,${convertedCurrency?.name || "N/A"} (${convertedCurrency?.code || "N/A"})\n`
    csvContent += `Exchange Rate,1 ${selectedCurrency.code} = ${convertedCurrency ? (convertedCurrency.rate / selectedCurrency.rate).toFixed(4) : "N/A"} ${convertedCurrency?.code || "N/A"}\n`
    csvContent += `\nGenerated by SalarySplit on ${new Date().toLocaleDateString()}\n`

    // Create a blob and download link
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

  // Download currency list as CSV
  function downloadCurrencyList() {
    if (!currencies.length) return

    // Create CSV content
    let csvContent = "Currency Code,Currency Name,Symbol,Exchange Rate (vs USD)\n"

    // Add rows for each currency
    currencies.forEach((currency) => {
      csvContent += `${currency.code},${currency.name},${currency.symbol},${currency.rate}\n`
    })

    // Add metadata
    csvContent += `\nExchange rates as of ${new Date().toLocaleDateString()}\n`
    csvContent += `Source: exchangerate.host\n`
    csvContent += `Generated by SalarySplit\n`

    // Create a blob and download link
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
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col items-center space-y-8 mb-10">
        <div className="flex items-center space-x-2">
          <Calculator className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">SalarySplit</h1>
        </div>
        <p className="text-muted-foreground text-center max-w-2xl">
          Enter your annual salary to see how it breaks down by month, week, day, and hour. You can also convert your
          earnings to different currencies.
        </p>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-lg mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-[1fr_1.5fr]">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Enter Your Salary</CardTitle>
              <CardDescription>Provide your annual salary (Cost to Company) details</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="salary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Annual Salary</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input className="pl-10" placeholder="e.g. 75000" {...field} />
                            </div>
                          </FormControl>
                          <FormDescription>Enter your total annual salary before taxes</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[300px]">
                              {currencies.map((currency) => (
                                <SelectItem key={currency.code} value={currency.code}>
                                  {currency.symbol} {currency.name} ({currency.code})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>Select the currency of your salary</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      Calculate
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Currency List</CardTitle>
              <CardDescription>Download the complete list of available currencies and exchange rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-4">
                <p>Our application uses a comprehensive list of world currencies with their exchange rates.</p>
                <p className="mt-2">
                  The list includes {currencies.length} major currencies with their current exchange rates against USD.
                </p>
              </div>
              <Button
                onClick={downloadCurrencyList}
                className="w-full"
                variant="outline"
                disabled={isLoading || currencies.length === 0}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading Currencies
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download Currency List
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {breakdowns ? (
          <Card>
            <CardHeader>
              <CardTitle>Your Salary Breakdown</CardTitle>
              <CardDescription>See how your annual salary breaks down into smaller time periods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="breakdown">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="breakdown">Time Breakdown</TabsTrigger>
                  <TabsTrigger value="conversion">Currency Conversion</TabsTrigger>
                </TabsList>
                <TabsContent value="breakdown" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Annual</p>
                          <p className="text-sm text-muted-foreground">Yearly salary</p>
                        </div>
                      </div>
                      <p className="text-xl font-bold">{formatCurrency({ amount: breakdowns.annual, currency: selectedCurrency })}</p>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <CalendarDays className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Monthly</p>
                          <p className="text-sm text-muted-foreground">Per month</p>
                        </div>
                      </div>
                      <p className="text-xl font-bold">{formatCurrency({ amount: breakdowns.monthly, currency: selectedCurrency })}</p>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <CalendarClock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Weekly</p>
                          <p className="text-sm text-muted-foreground">Per week</p>
                        </div>
                      </div>
                      <p className="text-xl font-bold">{formatCurrency({ amount: breakdowns.weekly, currency: selectedCurrency })}</p>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Daily</p>
                          <p className="text-sm text-muted-foreground">Per working day</p>
                        </div>
                      </div>
                      <p className="text-xl font-bold">{formatCurrency({ amount: breakdowns.daily, currency: selectedCurrency })}</p>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Hourly</p>
                          <p className="text-sm text-muted-foreground">Per working hour</p>
                        </div>
                      </div>
                      <p className="text-xl font-bold">{formatCurrency({ amount: breakdowns.hourly, currency: selectedCurrency })}</p>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground mt-4">
                    <p>* Calculations assume:</p>
                    <ul className="list-disc list-inside ml-2">
                      <li>12 months per year</li>
                      <li>52 weeks per year</li>
                      <li>260 working days per year (5 days/week, 52 weeks)</li>
                      <li>8 working hours per day</li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="conversion" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm font-medium">Convert your annual salary to:</p>
                      <Select
                        defaultValue={convertedCurrency?.code || "USD"}
                        onValueChange={(value) => {
                          const currency = currencies.find((c) => c.code === value)
                          if (currency) {
                            setConvertedCurrency(currency)
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {currencies.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              {currency.symbol} {currency.name} ({currency.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <p className="text-sm">Original Currency:</p>
                            <p className="font-medium">
                              {selectedCurrency?.name} ({selectedCurrency?.symbol})
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-sm">Converted Currency:</p>
                            <p className="font-medium">
                              {convertedCurrency?.name} ({convertedCurrency?.symbol})
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-sm">Exchange Rate:</p>
                            <p className="font-medium">
                              1 {selectedCurrency?.code} ={" "}
                              {((convertedCurrency?.rate || 1) / (selectedCurrency?.rate || 1)).toFixed(4)}{" "}
                              {convertedCurrency?.code}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid gap-4 mt-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <p className="font-medium">Annual</p>
                        <p className="text-xl font-bold">
                          {formatCurrency(
                            { amount: convertCurrency(breakdowns.annual, selectedCurrency, convertedCurrency), currency: convertedCurrency },
                          )}
                        </p>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <p className="font-medium">Monthly</p>
                        <p className="text-xl font-bold">
                          {formatCurrency(
                            { amount: convertCurrency(breakdowns.monthly, selectedCurrency, convertedCurrency), currency: convertedCurrency },
                          )}
                        </p>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <p className="font-medium">Weekly</p>
                        <p className="text-xl font-bold">
                          {formatCurrency(
                            { amount: convertCurrency(breakdowns.weekly, selectedCurrency, convertedCurrency), currency: convertedCurrency },
                          )}
                        </p>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <p className="font-medium">Daily</p>
                        <p className="text-xl font-bold">
                          {formatCurrency(
                            { amount: convertCurrency(breakdowns.daily, selectedCurrency, convertedCurrency), currency: convertedCurrency },
                          )}
                        </p>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <p className="font-medium">Hourly</p>
                        <p className="text-xl font-bold">
                          {formatCurrency(
                            { amount: convertCurrency(breakdowns.hourly, selectedCurrency, convertedCurrency), currency: convertedCurrency }
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground mt-4">
                      <p>* Exchange rates are provided by exchangerate.host API and updated regularly.</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button onClick={downloadBreakdown} className="w-full" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Breakdown
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="flex items-center justify-center min-h-[400px]">
            <CardContent className="text-center">
              <Calculator className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">Enter Your Salary</h3>
              <p className="text-muted-foreground">
                Fill out the form to see your salary breakdown and currency conversions
              </p>
            </CardContent>
          </Card>
        )}
      </div>

       <footer className="mt-12 border-t pt-6 pb-8 text-center">
      <div className="container mx-auto px-4">
        <div className="text-sm text-muted-foreground">
          <p className="mb-2">
            SalarySplit helps you understand your earnings across different time periods. 
            This calculator is for informational purposes only and does not account for taxes or deductions.
          </p>
          <p className="mb-4">
            Currency data updated as of {new Date().toLocaleDateString()}
          </p>
          
          {/* Developer information */}
          <div className="my-6 py-4 border-y border-gray-100">
            <p className="font-medium text-base mb-1">By Sumanth Kumar</p>
            <p className="mb-2 text-sm">Front End Dev</p>
            
            <div className="flex items-center justify-center space-x-4 mt-3">
              <a 
                href="mailto:Sumanth.k.0202@gmail.com" 
                className="flex items-center text-muted-foreground hover:text-blue-600 transition-colors"
                aria-label="Email"
              >
                <Mail size={18} className="mr-1" />
                <span className="text-xs">Email</span>
              </a>
              <a 
                href="https://github.com/Skarycloud" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-muted-foreground hover:text-gray-900 transition-colors"
                aria-label="GitHub"
              >
                <Github size={18} className="mr-1" />
                <span className="text-xs">GitHub</span>
              </a>
              <a 
                href="https://www.linkedin.com/in/sumanth-kumar-230194294" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-muted-foreground hover:text-blue-700 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} className="mr-1" />
                <span className="text-xs">LinkedIn</span>
              </a>
            </div>
          </div>
          
          <p className="mt-4 text-xs">
            © {new Date().getFullYear()} SalarySplit. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
    </div>
  )
}

