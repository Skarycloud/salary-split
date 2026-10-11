import { NextResponse } from "next/server"

type CurrencyMeta = { name: string }
type FrankfurterRate = { date: string; base: string; quote: string; rate: number }

const SUPPORTED_CURRENCIES: Record<string, CurrencyMeta> = {
  USD: { name: "US Dollar" }, EUR: { name: "Euro" }, GBP: { name: "British Pound" }, JPY: { name: "Japanese Yen" },
  CAD: { name: "Canadian Dollar" }, AUD: { name: "Australian Dollar" }, INR: { name: "Indian Rupee" }, CNY: { name: "Chinese Yuan" },
  CHF: { name: "Swiss Franc" }, HKD: { name: "Hong Kong Dollar" }, SGD: { name: "Singapore Dollar" }, NZD: { name: "New Zealand Dollar" },
  MXN: { name: "Mexican Peso" }, BRL: { name: "Brazilian Real" }, RUB: { name: "Russian Ruble" }, ZAR: { name: "South African Rand" },
  TRY: { name: "Turkish Lira" }, SEK: { name: "Swedish Krona" }, NOK: { name: "Norwegian Krone" }, DKK: { name: "Danish Krone" },
  PLN: { name: "Polish Zloty" }, ILS: { name: "Israeli New Shekel" }, KRW: { name: "South Korean Won" }, THB: { name: "Thai Baht" },
  IDR: { name: "Indonesian Rupiah" }, MYR: { name: "Malaysian Ringgit" }, PHP: { name: "Philippine Peso" }, AED: { name: "UAE Dirham" },
  SAR: { name: "Saudi Riyal" }, HUF: { name: "Hungarian Forint" }, CZK: { name: "Czech Koruna" }, TWD: { name: "New Taiwan Dollar" },
  CLP: { name: "Chilean Peso" }, COP: { name: "Colombian Peso" }, RON: { name: "Romanian Leu" },
}

// Last refreshed from Frankfurter's USD reference-rate feed on 2026-10-11.
// Used only when the free upstream service is unavailable; it is always marked as fallback data.
const FALLBACK_UPDATED_AT = "2026-10-11"
const FALLBACK_RATES: Record<string, number> = {
  USD: 1, EUR: 0.89154, GBP: 0.75563, JPY: 158.24, CAD: 1.4229, AUD: 1.4353, INR: 96.65,
  CNY: 6.6921, CHF: 0.83155, HKD: 7.8537, SGD: 1.2802, NZD: 1.7827, MXN: 18.1953, BRL: 5.0088,
  RUB: 85.16, ZAR: 16.5388, TRY: 49.241, SEK: 9.9819, NOK: 9.5691, DKK: 6.671, PLN: 3.9102,
  ILS: 3.0631, KRW: 1342, THB: 33.579, IDR: 17881, MYR: 4.0872, PHP: 62.844,
  AED: 3.6725, SAR: 3.75, HUF: 326.18, CZK: 21.763, TWD: 31.907, CLP: 979.49, COP: 3212.25, RON: 4.7699,
}

function currencySymbol(code: string) {
  try {
    return new Intl.NumberFormat("en", { style: "currency", currency: code, currencyDisplay: "narrowSymbol" })
      .formatToParts(0)
      .find((part) => part.type === "currency")?.value ?? code
  } catch {
    return code
  }
}

function buildCurrencies(rates: Record<string, number>, useFallback = false) {
  return Object.entries(SUPPORTED_CURRENCIES)
    .filter(([code]) => code === "USD" || (Number.isFinite(rates[code]) && (useFallback || rates[code] > 0)))
    .map(([code, meta]) => ({ code, name: meta.name, symbol: currencySymbol(code), rate: code === "USD" ? 1 : rates[code] }))
    .sort((a, b) => a.code.localeCompare(b.code))
}

export async function GET() {
  try {
    const response = await fetch("https://api.frankfurter.dev/v2/rates?base=USD", { next: { revalidate: 3600 } })
    if (!response.ok) throw new Error(`Rate provider returned ${response.status}`)

    const rows = (await response.json()) as FrankfurterRate[]
    if (!Array.isArray(rows) || rows.length === 0 || !rows.some((row) => row.quote === "INR" && row.rate > 0)) {
      throw new Error("Rate provider returned incomplete data")
    }

    const rates: Record<string, number> = { USD: 1 }
    for (const row of rows) {
      if (row.base === "USD" && Number.isFinite(row.rate) && row.rate > 0) rates[row.quote] = row.rate
    }

    return NextResponse.json({
      base: "USD",
      provider: "Frankfurter · blended mid-market reference rates",
      updatedAt: rows[0].date,
      live: true,
      currencies: buildCurrencies(rates),
    })
  } catch {
    return NextResponse.json({
      base: "USD",
      provider: "Frankfurter fallback snapshot",
      updatedAt: FALLBACK_UPDATED_AT,
      live: false,
      currencies: buildCurrencies(FALLBACK_RATES, true),
    })
  }
}
