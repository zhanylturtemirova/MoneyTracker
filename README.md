# MoneyTracker

Product specification / Техническое задание, draft 0.1, 2026-10-11.

- [ТЗ на русском](docs/SPEC.ru.md)
- [English specification](docs/SPEC.en.md)
- [Проверенные источники / Verified sources](docs/SOURCES.md)
- [Правила работы и проектные Skills / Project instructions and skills](AGENTS.md)
- [Дизайн Emerald & Gold / Design concept](docs/design/README.md)
- [Penpot — Emerald & Gold v1](https://design.penpot.app/#/workspace?team-id=17193a1f-939a-80b5-8008-c5cb27c70f56&file-id=52a5041f-08a1-80f1-8008-c5cb91e87f3d&page-id=52a5041f-08a1-80f1-8008-c5cb91e87f3e) — требуется доступ / authorized access required.

The first Next.js home-page demo is implemented. The full financial application is not yet implemented. These documents capture the requirements interview and proposed implementation rules. Matching requirement IDs link the two language versions. Confirmed requirements, proposals and research gates are explicitly distinguished.

Реализована первая демонстрационная главная страница на Next.js. Полное финансовое приложение ещё не готово. Документы фиксируют интервью и предлагаемые правила реализации. Одинаковые идентификаторы связывают языковые версии. Подтверждённые требования, предложения и задачи исследования явно разделены.

## Run locally / Локальный запуск

Use Node.js 24 LTS and npm. / Используйте Node.js 24 LTS и npm.

```sh
npm ci
npm run dev
```

Open / Откройте [localhost:3000](http://localhost:3000).

```sh
npm test
npm run typecheck
npm run build
npm run preview
```

`preview` serves the static `out` directory using Python 3. No paid service or server rendering is required for this demo. A web manifest is included; offline caching, installability across platforms, cloud sync, auth, OCR and real accounts are not implemented. The current UI is light theme only; dark mode remains planned.

`preview` запускает Python 3 для статической папки `out`. Демонстрации не нужны платные сервисы или серверный рендеринг. Есть web manifest; офлайн-кеширование, проверка установки на разных платформах, облачная синхронизация, авторизация, OCR и реальные счета пока не реализованы. Сейчас интерфейс светлый; тёмная тема остаётся в плане.

The fixed October 2026 fixture is labelled as a demo. Extra, unplanned USD purchases are stored under `moneytracker.demo.expenses.v1` in localStorage and deducted from the sample available cash, free funds and wealth. This is not the production multi-account ledger. Do not enter real financial data. Reset removes only this demo's entries.

Данные октября 2026 помечены как демонстрация. Дополнительные внеплановые покупки в USD хранятся в localStorage под ключом `moneytracker.demo.expenses.v1`, уменьшая демонстрационные наличные, свободную сумму и капитал. Это не производственный учёт нескольких счетов. Не вводите реальные финансовые данные. Reset удаляет только записи этой демонстрации.

## Project skills / Навыки проекта

Skills are stored in `.agents/skills/`, following the role-based structure used in Wortilo, adapted to this project's specification. Use the matching skill explicitly or follow the routing in `AGENTS.md`:

- `$moneytracker-backend` — financial domain, API, authorization and sync.
- `$moneytracker-frontend` — PWA, client storage, receipts and device integrations.
- `$moneytracker-designer` — simple cards, financial UX, accessibility and screen states.
- `$moneytracker-qa` — financial invariants, regression and platform verification.
- `$moneytracker-financial-advisor` — household budgeting, goals and sourced broker comparisons.

Навыки содержат инструкции для агента; они не реализуют функции приложения. Финансовый консультант различает факты, предположения и рекомендации, проверяет актуальные условия и не выполняет финансовые операции.
