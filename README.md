# SalarySplit

SalarySplit helps people understand salary in context: compare job offers by pay, time commitment and user-entered extras, break one salary into useful pay periods, and plan monthly spending.

## Features

- Compare annual or monthly base pay, weekly hours, recurring and sign-on bonuses, optional benefits value, and commute costs.
- View annual, monthly, weekly, daily and hourly gross-pay equivalents using a custom work week.
- Convert pay with dated daily reference exchange rates and a clearly labeled offline fallback snapshot.
- Plan from gross pay or enter take-home pay; compare the plan with real monthly spending.
- Estimate the work hours behind a purchase and the months needed to reach a savings target.
- Export a salary breakdown as CSV.

SalarySplit does not estimate taxes or guarantee the value of employer benefits. Offer, budget and currency figures are planning references; exchange rates may differ from bank or card rates.

## Navigation

The floating navigation keeps the two main tools—Salary breakdown and Compare offers—in a sliding tab switch. Guide and About sit alongside as secondary links. The active tool remains selected while browsing those secondary pages.

## Run locally

```sh
npm install
npm run dev
```

Production build:

```sh
npm run build
npm start
```

## How data is handled

There is no account or database. Salary inputs are held in session storage in the current browser tab so the result page can load without placing salary figures in the URL. Currency requests are handled by the app's exchange-rate route, which fetches daily Frankfurter reference rates and uses a dated fallback snapshot if the provider is unavailable.
