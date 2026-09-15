<!-- Сгенерировано: node tools/review/bridges.mjs. Не править руками. -->
# Мосты `rgb(from … / a)` — материал к задаче

Карточка дизайн-команды: **[design#1554](https://github.com/DevExpress/design/issues/1554)** — рассмотрение идёт там.

Вопрос задачи: **оставить мосты штатным механизмом темы или заказать в пакет токенов роли с альфой?** Решение 3 агенды дизайн-ревью принято («принять мосты»), выпуск темы это не блокирует — карточка уточняет, расширять ли пакет.

## Что такое мост

Месту нужен цвет роли с прозрачностью, а в foundation роли с такой альфой нет. Тема берёт существующую роль и задаёт альфу на месте средствами CSS:

```scss
// было в legacy fluent: альфа считалась Sass-функцией от значения
$datagrid-drag-header-border-color: color.change($base-accent, $alpha: .5);

// стало в fluent-next: роль сохраняется, альфа задаётся поверх неё
$grid-drag-header-border: rgb(from #{ds.$color-border-primary} r g b / 0.5);
```

Отличие принципиальное: значение остаётся **связанным с ролью** — при ре-скине темы оно поедет вместе с ней. Литерал такой связи не даёт.

## Масштаб

- объявлений в исходниках темы: **18** (в `*/_colors.scss`)
- мест в собранном бандле: **54** (каждое живёт в обоих режимах)
- различных заявок «роль + альфа»: **18**

## Что именно просить у пакета

Одна строка — один запрос: если такие роли появятся, мост в этих местах заменяется ссылкой.

| Роль-источник | Альфа | Мест | Где |
|---|---|---|---|
| `color-border-primary` | 50% | 12 | Гриды, прочее, PivotGrid |
| `color-content` | 3% | 8 | Scheduler |
| `color-bg-inverted` | 20% | 6 | Gantt |
| `color-content` | 8% | 4 | прочее |
| `color-bg` | 80% | 3 | DateView, Gallery |
| `color-content` | 80% | 3 | HtmlEditor |
| `color-content` | 10% | 3 | FileManager |
| `color-bg` | 0% | 2 | DateView |
| `color-content-subtle` | 15% | 2 | HtmlEditor |
| `color-bg` | 40% | 2 | HtmlEditor |
| `color-border-contrast` | 2% | 2 | Diagram |
| `color-content-inverted` | 10% | 2 | Switch |
| `color-content` | 24% | 1 | прочее |
| `color-bg-low` | 90% | 1 | PivotGrid |
| `color-bg-primary-subtle` | 15% | 1 | Scheduler |
| `color-border` | 80% | 1 | HtmlEditor |
| `color-bg-primary` | 80% | 1 | FileManager |
| `color-bg-primary` | 70% | 1 | FileManager |

## Полный инвентарь

### Scheduler (9)

| Место | Мост | Светлый: fluent → fluent-next | Тёмный: fluent → fluent-next |
|---|---|---|---|
| `.dx-scheduler-work-space-month.dx-scheduler-work-space-count .dx-scheduler-date-table-first-of-month \| background-color` | `color-bg-primary-subtle` @ 15% | rgba(198.3,226.2,250.5,.15) → rgba(180, 210, 244, 0.15) | rgba(3.6701030928,35.6,67.5298969072,.15) → rgba(0, 72, 132, 0.15) |
| `.dx-scheduler-date-time-shader-all-day \| background-color` | `color-content` @ 3% | rgba(0,0,0,.03) → rgba(22, 22, 22, 0.03) | rgba(0,0,0,.03) → rgba(255, 255, 255, 0.03) |
| `.dx-scheduler-work-space-day .dx-scheduler-date-time-shader-bottom::before \| background-color` | `color-content` @ 3% | rgba(0,0,0,.03) → rgba(22, 22, 22, 0.03) | rgba(0,0,0,.03) → rgba(255, 255, 255, 0.03) |
| `.dx-scheduler-work-space-day .dx-scheduler-date-time-shader-top::before \| background-color` | `color-content` @ 3% | rgba(0,0,0,.03) → rgba(22, 22, 22, 0.03) | rgba(0,0,0,.03) → rgba(255, 255, 255, 0.03) |
| `.dx-scheduler-work-space-week .dx-scheduler-date-time-shader-bottom::before \| background-color` | `color-content` @ 3% | rgba(0,0,0,.03) → rgba(22, 22, 22, 0.03) | rgba(0,0,0,.03) → rgba(255, 255, 255, 0.03) |
| `.dx-scheduler-work-space-week .dx-scheduler-date-time-shader-top::before \| background-color` | `color-content` @ 3% | rgba(0,0,0,.03) → rgba(22, 22, 22, 0.03) | rgba(0,0,0,.03) → rgba(255, 255, 255, 0.03) |
| `.dx-scheduler-work-space-work-week .dx-scheduler-date-time-shader-bottom::before \| background-color` | `color-content` @ 3% | rgba(0,0,0,.03) → rgba(22, 22, 22, 0.03) | rgba(0,0,0,.03) → rgba(255, 255, 255, 0.03) |
| `.dx-scheduler-work-space-work-week .dx-scheduler-date-time-shader-top::before \| background-color` | `color-content` @ 3% | rgba(0,0,0,.03) → rgba(22, 22, 22, 0.03) | rgba(0,0,0,.03) → rgba(255, 255, 255, 0.03) |
| `.dx-scheduler-timeline .dx-scheduler-date-time-shader::before \| background-color` | `color-content` @ 3% | rgba(0,0,0,.03) → rgba(22, 22, 22, 0.03) | rgba(0,0,0,.03) → rgba(255, 255, 255, 0.03) |

### прочее (8)

| Место | Мост | Светлый: fluent → fluent-next | Тёмный: fluent → fluent-next |
|---|---|---|---|
| `.dx-calendar-cell.dx-calendar-empty-cell \| color` | `color-content` @ 24% | rgba(36,36,36,.24) → rgba(22, 22, 22, 0.24) | rgba(255,255,255,.24) → rgba(255, 255, 255, 0.24) |
| `@keyframes dx-datagrid-highlight-change { 50% \| background-color` | `color-content` @ 8% | rgba(36,36,36,.08) → rgba(22, 22, 22, 0.08) | rgba(255,255,255,.08) → rgba(255, 255, 255, 0.08) |
| `@keyframes dx-datagrid-highlight-change { from \| background-color` | `color-content` @ 8% | rgba(36,36,36,.08) → rgba(22, 22, 22, 0.08) | rgba(255,255,255,.08) → rgba(255, 255, 255, 0.08) |
| `@keyframes dx-treelist-highlight-change { 50% \| background-color` | `color-content` @ 8% | rgba(36,36,36,.08) → rgba(22, 22, 22, 0.08) | rgba(255,255,255,.08) → rgba(255, 255, 255, 0.08) |
| `@keyframes dx-treelist-highlight-change { from \| background-color` | `color-content` @ 8% | rgba(36,36,36,.08) → rgba(22, 22, 22, 0.08) | rgba(255,255,255,.08) → rgba(255, 255, 255, 0.08) |
| `.dx-ai-chat \| --dx-grid-drag-header-border` | `color-border-primary` @ 50% | — → rgba(103, 162, 225, 0.5) | — → rgba(75, 144, 217, 0.5) |
| `.dx-cardview \| --dx-grid-drag-header-border` | `color-border-primary` @ 50% | — → rgba(103, 162, 225, 0.5) | — → rgba(75, 144, 217, 0.5) |
| `.dx-header-filter-menu \| --dx-grid-drag-header-border` | `color-border-primary` @ 50% | — → rgba(103, 162, 225, 0.5) | — → rgba(75, 144, 217, 0.5) |

### Гриды (8)

| Место | Мост | Светлый: fluent → fluent-next | Тёмный: fluent → fluent-next |
|---|---|---|---|
| `.dx-sortable-dragging>div>.dx-gridbase-container>.dx-datagrid-rowsview \| border-color` | `color-border-primary` @ 50% | rgba(15,108,189,.5) → rgba(103, 162, 225, 0.5) | rgba(71,158,245,.5) → rgba(75, 144, 217, 0.5) |
| `.dx-sortable-dragging>div>.dx-gridbase-container>.dx-treelist-rowsview \| border-color` | `color-border-primary` @ 50% | rgba(15,108,189,.5) → rgba(103, 162, 225, 0.5) | rgba(71,158,245,.5) → rgba(75, 144, 217, 0.5) |
| `.dx-datagrid \| --dx-grid-drag-header-border` | `color-border-primary` @ 50% | — → rgba(103, 162, 225, 0.5) | — → rgba(75, 144, 217, 0.5) |
| `.dx-datagrid-column-chooser \| --dx-grid-drag-header-border` | `color-border-primary` @ 50% | — → rgba(103, 162, 225, 0.5) | — → rgba(75, 144, 217, 0.5) |
| `.dx-datagrid-drag-header \| --dx-grid-drag-header-border` | `color-border-primary` @ 50% | — → rgba(103, 162, 225, 0.5) | — → rgba(75, 144, 217, 0.5) |
| `.dx-treelist \| --dx-grid-drag-header-border` | `color-border-primary` @ 50% | — → rgba(103, 162, 225, 0.5) | — → rgba(75, 144, 217, 0.5) |
| `.dx-treelist-column-chooser \| --dx-grid-drag-header-border` | `color-border-primary` @ 50% | — → rgba(103, 162, 225, 0.5) | — → rgba(75, 144, 217, 0.5) |
| `.dx-treelist-drag-header \| --dx-grid-drag-header-border` | `color-border-primary` @ 50% | — → rgba(103, 162, 225, 0.5) | — → rgba(75, 144, 217, 0.5) |

### HtmlEditor (8)

| Место | Мост | Светлый: fluent → fluent-next | Тёмный: fluent → fluent-next |
|---|---|---|---|
| `.dx-htmleditor-content .ql-code-block-container \| background-color` | `color-content-subtle` @ 15% | rgba(191,191,191,.15) → rgba(68, 68, 68, 0.15) | rgba(191,191,191,.15) → rgba(203, 203, 203, 0.15) |
| `.dx-htmleditor-content .ql-code-block-container \| color` | `color-content` @ 80% | rgba(36,36,36,.8) → rgba(22, 22, 22, 0.8) | rgba(255,255,255,.8) → rgba(255, 255, 255, 0.8) |
| `.dx-htmleditor-content code \| background-color` | `color-content-subtle` @ 15% | rgba(191,191,191,.15) → rgba(68, 68, 68, 0.15) | rgba(191,191,191,.15) → rgba(203, 203, 203, 0.15) |
| `.dx-htmleditor-content code \| color` | `color-content` @ 80% | rgba(36,36,36,.8) → rgba(22, 22, 22, 0.8) | rgba(255,255,255,.8) → rgba(255, 255, 255, 0.8) |
| `.dx-htmleditor.dx-state-disabled .dx-htmleditor-toolbar-wrapper::before \| background-color` | `color-bg` @ 40% | rgba(255,255,255,.4) → rgba(255, 255, 255, 0.4) | rgba(41,41,41,.4) → rgba(36, 36, 36, 0.4) |
| `.dx-htmleditor.dx-state-readonly .dx-htmleditor-toolbar-wrapper::before \| background-color` | `color-bg` @ 40% | rgba(255,255,255,.4) → rgba(255, 255, 255, 0.4) | rgba(41,41,41,.4) → rgba(36, 36, 36, 0.4) |
| `.dx-htmleditor-content blockquote \| color` | `color-content` @ 80% | rgba(36,36,36,.8) → rgba(22, 22, 22, 0.8) | rgba(255,255,255,.8) → rgba(255, 255, 255, 0.8) |
| `.dx-htmleditor-add-image-popup .dx-fileuploader-dragover .dx-fileuploader-content \| background-color` | `color-border` @ 80% | rgba(224,224,224,.8) → rgba(203, 203, 203, 0.8) | rgba(97,97,97,.8) → rgba(118, 118, 118, 0.8) |

### Gantt (6)

| Место | Мост | Светлый: fluent → fluent-next | Тёмный: fluent → fluent-next |
|---|---|---|---|
| `.dx-gantt .dx-gantt-taskWrapper .dx-gantt-task .dx-gantt-tPrg \| background-color` | `color-bg-inverted` @ 20% | rgba(0,0,0,.2) → rgba(36, 36, 36, 0.2) | rgba(255,255,255,.2) → rgba(255, 255, 255, 0.2) |
| `.dx-gantt .dx-gantt-taskWrapper .dx-gantt-task.dx-gantt-parent:not(.dx-gantt-noPrg) .dx-gantt-tPrg \| background-color` | `color-bg-inverted` @ 20% | rgba(0,0,0,.2) → rgba(36, 36, 36, 0.2) | rgba(255,255,255,.2) → rgba(255, 255, 255, 0.2) |
| `.dx-gantt .dx-gantt-taskWrapper .dx-gantt-task.dx-gantt-parent:not(.dx-gantt-noPrg) .dx-gantt-tPrg::before \| border-left-color` | `color-bg-inverted` @ 20% | rgba(0,0,0,.2) → rgba(36, 36, 36, 0.2) | rgba(255,255,255,.2) → rgba(255, 255, 255, 0.2) |
| `.dx-gantt .dx-gantt-taskWrapper .dx-gantt-task.dx-gantt-parent:not(.dx-gantt-noPrg) .dx-gantt-tPrg::before \| border-top-color` | `color-bg-inverted` @ 20% | rgba(0,0,0,.2) → rgba(36, 36, 36, 0.2) | rgba(255,255,255,.2) → rgba(255, 255, 255, 0.2) |
| `.dx-gantt .dx-gantt-taskWrapper .dx-gantt-task.dx-gantt-parent.dx-gantt-cmpl::after \| border-right-color` | `color-bg-inverted` @ 20% | rgba(0,0,0,.2) → rgba(36, 36, 36, 0.2) | rgba(255,255,255,.2) → rgba(255, 255, 255, 0.2) |
| `.dx-gantt .dx-gantt-taskWrapper .dx-gantt-task.dx-gantt-parent.dx-gantt-cmpl::after \| border-top-color` | `color-bg-inverted` @ 20% | rgba(0,0,0,.2) → rgba(36, 36, 36, 0.2) | rgba(255,255,255,.2) → rgba(255, 255, 255, 0.2) |

### FileManager (5)

| Место | Мост | Светлый: fluent → fluent-next | Тёмный: fluent → fluent-next |
|---|---|---|---|
| `.dx-filemanager .dx-filemanager-toolbar .dx-texteditor.dx-editor-filled.dx-state-active \| background` | `color-content` @ 10% | rgba(36,36,36,.1) → rgba(22, 22, 22, 0.1) | rgba(255,255,255,.1) → rgba(255, 255, 255, 0.1) |
| `.dx-filemanager .dx-filemanager-toolbar .dx-texteditor.dx-editor-filled.dx-state-focused \| background` | `color-content` @ 10% | rgba(36,36,36,.1) → rgba(22, 22, 22, 0.1) | rgba(255,255,255,.1) → rgba(255, 255, 255, 0.1) |
| `.dx-filemanager .dx-filemanager-toolbar .dx-texteditor.dx-editor-filled.dx-state-hover \| background` | `color-content` @ 10% | rgba(36,36,36,.1) → rgba(22, 22, 22, 0.1) | rgba(255,255,255,.1) → rgba(255, 255, 255, 0.1) |
| `.dx-filemanager .dx-filemanager-thumbnails .dx-filemanager-thumbnails-item.dx-item-selected \| background` | `color-bg-primary` @ 80% | rgba(15,108,189,.8) → rgba(15, 108, 189, 0.8) | rgba(71,158,245,.8) → rgba(15, 108, 189, 0.8) |
| `.dx-filemanager .dx-filemanager-thumbnails .dx-filemanager-thumbnails-item.dx-item-selected.dx-state-focused \| background` | `color-bg-primary` @ 70% | rgba(15,108,189,.7) → rgba(15, 108, 189, 0.7) | rgba(71,158,245,.7) → rgba(15, 108, 189, 0.7) |

### DateView (2)

| Место | Мост | Светлый: fluent → fluent-next | Тёмный: fluent → fluent-next |
|---|---|---|---|
| `.dx-dateview-rollers \| --dx-date-view-roller-bottom-shadow` | `color-bg` @ 0%<br>`color-bg` @ 80% | — → 180deg,rgba(255, 255, 255, 0) 0%,rgb(from var(--dxds-color-bg) r g b/0.8) 60% | — → 180deg,rgba(36, 36, 36, 0) 0%,rgb(from var(--dxds-color-bg) r g b/0.8) 60% |
| `.dx-dateview-rollers \| --dx-date-view-roller-top-shadow` | `color-bg` @ 0%<br>`color-bg` @ 80% | — → 0deg,rgba(255, 255, 255, 0) 0%,rgb(from var(--dxds-color-bg) r g b/0.8) 60% | — → 0deg,rgba(36, 36, 36, 0) 0%,rgb(from var(--dxds-color-bg) r g b/0.8) 60% |

### PivotGrid (2)

| Место | Мост | Светлый: fluent → fluent-next | Тёмный: fluent → fluent-next |
|---|---|---|---|
| `.dx-pivotgrid-fields-container.dx-drag .dx-area-field.dx-area-box \| background-color` | `color-bg-low` @ 90% | rgba(240.006,240.006,240.006,.9) → rgba(245, 245, 245, 0.9) | rgba(9.992,9.992,9.992,.9) → rgba(22, 22, 22, 0.9) |
| `.dx-pivotgrid \| --dx-grid-drag-header-border` | `color-border-primary` @ 50% | — → rgba(103, 162, 225, 0.5) | — → rgba(75, 144, 217, 0.5) |

### Diagram (2)

| Место | Мост | Светлый: fluent → fluent-next | Тёмный: fluent → fluent-next |
|---|---|---|---|
| `.dx-diagram .dxdi-control:not(.focused) .dxdi-canvas .items-selection-rect \| fill` | `color-border-contrast` @ 2% | rgba(144,144,144,0.02) → rgba(118, 118, 118, 0.02) | rgba(144,144,144,0.02) → rgba(171, 171, 171, 0.02) |
| `.dx-diagram .dxdi-control:not(.focused) .dxdi-canvas .item-multi-selection-rect \| fill` | `color-border-contrast` @ 2% | rgba(144,144,144,0.02) → rgba(118, 118, 118, 0.02) | rgba(144,144,144,0.02) → rgba(171, 171, 171, 0.02) |

### Switch (2)

| Место | Мост | Светлый: fluent → fluent-next | Тёмный: fluent → fluent-next |
|---|---|---|---|
| `.dx-switch \| --dx-switch-handle-on-box-shadow` | `color-content-inverted` @ 10% | — → 0 0 0 0 rgba(255, 255, 255, 0.1) | — → 0 0 0 0 rgba(22, 22, 22, 0.1) |
| `.dx-switch \| --dx-switch-handle-on-shadow` | `color-content-inverted` @ 10% | — → rgba(255, 255, 255, 0.1) | — → rgba(22, 22, 22, 0.1) |

### Gallery (1)

| Место | Мост | Светлый: fluent → fluent-next | Тёмный: fluent → fluent-next |
|---|---|---|---|
| `.dx-gallery \| --dx-gallery-indicator-border-selected` | `color-bg` @ 80% | — → rgba(255, 255, 255, 0.8) | — → rgba(36, 36, 36, 0.8) |

### Sortable (1)

| Место | Мост | Светлый: fluent → fluent-next | Тёмный: fluent → fluent-next |
|---|---|---|---|
| `.dx-sortable-dragging>* \| border-color` | составное значение | rgba(15,108,189,.5) → rgb(from var(--dx-sortable-placeholder-border) r g b/.5) | rgba(71,158,245,.5) → rgb(from var(--dx-sortable-placeholder-border) r g b/.5) |

