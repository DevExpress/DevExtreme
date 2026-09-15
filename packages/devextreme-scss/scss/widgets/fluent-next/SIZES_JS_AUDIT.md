# Размерные значения, зашитые в JS - аудит под моду `large`

Материал к пункту 9 «Открытых направлений» ([README.md](README.md)): размерная мода `large` в теме
расширяема тремя строчками SCSS, но **JS про размерную ось не знает вообще**. Этот док - инвентарь
всех мест, где JS сам решает, какое число подставить в зависимости от `compact`/`default`, с
вердиктом по каждому: токенизировать, упразднить или оставить.

Замеры сделаны 10.09.2026 на ветке `fluent-next/roles-audit`, бандл - `artifacts/css/dx.fluent-next.blue.light[.compact].css`
(сборка 09.09). Команды для пересчёта - в конце.

---

## 1. Механика: почему `large` сломается тихо

`isCompact()` - это регулярка по имени темы:

```ts
// js/__internal/ui/themes.ts:353
function isTheme(themeRegExp: string, themeName: string): boolean {
  if (!themeName) { themeName = currentThemeName || readThemeMarker(); }
  return new RegExp(themeRegExp).test(themeName);
}
export function isCompact(themeName: string): boolean { return isTheme('compact', themeName); }
```

Имя темы JS читает из CSS: в `<div class="dx-theme-marker">` подставляется
`font-family: "dx.fluent-next.blue.light.compact"`, где хвост даёт `$theme-marker-size-postfix`
(`_sizes.scss`: `""` для default, `".compact"` для compact).

Отсюда следствие: при `dx.fluent-next.blue.light.large` **каждый** `isCompact()` вернёт `false`,
и все тернарки молча уйдут в ветку `default`. Ничего не бросит исключение, ни один тест не
покраснеет, линтер ничего не увидит - виджет просто отрисует default-геометрию поверх large-стилей.

Правила `defaultOptions` вида `isFluent() && !isCompact()` тоже примут `large` за default.

**Пример поломки.** FAB для fluent(+next) кладёт `indent: 60` в ветку `isFluent && !isCompact`.
Если large-кнопка будет 56px, дети встанут на 60px от якоря, то есть в 4px от края кнопки вместо
штатных 16px. Визуально - слипание, без единого сигнала в сборке.

---

## 2. Инвентарь: 12 вызовов `isCompact()` в 6 файлах

Все места в продуктовом JS (`packages/devextreme/js`, без тестов и `.d.ts`):

| # | Место | Что решает | default / compact | Вердикт |
|---|---|---|---|---|
| 1 | `ui/speed_dial_action/speed_dial_main_item.ts:131,133` | generic: `indent`, `childOffset` | 55/9 · 49/2 | ручная подгонка, формуле не подчиняется |
| 2 | `…speed_dial_main_item.ts:149-166` | fluent + fluent-next: `indent`, `childIndent`, `childOffset` | 60/60/0 · 48/48/0 | **выводится точно** из токена, см. §3 |
| 3 | `…speed_dial_main_item.ts:169-186` | material: то же | 72/56/8 · 58/48/1 | `indent` выводится, `childIndent` compact - нет |
| 4 | `ui/html_editor/ui/aiDialog.ts:66` | ширина кнопок Generate / Cancel | 110 · 100 | упразднить -> `min-width` в CSS |
| 5 | `ui/file_manager/ui.file_manager.toolbar.ts:452` | material: `dropDownOptions.width` попапа переключателя вида | 36 · 28 | **точно равно** CSS-формуле, см. §3 |
| 6 | `…ui.file_manager.toolbar.ts:454` | fluent + fluent-next: то же | 40 · 34 | та же формула `+ 8` |
| 7 | `grids/grid_core/ai_assistant/utils.ts:291` (константы в `const.ts:10-11`) | ширина confirm-диалога отмены | 425 · 360 | токенизировать |
| 8 | `scheduler/view_model/generate_view_model/options/get_min_appointment_size.ts:25` | минимальная высота встречи | 20 · 18 | оставить в JS, сделать size-keyed |
| 9 | `scheduler/r1/utils/themes.ts:11` | `isCompact` в `getThemeType()` | - | **мёртвый**: из результата деструктурируют только `isMaterialBased` |

Итого под `large` без изменения механики придётся руками править 6 файлов и добавить по третьему
правилу на каждую пару тема × размер в FAB.

---

## 3. Проверенные формулы: это дубли CSS, а не независимые числа

### FAB: `indent = childIndent = fa-button-size + 16`

16 - это собственный `position.offset` виджета (`{x: -16, y: -16}`, публичный дефолт
`"{ at: 'right bottom', my: 'right bottom', offset: '-16 -16' }"`).

| Тема / размер | SCSS `*-fa-button-size` | JS `indent` | сходится |
|---|---|---|---|
| fluent-next default | `ds.$spacing-440` = 44px | 60 | 44 + 16 |
| fluent-next compact | `ds.$spacing-320` = 32px | 48 | 32 + 16 |
| fluent default | 44px | 60 | 44 + 16 |
| fluent compact | 32px | 48 | 32 + 16 |
| material default | 56px | 72 | 56 + 16 |
| material compact | 42px | 58 | 42 + 16 |
| generic default | 48px | 55 | нет |
| generic compact | 34px | 49 | нет |

`childIndent` для fluent/fluent-next равен `$speed-dial-action-fa-button-size + 16` (кнопка ребёнка
там того же размера, что главная). Для material дочерняя кнопка не ветвится по размеру
(`$material-fa-button-size: 40px`), и `childIndent` сходится только в default (56 = 40 + 16),
compact 48 подогнан руками.

Вывод: **все четыре числа fluent/fluent-next - это одна величина, переписанная в JS руками.**

### FileManager: `width = 2 × viewmode-padding + icon-size`

CSS уже считает ровно это на контейнере попапа
(`.dx-filemanager-view-switcher-popup`, элемент создаётся в JS на `toolbar.ts:185` и передаётся
попапу как `container`):

```scss
.dx-filemanager-view-switcher-popup {
  width: calc(2 * var(--dx-file-manager-toolbar-viewmode-padding) + #{$global-icon-size});
}
```

| Тема / размер | padding | icon | CSS-контейнер | JS `dropDownOptions.width` |
|---|---|---|---|---|
| material default | 6px | 24px | 36 | **36** |
| material compact | 5px | 18px | 28 | **28** |
| fluent default | 6px | 20px | 32 | 40 (= +8) |
| fluent compact | 5px | 16px | 26 | 34 (= +8) |
| fluent-next default | `spacing-60` = 6px | `spacing-200` = 20px | 32 | 40 (= +8) |
| fluent-next compact | `spacing-50` = 5px | `spacing-160` = 16px | 26 | 34 (= +8) |

Для material JS-число совпадает с CSS-формулой до единицы. Для fluent (и, через
`isFluent()`, для fluent-next) оно на 8px больше - похоже на компенсацию хрома самого попапа.
В обоих случаях величина полностью выводима из CSS.

---

## 4. Второй эшелон: привязано к теме, но слепо к размеру

Всего в `js/__internal` **42** правила `defaultOptions`, у которых `device` спрашивает тему;
из них **13** несут числа. Эти уже сейчас не различают compact и при `large` останутся такими же:

| Место | Значение |
|---|---|
| `grids/data_grid/m_widget_base.ts:87`, `grids/tree_list/m_widget_base.ts:85`, `grids/new/grid_core/options.ts:70` | `headerFilter.height: 315` |
| `ui/load_panel.ts:74` | `width/height/maxWidth/maxHeight: 60` (material) |
| `ui/slider/slider.ts:195` | `validationMessageOffset` `{h:18,v:0}` / `{h:7,v:4}` |
| `scheduler/utils/options/constants.ts:170` | `_appointmentTooltipOffset {x:0, y:11}` (material) |
| `ui/html_editor/ui/aiDialog.ts:53-63` | `POPUP_MIN_WIDTH 288`, `POPUP_MAX_WIDTH 494/460`, `TEXT_AREA_MIN/MAX_HEIGHT 64/128`, `REPLACE_DROPDOWN_WIDTH 150` |
| `ui/speed_dial_action/speed_dial_main_item.ts:120,132` | `position.offset {x:-16,y:-16}`, `childIndent: 40` (база до правил) |

Плюс размерные дефолты, вовсе не привязанные к теме (91 числовое значение в 27 файлах внутри
`_getDefaultOptions`): `pivot_grid` 252×325 / 600×600, `tile_view` `baseItemWidth/Height 100`,
`itemMargin 20`, `resizable` 30×30, `agenda` `rowHeight 60`, `time_view._arrowOffset 5`. Их `large`
не сломает - они и сейчас одинаковы для обоих размеров, - но масштабироваться вместе с темой они
тоже не будут.

---

## 5. Смежное: тема вычисляется на уровне модуля

Отдельный дефект, который любая схема с размерной осью всё равно не вылечит - снимок темы
берётся в момент импорта модуля, до того как может быть применён стиль или переключена тема:

- `ui/html_editor/ui/aiDialog.ts:54` - `const POPUP_MAX_WIDTH = isMaterial(current()) ? 494 : 460;`
- `ui/check_box/editor_base/text_editor_props.ts:27` - `stylingMode` в `defaultTextEditorProps`
- `ui/check_box/editor_base/editor_label_props.ts:10` и `pagination/editors/common/editor_label_props.ts:10` - `labelMode`
- `scheduler/r1/components/base/date_header.tsx:12` и `…/timeline/date_header_timeline.tsx:12` - `const { isMaterialBased } = getThemeType();`

Эти места надо делать ленивыми независимо от размерной темы.

---

## 6. Что в теме уже готово под токенизацию, и четыре ловушки

По собранному светлому бандлу fluent-next:

| | |
|---|---|
| уникальных `--dx-*` | 2263 |
| из них объявлено на `:root` | 92 (88 - только там) |
| на корнях компонентов | 2175 |
| размерных имён (`size`/`width`/`height`/`padding`/`margin`/`indent`/`offset`/`radius`/`gap`/`spacing`/`inset`) | 1254, из них на `:root` - 48 |

То есть ровно те величины, что дублирует JS, уже опубликованы:
`--dx-speed-dial-action-main-fa-button-size`, `--dx-speed-dial-action-fa-button-size`,
`--dx-file-manager-toolbar-viewmode-padding`, `--dx-grid-ai-confirm-dialog-button-width`.

Четыре ловушки, проверенные на живой странице и на бандле:

1. **Значение приходит в rem, а не в px.** `getComputedStyle(root).getPropertyValue('--dx-fab-size')`
   возвращает `"2.75rem"`: `var()` подставляется, единицы - нет. Нужен пересчёт через корневой
   font-size (при 16px это те самые 44px). Проверено в браузере на цепочке
   `--dx-fab-size: var(--dxds-spacing-440)` -> `--dxds-spacing-440: 2.75rem`.
2. **Компонентные токены лежат не на `:root`.** Проверено по бандлу:
   `--dx-speed-dial-action-main-fa-button-size` объявлен на `.dx-fa-button`,
   `--dx-file-manager-toolbar-viewmode-padding` - на `.dx-filemanager, .dx-filemanager-dialog-popup`,
   `--dx-grid-ai-confirm-dialog-button-width` - на `.dx-datagrid, .dx-datagrid-ai-assistant-confirm-dialog, …`,
   `--dx-html-editor-ai-dialog-content-gap` - на `.dx-aidialog, .dx-htmleditor, …`.
   Значит читать можно только с элемента виджета и только **после** того, как класс навешен, -
   в `_getDefaultOptions()` его ещё нет (`dx-fa-button` добавляется в `_render()`,
   `speed_dial_item.ts:111`).
   Глобально на `:root` доступны только общие ручки: `--dx-component-height`, `--dx-font-size`,
   `--dx-font-size-icon`, `--dx-border-width`, `--dx-border-radius`.
3. **Публикует только fluent-next.** Для generic / material / fluent литеральная ветка в JS всё
   равно остаётся - токен-чтение должно падать на неё.
4. **`getComputedStyle` форсит пересчёт стилей.** Читать один раз с инвалидацией на смене темы
   (`themes.initialized` / `resetTheme`), а не на каждое позиционирование.

---

## 7. Рекомендация

### Шаг A - обязательный и дешёвый: сделать размерную ось явной в JS

В `js/__internal/ui/themes.ts`:

```ts
export type ThemeSize = 'default' | 'compact' | 'large';
export function size(themeName?: string): ThemeSize;   // парсит постфикс маркера
export function isCompact(themeName: string): boolean { return size(themeName) === 'compact'; }
```

Оставшиеся ветки переписать на `Record<ThemeSize, T>`. Тогда добавление `'large'` в юнион
превращает каждое непокрытое место в **ошибку компиляции**, а не в молча неверное число.
Это и есть главный выигрыш: тихий отказ становится громким.

Требование к теме: `_sizes.scss` должен выдавать `$theme-marker-size-postfix: ".large"` в третьей
ветке, а `build/theme-options.cjs` - знать про `large` в списке размеров. Оба изменения уже
описаны в пункте 9 «Открытых направлений».

### Шаг B - точечно, по убыванию отдачи

| Действие | Места |
|---|---|
| **Упразднить** - значение целиком CSS-ное | ширина кнопок aiDialog -> `min-width` на `.dx-aidialog` (скоуп токенов уже есть); ширина попапа FileManager -> убрать `dropDownOptions.width`, оставить CSS-формулу (для material она уже точна, для fluent-ветки недостающие 8px переносятся в CSS) |
| **Вывести из токена** | FAB: `indent`/`childIndent` считать как `fa-button-size + abs(position.offset.y)` из `--dx-speed-dial-action-*-fa-button-size`, читая лениво в `_getActionPosition` (там класс уже навешен), с падением на текущие литералы для generic/material. Эти опции **не входят** в публичный `floatingActionButtonConfig` в `js/common.d.ts` (там только `closeIcon`, `direction`, `icon`, `label`, `maxSpeedDialActionCount`, `position`, `shading`), так что руки развязаны |
| **Токенизировать** | ширина grid AI confirm-диалога: `.dx-datagrid-ai-assistant-confirm-dialog` уже является скоупом токенов темы |
| **Оставить в JS, но size-keyed** | минимальная высота встречи в Scheduler - это геометрия вью-модели, CSS её не выразит. В файле уже висит `// TODO get rid of depending from themes` |
| **Удалить** | `isCompact` из `getThemeType()` - его никто не читает |

После шага A + B в JS остаётся одно размерно-зависимое место (Scheduler), и то с явным
исчерпывающим маппингом.

---

## 8. Что из этого делается на `main` для legacy-тем без риска

Проверено 15.09.2026 по `upstream/main` (`c480b59c56`): все 12 вызовов там **те же, вплоть до
номеров строк**. Ветка темы отличается от `main` в этих файлах только fluent-next'овским
`mode()`/`refreshMode()` в `themes.ts` и `?? $()` в FAB. Значит PR в `main` закрывает и
legacy-темы, и фичу - фича доберёт его синком.

Критерий «безболезненно»: визуально ноль во всех трёх legacy-темах, публичный API не трогаем.

### Безболезненно

| Что | Почему без риска | Куда смотреть |
|---|---|---|
| `ThemeSize` + `size()` в `themes.ts`, внутренний (в `.d.ts` не выносить). Семантика - та же регулярка по имени, что у `isCompact()`, иначе поведение на кастомных именах тем поедет | Только добавление. Три точки регистрации: default export `themes.ts`, destructure в `js/ui/themes.js` (все 6 файлов импортируют оттуда), `wrapExport('size')` в `testing/helpers/esm-shims/themes.js` - без последнего каждый QUnit-сьют падает на `undefined`, потому что оба пути (`ui/themes` и `__internal/ui/themes`) перенаправлены на шим | `testing/runner/lib/handWrittenShims.ts:3-8`, `importMap.ts:351-352` |
| 12 мест → `Record<ThemeSize, T>` с теми же числами | Значения не меняются. FAB: числа **остаются в слое `_defaultOptionsRules`** - правила ложатся поверх `_getDefaultOptions`, а туда входит спред `config().floatingActionButtonConfig`; перенос в дефолты поменял бы приоритет пользовательского конфига. QUnit FAB идёт под `fluent_blue_light.css!` и пинит 60/120 - рефакторинг проверяется существующим тестом | `core/options/m_index.ts` (`_initial`: rules поверх `_default`), `speedDialAction.tests.js:7,1143-1167` |
| Удалить мёртвое: `isCompact` из `getThemeType()`; после следующей строки - сам `getThemeType` и `themeUtils`; файлы `check_box/editor_base/text_editor_props.ts` и `editor_label_props.ts` | На `getThemeType()` два потребителя, оба берут только `isMaterialBased`. У двух файлов check_box - **ни одного импорта** в пакете (`check_box.tsx` берёт `defaultEditorProps` из `editor_base/editor`) | `git grep` по именам: только определения |
| Ленивые снимки темы: `POPUP_MAX_WIDTH` → внутрь `_getPopupConfig()`; `date_header.tsx` и `date_header_timeline.tsx` → `isMaterialBased(current())` в `render()` | Значение то же, когда CSS загружен раньше скрипта - то есть всегда, кроме случая, который сегодня и есть баг. Раннер QUnit уже обходит его предзагрузкой CSS с прямым указанием на `getThemeType()` в module scope - после правки обход становится не нужен | `testing/runner/lib/pages.ts:146` |

### Не безболезненно на `main`

| Что | Почему |
|---|---|
| Упразднить JS-ширину попапа FileManager | Без `dropDownOptions.width` DropDownButton ставит попапу **ширину кнопки** inline (`getElementWidth(this.$element())`) - CSS её не перебьёт. Для generic это и есть текущее поведение, для material/fluent - смена геометрии |
| Упразднить ширину кнопок aiDialog | Нужны правила в трёх legacy-темах × два размера плюс класс-хук на элементах тулбара - JS всё равно трогать, а CSS legacy-тем меняется |
| Токенизировать FAB / диалоги | Legacy-темы `--dx-*` не публикуют - читать нечего. Только fluent-next, только в фиче |
| Ленивый `EditorLabelDefaultProps` в pagination | Спред в статические `NumberBoxDefaultProps` (`select_box.tsx:31-33`, `number_box.tsx:29-32`) - это модель дефолтов renovation-компонентов, механической правкой не лечится |

Цена в тестах: два файла. `aiDialog.tests.js:1465` подменяет `isCompact` через sinon - станет
`size`; `ai_assistant/__tests__/utils.test.ts:43,766-799` мокает `isCompact` в jest и импортирует
две константы ширины по именам. У `get_min_appointment_size.ts` прямых тестов нет ни в jest, ни в
QUnit - только интеграционные сьюты Scheduler в generic.

---

## 9. Compact дублирует default: 21 переменная, все в одном файле

Вопрос: есть ли в ветках `@if $size` переменные, у которых compact-значение совпадает с default.
Их ветвление лишнее, а под `large` они попросили бы третье значение зря. Просканированы все
`_sizes.scss` четырёх тем; парсер сверен с независимым подсчётом объявлений (366/366 fluent-next,
344/344 fluent, 344/345 material, 346/346 generic). Таблицы сгенерированы
`node tools/review/size-branch-dups.mjs --md` 15.09.2026.

| Тема | Файлов с ветками | Переменных в обеих ветках | compact = default | то же выражение, зависит от размерной переменной | разное | только default | только compact |
|---|---|---|---|---|---|---|---|
| fluent-next | 52 | 366 | **20** | 1 | 345 | 0 | 0 |
| fluent | 53 | 344 | **0** | 0 | 344 | 0 | 0 |
| material | 51 | 343 | **0** | 0 | 343 | 1 | 2 |
| generic | 53 | 346 | **0** | 0 | 346 | 0 | 0 |

Все 21 - в `fluent-next/cardView/_sizes.scss`. В трёх legacy-темах те же переменные объявлены
**один раз, вне веток** - 21 из 21 в `fluent`, `material` и `generic` (например
`$cardview-fluent-common-border-radius: 16px` на строке 20 `fluent/cardView/_sizes.scss` против
веток 176/258 в fluent-next). Ветвление появилось при переносе: порт нормализовал каждую переменную
файла в форму «`null !default` сверху + значение в обеих ветках». Разных токенов с одним разрешённым
значением не найдено, файлов, где compact-ветка целиком повторяет default, нет.

| Файл | Переменная | Значение в обеих ветках | Разрешается в | Строки default / compact |
|---|---|---|---|---|
| `widgets/fluent-next/cardView/_sizes.scss` | `$card-view-border-radius` | `ds.$border-radius-160` | 16px | 176 / 258 |
| `widgets/fluent-next/cardView/_sizes.scss` | `$card-view-font-weight` | `ds.$font-weight-base-default` | 400 | 177 / 259 |
| `widgets/fluent-next/cardView/_sizes.scss` | `$card-view-card-min-width` | `250px` | - | 184 / 266 |
| `widgets/fluent-next/cardView/_sizes.scss` | `$card-view-card-border-width` | `ds.$border-width-10` | 1px | 185 / 267 |
| `widgets/fluent-next/cardView/_sizes.scss` | `$card-view-card-field-caption-font-weight` | `ds.$font-weight-base-strong` | 600 | 190 / 272 |
| `widgets/fluent-next/cardView/_sizes.scss` | `$card-view-card-field-caption-font-weight-selected` | `var(--dx-card-view-card-field-caption-font-weight)` | - | 199 / 281 |
| `widgets/fluent-next/cardView/_sizes.scss` | `$card-view-header-panel-item-border-width` | `ds.$border-width-10` | 1px | 209 / 291 |
| `widgets/fluent-next/cardView/_sizes.scss` | `$card-view-header-panel-item-border-radius` | `ds.$border-radius-60` | 6px | 210 / 292 |
| `widgets/fluent-next/cardView/_sizes.scss` | `$card-view-header-panel-item-font-weight` | `var(--dx-card-view-font-weight)` | - | 215 / 297 |
| `widgets/fluent-next/cardView/_sizes.scss` | `$card-view-header-panel-item-sort-index-font-weight` | `ds.$font-weight-base-default` | 400 | 216 / 298 |
| `widgets/fluent-next/cardView/_sizes.scss` | `$card-view-header-panel-item-icon-size` | `$global-icon-size` | зависит от размерной переменной | 217 / 299 |
| `widgets/fluent-next/cardView/_sizes.scss` | `$card-view-header-panel-item-font-weight-hovered` | `var(--dx-card-view-header-panel-item-font-weight)` | - | 220 / 302 |
| `widgets/fluent-next/cardView/_sizes.scss` | `$card-view-header-panel-item-sort-index-font-weight-hovered` | `var(--dx-card-view-header-panel-item-sort-index-font-weight)` | - | 221 / 303 |
| `widgets/fluent-next/cardView/_sizes.scss` | `$card-view-header-panel-item-dragging-font-weight` | `var(--dx-card-view-header-panel-item-font-weight)` | - | 224 / 306 |
| `widgets/fluent-next/cardView/_sizes.scss` | `$card-view-header-panel-item-dragging-sort-index-font-weight` | `var(--dx-card-view-header-panel-item-sort-index-font-weight)` | - | 225 / 307 |
| `widgets/fluent-next/cardView/_sizes.scss` | `$card-view-header-panel-item-dragged-font-weight` | `var(--dx-card-view-header-panel-item-font-weight)` | - | 228 / 310 |
| `widgets/fluent-next/cardView/_sizes.scss` | `$card-view-header-panel-dropzone-border-width` | `1.5px` | - | 235 / 317 |
| `widgets/fluent-next/cardView/_sizes.scss` | `$card-view-filter-panel-border-radius` | `0` | - | 239 / 321 |
| `widgets/fluent-next/cardView/_sizes.scss` | `$card-view-card-content-field-value-highlighted-border-radius` | `ds.$border-radius-50` | 5px | 247 / 329 |
| `widgets/fluent-next/cardView/_sizes.scss` | `$card-view-card-content-field-value-highlighted-padding` | `.125em 0.2em` | - | 248 / 330 |
| `widgets/fluent-next/cardView/_sizes.scss` | `$card-view-card-content-field-value-highlighted-font-weight` | `ds.$font-weight-base-strong` | 600 | 249 / 331 |

Одна строка отличается от legacy по значению: вес подсветки совпадений - в fluent `500`
(`fluent/cardView/_sizes.scss:247`, в бандле `font-weight:500`), в fluent-next
`ds.$font-weight-base-strong` = 600. Это решение #35102 от 14.09 (веса 500 переведены на роли,
см. README, «Открытые направления» п. 10), а не ошибка переноса; дублем между ветками строка от
этого быть не перестаёт.

### Как упразднить

Для каждой из 21 значение переносится в уже существующее предобъявление `$x: null !default` в начале
файла, обе строки в ветках удаляются - ровно та раскладка, что в legacy. Позиционная зависимость
есть только у `$card-view-header-panel-item-icon-size: $global-icon-size`: `$global-icon-size`
приходит модулем из `../sizes` и вычислен до этого файла, поэтому и она переезжает наверх (legacy
делает то же - `$cardview-fluent-header-panel__item__icon-size: $fluent-base-icon-size`, строка 139).
Остальные значения - токены `ds.$…`, литералы и строки `var(--dx-…)`, от размера не зависят.
Ожидание - байт-идентичный бандл во всех четырёх сборках, гейт - обычный дифф собранных бандлов.
Для `large` это минус 21 значение из 366.

### Смежное

- В JS compact дублирует default в одном поле: `childOffset: 0` у FAB в обоих fluent-правилах
  (`speed_dial_main_item.ts:155,165`). Остальные пары - 55/49, 9/2, 60/48, 110/100, 36/28, 40/34,
  425/360, 20/18 - различаются.
- Обратный случай, асимметрия, есть только в `material/cardView/_sizes.scss`:
  `$cardview-material-card__header__toolbar-override-height` задана лишь в default (52px, строка 279),
  `…card__content-font-size` и `…card__content-line-height` - лишь в compact (12px и 16px, строки
  334-335); в другой ветке остаётся `null`. Legacy-поведение, здесь не трогаем, но при заведении
  `large` для material про эти три придётся решать отдельно.

---

## 10. Как пересчитать

Все числа этого дока воспроизводятся из репозитория, команды - из корня репо. `node` в шелле
агента может быть не в `PATH`: `export PATH="$HOME/.local/share/mise/installs/node/24.16.0/bin:$PATH"`.

Вызовы `isCompact()` в продуктовом JS - **12**:

```bash
grep -rn "isCompact(" packages/devextreme/js --include='*.ts' --include='*.js' | grep -viE "\.test\.|__tests__|\.d\.ts" | grep -vE "js/__internal/ui/themes\.ts|js/ui/themes\.js"
```

Файлы, где размерное значение решает JS - **6** (те же строки, сгруппированные по файлу; исключён
сам `themes.ts` с определением предиката):

```bash
grep -rl "isCompact(" packages/devextreme/js/__internal --include='*.ts' | grep -viE "\.test\.|__tests__" | grep -v "ui/themes.ts"
```

Правила `defaultOptions`, чей `device` спрашивает тему - **42**, из них с числами - **13**
(грепом это не считается: `device` бывает и методом, и стрелкой, а числа надо искать в
сбалансированном блоке `options`):

```bash
node - <<'EOF'
const fs=require('fs'),p=require('path');const P=/\b(isCompact|isMaterial|isFluent|isGeneric|isMaterialBased|isDark)\s*\(/;
const W=(d,o=[])=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=p.join(d,e.name);if(e.isDirectory()){if(e.name!=='__tests__')W(f,o);}else if(/\.(ts|js)$/.test(e.name)&&!/\.test\.|\.d\.ts$/.test(e.name))o.push(f);}return o;};
const B=(s,i)=>{i=s.indexOf('{',i);let d=0;for(let j=i;j<s.length;j++){if(s[j]==='{')d++;else if(s[j]==='}'&&!--d)return s.slice(i,j+1);}return '';};
let n=0,num=0;
for(const f of W('packages/devextreme/js/__internal')){const s=fs.readFileSync(f,'utf8');if(!P.test(s))continue;
const re=/device\s*(?:\(\s*\)\s*(?::\s*boolean\s*)?\{|:\s*\(\s*\)\s*(?::\s*boolean\s*)?=>)/g;let m;
while((m=re.exec(s))){const end=m.index+m[0].length;const dev=s[end-1]==='{'?B(s,end-1):s.slice(m.index,m.index+400).split(/,\n/)[0];
if(!P.test(dev))continue;const oi=s.indexOf('options',m.index);if(oi<0)continue;const ob=B(s,oi);if(!ob)continue;
n++;if(/:\s*-?\d+(\.\d+)?\s*[,}\n]/.test(ob))num++;}}
console.log({themeKeyedRules:n,withNumbers:num});
EOF
```

Дубли compact = default в ветках `@if $size` (§9) - из `packages/devextreme-scss`, `--md` даёт
таблицы дока как есть:

```bash
node tools/review/size-branch-dups.mjs --md
```

Счёт дублей берётся из исходников; собранный `artifacts/css/dx.fluent-next.blue.light.css` нужен
только столбцу «Разрешается в» - при старом бандле врать может он, а не счёт.

Раскладка `--dx-*` по скоупам в бандле (2263 / 92 / 2175 / 1254):

```bash
node -e "const fs=require('fs');let c=fs.readFileSync('packages/devextreme/artifacts/css/dx.fluent-next.blue.light.css','utf8').replace(/\/\*[\s\S]*?\*\//g,'');const re=/--dx-[a-z0-9-]+\s*:/g;let m;const R=new Set(),C=new Set();while((m=re.exec(c))){const n=m[0].replace(/\s*:/,'');if(n.startsWith('--dxds-'))continue;const o=c.lastIndexOf('{',m.index);const p=Math.max(c.lastIndexOf('}',o),c.lastIndexOf(';',o),c.lastIndexOf('{',o-1));(c.slice(p+1,o).trim()===':root'?R:C).add(n);}const A=new Set([...R,...C]);const S=/(size|width|height|padding|margin|indent|offset|radius|gap|spacing|inset)/;console.log({all:A.size,root:R.size,comp:C.size,sizeish:[...A].filter(n=>S.test(n)).length});"
```

Значение токена в rem проверяется на любой странице:

```js
getComputedStyle(document.querySelector('.dx-fa-button'))
  .getPropertyValue('--dx-speed-dial-action-main-fa-button-size'); // "2.75rem"
```
