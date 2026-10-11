# MoneyTracker

Product specification / Техническое задание, draft 0.1, 2026-10-11.

- [ТЗ на русском](docs/SPEC.ru.md)
- [English specification](docs/SPEC.en.md)
- [Проверенные источники / Verified sources](docs/SOURCES.md)
- [Правила работы и проектные Skills / Project instructions and skills](AGENTS.md)

The app has not been implemented. These documents capture the requirements interview and proposed implementation rules. Matching requirement IDs link the two language versions. Confirmed requirements, proposals and research gates are explicitly distinguished.

Приложение пока не реализовано. Документы фиксируют интервью и предлагаемые правила реализации. Одинаковые идентификаторы связывают языковые версии. Подтверждённые требования, предложения и задачи исследования явно разделены.

## Project skills / Навыки проекта

Skills are stored in `.agents/skills/`, following the role-based structure used in Wortilo, adapted to this project's specification. Use the matching skill explicitly or follow the routing in `AGENTS.md`:

- `$moneytracker-backend` — financial domain, API, authorization and sync.
- `$moneytracker-frontend` — PWA, client storage, receipts and device integrations.
- `$moneytracker-designer` — simple cards, financial UX, accessibility and screen states.
- `$moneytracker-qa` — financial invariants, regression and platform verification.
- `$moneytracker-financial-advisor` — household budgeting, goals and sourced broker comparisons.

Навыки содержат инструкции для агента; они не реализуют функции приложения. Финансовый консультант различает факты, предположения и рекомендации, проверяет актуальные условия и не выполняет финансовые операции.
