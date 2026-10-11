# MoneyTracker — product and implementation specification

Version: 0.1 · Date: 2026-10-11 · Status: reviewable specification draft, not an implemented application.

[Русский](SPEC.ru.md) · [Sources](SOURCES.md)

## 1. Document conventions

- **C — confirmed:** confirmed by the user during the interview.
- **P — proposed:** a specification author decision, usable as an explicitly labelled provisional implementation choice, not a user answer.
- **R — research:** availability, quality or terms require verification. Do not describe the capability as operational before verification.
- **L — later:** a required or desired subsequent stage, as specified in the requirement.

RU and EN express the same requirements with matching IDs. Log and resolve translation discrepancies rather than silently choosing a convenient version. Add new assumptions to the decision log. Personal balances, accounts, percentages and targets are onboarding inputs, not hardcoded values.

## 2. Product, audience and constraints

| ID | Status | Requirement |
|---|---|---|
| PR-01 | C | Explain where salary goes, total wealth and when a home purchase becomes possible. Daily maintenance should take a few minutes. |
| PR-02 | C | Initial audience: a two-person household using iPhone and Android. Later: other households and individuals. |
| PR-03 | C | The first release must include expenses and existing assets. Do not remove investment tracking to deliver only an expense tracker. |
| PR-04 | C | English UI. Russian and English specifications. Receipts: Russian, English, German and an extensible selection of additional languages. |
| PR-05 | C | USD reporting default, switchable to at least EUR. Preserve original currencies of accounts and transactions; travel currencies vary. |
| PR-06 | C | Initial development and operating budget: zero. Free resources only; paid APIs and temporary trials must not be mandatory dependencies. |
| PR-07 | C/L | Start with a PWA; prepare for Google Play and App Store applications. Publication in both stores is a mandatory future stage. |
| PR-08 | C/R | Support was requested for different models dating from 2015. Release year does not establish compatibility: a verified OS/browser/capability matrix is required; see section 12. |
| PR-09 | C | Simple interface with few prominent numbers, cards, light/dark themes and system appearance. |
| PR-10 | C | The user selected Next.js for the PWA. Initial implementation uses Next.js App Router, React and TypeScript with static export; backend selection remains separate. |

Initial user context: Kyrgyz citizenship, Georgian tax residency, possible move to Austria, frequent travel. Do not infer tax residency from physical location. Automated tax calculations have not been agreed. These countries must not limit the product.

## 3. Household, onboarding and access

| ID | Status | Requirement |
|---|---|---|
| HH-01 | C | Shared and personal accounts. Both members can view household transactions including personal accounts, and edit shared data, categories, budgets and goals. |
| HH-02 | C | Pool household income and distribute it among budgets and goals while reserving personal spending money for each member. One income is stable; the other varies. |
| HH-03 | C | Support savings as a percentage of income. Do not apply the percentage again to each member after applying it to pooled income. |
| HH-04 | C | Goal contributions are amounts specifically allocated to that goal. A member's full income is not their home-purchase contribution. |
| HH-05 | P | Onboarding: currency and household timezone → member invitation → accounts/balances → income → obligations/budgets → personal allowances → emergency fund/goals. Allow skipping optional steps. |
| HH-06 | C/R | Google/Apple sign-in and an additional PIN. Google is a candidate for the free launch; Apple developer setup and terms require investigation, not a promise of free readiness. |
| HH-07 | P | Personal allowances may be fixed amounts or percentages of pooled income. Allocation must not silently exceed available funds. Show unallocated funds. |
| HH-08 | P | Household invitations are single-use and time-limited, with explicit acceptance. Other households have no access. |

End users supply recurring payments, goal prices, tariffs, percentages and balances during setup. Paper notes do not imply an existing digital import: default to opening balances. Historical entry is manual or through a supported import.

## 4. Accounts, transactions and currencies

| ID | Status | Requirement |
|---|---|---|
| TX-01 | C | Cash, bank accounts, deposits, stocks, ETFs/funds and cryptocurrency. No current property or debt. |
| TX-02 | P | Use extensible asset types; property, vehicles and actual loans are outside the first release pending confirmation. A mortgage goal scenario does not create an actual debt. |
| TX-03 | C | Quick manual entry, photo, screenshot, electronic receipt/PDF; system Share where supported, otherwise in-app file selection. |
| TX-04 | P | Types: income, expense, transfer, FX exchange, refund/reimbursement, fee and reconciliation adjustment. Household transfers are neither income nor consumption; fees are expenses. |
| TX-05 | C/P | Reimbursements reduce the linked original expense. Proposed: record cash receipt on its actual date and link to the purchase; analytics explicitly identify the reporting period. |
| TX-06 | P | Preserve receipt amount/currency and actual account debit amount/currency when known. Otherwise label conversion as estimated. Updating the actual debit must not create another purchase. |
| TX-07 | P | Balance = opening balance + posted movements. Reconciling to an actual balance creates an adjustment with a reason, not a categorized purchase. |
| TX-08 | C | Warn about potential duplicates and offer merging. Do not automatically delete similar legitimate purchases. |
| TX-09 | P | Transfers store both sides; cross-currency transfers store both actual amounts and a separate fee. Save atomically. |
| FX-01 | P/R | Historical spending uses transaction-date conversion; current assets use the latest available valuation. Store rate, source and timestamp. Investigate free FX sources. |
| FX-02 | P | A missing rate is not 1. Show original currency and an incomplete aggregate; allow manual rates. Changing USD/EUR changes presentation, not original transactions. |

Store money in integer minor units or exact decimal strings, never binary floating point. Quantities and rates use exact decimals with defined precision. Separate transaction date, UTC creation time and reporting timezone. Do not automatically change the household timezone when travelling.

## 5. Receipts, categories and trips

| ID | Status | Requirement |
|---|---|---|
| RC-01 | C | Extract merchant, date, total and currency. No line-item extraction required; one category/subcategory per receipt. |
| RC-02 | C/P | Automatically save confident results. Require resolved amount, currency, date and account and no duplicate suspicion. A single overall OCR score is insufficient. |
| RC-03 | C | Uncertain category: Needs review with a suggestion. Unknown amount/currency/account: a draft with no balance impact. |
| RC-04 | P | Remember each member's last explicitly confirmed account. Display it on save with Undo/Edit. Ask on first entry or currency ambiguity. This remains a proposal because answer 68 was unresolved. |
| RC-05 | C | Delete the app's image copy after successful extraction and structured-data persistence. Keep the gallery original. On failure, retain temporarily until correction/cancellation. |
| RC-06 | C/R | Prefer free local OCR; external processing is allowed only at no cost and after configuring data sharing. Manual correction is mandatory. Test real receipts, languages and older devices. |
| RC-07 | P | PDFs: extract existing text first; OCR scanned pages individually. Do not execute active file content. Set file/page limits after tests and provide clear errors. |
| CT-01 | C | Users create categories/subcategories; suggest a small editable starter set. Do not impose a fixed taxonomy. |
| CT-02 | C/P | One subcategory level; each expense belongs to one node. Parent totals include child amounts and direct parent expenses without double counting. |
| CT-03 | C | Corrections inform future matching rules; bulk changes to previous transactions require separate confirmation. |
| TR-01 | C | Trips have name, dates, budget and optional country. Link expenses across categories and compare trips/countries and average daily spending. |
| TR-02 | C | Suggest country from receipt evidence; leave unknown country blank. Do not infer country solely from currency or require geolocation. |
| TR-03 | P | Without known days of presence, country comparisons are limited to amounts and days with transactions; do not label this the full daily cost of living. |

Processing states: queued → processing → draft/needs_review/saved → source_deleted. Failure does not post an expense. Delete source only after structured data are persisted; reliable local persistence need not wait for cloud sync. Unresolved fields remain visible in the structured record.

## 6. Household budget and free-to-spend balance

| ID | Status | Requirement |
|---|---|---|
| BG-01 | C | Free-to-spend is always accessible on Home and recalculates after each change. Planning horizon: current month end. |
| BG-02 | C | Include obligations, planned groceries/transport and other everyday spending, savings and personal allowances. |
| BG-03 | C/P | Variable income uses a cautious historical estimate; before history exists, use manual input. Proposal: minimum of the median of the last 6 complete months and average of the last 3, requiring at least 3 months; otherwise manual. Explain the method and allow override. |
| BG-04 | C | Unspent budget moves to goals/emergency savings, not automatically to next month's spending budget. |
| BG-05 | P | At month close suggest allocation of positive surplus using configured percentages/priorities. Default suggestion: emergency-fund shortfall, then the highest-priority goal. Without rules, ask for a selection. Month close is idempotent. |
| BG-06 | C | When funds are insufficient, suggest reducing optional spending or temporarily reducing goal contributions. Never change budgets or move money without a user action. |
| BG-07 | C/P | Subscriptions: amount, interval, next date, advance reminder. Proposal: planned payments do not automatically become actual; confirmation or matching import posts them. |

### Proposed calculation semantics (P)

`Free now = L − R − O − G − A`

- `L`: actual accessible balances of spending accounts/cash; excludes locked deposits and unsold investments.
- `R`: emergency/goal funds already reserved within L. Do not subtract reserves in investments outside L again.
- `O`: unpaid obligations and remaining everyday budgets through month end. Do not count a linked subscription and its category twice.
- `G`: planned but not yet fulfilled goal contributions from currently accessible funds.
- `A`: remaining personal allowances reserved within L and not included in R/O/G.

Reserve buckets are disjoint. Future income does not increase Free now. A separate End-of-month forecast may include expected income and future allocations with an explicit forecast label. Show negative free funds as a shortfall; do not clamp to zero.

A budgeted expense reduces both L and its remaining budget: do not deduct it twice. Fulfilling a contribution moves G to R without creating consumption or changing net worth. A transfer to a savings account is not automatically a goal contribution: it needs an allocation link. Account balances and reservations are different entities.

## 7. Goals and home purchase

| ID | Status | Requirement |
|---|---|---|
| GL-01 | C | Home for living in Europe, country/price/deadline unknown. Also holidays, major purchases and arbitrary amount/deadline goals; extensible templates. |
| GL-02 | C | Household progress and each member's contributions. Fixed emergency-fund target. Allow partial use of emergency savings/investments with a protected minimum/allowed share. |
| GL-03 | C | All-cash and mortgage purchase scenarios. |
| GL-04 | P | With no target price, show savings and request a range; do not invent a purchase date. Users enter mortgage assumptions, fees, refurbishment, rate, term and down payment. |
| GL-05 | P | Baseline projection uses currently eligible goal reserves and future contributions without promised returns. Optional return/inflation scenarios explicitly state assumptions. |
| GL-06 | P | No unit of money funds two goals. Contributions without an identified member are Family contributions; never assume 50/50 attribution. Reallocations/withdrawals are separate events. |

For constant contributions and zero return: months = ceiling `(target − eligible funds) / monthly contribution`, minimum 0. A shortfall with nonpositive contributions has no completion date. Mortgage annuity: `M = P*r/(1−(1+r)^−n)`; for r=0 use P/n. This is a scenario, not a bank offer; show currency and assumptions. Do not consume protected reserves without a settings change.

## 8. Assets, deposits, imports and brokers

| ID | Status | Requirement |
|---|---|---|
| AS-01 | C | Named institutions without a hardcoded exclusive list: O!Bank, MBANK, Optima, Freedom Broker, MInvest (Kyrgyzstan), TBC, Galt & Taggart (Georgia). Legal entities/tariffs require verification. |
| AS-02 | C | Show identical instruments held at different brokers separately. Household totals sum valuations without merging UI positions. |
| AS-03 | C/P | Import portfolio snapshots from screenshots. Decision delegated in answer 89: always review positions before applying. Fields: brokerage account, instrument, quantity, visible price/value/currency and valuation date. |
| AS-04 | C | An instrument missing from a new screenshot is not evidence of a sale. Update confirmed positions only. Reimporting does not increase quantity. |
| AS-05 | C/R | Investigate CSV/Excel/PDF statements per broker. Do not claim format support without a sample, parser and validation. Manual entry/correction is mandatory. |
| AS-06 | C/R | Free daily quotes, manual valuation when a source is unavailable. Show date, source, staleness and the portion missing prices. |
| AS-07 | C | Crypto: asset, quantity, account/wallet and valuation. Full crypto trade history is not required. Never request seed phrases/private keys. |
| AS-08 | C | Deposits: principal, currency, rate, term, compounding, expected interest and maturity reminders. Users supply withdrawal/top-up terms. |
| AS-09 | C/R | Profit, returns, dividends, fees and taxes are desired when data permit. A snapshot does not replace transaction/cash-flow history. |
| BR-01 | C/R | Compare contractual fees/limitations and suggest cheaper options. Whether this is a separate family report or an app feature is unresolved; the first release must not depend on automated AI contract analysis. |
| BR-02 | P | Every extracted term records document/URL, page/clause, verification date, legal entity, tariff and country/client applicability. Missing terms are unknown, not free. |
| BR-03 | P | Compare trading fees/minimums, custody/service, conversion, deposits/withdrawals, securities transfer, inactivity and restrictions. A cheaper verdict applies to a stated scenario, not every customer. |

Keep snapshots, trades and revaluations separate. Market appreciation is not salary or spendable cash. Unrealized profit requires quantity and cost basis; realized profit requires sales and a selected basis method. Proposed: weighted-average cost for analytics, not tax reporting. Apply fees consistently and disclose the method. Store broker-provided metrics separately with attribution.

Calculate period percentage returns only with complete cash-flow history and a documented method; method selection remains R. Until then show available absolute metrics and why return is unavailable. Post dividends once as a cash flow; reinvestment is a separate purchase, not another income event. Investment purchases and own-account transfers are not consumption.

Deposit calculations retain contractual nominal/effective rates, day-count basis, payment schedule, compounding and top-ups. Incomplete terms produce an approximate result with assumptions. Do not assume tax rates or early-withdrawal eligibility.

## 9. Analytics, chat and notifications

| ID | Status | Requirement |
|---|---|---|
| AN-01 | C | Weekly/monthly spending, category growth, patterns, goal progress and net worth. Drill down from cards to source transactions. |
| AN-02 | P | Compare equivalent periods: elapsed days this month against the same count last month. A zero baseline yields absolute change, not an infinite percentage. |
| AN-03 | C/R | Chat is desired if free. Baseline candidate: deterministic supported questions for free funds, largest categories, spending changes and goal progress. Do not present this as a general-purpose AI model. |
| AN-04 | P | Numerical chat answers include period, currency and linked data. Unsupported questions receive an honest explanation. Chat does not autonomously modify money/budgets. |
| NT-01 | C | Push for weekly/monthly summaries and category growth, plus subscription/deposit reminders. Hide monetary amounts. |
| NT-02 | P | Configurable frequency/local time and per-type opt-out. Suggested category growth threshold: both +20% and $20 equivalent over a comparable period; editable. One warning per category/week. |
| NT-03 | P/R | Push depends on permission, platform and connectivity. An in-app inbox retains events when push is unavailable. Exact-time delivery is not guaranteed. Investigate a free scheduler. |

## 10. Main screens

Proposed navigation (P): Home, Activity, Assets, Plan; Settings and Reports are reachable from relevant screens; persistent Add action.

| Screen | Content |
|---|---|
| Home | Free to spend, monthly spending, net worth, nearest goal; sync timestamp and incomplete-data indicator. Tap for details. |
| Add / Review | Photo/file/manual entry; account, amount, currency, category; review queue and Undo. |
| Activity | Income/expenses/transfers; date/member/account/category/trip filters and search. |
| Assets | Accounts and separate broker positions, deposits, crypto, valuation timestamp and imports. |
| Plan | Pooled income allocation, personal allowances, budgets, emergency reserve, goals and purchase scenarios. |
| Reports / Ask | Week/month/trip reports, explanations of changes; chat where feasible. |
| Settings | Household, login/PIN, categories, currency, theme, notifications, backups, exports and deletion. |

Empty states provide one clear next action. Errors retain entered values. Missing exchange rates must not produce apparently precise complete totals. Color is not the sole information carrier; large touch targets and text scaling are proposed accessibility criteria.

## 11. Data model, synchronization and protection

Proposed entity contract (P):

| Entity | Main fields/invariants |
|---|---|
| User / Household / Membership | IDs, provider subject, household/member IDs, role, accepted invitation; server-enforced access. |
| Account | ID, household, owner/shared, type, institution, currency, availability, opening balance/date. |
| Transaction / Posting | ID, type, date, account postings, category, trip, actor, source, related ID, status, revision. |
| Category / CategoryRule | ID, parent ID, name, merchant/text rule, user correction, priority. |
| Budget / Allocation | month, bucket/member/goal, planned/reserved/spent, allocation rule; links instead of copied money. |
| Goal / Contribution | amount/currency/deadline, priority, protection, reserve source, member or Family attribution. |
| Instrument / Position / Trade | identifier/exchange/currency, account ID, quantity, cost basis when known, history. |
| PortfolioSnapshot / Quote / FxRate | as-of, source, imported fields, valuation/rate timestamp, completeness. |
| Deposit / RecurringPayment / Trip | contractual parameters / schedule / dates, budget, optional country. |
| ImportJob / AuditEvent / SyncOperation | status, fingerprint, source deletion state / actor, before-after / idempotency key, base revision. |
| Notification / BrokerDocument / FeeRule | event/delivery / document version/provenance / condition, minimum, unit, applicability. |

| ID | Status | Requirement |
|---|---|---|
| SY-01 | C | Offline entry and access to cached data; synchronize when connectivity returns. Free cloud is acceptable. |
| SY-02 | C | Conflicting edits require choosing one version. Retain both until resolution; never sum both monetary effects. |
| SY-03 | P | Local queue with unique operation IDs, idempotent retries and atomic transfers. Server returns accepted revision; no silent last-writer-wins. |
| SY-04 | C | Change history and recovery of deleted records. Proposed trash retention: 30 days with notice before final deletion. |
| SE-01 | C/P | PIN lock; do not label it end-to-end encryption. Provider authentication and household isolation are independent of PIN. Never store raw PIN. |
| SE-02 | P | TLS, per-entity household authorization and server-only provider secrets. Exclude amounts/documents/tokens from ordinary logs. Never request bank passwords. |
| SE-03 | C/P | CSV export and complete backup/restore. Proposed complete format: versioned JSON archive with integrity checks and optional password encryption. CSV is not a complete backup. |
| SE-04 | P | Restore validates version/structure and previews changes before overwriting anything. Reimport does not duplicate entities. Never export OAuth tokens or PIN. |
| SE-05 | P | Distinguish account/household deletion from leaving a household: one member must not silently delete the other's data. Finalize retention, deletion and privacy policies before public release. |

Browser storage can be cleared by the OS or user. Show sync/backup status; do not promise recovery of the only unsynced copy after browser data deletion. During a conflict, calculations use one clearly marked current version; resolution recalculates atomically.

## 12. Platforms, budget and architecture

Proposed architecture: shared web UI, independent financial domain module, local database/sync queue, authorized cloud API and OCR/quote/notification adapters. The user selected Next.js for the frontend (PR-10). Older-device compatibility and cloud supplier free-tier limits still require validation.

| Capability | Modern supported platform | Older device/missing API |
|---|---|---|
| Tracking/reports | Full baseline functionality | Target a lightweight UI; minimum version determined by tests, not release year |
| Installation | Home-screen PWA | Browser use where installation is unavailable |
| Offline | Service worker + local database | Disclose unavailable safe persistence; do not call the device fully supported |
| OCR | Local worker/model loaded on demand | Manual input/correction; model does not block app startup |
| Push | Permission + supported OS; iOS Home Screen from 16.4 [S1] | In-app notifications; no full parity across all 2015 devices |
| Share | System receiving where supported [S2] | In-app file picker |
| Background sync | Optional enhancement | Baseline sync attempt when app is open and online [S3] |

**Compatibility remains R:** test actual devices/emulators from the 2015, intermediate and current generations on both operating systems. Record exact browsers, OAuth/TLS, local database, OCR and performance. Emulation does not prove speed on old hardware. Until the matrix is completed, “all models since 2015” is not an achieved requirement.

**Zero budget:** a free HTTPS subdomain is proposed; a custom domain is optional. No automatic paid overages. On quota exhaustion retain local entry/export and show cloud suspension. Free operation for two people is not a promise of free unlimited public scale.

Tesseract.js is a local OCR candidate, not a quality guarantee; PDF requires extra processing [S8]. Capacitor is a mobile-build candidate supporting web-code reuse [S6]. Apple Login requires app/service identifier setup [S7]; verify zero-budget availability before promising it. Standard App Store membership costs $99/year and Google Play registration $25 once [S4–S5]; spending is not authorized now. App Store review requires appropriate functionality/quality beyond a repackaged website [S9].

## 13. Acceptance criteria

Amounts below are test fixtures, not the user's financial data. These are proposed verifiable implementation conditions.

| ID | Scenario and expected result |
|---|---|
| AC-01 | L=$3,000, R=$800, O=$900, G=$200, A=$300 → free $800. Future salary $1,000 changes forecast only. |
| AC-02 | A $100 purchase within O makes L=$2,900 and O=$800 → free remains $800. An unbudgeted $50 purchase reduces free by $50. |
| AC-03 | A fulfilled $200 contribution reduces G and increases R by $200; free funds and net worth are unchanged. |
| AC-04 | A $100 own-account transfer does not change household wealth/consumption; a separate $2 fee reduces wealth and adds $2 expense. |
| AC-05 | A $100 expense and linked $40 reimbursement in one period produce $60 net expense, not $40 income. Different periods retain actual dates. |
| AC-06 | A €20 receipt and $21.60 actual debit create one purchase with two currency values; USD balance falls by $21.60. |
| AC-07 | A $30 subcategory expense contributes $30 to its parent and $30 to household spending, not $60. |
| AC-08 | Unclear category but resolved financial fields → posted Needs review. Unknown amount/currency/account → draft without balance effects. |
| AC-09 | Repeated receipt warns without deleting automatically. Undo reverses its financial effect while retaining an audit event. |
| AC-10 | Successful persistence deletes the app's temporary receipt copy, not the gallery original. OCR failure does not destroy the only input before cancellation. |
| AC-11 | Confirmed screenshot with 5 shares updates position to 5; reimport retains 5. Another position missing from the image remains. |
| AC-12 | Same instrument in two brokers remains two positions, counted once each. Missing cost basis produces no invented profit. |
| AC-13 | Missing quote/rate shows original value and incomplete status, not zero/one substitution. |
| AC-14 | Deposit $1,000 at 12% annually for exactly one year, no compounding/tax/top-ups → expected interest $120 under explicitly selected terms. |
| AC-15 | Target $10,000, reserved $2,000, monthly contribution $500 → 16 months at zero return. Unknown home price → no purchase date. |
| AC-16 | Month-end $100 surplus allocated $60 emergency/$40 goal leaves consumption/net worth unchanged and increases reserves $100. Reclosing does not allocate twice. |
| AC-17 | Two offline edits to one transaction → choose one version; both are inspectable, only one monetary effect counts, resolution synchronizes. |
| AC-18 | Retrying one sync operation creates no duplicate. Distinct equal-amount expenses remain separate. |
| AC-19 | Another household cannot read/write via direct API. Both invited members can see shared and personal accounts in their household. |
| AC-20 | Push contains no amount/balance. Without permission, the event remains in-app. |
| AC-21 | Full backup restored into clean storage preserves balances, goals, relationships, positions and currencies. Invalid backups do not corrupt existing data. |
| AC-22 | An older device without OCR saves manual expenses; unsupported capabilities do not cause blank screens. Disclosed limitations match tested support. |
| AC-23 | “Where did money go in September?” returns September-based numbers, currency and source links. Unsupported questions receive no fabricated answer. |
| AC-24 | Percentage/minimum fee tariffs are compared on identical trade amounts/counts. Missing fees are unknown. Document and verification date are accessible. |

## 14. Milestones and research

Each milestone ends with a demonstrated working flow and relevant acceptance checks. This is implementation order, not permission to remove assets from the first user release.

1. **M0 — feasibility:** old-device matrix, receipt/screenshot OCR, free hosting/cloud/scheduler, Google/Apple Login, quotes/FX and statement samples. Deliver precise limitations and stack proposals.
2. **M1 — financial core:** household access, accounts, manual transactions, categories, budgets, free funds, local queue, conflicts and backups.
3. **M2 — assets/goals:** separate broker positions, crypto, deposits, reviewed import, reserves/goals/home scenarios.
4. **M3 — usable PWA:** receipts with manual fallback, trips, reports, supported-device push, PIN, themes and exports. M1–M3 together form the first release.
5. **M4 — validated extensions:** chat beyond supported questions, verified statement formats and broker-analysis format. Features lacking free solutions remain explicitly limited rather than promised.
6. **M5 — mandatory future publication:** mobile builds, native integrations, privacy/deletion policies, store compliance, testing and a separate registration budget.

| ID | Open research/decision |
|---|---|
| R-01 | Exact minimum OS/browser versions and supported capabilities for devices dating from 2015. |
| R-02 | OCR: at least 30 diverse RU/EN/DE receipts and several screens per broker with owner consent. Measure amount/currency/date accuracy and latency; do not claim a rate before measurement. |
| R-03 | Free cloud/auth/push stack: storage, requests, users, sleeping projects, backup limits and prevention of paid overages. |
| R-04 | Zero-budget Google/Apple Login. Deferring Apple until publication is a proposal requiring a recorded decision, not an agreed removal. |
| R-05 | Quote/FX sources, public-app licensing, instrument coverage and manual fallback. |
| R-06 | Bank/broker export formats and official read-only integrations. No terms circumvention or password storage. |
| R-07 | Legal entities, current tariffs/contracts and effective dates. This specification has not performed the actual broker comparison. |
| R-08 | Return method, display precision and deposit formulas based on actual agreements. |
| R-09 | Whether supported chat queries are sufficient; feasibility of a free model on target devices without mandatory paid infrastructure. |
| D-01 | Proposals for confirmation: free-funds formula, personal allowances, surplus allocation, subscription confirmation, receipt account selection and notification thresholds. |
| D-02 | Broker analysis as a family report or app feature; does not block core tracking. |

## 15. Implementation instructions and completion boundary

- Start with M0 and financial invariants. Do not create paid subscriptions, promise unverified banking APIs or publish financial data.
- Separate the financial module from UI, providers and OCR. Validate automatically extracted values, currencies and duplicates.
- Test formulas/invariants with the AC table, negative authorization cases and permitted anonymized real imports. Test UI on both operating systems and an older configuration.
- Record requirement changes by ID and reason in both languages. Do not relabel P/R as C without evidence.
- First-release completion requires M1–M3 working together, applicable AC passing, no household data leakage or double counting, known free quotas, disclosed device limits and verified export/restore.
- The specifications and an initial Next.js home-page demo with locally saved extra sample expenses are implemented. The full financial ledger, OCR verification, broker connections, tariff analysis and publication are not complete. See README for current commands and demo limitations.
