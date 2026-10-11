# SalarySplit Feature Ideas and Status

These ideas are designed for the current SalarySplit project without requiring any backend, database, or third-party API. They should work entirely in the browser with local calculations and optional local storage.

## Current implementation status

- Implemented: offer comparison by base pay and schedule, custom work-week estimates, editable percentage budget, currency conversion, CSV export, and collapsed-by-default work-week inputs.
- Implemented in the current feature update: first-year/ongoing offer comparison with recurring and sign-on bonuses, user-entered benefits and commute costs; monthly remainder from entered take-home pay and expenses; purchase cost in work hours; savings-goal timeline.
- Deliberately excluded: generic tax estimates and unreferenced global salary rankings. Do not present gross pay as net pay or invent market benchmarks.
- Private salary input is kept in the current tab's session storage rather than being added to the results URL.

## High-Value Features

### 1. Take-Home Salary Estimator
- Let users choose a simple deduction mode like `Low`, `Medium`, or `High`.
- Show estimated net monthly and annual salary beside gross salary.
- Useful because most people think in take-home pay, not gross pay.

### 2. Raise Comparison Mode
- Allow users to compare `Current Salary` vs `New Salary`.
- Show the increase in monthly, annual, daily, and hourly terms.
- Add percentage increase and exact money difference.

### 3. Salary Goal Planner
- Let users enter a salary target they want to reach.
- Show how far away they are from that target in both amount and percentage.
- Good for career planning and negotiation prep.

### 4. Purchase-in-Work-Hours Calculator
- User enters a cost like `Laptop`, `Phone`, or `Vacation`.
- App shows how many work hours or workdays that purchase costs.
- Very practical and emotionally intuitive.

### 5. Savings Goal Timeline
- User enters a savings target and how much they can save monthly.
- App shows how many months it would take to reach that goal.
- Can also show milestone checkpoints.

### 6. Emergency Fund Planner
- Ask for monthly expenses and desired safety cushion like `3`, `6`, or `12` months.
- Show target fund size and how long it may take to build.
- Strong real-world usefulness.

### 7. Monthly Budget Split Customizer
- Keep the default `50 / 30 / 20`, but let users change it.
- Example: `60 / 20 / 20` or `40 / 30 / 30`.
- Show live changes in budget categories.

### 8. Lifestyle Cost Buckets
- Let users estimate monthly spending buckets manually:
  - rent
  - food
  - transport
  - subscriptions
  - savings
- Show leftover disposable income.
- No API needed because user provides the numbers.

## Insightful Features

### 9. Time Value View
- Show salary as:
  - per year
  - per month
  - per week
  - per workday
  - per hour
  - per minute
  - per second
- This is simple but surprisingly compelling for users.

### 10. Work-Life Adjustment View
- Let users change working days and hours and instantly see how hourly value changes.
- Good for comparing full-time, hybrid, and part-time schedules.

### 11. Overtime Impact Calculator
- User enters extra hours worked per week.
- Show what that time is worth at base hourly rate.
- Can also show annualized overtime value.

### 12. Unpaid Leave Impact
- User enters number of unpaid leave days.
- Show how much salary that reduces over a month or year.
- Useful for freelancers, contractors, or people considering breaks.

### 13. Bonus Split Calculator
- User enters a one-time bonus.
- App shows how to split it across:
  - savings
  - debt repayment
  - spending
- Good financial planning feature.

### 14. 13th Month / Festival Bonus Mode
- Let users enable extra salary cycles.
- Useful for countries or companies where extra salary months are common.

### 15. Inflation Awareness View
- Let users enter an assumed inflation rate manually.
- Show rough future value loss of salary over `1`, `3`, or `5` years.
- No external data needed if user provides the rate.

## Personal Finance Features

### 16. Debt Payoff Allocation Helper
- User enters total debt and planned monthly repayment.
- Show rough payoff time.
- Can also compare aggressive vs moderate repayment.

### 17. SIP / Monthly Investment Projection
- User enters monthly contribution, years, and expected annual return.
- Show rough projected corpus.
- Very useful and fully frontend-calculable.

### 18. Retirement Starter Estimator
- Ask for monthly investment amount and years to invest.
- Show a simple future value estimate.
- Keep it intentionally basic, not pretending to be a financial advisory tool.

### 19. Salary-to-Savings Ratio Checker
- Compare monthly savings against income.
- Tell user if they are saving `5%`, `10%`, `20%`, etc.
- Small feature, but very readable and motivating.

### 20. Fixed vs Flexible Expense Split
- User tags expenses as `fixed` or `flexible`.
- App shows how resilient their monthly budget is.
- Great for planning during job changes.

## Career-Oriented Features

### 21. Offer Comparison Card
- Compare two job offers side by side.
- Inputs:
  - salary
  - working days
  - working hours
  - bonus
- Show which one gives better hourly value.

### 22. Workload vs Pay Comparison
- Compare two salaries with different schedules.
- Example:
  - Job A pays less but has fewer hours
  - Job B pays more but has longer days
- Helps users reason beyond headline salary.

### 23. Negotiation Readiness Summary
- Generate a clean summary like:
  - current salary
  - target salary
  - percentage gap
  - monthly improvement
- Could be copyable text for users.

### 24. Salary Milestone Tracker
- Show milestones such as:
  - first `1L`
  - first `10L`
  - first `1Cr`
  - or custom salary milestones
- Can be motivating if presented cleanly.

## Interesting / Intriguing Features

### 25. Time-to-Earn Common Items
- Show how long it takes to earn:
  - coffee
  - movie ticket
  - iPhone
  - rent
  - flight ticket
- Could use editable presets rather than APIs.

### 26. Salary Reality Check
- Show plain-language observations such as:
  - "Your hourly value is lower than it looks because of long work hours."
  - "Your monthly savings room is tight after essential splits."
- This should be rule-based, not AI-generated.

### 27. Pay Frequency Simulator
- Toggle between monthly pay, biweekly pay, and weekly pay.
- Helps users understand cash flow timing.

### 28. Salary Breakdown Story Mode
- Instead of only numbers, show short explanatory cards:
  - "One day of your work is worth..."
  - "One week of your work funds..."
- Makes the product feel more human.

### 29. Career Path Scenario Mode
- Let users try hypothetical raises like:
  - `+10%`
  - `+25%`
  - `double salary`
- Show how life metrics change.

### 30. Personal Finance Health Score
- Simple score from user-entered values:
  - savings rate
  - debt load
  - emergency fund progress
- Should stay lightweight and transparent.

## Lightweight UX Improvements

### 31. Save Multiple Profiles Locally
- Store profiles in local storage like:
  - `Current Job`
  - `Dream Offer`
  - `Freelance Mode`
- No backend needed.

### 32. Shareable Result Snapshot
- Generate a shareable UI card or exportable image locally.
- Useful for sending a clean salary comparison.

### 33. Smarter Result Explanations
- Add short contextual text under each result.
- Example:
  - monthly
  - effective hourly
  - estimated savings potential

### 34. Guided Input Flow
- Turn the form into a step-by-step wizard.
- Better for mobile and reduces cognitive load.

### 35. Clean Empty-State Education
- Before calculation, explain what the app can tell the user.
- Helps convert first-time visitors into users.

## Possible Future Additions

If prioritizing impact, these are the strongest frontend-only features to build next:

1. Emergency fund planner
2. Actual bill due-date cash-flow calendar
3. Save multiple scenarios locally
4. Negotiation summary users can copy
5. Source-backed occupation and location wage benchmarks, starting with one authoritative country dataset
6. Time-to-earn common items using editable prices

## Notes

- Avoid pretending precision where the app only has estimates.
- Prefer user-entered assumptions over fake market data.
- Keep each feature tightly focused so the app stays clean.
- Features that translate salary into time, tradeoffs, or decisions will usually feel more useful than raw extra numbers.
