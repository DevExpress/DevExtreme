# fluent-next → трекер миграции на design tokens

Цель: заменить **значения** переменных ссылками на design-токены (`ds.$…` из `scss/_design-system/variables/_ds.scss`).

> **Словарь ролей.** Имена ролей в датированных записях ниже приведены **на момент своей записи**.
> Пакет `262.10.1` (#34916) переименовал оба тира: `surface` → `bg`, `neutral`/`default` и явный
> `rest` убраны, `subdued` → `subtle`, `compound` → `shared`, `deep` → `low`, `accessible` → `contrast`;
> компонентный тир перестроен (`button-outline-color-bg-rest` → `button-color-contained-*`). Живое
> написание — в `scss/_design-system/variables/_ds.scss` и в `tokens.flat.json` пакета; полные ссылки
> вида `ds.$…` / `--dxds-…` в этих доках уже приведены к нему, сокращённые упоминания — нет.

Правила, селекторы, размеры и разметка остаются нетронутыми — единственное ожидаемое визуальное отличие — оттенки цветов.

> **Навигация.** Состояние темы целиком, что шипается и что открыто — в [README.md](README.md);
> ловушки — в [GOTCHAS.md](GOTCHAS.md); тесты, a11y и CI — в [TESTING.md](TESTING.md);
> расхождения для дизайн-ревью — в [DIVERGENCES.journal.md](DIVERGENCES.journal.md)
> (одноимённый [DIVERGENCES.md](DIVERGENCES.md) с #35060 — это отслеживаемый git'ом док про маркеры).
>
> Этот документ — журнал самой миграции: правила, инвентарь, уровни токенов, таблицы маппинга по
> волнам. Все проходы (цвета, размеры, типографика, литералы в файлах стилей, слой `base/**`)
> **завершены**; статус каждого указан в его разделе.

> **Словарь имён ниже — исторический.** 262.8.0 переименовал весь семантический слой пакета
> (`color-surface-<палитра>-<вариант>-<состояние>` → плоские `color-bg…`), тема переведена на
> 262.10.1 в `508d382bfe`. Таблицы маппинга фиксируют решения своих волн в написании того времени;
> действующее написание — в коде, правила соответствия — [GOTCHAS.md](GOTCHAS.md) §24.

## Правила прохода (кратко)

1. Область на виджет: только `<widget>/_colors.scss`. `_sizes.scss` вне области (режим размеров — отдельная будущая фаза: геометрия пакета отличается от fluent по замыслу). *Уточнение: правило описывает цветовой проход; миграция размеров с тех пор выполнена отдельным этапом — см. «Миграция размеров» ниже и [SIZES_MIGRATION_PLAN.md](SIZES_MIGRATION_PLAN.md). Открытым остаётся только режим `large`.*
2. **Сначала нормализация слоёв** (фаза 0.5): файлы стилей (`_index.scss`, `_mixins.scss`) должны ссылаться только на собственные переменные своего виджета. Каждая прямая ссылка на уровень темы (`$base-*`) или инлайновое вычисление цвета выносится в `_colors.scss` виджета с тем же выражением. Критерий приёмки: скомпилированные бандлы байт-идентичны.
3. **Маппинг по роли места, а не по старой цепочке**: производные цепочки (`color.mix`/`color.change`/HSL-корректировки) заменяются готовым токеном. Приоритет:
   ① семантическая роль (`ds.$color-bg-primary`) →
   ② базовая шкала / семантическая типографика →
   ③ CSS-мост `color-mix(in srgb, …)` / `rgb(from …)` — обязательно фиксируется в DIVERGENCES.md →
   ④ эскалация в команду design-system.
   Никаких SCSS-функций цвета над значениями `var()`.

   **Компонентный тир вендора (`ds.$button-*`, `ds.$checkbox-*`, …) не потребляется — решение
   06.08.2026.** Раньше он стоял первым приоритетом; замер по собранным бандлам (262.6.0) показал,
   что все 62 потреблявшихся токена — чистые алиасы семантических ролей, одинаковые в light и dark,
   то есть тир не нёс ни бита информации, зато держал зависимость от 62 вендорских имён (включая
   опечатку `switch-color-checked-bg-disable`). 90 чтений заменены на роли; резолв-дифф по всем
   4 бандлам — 0 отличий на 16 274 декларациях каждого. Компонентный уровень темы — наши
   `$<component>-*` переменные, замапленные на семантику и базу. Запись в DIVERGENCES.md
   («component tier»).
4. Ветки `@if $mode == "dark"` / `@if $color` сворачиваются там, где роль покрывает оба случая — режим/акцент резолвится бандлом (`modes/{mode}.scss`, `accents/{color}.scss`).
5. Переменная, используемая в двух разных ролях: оставляем доминирующую роль, фиксируем в DIVERGENCES.md; расщепление (правка правил) — отдельный согласованный follow-up.

## Исключения из нормализации слоёв (фаза 0.5, по замыслу)

1. Строка-маркер темы в `common/_index.scss` (`$theme-marker-color`, `$theme-marker-mode`, `$theme-marker-size-postfix`) — кодирует идентичность темы, остаётся на уровне темы.
2. Блоки конфигурации модулей `@use … with (…)` (dataGrid/treeList/sortable → базовые виджеты) — связка темы между модулями, значения токенизируются в местах своего определения.
3. Размерные переменные (`$fluent-*`, `$base-border-radius` и т. п. из `_sizes`) — вне области до фазы режима размеров.
4. Межвиджетные ссылки на цвета в файлах стилей (например, `$overlay-content-bg` в diagram) — резолвятся транзитивно после маппинга владеющего виджета.

## Инвентаризация виджетов

Статус: `todo` → `normalized` (фаза 0.5 выполнена) → `mapped` (токены применены). Четвёртый статус
`done` был задуман с DoD «бандл собирается, демо просмотрено, папка testcafe зелёная» — **он снят
с употребления решением 28.08.2026**, и вот почему.

**Все 86 виджетов в статусе `mapped`, и это финальное состояние инвентаря.** Ни один не переведён
в `done` не потому, что работа не доделана, а потому, что за прошедшие волны приёмка перестала быть
пер-виджетной: её делают машинные гейты, и все они общетемные, а не по виджету —

| Что проверяет | Чем |
|---|---|
| значения не поехали | резолв-дифф собранных бандлов против пре-волнового эталона (0 потерянных, 0 изменённых) |
| легаси-темы не задеты | побайтовая сверка `generic`/`material`/`fluent` |
| имена и владение | энфорсер `fluent-next-naming.test.ts` (81 кейс) + `naming:check` |
| достижимость тира в DOM | `playground/tier-reachability-audit.html` — 52 виджета, их сателлиты и порталы |
| каскад на пикселях | скриншоты e2e и демок против эталонов fluent-next |

Единственное, что осталось от старого DoD и **не** заменено машиной, — зелёная матрица скриншотов
на текущем коммите: прогон на `cbb3c39cec` был красным (180 скриншотов, все — дыры достижимости
сателлитов), причины исправлены коммитом `a24f2d590d`, повторный прогон не снят.
Пер-виджетную колонку `done` вводить обратно не нужно: она бы дублировала эти гейты.

| Виджет | Волна | Статус |
|---|---|---|
| button | pilot | mapped |
| checkBox | pilot | mapped |
| textBox | pilot | mapped |
| textEditor | pilot | mapped |
| badge | w2-primitives | mapped |
| box | w2-primitives | mapped |
| card | w2-primitives | mapped |
| common | w2-primitives | mapped |
| fieldset | w2-primitives | mapped |
| icons | w2-primitives | mapped |
| informer | w2-primitives | mapped |
| loadIndicator | w2-primitives | mapped |
| numberBox | w2-primitives | mapped |
| progressBar | w2-primitives | mapped |
| radioButton | w2-primitives | mapped |
| rangeSlider | w2-primitives | mapped |
| responsiveBox | w2-primitives | mapped |
| scrollable | w2-primitives | mapped |
| slider | w2-primitives | mapped |
| sortable | w2-primitives | mapped |
| speedDialAction | w2-primitives | mapped |
| splitterBar | w2-primitives | mapped |
| stepper | w2-primitives | mapped |
| switch | w2-primitives | mapped |
| textArea | w2-primitives | mapped |
| typography | w2-primitives | mapped |
| validation | w2-primitives | mapped |
| widget | w2-primitives | mapped |
| actionSheet | w3-composites | mapped |
| buttonGroup | w3-composites | mapped |
| calendar | w3-composites | mapped |
| contextMenu | w3-composites | mapped |
| dateView | w3-composites | mapped |
| drawer | w3-composites | mapped |
| dropDownButton | w3-composites | mapped |
| dropDownEditor | w3-composites | mapped |
| dropDownMenu | w3-composites | mapped |
| gallery | w3-composites | mapped |
| list | w3-composites | mapped |
| loadPanel | w3-composites | mapped |
| menu | w3-composites | mapped |
| menuBase | w3-composites | mapped |
| multiView | w3-composites | mapped |
| overlay | w3-composites | mapped |
| popover | w3-composites | mapped |
| popup | w3-composites | mapped |
| radioGroup | w3-composites | mapped |
| scrollView | w3-composites | mapped |
| splitter | w3-composites | mapped |
| tabs | w3-composites | mapped |
| tileView | w3-composites | mapped |
| timeView | w3-composites | mapped |
| toast | w3-composites | mapped |
| tooltip | w3-composites | mapped |
| treeView | w3-composites | mapped |
| accordion | w4-composite-editors | mapped |
| autocomplete | w4-composite-editors | mapped |
| chat | w4-composite-editors | mapped |
| colorBox | w4-composite-editors | mapped |
| colorView | w4-composite-editors | mapped |
| dateBox | w4-composite-editors | mapped |
| dateRangeBox | w4-composite-editors | mapped |
| dropDownBox | w4-composite-editors | mapped |
| dropDownList | w4-composite-editors | mapped |
| fileUploader | w4-composite-editors | mapped |
| filterBuilder | w4-composite-editors | mapped |
| form | w4-composite-editors | mapped |
| lookup | w4-composite-editors | mapped |
| pagination | w4-composite-editors | mapped |
| recurrenceEditor | w4-composite-editors | mapped |
| selectBox | w4-composite-editors | mapped |
| speechToText | w4-composite-editors | mapped |
| tabPanel | w4-composite-editors | mapped |
| tagBox | w4-composite-editors | mapped |
| toolbar | w4-composite-editors | mapped |
| cardView | w5-complex | mapped |
| dataGrid | w5-complex | mapped |
| diagram | w5-complex | mapped |
| fileManager | w5-complex | mapped |
| gantt | w5-complex | mapped |
| gridBase | w5-complex | mapped |
| htmlEditor | w5-complex | mapped |
| map | w5-complex | mapped |
| pivotGrid | w5-complex | mapped |
| scheduler | w5-complex | mapped |
| treeList | w5-complex | mapped |

## Уровни токенов: пакет → сгенерированный вывод

Сгенерированный `scss/_design-system/` повторяет три уровня пакета (`@devexpress/design-tokens-internal/tokens/`).
Каждая цепочка сохраняется в итоговом CSS (`outputReferences: true`): свойство ссылается на компонентную или семантическую
переменную, та — на семантическую или базовую; все три уровня являются независимо переопределяемыми custom properties.

| Уровень | Папка пакета | Сгенерированный файл | Примеры |
|---|---|---|---|
| base: цветовые палитры | `base/colors/palettes/fluent/*` | `fluent/accents/{palette}.scss` | `--dxds-neutral-30`, `--dxds-primary-90` |
| base: шкалы | `base/{spacing,borders,opacity,typography}` | `base.scss` | `--dxds-spacing-120`, `--dxds-font-size-140` |
| base: utility/global/figma | `base/colors/utility`, `global`, `figma-utils` | `fluent/base.scss` | `--dxds-utility-*`, `--dxds-global-*`, параметры слоёв тени |
| **semantic: цвета** (по режимам) | `semantic/colors/fluent/{light,dark}` | `fluent/semantic/colors/{mode}.scss` | `--dxds-color-bg` |
| **semantic: типографика** | `semantic/typography/fluent/*` | `fluent/semantic/typography.scss` | `--dxds-font-size-base-md`, `--dxds-font-family-sans-serif` |
| **semantic: box-shadow** | `semantic/box-shadow/fluent` | `fluent/semantic/box-shadow.scss` | `--dxds-box-shadow-md` |
| component: тема (цвета) | `components/core/theme/fluent` | `fluent/components/theme.scss` | `--dxds-button-contained-color-bg-rest` |
| component: размеры | `components/core/size/fluent_{size}` | **не генерируется** (см. ниже) | `--dxds-button-contained-layout-*` |

**Компонентные size-токены сознательно исключены из генерации** (`build/tokens/build-tokens.mjs`,
`fluent-next/_design-system.scss`): виджеты кладут размеры на базовые шкалы, поэтому `*-layout-*`
custom properties не читал бы ни один виджет. Файла `fluent/components/sizes/{size}.scss` в
сгенерированном каталоге нет — это важно для будущей фазы `large`, значения для неё придётся брать
из базовых шкал.

**Пробел в пакете:** семантический уровень покрывает только цвета, типографику и box-shadow. **Семантических ролей для
spacing / border-radius / border-width / opacity / геометрии тени нет** — компонентные токены и `_sizes.scss` виджетов
ссылаются для этих категорий на базовые шкалы напрямую (63% ссылок `var()` в разметке). Эскалировано в
команду design-system (см. DIVERGENCES).

## Семантический проход по типографике (follow-up к миграции размеров) — done

Миграция размеров изначально сопоставила типографику виджетов базовым числовым ступеням (`ds.$font-size-140`), минуя
семантические роли. Переназначено **57 ссылок** в `*/_sizes.scss` на семантические роли, выбранные по роли места
(подписи/бейджи/хинты → `caption-*`, текст/редакторы/ячейки → `base-*`, хедеры/подписи групп → `title-*`, заголовки →
`headline-*`); `$base-font-family` → `ds.$font-family-sans-serif`. Каждая замена — точный алиас исходной
базовой ступени, проверено резолвом всех скомпилированных объявлений до/после: **единственное изменение значения это стек
font-family** (зафиксировано в DIVERGENCES).

Уточнённые правила:
- Переменная маппится только тогда, когда **все** значения её ветвей `@if $size` попадают на роли **одного семейства** (суффикс может
  отличаться: default `base-md` / compact `base-sm`) — иначе переопределение роли перестилизует лишь одну ветку.
  Смешанные/внешкальные случаи остаются на базовых ступенях с маркером `// dx-no-semantic-role`.
- Размеры глифов иконок (`font-size` у иконочных шрифтов) остаются на базовых ступенях с маркерами `// dx-icon-glyph-size` — семантические
  роли типографики это текстовые роли.
- Внешкальные ступени без роли (кандидаты на новые роли в пакете): font-size 110/180/220/260/360, line-height 120/180,
  font-weight 500. Утилиты `.dx-font-{xl,l,m,s,xs}` виджета typography намеренно остаются на базовых ступенях (сырые
  размерные утилиты, а не текстовые роли); его `h1`/`h3` маппятся на `headline-*`.

## Проход по литералам в файлах стилей — done (follow-up по spacing в ожидании)

Инлайновые захардкоженные значения в файлах стилей виджетов (`_index.scss`/`_mixins.scss`) обошли и
цветовую, и размерную миграции (их областью были переменные `_colors.scss`/`_sizes.scss`). Аудит + правки:

- **Токенизировано (48 мест, 24 виджета):** литералы font-weight (20), px у font-size/line-height (15),
  px у border-radius/width (13), opacity (3), цвета выделения на канве diagram (`#666`,
  `rgba(144,144,144,.02)`). Каждое вынесено в переменную виджета в `_sizes.scss`/`_colors.scss` и сопоставлено
  по стандартным правилам (семантическая роль → базовая ступень + маркер `dx-no-semantic-role`/`dx-icon-glyph-size`
  → литерал + `dx-offscale`). Локальные для файлов стилей размерные переменные (размеры шрифта хедера/области
  pivotGrid, толщины границ list/textEditor/diagram) перенесены в `_sizes.scss`, где им и место.
- **Оставлено как есть:** безразмерные сбросы `line-height: 0/1`, `border-radius: 50%`, `transparent`/`currentcolor`.
- **Пропорциональные дизайн-значения в `em` → переменные с сохранением литерала `em` (13 мест):** толщина кольца спиннера
  (`$load-indicator-segment-border-width: 0.12em`), ширины роллеров и шкалы акцентирования dateView, шрифт тулбара
  заголовка попапа diagram, высота сообщения о пустом списке в list — это дизайн-ручки (ре-скин может изменить пропорцию), поэтому
  им выдаётся переменная, но значение должно остаться относительным (маркер `// dx-relative`): фиксированная ступень шкалы сломала бы
  масштабирование вместе с font-size виджета. Badge `border-radius: 999em` → `ds.$border-radius-full` (идиома pill,
  визуально идентично).
- **Ключевые слова/сбросы раскладки остаются литералами (по замыслу, ~235 мест):** `auto`, `0`, `none`, `100%`, `50%`,
  `inherit` у box-свойств (`height: auto`, `padding-inline-end: 0`, `left: 0`, …) — это механика раскладки,
  семантика растяжения/позиционирования/сброса, а не значения шкалы. Это не точки кастомизации; их вынос
  похоронил бы настоящие токены. Лакмусовая проверка: *изменит ли дизайнер это значение при ре-скине темы?*
  `0` попадает в переменную `_sizes.scss` только тогда, когда это спроектированное значение (например, одна ветка пары режимов размера —
  `$fluent-accordion-item-opened-margin`).
- **Проход по spacing + границам (done):** 132 объявления spacing (→ ~124 переменные, 23 виджета) + 57 shorthand
  границ (→ ~49 переменных) + 17 локальных для файлов стилей px-определений переменных перенесены в `_sizes.scss`.
  Правило (согласовано): точное совпадение со шкалой → токен; иначе литерал уходит в переменную без изменений с
  маркером `// dx-offscale` — **никаких аппроксимаций через calc()**; отрицательные смещения остаются литеральными px.
  Объявления, уже содержащие `calc()`/`var()` (34), намеренно не тронуты.
  Подводный камень, найденный линтом (`scss/no-duplicate-dollar-variables`): две автоматически вынесенные переменные
  столкнулись с уже существовавшими именами — при `!default` добавленное определение молча проигрывает, и стиль получает
  неверное значение. Обе переименованы (`…-column-chooser-list-item-margin`, `…-month[-recurrence]-appointment-content-padding[-rtl]`)
  и проверены на возврат к исходным значениям. Всегда запускайте линт + диф отрезолвленных значений после прохода с выносом.

## Миграция слоя base/** (общая со всеми темами) — done

`widgets/base/**` (195 файлов) компилируется в бандлы каждой темы; его захардкоженные дизайн-значения были
последней нетокенизированной поверхностью в fluent-next. Инвентаризация: ~618 сырых px, ~19 цветов, 28 opacity,
~46 дизайнерских em (+105 модульных `$`-констант в одной правке от параметризуемости). ЖЁСТКОЕ ограничение: другие
темы остаются **байт-идентичными**.

**Контракт (новый, волны B):** литерал в base → `$x: <legacy literal> !default` (опциональное переопределение —
в отличие от старого контракта обязательной инъекции `null !default`, темы без инъекции сохраняют
литерал по построению). fluent-next инъектирует токены через `@use "../../base/x" with (…)`, значения приходят
из переменных `_colors.scss`/`_sizes.scss` виджета (в волнах B они несли префикс `$fluent-*` — им уворачивались
от имён base, занятых под `as *`; волна C заменила его на имя компонента, которое различает не хуже, а волна F2
сняла последние три вхождения — см. [NAMING.md](NAMING.md)).
Любая математика Sass над новой переменной требует guard-паттерна `meta.type-of`.

- **B1a — done:** 25 мест (цвета/тени/opacity/типографика) в popup, htmlEditor, diagram,
  sortable, numberBox, pagination, dropDownEditor, list, box, fileUploader, progressBar,
  scrollView, calendar, fileManager, scheduler (константы модулей). 7 видимых изменений значений на режим —
  см. DIVERGENCES; остальное резолвится идентично. Другие темы проверены как байт-идентичные (6 бандлов).
- **B1b — done:** 15 значений протянуто через цепочки модулей — scheduler `_tooltip` (тень обёртки →
  `box-shadow-md`), `appointment/agenda` (fw заголовка, fs/opacity деталей), `appointment/regular`
  (fs иконки + 4 opacity состояний) через цепочки `with (…)` `base/scheduler/_index` → `./tooltip`/`./appointment` →
  `./agenda`/`./regular`; раскладка chat (fw имени файла в `chat-fileview`, fw подписи в
  `chat-messagebox-editing-preview`) через новые `with()` на `@use`-ах раскладки; treeView
  `_common` opacity disabled; filterBuilder `_common` opacity разделителя диапазона. Паттерн: литеральный
  default в конфигурационном хабе цепочки, `null !default` как проброс в подмодулях. Замечание: `with()` на стороне
  темы должен идти ПОСЛЕ импортов `colors`/`sizes` виджета (порядок в chat/_index изменён). Пропущено
  как затенённое темой: font-size темы/даты в tooltip + opacity даты (тема задаёт свои правила).
  `scheduler/_index:458` 11px — внешкальное, без инъекции (только канал, не параметризовано).
- **B2 — done:** px-размеры по виджетам через общий движок (один базовый `$x: <literal> !default`
  на каждую уникальную пару свойство+значение, автоимя от ближайшего селектора, инъектируемый токен из
  `_sizes.scss` виджета через `with()`). Структурное/функциональное пропущено: отрицательные значения, off-screen
  (`-5000px`), фиксированные размеры панелей от ~1000px оставлены литералами `!default` + `dx-offscale`.
  - **Батч 1 done:** fileManager (63 места), _pagination, _scrollView, _fileUploader — 4 виджета.
    Guard-паттерн против коллизий имён добавлен после того, как `$fluent-filemanager-button-content-padding` столкнулся
    с уже существовавшей переменной темы (автоимя теперь проверяет существующие имена в base+теме и добавляет суффикс при коллизии).
    Проверено: 6/6 бандлов других тем байт-идентичны; геометрия резолва fluent-next идентична (только
    безобидные расщепление shorthand минификатором и разъединение смежных правил над `var()`).
  - **Батч 2 done:** pivotGrid (23 места, через `basePivotGrid with()`), diagram (13, через
    `base/diagram with()`).
  - **Батч 3 done:** dataGrid — `_index` (7 общих переменных: контуры фокуса, отступы кнопок) через
    `baseGrid with()`, + `layout/cell` (границы строки группы/залипающей колонки, контур фокуса ячейки),
    протянутые через хаб с литеральным default в `base/dataGrid/_index` → `@use 'layout/cell' with()`
    (в cell остаётся `null !default`, другие темы получают литерал из хаба → байт-идентично).
  - **Батч 4 done (протянуто):** scheduler/views (11 переменных, протяжка `baseScheduler` → `./views`),
    filterBuilder/_common (13 переменных, протяжка `base/filterBuilder` → `./common`). Та же оснастка: хаб с
    литеральным default, подмодуль с `null !default`, проброс через существующий `with()`; отрицательные значения и
    высоты с `!important` оставлены литералами. 6/6 байт-идентичны, 0 изменений значений.
  - **Отсеяно по триажу (не токенизировано, по замыслу):**
    - textEditor/_mixins (25) — px живут внутри тел `@mixin` и преимущественно структурны:
      перекрытия `clip-path: inset(-1px …)`, подвижки margin на ±1–2px, радиусы волосяных линий 1px, плюс
      варианты миксина `*-material` (не используются fluent-next). Немногие дизайнерские значения (толщина
      подчёркивания 3px, отступы кнопок) не оправдывают изменения сигнатуры миксина по всему base.
    - _htmlEditor (29) — геометрия *контента* rich-text (`.ql-*`, отступы `ol`/`ul`/`td`, em) — это
      семантика контента, записанная в вывод редактора, а не хром темы.
    - colorView (24) — геометрия колор-пикера/спектра (функциональная, не тематизируемая).

**Результат B2: параметризовано 10 файлов** (fileManager, pagination, scrollView, fileUploader, pivotGrid,
diagram, dataGrid `_index`+`layout/cell`, treeList `_index`+`layout/cell`, scheduler/views,
filterBuilder/_common) ≈ 240 px-мест. treeList в точности повторяет оснастку dataGrid (`baseTreeList`
+ проброс через хаб `layout/cell`). Вся миграция base (B1a+B1b+B2) байт-идентична для
generic/material/fluent (проверено относительно предмиграционного коммита `996a87ff15`) и резолвится
с идентичной геометрией для fluent-next.

**Хвост px в base — закрыт (см. «B2-tail — done» ниже).** Значимый для дизайна остаток
(scheduler `_tooltip`/`_common` + глубокие подмодули `appointment`/`views`, `_pagination`,
`_map`, `_validation`, пропуски смешанных padding в pivotGrid) перенесён в батчах B2-tail 1–3. То, что
осталось литералами, структурно/функционально по замыслу (отрицательные значения, `outline-offset`, off-screen,
центрирование через `calc()`, волосяные линии 1px, трансформации, функциональные хаки) плюс геометрия колец/
соглашений внутри миксинов и литералы cardView для каждой темы — оба отсеяны по триажу с обоснованием ниже.
  - **Замечание о проверке:** миграция base уже закоммичена (`c45f7739fc`/`4cbe4aaff1`). Байт-
    идентичность повторно подтверждена накопительно сборкой 6 бандлов других тем на HEAD против
    предмиграционного коммита `996a87ff15` (base откачен, только остальные бандлы) → **6/6 идентичны**.
  - **В ожидании, тяжёлый триаж:** _htmlEditor (29 — большая часть это геометрия *контента* rich-text `.ql-*`/`ol`/`td`,
    НЕ хром темы → в основном пропуск), colorView (24 — геометрия пикера/спектра → пропуск).
  - ПРИМЕЧАНИЕ: `base/gridBase/_index` (39 px) — библиотека миксинов, НЕ используемая fluent-next (тема
    переопределяет `grid-base`) — вне области.

- **B2-tail — done (в этой сессии):** хвост px в общем base закрыт в рамках контракта. Все
  батчи проверены зелёными: диф резолва fluent-next — 0 потерянных/изменённых, 6/6 бандлов других тем
  байт-идентичны предмиграционному `996a87ff15`, линт 0, jest 18/18, build:ci 6/6.
  - **Батч 1** (расширение существующих протянутых/прямых загрузчиков): боковой padding ячеек хедера и
    области полей pivotGrid (`2px`→`ds.$spacing-20` ×2), font-size деталей контента appointment в scheduler
    (`11px`→`ds.$font-size-110`, dx-no-semantic-role), font-size темы/даты в tooltip scheduler
    (`16px`→`ds.$font-size-title-sm`, `12px`→`ds.$font-size-caption-md` — протянуто через `./tooltip`),
    горизонтальный padding страницы в pagination (`13px`→`ds.$spacing-130`).
  - **Батч 2** (новые загрузчики): `_map` margin тултипа маркера (`10px`→`ds.$spacing-100`, новый `with()`
    на `base/map`); `_validation` margin-top сводки (`20px`→`ds.$spacing-200`) + padding сообщения
    о невалидности (`10px`→`ds.$spacing-100`) — `base/validation` загружается `as *` дважды (common/_mixins +
    validation/_index); `with()` размещён на `fluent-next/common/_mixins.scss` (первый загрузчик в
    графе бандла — проверено сборкой). Цвет текста `#000` в map оставлен литералом (прежний триаж цветов map).
  - **Батч 3** (глубокая многозвенная протяжка scheduler, 20 переменных): протянуто лист→промежуточный→`scheduler/_index`
    →тема через `appointment/_index` и `views/_index`. appointment/regular (top/rtl-left уменьшенной иконки `3px`,
    радиус маркера активности `4px`, margin-top деталей контента `2px`);
    appointment/agenda (padding элемента `10px`/радиус `5px`, margin правой раскладки/rtl/ресурса,
    padding-right для allday); views/timelines (min-height `100px`→`spacing-1000`, ширина хедера группы
    `80px`→`spacing-800`, пустая ячейка group-two `160px`→`spacing-1600`; `240px`/`200px` — внешкальные
    литералы); views/agenda (left-column-width `70px` внешкальная, font-size хедера группы `18px`→
    `ds.$font-size-180` dx-no-semantic-role, padding-top таблицы дат `10px`); views/renovation
    (высота виртуальной строки `50px` внешкальная). Листья appointment переименовываются с короткого имени на длинное на границе;
    листья views сохраняют имя `$scheduler-*` через всю цепочку.
  - **Также проверено разделение настоящих пропусков и отсеянных по триажу остатков в файлах со статусом `done`** — оставшиеся сырые px
    структурны и оставлены литералами по замыслу: отрицательные margin / `outline-offset` (pivotGrid,
    dataGrid, filterBuilder, _fileUploader, _scrollView, colorBox), off-screen `-5000px`
    (fileManager), центрирование через `calc()` (diagram, colorBox, _tagBox), волосяные разделители 1px,
    трансформации/анимация (_ui), функциональные хаки (`width:0.1px` T393423).

- **Отсеяно по триажу — финально (внутри миксинов + cardView), по замыслу:**
  - **Геометрия колец/соглашений внутри миксинов** — геометрия колец фокуса/выделения, захардкоженная внутри
    тел общих `@mixin` (выводится идентично для всех 4 тем, а не как аргументы миксина): кольца фокуса `toolbar`,
    `dropDownMenu`, `calendar` (`outline: 2px solid` + `outline-offset: 1px`/контур через box-shadow),
    `stepper/layout/step` (40 px — концентрические кольца выделения `box-shadow: 0 0 0 {2,4,8}px` ×16 состояний),
    `switch` (pill `border-radius: 500px`, невидимые padding у on/off-подписей),
    `timeView` (ширина `10px` + центрирование `-5px`). Токенизация требует рефакторинга сигнатур/аргументов миксинов,
    затрагивающего места вызова во всех темах — вне контракта «не трогать другие темы / литеральный default +
    `with()` только для fluent-next»; геометрия колец структурна для a11y и оставлена литералами.
  - **cardView** (`padding: 0 12px`, placeholder чекбокса `20px`, `gap: 4px` у элемента панели хедера) —
    у cardView есть СВОЯ зрелая система размеров для каждой темы (`$cardview-<theme>-*` в `_sizes.scss` каждой темы,
    базовые переменные `null !default`). Эти 3 сырых литерала — уже существовавшие недочёты
    ТОЙ системы, а не литералы общего base. Её конфигурация распространяется только тогда, когда базовый default равен
    `null` (литеральный default сохраняет литерал — проверено эмпирически), поэтому токенизация требует
    обвязки для каждой темы и в generic/material/fluent → нарушает контракт «не трогать другие темы».
    Оставлено владельцам cardView как уборка по каждой теме.

- **B3 — done (в этой сессии):** дизайнерские em/% вынесены в помеченные базовые переменные. Пакет **не поставляет
  шкалу em/%** (только абсолютные px/rem-токены), а конвертация пропорциональных em/% в абсолютный токен
  изменила бы поведение (ломает NFR-1) — поэтому корректная трактовка это базовая переменная `$x: <literal> !default;
  // dx-relative[-%]`, используемая по месту (без инъекции fluent-next; значение идентично, а токена, на который
  можно маршрутизировать, нет). Байт-идентично для **всех** тем, включая fluent-next (диф резолва 0,
  6/6 байт-идентичны, линт 0, jest 18/18, build:ci 6/6). 16 вхождений / 11 файлов:
  - шрифтовые пропорции: `_slider`/`_tooltip`/`_validation` `.dx-*` `font-size: 0.85em`, `diagram`
    toolbox-input `0.9em`, `fileManager` сообщение об ошибке `0.85em`.
  - em spacing/размеры: `_fieldset` field `0.4em`, `_fileUploader` input-wrapper `1em`, `_menuBase`
    контейнер стрелки раскрытия `2em`, `calendar/_calendar` ячейка номера недели `2em`, `list` min-height
    `3em` (×2) + кнопка сообщения о пустом списке `0 3em`.
  - раскладочные %: `_fieldset` label `40%` / datebox-value `60%`, `fileManager` панель drawer `30%`,
    `lookup` список поиска в попапе `90%`, `chat-messagebubble` контент `82.5%`, `scheduler/views`
    индикатор времени `10%`. (Всего 18 вхождений в 13 файлах.)
  - **Отсеяно по триажу (оставлено литералами, по замыслу):** все `50%`/`border-radius: 50%` для центрирования и кругов,
    трансформации `translate3d/translateX`/`clip-path`, центрирование `calc(50% ± …)`; `colorView`
    % шахматки в `linear-gradient`, % полигона/сегмента спиннера `_loadIndicator` (`37.5%`,
    `9.375%`, …), % в `background-size/position`; % внутри миксинов (textEditor/timeView/switch/
    checkBox/radioButton/scheduler `_mixins`); em/% контента rich-text `_htmlEditor` (`.ql-*`, отступы
    списков); полностью скруглённые радиусы pill `999em` (маркер соглашения, 5 файлов — как `500px` у switch);
    `letter-spacing: 0.01em`, хак `min-height: 101%` для overscroll; половинки `50%` у спин-кнопок `_numberBox`,
    `49%` у `_scrollView` (структурная геометрия).
- Вне области по триажу: off-screen смещения, геометрия пикера colorView, отступы контента rich-text
  htmlEditor, цвета/opacity невидимых хаков, хаки композитинга.

## Страницы проверки (packages/devextreme/playground/)

- `design-tokens.html` — браузер сгенерированных переменных `--dxds-*` (палитры, семантические цвета, компонентные токены, переключатели режима/размера).
- `design-tokens-compare.html` — рендер виджетов legacy fluent и fluent-next рядом (матрица состояний по виджетам; расширяйте страницу фрейма по мере выхода волн).

Секции `design-tokens-compare-frame.html` покрывают pilot, w2, w3, w4 и w5 (dataGrid, treeList,
pivotGrid, scheduler, htmlEditor, fileManager, gantt). **Секций cardView и diagram в ней по-прежнему
нет** (проверено 28.08.2026) — при правках этих виджетов сравнивать «было → стало» глазами
негде, секцию нужно добавить. Машинно они закрыты: оба виджета есть в галерее
`playground/tier-reachability-audit.html` (волна H), и их значения держит резолв-дифф; дыра —
только в ручной визуальной сверке. Файлы плейграунда до сих пор untracked (см. [README.md](README.md)).

## Миграция размеров (все виджеты, один проход) — done

Нецветовые значения в каждом `_sizes.scss` сопоставлены **базовым шкалам** из `_ds.scss`
(`ds.$spacing-*`, `$font-size-*`, `$line-height-*`, `$border-radius-*`, `$border-width-*`, `$font-weight-*`).
Требование: компоненты остаются визуально идентичными (compact = small, default = medium; large отложен).

**Покрытие:** токенизировано 872 объявления (+5 font-weight) в 87 `_sizes.scss`; **~95% px-литералов маппятся точно** на ступень шкалы. Разбивка по шкалам: spacing 811, font-size 78, line-height 21, border-radius 33, border-width 10.

**Метод (см. SIZES_MIGRATION_PLAN.md):** только точное совпадение (скрипт проверяет равенство значений); шкала выбирается по категории имени переменной; shorthand расщепляется по компонентам. Арифметика над токенизированными переменными переписана на CSS `calc()`. Общие миксины `base/**`, вычисляющие значения из размерных аргументов, закрыты guard-паттерном — `@if meta.type-of($x) == number { …legacy… } @else { …calc… }` — так что generic/material/fluent остаются **байт-идентичными** (проверено).

**Проверка:** нормализатор из scratchpad компилирует каждый бандл fluent-next до/после, резолвит `var(--dxds-*)`, переводит rem→px, сворачивает константные `calc()`, раскрывает shorthand/`font` и сравнивает с учётом каскада — **0 дифов по всем 8 бандлам**. Шесть представительных бандлов других тем байт-идентичны HEAD.

**Сироты (55 использований, вне всех шкал):** оставлены px-литералами с маркерами `// dx-offscale: <px>`, преимущественно крупные фиксированные размеры (панели color-view/date-view/calendar, scheduler, gantt) плюс `1.5px`. Уникальные значения: `1.5, 27, 35, 38, 42, 43, 46, 49, 50, 51, 57, 58, 62, 65, 68, 69, 78, 90, 93, 102, 105, 115, 130, 140, 150, 156, 180, 182, 190, 200, 220, 250, 252, 260, 264, 272, 280, 288, 299, 450`. Топ файлов: colorView (8), diagram (7), cardView (6), scheduler (5). → на ревью дизайн-команде: какие из них заслуживают ступеней шкалы.

## Таблицы маппинга

Таблицы по виджетам добавляются ниже по мере миграции виджетов.
Формат: `variable | role decision | token / bridge | note`.

<!-- mapping tables start -->

### w5-complex (11 виджетов) — mapped

Семейство гридов (`gridBase` → `dataGrid`/`treeList`/`cardView`), плюс `pivotGrid`, `gantt`, `scheduler`, `diagram`, `fileManager`, `htmlEditor`, `map`. Самые крупные файлы `_colors.scss`; миграция по одному виджету за раз, сборка после каждого. `gridBase` первым — он определяет переменные `$datagrid-*`, которые остальные гриды подключают через `@use`.

Повсеместно роли стандартного словаря (②); новые семейства компонентных токенов не заводились (компонентные токены `grid-*` из DS резолвятся в те же семантические роли — см. примечание о консолидации в DIVERGENCES). Цветные поверхности сочетаются с `content-neutral-default-static-dark-rest` (белый). Общие keyframes подсветки изменений в `base/**` закрыты guard-паттерном `meta.type-of` (другие темы байт-идентичны).

- **gridBase** (`mapped`) — текст/фон/границы → нейтральные роли; hover → `surface-neutral-default-hovered`; строка в фокусе → `surface-primary-subdued-rest`; чередование строк → `surface-neutral-deep-rest`; строка фильтра и master-detail → `surface-neutral-subdued-rest`; поиск/подсветка drop/ошибка/разделитель колонок/активный фильтр → поверхности primary/danger + белый статичный текст; ссылка/панель фильтра/иконка активного фильтра → `content-primary-default-rest`; nodata/summary/сообщение/шеврон/draggable → `content-neutral-subdued-rest`; граница перетаскиваемого хедера → мост accent-alpha ③, тени → `color-shadow-ambient`/`-key`; фон редактора → `transparent`. Сохранённые цепочки: переменные button (выделение, границы modified/invalid, opacity иконки в disabled), `$base-disabled-opacity`. Удалена неиспользуемая `$datagrid-block-separator-bg`; удалены ставшие мёртвыми `$base-hover-color` / `$base-invalid-color`. Закрыты guard-паттерном keyframes подсветки изменений в `base/dataGrid` + `base/treeList`.
- **diagram** (`mapped`) — граница/граница тулбара → `border-neutral-default-rest`; фон → `surface-neutral-default-rest`; канва → `surface-neutral-subdued-rest`; тень → `0 1px 8px color-shadow-key`; фоны активного форматирования → button-active / danger|success-active (из пилота); база иконки-изображения в инлайновом SVG → `content-neutral-subdued-rest`, акцент → `content-primary-default-rest`, заливка предупреждения → `content-danger-default-rest`. **Цвета иконок data-uri оставлены конкретными** (`$diagram-text-color`, `$diagram-properties-panel-icon-color` = `$base-*`) — см. эскалацию по пробелу в фундаменте; кроме того, `toolbox-drag`/`properties-panel-open` в `diagram/_index.scss` переведены с токенизированных `$popup-title-color`/`$button-default-color` (которые начали рендериться чёрными) на эти собственные конкретные переменные. Убраны `@use`-ы `sass:color`/`../sizes`/`../overlay`/`../button`/`../loadIndicator`.
- **dataGrid** (`mapped`) — фон элемента панели группировки (ветки −5.88%/alpha .4/−12.16%) → `surface-neutral-deep-rest`; хелперы: `$datagrid-accent` → `surface-primary-default-rest`, `$datagrid-border-color-disabled` → `border-neutral-default-disabled`. Всё остальное наследуется от gridBase.
- **treeList** (`mapped`) — иконка шеврона → `content-neutral-subdued-rest`; шеврон выделения сохраняет внутреннюю цепочку. Всё остальное наследуется от gridBase.
- **cardView** (`mapped`) — полный проход по семейству fluent-card (переписано 302 строки, ветки light/dark свёрнуты): фон карточки/выбранной карточки → `surface-primary-subdued-rest` (+ `border-primary-default-rest`), обложки/без изображения + элементы панели хедера → `surface-neutral-deep-*`, приглушённый/disabled текст → `content-neutral-subdued-rest`/`content-neutral-default-disabled`, ссылки/индекс сортировки → `content-primary-default-rest`, тени → `color-shadow-key`, dropzone → `surface-primary-subdued-rest`.
- **gantt** (`mapped`) — фон/границы диаграммы → нейтральные роли surface/border; «чернильная» графика (майлстоун, линии зависимостей, коннекторы, стрелки) → `content-neutral-default-rest`; полоса задачи → `surface-primary-default-rest` + заголовок `content-neutral-default-inverted-rest`; чип ресурса → `surface-neutral-default-inverted-rest`; затемнение прогресса → мост относительного цвета ③ над инвертированной поверхностью @ .2; родительская задача → `surface-success-default-rest` (`@if $color == "blue"` свёрнуто); чередующиеся/сворачиваемые строки → `surface-neutral-deep-rest`; подсветка интервала времени → `surface-primary-alpha-hovered` (20% против 15% в legacy); граница рамки редактирования → `border-primary-default-rest`. **16 иконок data-uri в тулбаре оставлены конкретными** (`$gantt-icon-color: $base-text-color`) — после прохода gridBase они запекали `var()` (чёрный); см. эскалацию по пробелу в фундаменте.
- **pivotGrid** (`mapped`) — фон области/итога → `surface-neutral-default-rest`; тексты → `content-neutral-default-rest` / приглушённые → `content-neutral-subdued-rest`; границы → `border-neutral-default-rest` (+`-disabled`); фон чипа поля (ветки −5.88%/alpha .4/−12.16%, то же семейство, что и панель группировки dataGrid) → `surface-neutral-deep-rest`; общий итог (только light, `$base-hover-bg`) → `surface-neutral-deep-rest` (в dark появляется тот же акцент); контур фокуса/акцент → `border-primary-default-rest` / `content-primary-default-rest`; граница при перетаскивании → мост accent-alpha ③, тени при перетаскивании → `color-shadow-ambient`/`-key`, вынесенная тень перетаскивания → `0 3px 4px color-shadow-key`; фон перетаскиваемого чипа @ .9 → мост ③ над токеном чипа; индикатор позиции (`gray`) → `border-neutral-accessible-rest`.
- **scheduler** (`mapped`) — фоны рабочей области/хедера/all-day/оверлея → `surface-neutral-default-rest`; границы/разделители часов → `border-neutral-default-rest`, разделитель группы (−13%) → `border-neutral-accessible-rest`; тексты → `content-neutral-default-rest`, приглушённые (панель/другой месяц/иконки формы/дата в дропдауне @ .54/литералы даты в хедере) → `content-neutral-subdued-rest`; hover/active ячейки → `surface-neutral-default-{hovered,active}`; ячейка в фокусе (accent @ .12) → `surface-primary-alpha-rest` (11%); заливка appointment (ветки accent ±48%/30%) → `surface-primary-subdued-rest` + чернильный текст (#000/#fff → `content-neutral-default-rest`), ячейка первого месяца → мост ③ @ .15 над ней; тень старта/ресайза appointment (.3) → `color-shadow-key-darker`; бейдж «сегодня»/текст текущего времени → `content-primary-default-rest` (двойная роль: это же и фон бейджа — роль текста доминирует) + текст бейджа `content-neutral-default-inverted-rest`; акцентная полоса → `surface-primary-default-rest`; индикатор времени (`#eb5757`) → `surface-danger-default-rest` (сдвиг оттенка, зафиксировано); фон его следа → чернильный мост ③ @ .03; hover/active в agenda → `surface-neutral-default-hovered` / `surface-neutral-alpha-active`, иконка повторения → `content-neutral-default-inverted-rest`. Сохранено: цепочка `$button-default-outlined-active-bg`, булевы флаги и флаги opacity.
- **fileManager** (`mapped`) — границы → `border-neutral-default-rest`; тулбар файлов (−3%) → `surface-neutral-subdued-rest`; hover элемента → `surface-neutral-default-hovered`; фон фокуса дерева каталогов/хлебных крошек (∓8% / граница как фон) → `surface-neutral-default-active`; тексты в фокусе → `content-neutral-default-rest`; глиф миниатюры → `content-neutral-default-disabled`; оверлей выделения (accent @ .8/.7 + текст `$base-bg`) → мосты ③ над `surface-primary-default-rest` + `content-neutral-default-inverted-rest`; граница в фокусе → `border-primary-default-rest`; активный редактор переименования (чернила @ .1) → мост ③; бейдж ошибки → `surface-danger-default-rest` + статичный тёмный текст (двойная роль: это же и текст уведомления). **Иконки статусов data-uri оставлены конкретными** (`$filemanager-icon-{color,success-color,danger-color,inverted-color}` = `$base-*`; вызов миксина перенаправлен); удалены ставшие неиспользуемыми `$filemanager-text-color`/`$filemanager-success`/`$filemanager-progressbox-shadow-color`.
- **htmlEditor** (`mapped`) — границы/таблица → `border-neutral-default-rest` (удалена неиспользуемая `$htmleditor-border-color`); разделитель тулбара → `ds.$separator-color`; чип переменной (accent @ .15) → `surface-primary-alpha-hovered`; рамка/ручки ресайза → `border-primary-default-rest` / `surface-primary-default-rest`; упоминание → `surface-neutral-default-selected`; фон обёртки аплоадера (`$base-typography-bg`) → `surface-neutral-subdued-rest`; вынесенные обложки/приглушённый текст (фон @ .4 / чернила @ .8 / граница @ .8) → мосты ③; подсвеченная строка таблицы (accent @ .5) → `surface-primary-alpha-active`; убраны ставшие неиспользуемыми хелперы `$htmleditor-{accent,bg,text-color}`.
- **map** (`mapped`) — собственных цветовых переменных нет (`_index.scss` — структурное подключение `base/map`); токенизировать нечего.

### w4-composite-editors (20 виджетов) — mapped

Редакторы и контейнеры. У большинства дропдаун-редакторов нет собственных цветовых переменных (`dropDownBox`, `dropDownList`, `dateBox`, `dateRangeBox`, `autocomplete`, `speechToText`, `recurrenceEditor`) — они наследуют уже токенизированные цепочки `textEditor`/`dropDownEditor`.

Компонентные токены (①): tagBox (`ds.$tag-color-bg-rest/-disabled`). Всё остальное → семантические роли (②) через стандартный словарь (surface/content/border neutral + состояния, `content-neutral-subdued-rest` для приглушённого текста/подписей/иконок, `box-shadow-*` для elevation).

Примечательные решения:
- **filterBuilder** — цветные чипы операций маппятся на *subdued*-семейства поверхностей по роли: операция группы → `surface-danger-subdued-{rest,hovered}` + `-default` в фокусе; поле данных → `surface-primary-subdued-*`; оператор → `surface-success-subdued-*`; значение → `surface-neutral-alpha-*`. Иконки плюса/удаления → `content-{success,danger}-default-*`. Сворачивает старые цепочки alpha-над-акцентом.
- **chat** (32 переменные) — отправленный бабл → `surface-primary-subdued-rest`, полученный → `surface-neutral-subdued-rest`; приглушённые метаданные/индикатор набора → `content-neutral-subdued-rest`; elevation → `box-shadow-sm/md`; сохраняет цепочки button/textEditor для переменных file/cancel в messagebox.
- **form** — ветка `@if $color` (blue/saas) для цвета элемента поля свёрнута в `content-neutral-default-rest`.
- Сохранены ссылки на цепочки темы там, где источник уже является токеном: `lookup`/`chat` (переменные button, textEditor, dropDownEditor), `colorView` (фон контента оверлея), `accordion` (размерная переменная `$fluent-base-font-size`).

### w3-composites (27 виджетов) — mapped

Слой оверлеев/навигации. У `actionSheet`, `dropDownButton`, `dropDownMenu`, `multiView`, `tabs` нет собственных цветовых переменных. `popover`/`loadPanel` наследуют через (теперь токенизированную) цепочку overlay.

Использованные компонентные токены (①): toast (`ds.$toast-color-bg-rest`), tooltip (`ds.$tooltip-color-bg-rest`); разделители menu/list + состояния чекбокса treeView через `ds.$separator-color` / `ds.$checkbox-color-*`. Всё остальное → семантические роли (②): нейтральные поверхности hovered/active/selected/selected-hovered для состояний элементов, `surface-backdrop-default-rest` для шейдеров/шейдеров, `content-neutral-subdued-rest` для иконок/приглушённого текста, роли danger для invalid, `ds.$box-shadow-md/lg` + `ds.$color-shadow-{ambient,key}` для elevation попапов/меню/toast.

Примечательные решения:
- **overlay** — фон контента → `surface-neutral-default-rest`; шейдер → `surface-backdrop-default-rest` (сворачивает ветки режимов с чёрной альфой). Шейдеры drawer/loadPanel/popup следуют за ним.
- **calendar** — выбранная ячейка = `surface-primary-default-rest` + статичный тёмный контент; hover/active/contoured наследуют токенизированные тинты button-outlined (транзитивно).
- **toast/gallery/dateView** — цветная поверхность + статичный контент; несколько полупрозрачных градиентов/границ оставлены мостами относительного цвета `rgb(from … / a)` (③).
- В общем **base/calendar/_mixins** `color.change($cell-text-color, .24)` для пустой ячейки закрыт guard-паттерном (`meta.type-of == color`) → другие темы байт-идентичны.
- Межвиджетное: **diagram** (w5) потреблял ставшую токеном `$overlay-content-bg` из overlay через `color.adjust`; фон его канвы перенаправлен на `surface-neutral-subdued-rest` (полный проход по diagram — в w5).
- Удалены мёртвые переменные темы: `$base-invalid-color-{hover,active,selected}` (потребители теперь маппятся напрямую на роли danger).

### w2-primitives (24 виджета) — mapped

Файлы `_colors.scss` всех примитивных виджетов переведены на роли `ds.$`; ветки `@if $mode`/`@if $color` свёрнуты. У пяти виджетов нет цветовых переменных (box, rangeSlider, responsiveBox, sortable, textArea) — маппить нечего. `icons` содержит только алиас пути к изображению, а не цвет.

Использованные компонентные токены (①): badge (`ds.$badge-color-*`), switch (`ds.$switch-color-*`), progressBar (`ds.$progress-bar-progress-line-*`), loadIndicator (`ds.$spinner-color-*`), scrollable (`ds.$scroll-bar-color-*`), коннектор stepper (`ds.$separator-color`). Всё остальное → семантические роли (②): группы surface/content/border neutral+primary+danger+success, `ds.$box-shadow-*` для теней card/speedDial, `ds.$color-shadow-ambient|key` для слоёв общей тени дропдауна.

Примечательные решения:
- **switch** — полная обвязка компонентными токенами (трек=`bg`, ручка=`trigger`, по checked/unchecked × состояниям); тень-кольцо у включённой ручки — мост относительного цвета (③) над `switch-color-checked-trigger-rest`.
- **stepper** (29 переменных) — акцентные/danger/нейтральные поверхности + контент; внутренние цепочки (selected→акцент, invalid→base/danger) сохранены.
- **common** — `$common-font-family`/`$common-disabled-opacity` остаются на слое темы (это не цвета); цвета слоёв тени дропдауна → роли теней.
- **speedDialAction** — `$…-main-bg` остаётся `$base-accent` (общий миксин FAB вычисляет hover/active из него); фон/hover/active наследуют уже токенизированные переменные button.
- Удалены мёртвые переменные темы из `_colors.scss` темы: `$typography-color`, `$typography-link-color` (после маппинга потребителей не осталось).

### button (pilot) — mapped

Покрытие: 106 переменных → **19 компонентных токенов ① + 44 семантические роли ② + 33 внутренние цепочки + 10 литеральных/размерных значений; 0 CSS-мостов ③, 0 эскалаций ④.**
Ветки `@if $mode` / `@if $color` полностью свёрнуты (режим/акцент резолвится бандлом).

| Группа | Решение по роли |
|---|---|
| normal (contained/outlined/text) | нейтральная кнопка DS: `ds.$button-outline-color-*` (bg rest/hovered/active, content, border); selected → `ds.$color-bg-alpha-selected` |
| default contained | `ds.$button-contained-color-bg-{rest,hovered,active}`, контент `ds.$button-contained-color-content-rest` (static-dark), фон selected → `ds.$color-bg-primary-selected` |
| danger / success contained | `ds.$color-surface-{danger,success}-default-{rest,hovered,active,selected}`, контент = контент contained ① |
| цветные outlined/text: контент | `ds.$color-content-{primary,danger,success}-default-{rest,hovered,active}` (selected → hovered: роли контента для selected нет) |
| цветные outlined/text: тонированный фон | `ds.$color-surface-{primary,danger,success}-deep-{hovered,active,selected}` (deep = семейство светлых тинтов; ближайшая готовая роль к legacy-тинтам) |
| фон focused (все) | = hovered (в фундаменте нет ролей focused; соответствует поведению legacy fluent) |
| disabled | `ds.$button-contained-color-bg-disabled` / `-content-disabled` |
| shadow | `ds.$color-shadow-key` (legacy-альфа .24/.4 отброшена — роль key несёт альфу, зависящую от режима) |
| border-radius, transparent, opacity иконки 0.6 | без изменений (размер/литерал) |

### textEditor / textBox / checkBox (pilot) — mapped

Покрытие: textEditor 29 переменных → **15 ① + 4 ② + 8 цепочек + 2 литерал/размер**; textBox 1 переменная → 1 ①; checkBox 12 переменных → **9 ① + 3 ②**. 0 мостов, 0 эскалаций. Все ветки `@if $mode`/`@if $color` свёрнуты.

| Группа | Решение по роли |
|---|---|
| texteditor текст/плейсхолдер | `ds.$text-input-color-default-content-rest`, `ds.$text-content-color-default-placeholder-rest` |
| texteditor фон outlined / границы | `ds.$text-input-color-default-bg-rest`, `border-{rest,hovered,active,disabled}` |
| texteditor подчёркивание (нижняя граница) | `ds.$text-input-color-default-line-{rest,hovered}`; индикатор фокуса → `line-focused` (акцент) |
| texteditor фон filled | `ds.$color-bg-low` (та же ступень оттенка, что и legacy-вывод −3.9%) |
| texteditor invalid | `ds.$text-input-color-invalid-border-rest`; в фокусе → `ds.$color-border-danger-hovered` |
| texteditor подпись в фокусе / иконка очистки | `ds.$color-content-primary` / `ds.$color-content-subtle` |
| checkbox границы unchecked | `ds.$checkbox-color-unchecked-default-border-{rest,hovered,active,disabled}` |
| checkbox заливка checked / иконка | `ds.$checkbox-color-checked-default-bg-{rest,hovered,active}` / `-icon-{rest,disabled}` |
| checkbox invalid | `ds.$color-border-danger-default-{rest,hovered}` (переменная с двойной ролью — см. DIVERGENCES) |

Межвиджетные правки, потребовавшиеся из-за пилота:
- `diagram/_colors.scss`: 4 вычисления фона активного форматирования → роли состояния active (`ds.$button-outline-color-bg-active`, `ds.$button-contained-color-bg-active`, `ds.$color-surface-{danger,success}-default-active`).
- `speedDialAction`: общий миксин `base/_speedDialAction.scss` выводит hover/active через `color.adjust()` из своего аргумента фона → основной фон FAB остаётся на слое темы (`$speed-dial-action-main-bg: $base-accent`) до собственной волны виджета. Рекомендуемая правка вверх по потоку: добавить опциональные аргументы миксина `$hover-bg`/`$active-bg` со значениями по умолчанию, равными текущим вычислениям (байт-идентично для других тем).
