# fluent-next: миграция sizes (и прочих не-цветовых значений) на base-токены

> **АРХИВ.** Этап завершён и верифицирован (см. «Статус исполнения» внизу). Документ сохранён как
> запись метода и решений; текущее состояние темы — в [README.md](README.md), сводка результатов
> этапа — в разделе «Sizes migration» в [TOKENS_MIGRATION.md](TOKENS_MIGRATION.md).

## Context

Работа велась в ветке `26_2_design_tokens` (там же лежит пофазовая история); итог перенесён в
`feature/26_2_new_fluent_theme_with_design_tokens` одним squash-коммитом. Уже сделано ранее: пайплайн токенов (`build/tokens/` → `scss/_design-system/`), нормализация слоёв, цветовой маппинг пилотной волны (button, textEditor, textBox, checkBox).

Этот этап — **sizes и остальные не-цветовые категории** (типографика, радиусы, border-width, opacity, letter-spacing). Требование: **компоненты визуально без изменений** («точь-в-точь»), compact = small, medium = default; large — не обязателен сейчас.

**Решения:** архитектура A (существующие `@if $size` ветки остаются, значения → точные base-токены); значения вне шкалы остаются px-литералами с пометкой; скоуп — только переменные в `_sizes.scss` (+ вынужденные calc-правки вычислений в стилевых/shared-миксинах, чтобы сборка не падала).

## Собранные факты

- 87 файлов `_sizes.scss`; ~1017 px-литералов, 83 уникальных значения; **94.7% точно ложатся на base-шкалы**.
- Шкала spacing: каждый px 0–24 + ступени до 160 (и −10). Пример: 5px = `spacing-50` = 0.3125rem.
- font-size/line-height: 10-шаговые шкалы (120=12px; нет 13/15px), borders: 0–6,8,10,12,16,992; opacity шаг 0.05; letter-spacing 0–0.5px; font-weight 100–900.
- 55 использований вне шкалы (27, 35, 38, 42, 50, 90, 130, 150px…, 1.5px) — «сироты».
- `_ds.scss` уже экспортирует все нужные шкалы — пайплайн менять не нужно.
- px→rem: рендер идентичен при root 16px.

## Правила маппинга

1. Меняются **только значения переменных** в `_sizes.scss`. Структура `@if $size` веток, `with (...)`, маркер `$theme-marker-size-postfix` — не трогаются.
2. Выбор шкалы по имени переменной: `*font-size*`→font-size; `*line-height*`→line-height; `*radius*`→border-radius; сегмент `border` (в том числе одиночный: `$x-border`, `$x-border-width`, `$x-border-block-start`)→border-width; `*letter-spacing*`→letter-spacing; `*font-weight*`→font-weight; прочие px→spacing.
   Сегмент — именно дефисный: `borderedwidget` бордером не считается. Радиусы и их углы матчатся раньше, поэтому под правило `border` они не попадают.
   Проверка шкалы в гарде `rename.mjs` включается **только** для переменной, объявленной в `_sizes.scss`: у цвета шкалы размеров нет, а слова `border`/`line`/`outline` в его имени — часть, не длина (иначе гард флагает каждое переименование цвета, добавляющее или снимающее такое слово). Оба уточнения внесены 26.08.2026 волной G, когда `$x-border` (`<width> solid`) стал `$x-border-width`.
3. Только точное совпадение (assert в скрипте). Shorthand покомпонентно (`4px 8px` → `ds.$spacing-40 ds.$spacing-80`).
4. Сироты остаются литералами с маркером `// dx-offscale: <px>` + сводный список в DIVERGENCES.
5. Арифметика над токенами → `calc()` через интерполяцию (`math.div($a - $b, 2)` → `calc((#{$a} - #{$b}) / 2)`).
6. Вычисления от size-переменных в стилевых/shared-миксинах после токенизации листа не компилируются → `calc()` по месту. В shared base-миксинах (используются и другими темами) — через `@if meta.type-of($x) == number { …старое… } @else { …calc… }`, чтобы generic/material/fluent остались байт-идентичными.
7. `0`, `em`, `%`, строки, transition — без изменений.

## large (вне скоупа, зафиксировать)

Механизм расширяем: `@else if $size == "large"` третьей веткой + `large` в списке размеров
`build/theme-options.cjs`.

> **Поправка (актуально на 28.07.2026):** компонентные size-токены пакета **сознательно исключены**
> из генерации (`build/tokens/build-tokens.mjs`, `_design-system.scss`) — виджеты кладут размеры на
> базовые шкалы, поэтому `*-layout-*` custom properties никем не читались бы. Файла
> `_design-system/fluent/components/sizes/large.scss` больше **нет**: значения для `large` придётся
> брать из базовых шкал.

## Верификация

1. Скрипт маппинга: ноль assert-ошибок; ≥94% литералов на токенах, сироты помечены.
2. **Нормализатор «пиксель-в-пиксель»** (scratchpad): компилирует бандлы ДО (HEAD) и ПОСЛЕ, резолвит `var(--dxds-*)`, rem→px (×16), сворачивает calc-константы, раскрывает shorthand/`font`, сравнивает декларации каскадно. Ожидание — ноль отличий по всем 8 fluent-next-бандлам.
3. `pnpm run lint`, `pnpm test` (devextreme-scss), `pnpm nx build:ci devextreme-scss` — зелёные.
4. Compare-страница: default/compact, light/dark — визуально без изменений.

---

## Статус исполнения

- [x] Бэйзлайн-снапшот 8 бандлов до правок (scratchpad/sizes-baseline-css).
- [x] Аудит-скрипт + отчёт (959 px-литералов на токены, 55 сирот, 16 арифм. в `_sizes`, 99 в стилевых).
- [x] Механический маппинг: **872 декларации токенизированы** (+5 font-weight), 55 строк помечены `dx-offscale`, 517 имён переменных стали динамическими.
- [x] Ручной хвост calc(): ~90 мест в `_sizes`/стилевых/shared-миксинах. Guard-паттерн (`@if meta.type-of == number`) в shared base-миксинах: `_icon_fonts`, `_mixins` (pending-indicator), `textEditor/_mixins`, `radioButton/_mixins`, `switch/_mixins`, `dropDownEditor/_mixins`, `diagram/_mixins`, `calendar/_mixins`, `treeView/_index`, `treeList/_expandable`, `scheduler/views`, `pivotGrid/_index`, `cardView/header_panel`, chat-миксины.
- [x] Устранены «молчаливые» string-конкатенации в calc/shorthand (list, lookup, switch, cardView, treeView, treeList, pivotGrid, scheduler, calendar) — источник — интерполяция суммы токенов без внешних скобок/`calc`.
- [x] **Все 8 бандлов пиксель-в-пиксель идентичны бэйзлайну (TOTAL diffs: 0).**
- [x] lint (0 ошибок) + jest (18/18) — зелёные.
- [x] Другие темы не затронуты: 6 представителей (fluent light/dark, material, generic light/carmine/contrast) **байт-идентичны** HEAD-сборке (guard-паттерн берёт числовой путь). Найдена и исправлена регрессия: hoisted-локал в `diagram/_mixins` ссылался сам на себя в then-ветке — падало только на не-token темах, поймано именно этой проверкой.
- [x] Визуальная сверка (playground compare-frame): default = button 32px/14px, input 32px; compact = button 24px/12px — совпадает с legacy-геометрией fluent, ветвление `@if $size` через токены работает.
- [x] Доки обновлены: секция «Sizes migration» в TOKENS_MIGRATION.md (метрики + список 55 сирот), две записи в DIVERGENCES.md (px→rem accepted; off-scale review).

## Итог: этап sizes завершён и верифицирован. Готово к коммиту.
