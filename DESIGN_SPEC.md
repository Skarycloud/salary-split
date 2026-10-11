# SalarySplit — "Clear Sky" Product and Design Spec

Living product and visual reference for the current app.

## 1. Goal

Build SalarySplit as a clear, private-by-default salary decision tool using the Next.js App Router and Tailwind v4. Keep the **calm, safe, clear-sky** neobrutalist visual language described here.

Neobrutalism traits to use: solid 2px ink borders, hard offset shadows (no blur), flat fills, bold headings, and "press into the shadow" hover/active states.

Calm adjustments: use soft blue fills instead of loud primaries, ink `#202B36` instead of pure black for outlines, a 10px radius instead of sharp corners, and generous spacing.

Product behavior may change to address user requests. Keep calculations explainable, label assumptions, and avoid unsupported tax, market-pay, or cost-of-living claims. Keep salary inputs out of URLs; the current one-salary flow uses this tab's session storage.

## 2. Colour palette (from the user, required)

| Element | Colour |
|---|---|
| Overall page background | `#EAF6FF` |
| Alternate section background | `#F4F8FC` |
| White cards | `#FFFFFF` |
| Blue feature cards | `#D6ECFF` |
| Secondary blue sections | `#B9DDF7` |
| Subtle blue highlights | `#82BCE8` |
| Headings and outlines | `#202B36` |
| Body text | `#50677B` |
| Primary button | `#000000` |
| Primary button text | `#FFFFFF` |
| Borders | `#202B36` |
| Hard shadow | `4px 4px 0 #202B36` |

### Additions agreed in review
| Purpose | Colour | Token |
|---|---|---|
| Budget "Wants" / warm accent (sunrise) | `#FFE3B8` | `sunrise` |
| Budget "Future" / calm accent (mint) | `#CDEFDC` | `mint` |
| Warning/error background (soft coral) | `#FFDCD6` | `destructive-soft` |
| Error text / invalid border | `#B4382B` | `destructive` |

### Accessibility rules (from the palette review)
- **Body text `#50677B` on `#B9DDF7` is about 4.0:1 contrast and fails WCAG AA.** On `#B9DDF7`, `#82BCE8`, sunrise or mint surfaces, use ink `#202B36` (`text-foreground`) for all text.
- **Never put white text on `#82BCE8`** (about 2:1). It is a fill or highlight behind ink text only.
- `#50677B` is fine on `#EAF6FF`, `#F4F8FC` and `#FFFFFF`.
- The primary button remains black (`#000`) as specified by the user palette.

## 3. Design tokens (implemented in `src/app/globals.css`)

shadcn token mapping:
- `--background` `#EAF6FF`
- `--card` and `--popover` `#FFFFFF`
- `--foreground` ink `#202B36`
- `--primary` `#000` with `--primary-foreground` `#FFF`
- `--secondary` `#D6ECFF` (cloud)
- `--accent` `#B9DDF7` (sky)
- `--muted` `#F4F8FC` (mist), with `--muted-foreground` `#50677B` (body text)
- `--border` and `--input` ink
- `--ring` `#82BCE8`
- `--radius` `0.625rem` (10px)

Custom Tailwind colour utilities: `mist`, `cloud`, `sky`, `highlight`, `ink`, `sunrise`, `mint`, `destructive-soft`. For example: `bg-highlight`, `bg-mint`, `bg-sunrise`.

Shadows:
- `shadow-brutal-sm` (2px)
- `shadow-brutal` (4px, the default)
- `shadow-brutal-lg` (6px, for hero or main cards)

Radius: `rounded-base` (10px). `rounded-xl` is used for large cards.

Base layer:
- `body` uses `text-muted-foreground` (body colour) with the DM Sans font.
- `h1`–`h6` use `text-foreground` with the Space Grotesk font (`font-heading`).
- `::selection` is `#82BCE8` with ink text.

`ambient-sky` utility: a quiet, layered blue radial wash over `#EAF6FF`, applied to `<body>` without a repeating grid texture.

Fonts (`src/app/layout.tsx`):
- DM Sans → `--font-body`
- Space Grotesk → `--font-display`
- Geist Mono → `--font-geist-mono`, for money figures

## 4. Component rules

| Component | Spec |
|---|---|
| Button (`ui/button.tsx`) | `border-2 border-border rounded-base font-semibold`. Variants: `default` (black), `neutral` (white), `secondary` (cloud) and `destructive` (coral). All four use `shadow-brutal`, and on hover `translate-x/y-[4px] shadow-none` (slides into its shadow). `outline`, `ghost` and `link` have no shadow. Focus: `ring-4 ring-ring`. Sizes: sm h-9, default h-10, lg h-12. |
| Card | White, `border-2`, `shadow-brutal`, `rounded-xl`. Title uses `font-heading font-bold`. |
| Input | White, `border-2`, `rounded-base`, ink text. On focus it lifts `-2px/-2px` and gains `shadow-brutal` (no blurred ring). When invalid it gets a destructive border and a light coral background. |
| Currency picker | Searchable, keyboard-accessible picker with code, name, symbol, and visible selected state. Keep currency options shared between calculator, offer comparison, and results. |
| Select trigger | If used, match Input styling and provide a visible open/focus state. |
| Select content | If used, white, `border-2`, `shadow-brutal`; items show cloud on focus. |
| Tabs | The list has a cloud background, `border-2` and `p-1`. The active trigger is white with `border-2` and `shadow-brutal-sm`. |
| Skeleton | `bg-secondary animate-pulse rounded-base` |
| Label / FormMessage | Labels are ink and semibold. Field labels on pages are uppercase `text-xs font-bold tracking-[0.14em]`. |
| Eyebrow / badge | Small `border-2` chip: `rounded-base px-2.5 py-0.5 text-xs font-bold uppercase`, on a white or sky background, often with `shadow-brutal-sm`. |
| Highlighted word in headings | `inline-block rounded-base border-2 border-border bg-highlight px-2`, sometimes with `-rotate-1` |
| Alerts / errors | `bg-destructive-soft border-2 shadow-brutal-sm`, ink text, `role="status"` |
| Progress bars | White track with `border-2`, solid ink fill |
| Icon tiles | `rounded-base border-2 border-border p-2.5`, on a white or cloud background with an ink icon |

Interaction pattern: elements with a shadow move into it on hover (`translate 4px`, `shadow-none`). Selected toggles sit half-pressed (`translate 2px`, `shadow-brutal-sm`, `bg-accent`).

## 5. Current product behavior

- Home: enter gross monthly or annual pay, currency, and optional work schedule. The work-week disclosure starts collapsed.
- Compare: compare base salary, weekly hours, recurring and sign-on bonuses, optional benefits value, and commute costs. Results separate first-year value from ongoing value.
- Results: view gross pay periods, convert currencies, plan a month from gross or entered take-home pay, compare entered monthly spending, price purchases in work hours, and estimate a savings goal timeline.
- Exchange rates: daily Frankfurter reference rates with a dated fallback snapshot. Always identify the provider/date and distinguish reference rates from bank or card rates.
- Privacy: no account/database. The one-salary form uses session storage rather than putting salary values in the URL.

## 6. Product accuracy rules

- Never present gross pay as take-home pay. Tax is not estimated.
- Label optional benefits, bonuses, spending and savings values as user-provided assumptions.
- Do not show unsupported global income percentiles or static country take-home benchmarks.
- When external rates are unavailable, show the fallback source and snapshot date.
- Keep interactions keyboard accessible and preserve visible focus states and mobile wrapping.
