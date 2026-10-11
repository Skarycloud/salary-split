"use client"

import { useEffect, useId, useMemo, useRef, useState, type ButtonHTMLAttributes } from "react"
import { Check, ChevronDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CurrencyOption {
  code: string
  name: string
  symbol: string
}

type CurrencyPickerProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "onChange" | "label"> & {
  currencies: CurrencyOption[]
  value: string
  onChange: (code: string) => void
  label: string
  className?: string
}

export function CurrencyPicker({ currencies, value, onChange, label, className, ...buttonProps }: CurrencyPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const selected = currencies.find((currency) => currency.code === value)
  const filteredCurrencies = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    if (!normalizedQuery) return currencies
    const popular = ["USD", "EUR", "GBP", "INR"]
    return currencies.filter((currency) =>
      `${currency.code} ${currency.name} ${currency.symbol}`.toLocaleLowerCase().includes(normalizedQuery)
    ).sort((a, b) => {
      const aIndex = popular.indexOf(a.code)
      const bIndex = popular.indexOf(b.code)
      return (aIndex < 0 ? popular.length : aIndex) - (bIndex < 0 ? popular.length : bIndex) || a.code.localeCompare(b.code)
    })
  }, [currencies, query])

  useEffect(() => {
    if (!isOpen) return
    function closeOnOutsideClick(event: PointerEvent) {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setIsOpen(false)
    }
    document.addEventListener("pointerdown", closeOnOutsideClick)
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick)
  }, [isOpen])

  function chooseCurrency(code: string) {
    onChange(code)
    setQuery("")
    setIsOpen(false)
  }

  function focusOption(index: number) {
    document.getElementById(`${listId}-option-${index}`)?.focus()
  }

  return (
    <div ref={rootRef} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsOpen(false) }} className={cn("relative", className)}>
      <button
        {...buttonProps}
        type="button"
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={listId}
        onClick={() => { setQuery(""); setIsOpen((open) => !open) }}
        onKeyDown={(event) => { if (event.key === "Escape") setIsOpen(false) }}
        className="flex h-14 w-full items-center gap-3 rounded-base border-2 border-border bg-white px-3 text-left text-foreground shadow-brutal-sm transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-base border-2 border-border bg-secondary font-mono text-sm font-bold">{selected?.symbol ?? value}</span>
        <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{selected?.name ?? "Choose a currency"}</span><span className="text-xs text-muted-foreground">{selected?.code ?? "Search by name or code"}</span></span>
        <ChevronDown className={cn("h-5 w-5 shrink-0 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div id={listId} role="dialog" aria-label={`Choose ${label.toLowerCase()}`} className="absolute right-0 top-[calc(100%+0.6rem)] z-50 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border-2 border-border bg-white shadow-brutal-lg">
          <div className="border-b-2 border-border p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input id={`${listId}-search`} autoFocus type="search" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Escape") setIsOpen(false); if (event.key === "ArrowDown" && filteredCurrencies.length) { event.preventDefault(); focusOption(0) } if (event.key === "Enter" && filteredCurrencies[0]) { event.preventDefault(); chooseCurrency(filteredCurrencies[0].code) } }} placeholder="Search name or code…" aria-label={`Search ${label.toLowerCase()}`} className="h-11 w-full rounded-base border-2 border-border bg-muted pl-10 pr-3 text-sm text-foreground outline-none focus-visible:ring-4 focus-visible:ring-ring" />
            </div>
          </div>
          <div role="listbox" aria-label="Currencies" className="max-h-72 overflow-y-auto p-2">
            {filteredCurrencies.length ? filteredCurrencies.map((currency, index) => (
              <button id={`${listId}-option-${index}`} key={currency.code} type="button" role="option" aria-selected={currency.code === value} onClick={() => chooseCurrency(currency.code)} onKeyDown={(event) => { if (event.key === "ArrowDown") { event.preventDefault(); focusOption(Math.min(index + 1, filteredCurrencies.length - 1)) } if (event.key === "ArrowUp") { event.preventDefault(); if (index === 0) document.getElementById(`${listId}-search`)?.focus(); else focusOption(index - 1) } if (event.key === "Escape") setIsOpen(false) }} className="flex w-full items-center gap-3 rounded-base px-2.5 py-2 text-left text-foreground outline-none hover:bg-secondary focus-visible:bg-secondary">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-base border-2 border-border bg-white font-mono text-sm font-bold">{currency.symbol}</span>
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{currency.name}</span><span className="text-xs text-muted-foreground">{currency.code}</span></span>
                {currency.code === value && <Check className="h-4 w-4 text-foreground" />}
              </button>
            )) : <p className="px-3 py-8 text-center text-sm">No matching currency. Try a code like USD.</p>}
          </div>
        </div>
      )}
    </div>
  )
}
