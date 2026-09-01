# fluent-next: disabled-состояния — замер и решения

Закрывает пункт 3 «Ближайших задач» в [HANDOFF.md](HANDOFF.md) («дизайн-финал: disabled-состояния
через disabled-роли») и вопрос «скипнутые тесты в axe color-contrast сделаны неверно».

Инструмент замера — `packages/devextreme/playground/disabled-states-audit.html`: галерея всех
disabled-состояний темы + прогон axe с `runOnly: 'color-contrast'`. Результат в
`window.__disabledAudit`. Поднимается статик-сервером от корня репозитория, требует
`pnpm nx build:ci devextreme-scss` и `pnpm nx build:dev devextreme`.

## Главный вывод

**Контраст падал не из-за цветов, а из-за разметки.** Токены disabled по замыслу не проходят
AA — так же устроен Fluent 2 (`colorNeutralForegroundDisabled` ≈ 2:1), и WCAG 1.4.3 выводит
неактивные компоненты из-под требования контраста. Перекраска на роли не сняла бы ни одного
подавления.

| роль | light | dark | контраст на своей поверхности |
|---|---|---|---|
| `--dxds-color-content-disabled` | `#ababab` | `#767676` | 2.11 (light) / 3.98 (dark) |
| `--dxds-color-bg-disabled` | `#f5f5f5` | `#161616` | |
| `--dxds-color-border-disabled` | `#d7d7d7` | `#4c4c4c` | |
| глобальная `opacity: .35` над канвой | `#adadad` | `#717171` | 2.24 / 3.18 |

То есть оба подхода — дим и роли — дают одно и то же число в пределах 0.2. Разница между ними
не в контрасте, а в управляемости: дим гасит всё поддерево целиком и не переопределяется
по частям, роли переопределяются через тир `--dx-*`.

Освобождение от требования контраста axe выдаёт **только** элементу, у которого он сам или
любой предок помечен как disabled (`disabled` на fieldset/button/select/input/textarea либо
`aria-disabled="true"` на чём угодно — `axe-core/axe.js`, `isDisabled`). Всё остальное судится
как обычный текст.

## Что было сломано: `aria-disabled` не на корне виджета

`Widget._toggleDisabledState` ставил атрибут на `_getAriaTarget()` → `_focusTarget()`, а у
композитных виджетов это потомок. Замер до правки: **12 из 24** приглушённых корней виджетов не
несли маркера, который axe принимает.

| виджет | куда уезжал `aria-disabled` | что оставалось снаружи |
|---|---|---|
| TagBox, TextBox, SelectBox, NumberBox и прочие text-editor'ы | `<input>` | теги, лейбл, плейсхолдер, кнопки |
| DateRangeBox | два `<input>` | лейблы, разделитель, кнопка календаря |
| FileUploader | `.dx-fileuploader-button` — **и терялся вовсе**, кнопки ещё нет на момент вызова | список файлов, подпись «or drop file here» |
| Lookup | `.dx-lookup-field` | остальное шасси |
| List, MenuBase, TreeView-search | item container | поиск, «no data», группы |
| Calendar | `_$viewsWrapper` | навигатор |
| Form | первый таб-стоп поля | подписи, шапка |
| Chat | внутренний `<textarea>` | лента, тулбар |
| ButtonGroup, RadioCollection | **`$element().parent()`** — атрибут утекает за пределы виджета | — |

Правка (`js/__internal/core/widget/widget.ts`, `_toggleDisabledState`) **аддитивная**: прежний
атрибут остаётся на месте, корень помечается дополнительно, когда aria-таргет — не корень.
После неё: **0 из 24**.

Дополнительно помечены под-элементы, у которых disabled-вид был, а маркера не было вовсе:
командные ссылки грида (`grid_core/editing/m_editing.ts`) и nav-кнопки пагинации
(`pagination/common/light_button.tsx` + `pages/page_index_selector.tsx`).

## Доказательство, что подавления были лишними

Прогнаны все **44** конфигурации с `disabled: true` из трёх подавленных матриц
(`tests/accessibility/{tagBox,fileUploader,dateRangeBox}.ts`):

| | light | dark |
|---|---|---|
| с правкой разметки | **0** нарушений, 0 incomplete | **0** / 0 |
| без неё (маркер снят с корней на живой странице) | **15** нарушений | — |

Все 15 — `.dx-tag-content > span`, 2.1:1: ровно теги disabled-TagBox, из-за которых подавления и
появились. Негативная самопроверка обязательна: без неё «ноль нарушений» неотличим от
«проверка не запустилась».

Снято:

- `helpers/accessibility/test.ts` — массив `componentsWithDisabledColorContrastIssues`
  (`dxTagBox`, `dxFileUploader`, `dxDateRangeBox`) удалён целиком;
- `apps/demos/testing/common.test.ts` — `Accordion-Overview` и `TagBox-Overview` (обе про
  disabled TagBox) убраны из `getIgnoredRules`.

## Что осталось и почему

### cardView: drag-source покрашен disabled-ролями — баг во всех четырёх темах

`base/cardView/header_panel/item/_index.scss` применяет шесть параметров
`…item--disabled-*` внутри `&.dx-sortable-source`. Источник драга — обычный активный контент,
под исключение WCAG он не попадает, и axe прав.

| тема | цвет на фоне | контраст |
|---|---|---|
| generic | `#ccc` на `#fff` | **1.61** |
| fluent | `#bdbdbd` на `#f0f0f0` | **1.65** |
| fluent-next | `#ababab` на `#f5f5f5` | **2.11** (в тёмном 3.98) |
| material | `rgba(0,0,0,.38)` на `#ebebeb` | **2.61** |

Ниже нормы везде, fluent-next — лучший из четырёх. Правка в `base/**` меняет вид во всех темах,
поэтому это решение владельцев CardView, а не темы. Подавления в
`tests/accessibility/cardView/{sortable,columnSortable}.ts` **оставлены**, но комментарий
«false positive: contrast rules do not apply to disabled elements» заменён на замер: элемент
не disabled, и это настоящий дефект.

### readonly читает disabled-токен — вопрос имени, не контраста

`.dx-state-readonly` в textEditor/htmlEditor делит с disabled токен **границы**
(`--dx-text-editor-border-disabled`). Текст read-only редактора при этом полный `#161616`
(проверено на живом DOM), так что контраста текста это не задевает. Остаётся расхождение
имени и состояния: в словаре состояний (`NAMING.md`) есть отдельное `read-only`.

### Поправка: aiChat — не дефект темы

Ранняя версия этого документа утверждала, что `gridBase/layout/aiChat` подключает базовый миксин
и потому теряет `--dx-global-disabled-opacity`. **Это неверно.** Замер по собранным бандлам:
`.dx-ai-chat--disabled .dx-ai-chat__message-regenerate-button` даёт `opacity: .3` **во всех
четырёх темах** — generic, material, fluent и fluent-next одинаково берут дефолт
`base/_widget.scss` (`@mixin disabled-widget($opacity: 0.3)`). Легаси-fluent подключает тот же
базовый миксин. Это общесистемная неувязка (кнопка игнорирует disabled-непрозрачность любой темы),
а не расхождение fluent-next.

### `-disabled` роли на не-disabled местах

Найдены замером и чтением темы; ни одно не даёт нарушения контраста текста, но все ломают
правило «имя состояния = состояние»:

| место | что читает |
|---|---|
| `tagBox/_index.scss` — `.dx-tag-content` в обычном состоянии | `--dx-tag-box-border-disabled` |
| `pivotGrid/_index.scss` — обычный `.dx-area-field.dx-area-box` | `--dx-pivot-grid-border-disabled` |
| `dataGrid/_colors.scss` — `$data-grid-group-panel-item-border` | `ds.$color-border-disabled` |
| `treeView/_colors.scss` — `$tree-view-checkbox-bg-focused` | `ds.$color-bg-disabled` |
| `chat/_colors.scss` — индикатор набора текста | `ds.$color-content-disabled` |
| `fileManager/_colors.scss` — глиф миниатюры | `ds.$color-content-disabled` |

### Инвентарь по всей поверхности и волна перевода на роли

Инвентарь снят страницей `playground/disabled-readonly-compare.html` по **50** компонентам
(галерея из 51 кейса; `dxRecurrenceEditor` в ней не рендерится и не судится). Страница ставит
рядом четыре колонки — включено / disabled с димом / disabled без дима / легаси fluent — и
сравнивает не «на глаз», а по подписи: отсортированный мультимножество кортежей
`color|background|border|effective-opacity` по каждому элементу и его `::before`/`::after`.

Четыре ошибки методики, на которых пришлось остановиться отдельно (иначе отчёт врал в обе стороны):

- виджет создаётся **на** элементе `.host`, а подпись брала только `.host *` — корень виджета
  в неё не попадал, и все изменения фона/границы редактора были невидимы;
- псевдоэлементы не читались, а Switch красит disabled целиком через `::before`, HtmlEditor
  накрывает тулбар `::before`, underlined-редакторы рисуют линию `::after`;
- полностью прозрачный цвет сериализуется то как `rgba(0, 0, 0, 0)`, то как
  `color(srgb 1 1 1 / 0)` — строки разные, пиксель один; из-за этого Toolbar числился
  «перекрашенным», будучи идентичным;
- тяжёлые виджеты дорисовываются после `load`, и одиночный снимок давал разные вердикты от
  прогона к прогону — подпись снимается дважды и публикуется только при совпадении.

**Найденный дефект: disabled-тулбар не отличался от включённого.** `base/toolbar/_index.scss`
снимает с тулбара общий дим (`opacity: 1`) и ничего не ставит взамен, а правило «не гасить
вложенные виджеты» (`.dx-state-disabled.dx-widget .dx-widget`) снимает дим и с кнопок внутри,
потому что `dx-state-disabled` и `dx-widget` висят на одном элементе. Замер по бандлам: правило
`.dx-toolbar.dx-state-disabled{opacity:1}` есть **во всех четырёх темах**, то есть дефект общий.
В fluent-next состояние теперь красится ролью (`--dx-toolbar-content-disabled` на собственном
тексте и на тексте кнопок-элементов); базовое правило — вопрос к владельцам base.

**Переведены на disabled-роли** (каждый компонент отказывается от дима через `opacity: 1` и
красит свои части сам): `toolbar`, `menu`, `tabs`, `treeView`, `stepper`, `gallery`,
`filterBuilder`, `pagination`, `cardView`. У `menu`, `tabs`, `treeView`, `stepper` для этого
уже были токены их **элементов** — на уровне виджета они просто не применялись. Остальным
заведены новые имена тира: `--dx-gallery-content-disabled`,
`--dx-filter-builder-content-disabled`, `--dx-pagination-content-disabled`,
`--dx-card-view-content-disabled`, `--dx-toolbar-content-disabled`. В cardView намеренно **не**
переиспользованы существующие `…header-panel-item-*-disabled`: base применяет их к drag-source.

**Поправка к метрике.** Первая версия сравнивала цвета по всему поддереву и завышала покрытие:
у композита достаточно было измениться вложенному редактору, чтобы компонент числился «красит
сам», хотя его собственный контент не трогался. Так `dataGrid` попал в «покрытые», притом что
текст ячеек без дима оставался `#161616`. Разделены три вопроса:

- **виден ли disabled вообще** — сравнение по всему поддереву;
- **красит ли компонент себя сам** — сравнение только по **собственным** элементам, у которых
  ближайший `.dx-widget`-предок и есть корень (вложенные виджеты — отдельные компоненты со своими
  тирами);
- **покрыт ли он детьми** — меняется ли вид вложенных виджетов.

### Итог волны

| | компоненты |
|---|---|
| красят disabled сами | **37** |
| покрыты через вложенные виджеты (собственной разметки нет) | `buttonGroup`, `radioGroup`, `dropDownButton`, `calendar`, `form`, `tabPanel`, `fileManager` |
| держатся на диме — и это верно | `colorView`, `chat`, `splitter`, `drawer`, `box` |
| **disabled неотличим от включённого** | **0** |

Переведены на disabled-роли в этой волне: `toolbar`, `menu`, `tabs`, `treeView`, `stepper`,
`gallery`, `filterBuilder`, `pagination`, `cardView`, `tileView`, `fileUploader`, `scheduler`,
`pivotGrid` и всё грид-семейство (`dataGrid`, `treeList` — одной правкой в миксине `grid-base`).
Новые имена тира: `--dx-{toolbar,gallery,filter-builder,pagination,card-view,tile-view,
file-uploader,scheduler,pivot-grid,grid}-content-disabled`.

Две ловушки, стоившие отдельного разбора:

- **`dataGrid` не имеет класса `dx-datagrid` на корне виджета** — в отличие от `treeList`,
  который несёт `dx-treelist` на корне. Селектор в `grid-base` пришлось развести на два:
  `.dx-#{$name}.dx-state-disabled` и `.dx-state-disabled > .dx-#{$name}`;
- **`opacity: 1` без покрывающей покраски делает хуже, чем дим.** Попытка перевести `colorView`
  снята димом состояние и не нашла ни одного элемента для покраски — компонент остался вовсе без
  disabled-вида. Правило: сначала доказать, что покраска покрывает видимый контент (колонка
  «без дима» на странице сравнения), и только потом снимать дим.

### Глобальный дим убрать целиком нельзя — и это результат замера, а не отказ

После перевода в списке «держится только на диме» остались **четыре**: `colorView`, `splitter`,
`drawer`, `box`. Это не недоделка:

- `splitter`, `drawer`, `box` — раскладочные контейнеры, у них нет собственной поверхности,
  красить нечего; гасится их содержимое, и делает это именно групповая непрозрачность родителя;
- `colorView` — палитра цветов: её содержимое и есть цвет, перекраска нейтральной ролью
  бессмысленна (попытка была сделана и **откачена**: `opacity: 1` снял дим, а покраска не нашла
  ни одного элемента, и компонент остался вовсе без disabled-состояния);
- `dxScrollView` в инвентарь не входит: его `disabled` — это `dx-scrollable-disabled`, только
  отключение скролла, без визуального состояния.

Поэтому правильная цель — **не удалить правило, а сузить его** до компонентов, которым нечем
краситься, и закрыть ратчетом «список держащихся на диме может только уменьшаться до этих
четырёх». Полное удаление сняло бы disabled-вид у контейнеров и повторило бы дефект тулбара.

Отдельно остаются именованные opacity, где гасится композит целиком и это осознанно:
`--dx-{grid-text-link,grid-icon-link,list-item,scheduler-appointment,tree-view,tabs-nav-button}-*-disabled`
и хардкод `opacity: .5` у dxChat в `base/chat/layout/chat/_index.scss`.

## Побочная находка: 7 из 8 a11y-проверок dataGrid не проверяли ничего

`tests/accessibility/dataGrid/common.ts` в восьми местах передавал `runOnly: ''`. axe
нормализует строку в `{ type: 'tag', values: [''] }`, а пустой тег не совпадает ни с одним из
**104** правил. Проверено прогоном по реальному реестру правил axe:

- четыре места без блока `rules` — **0 из 104** правил;
- три места, где `rules` только отключает правило — тоже **0**;
- одно место (`aria-command-name: { enabled: true }`) — ровно **1** правило.

Это было верно **во всех темах**, не только в fluent-next. `runOnly: ''` снят во всех восьми
местах; теперь они ведут себя как остальные ~40 вызовов в том же файле. Ожидание: на fluent-next
добавляется color-contrast на восьми сценариях грида, в остальных темах — полный набор правил;
если что-то покраснеет, это ранее не измерявшиеся дефекты, а не регрессия правки.

## Молчаливые пустые PASS

`helpers/accessibility/utils.ts` на fluent-next делал `return` без единой ассерции, когда
вызывающий отключил color-contrast: тест отчитывался зелёным, ничего не проверив. Теперь:

- предикат применимости вынесен в `isA11yCheckApplicable()`;
- `testAccessibility()` объявляет неприменимый тест через `test.skip` — он виден в отчёте
  как пропущенный;
- прямой вызов `a11yCheck()` с конфигурацией, в которой проверять нечего, **бросает** с
  рецептом, а не молчит.
