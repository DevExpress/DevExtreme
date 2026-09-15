<!-- Сгенерировано: node tools/review/evidence.mjs --md > REVIEW_EVIDENCE.md. Не править руками. -->
# Доказательства к агенде дизайн-ревью fluent-next

Что именно меняется на экране по каждому решению из таблицы «Агенда для дизайн-ревью» в
[DIVERGENCES.journal.md](DIVERGENCES.journal.md). Не пересказ журнала, а сравнение **собранных бандлов**
`dx.fluent.blue.{light,dark}.css` и `dx.fluent-next.blue.{light,dark}.css`: для каждого
селектора и свойства, которые есть в обеих темах, значение fluent-next прогоняется по
`:root`-карте своего бандла до литерала, и сравниваются уже литералы.

Что учтено, чтобы таблицы не врали:

- **написание — не отличие**: `#0F6CBD`, `rgb(15 108 189)` и `rgba(15,108,189,1)` сводятся
  к одному кортежу, поэтому строка появляется только при настоящей смене цвета;
- **мосты ③ разворачиваются**: `rgb(from var(--dxds-…) r g b / .15)` считается цветом с альфой;
- **цвет из shorthand достаётся**: fluent часто пишет `border: 1px solid <цвет>`, а fluent-next
  обязан вынести `border-color` отдельно (значение — `var()`); без этого настоящая смена цвета
  выглядела бы как «свойство есть только в fluent-next»;
- **каналы клампятся как в браузере** — legacy fluent в тёмном режиме содержит внегамутное
  `hsla(0,0%,-46.42%,.2)`, и буквальное сравнение показало бы отличие там, где его не видно.

Пересобрать бандлы перед регенерацией:

```bash
pnpm nx build:themes-dev devextreme-scss --devBundles=fluent.blue.light,fluent.blue.dark,fluent-next.blue.light,fluent-next.blue.dark
```

| Решение | Отличий |
|---|---|
| 1. Модель «цветная поверхность + статический content» в тёмном режиме | dark 15 |
| 2. Семейство для цветных и нейтральных тинтов (hover/active/selected/полосы) | light 76, dark 76 |
| 3. Мосты ③ rgb(from … / a) там, где в foundation нет роли с альфой | light 36, dark 36 |
| 4. Смена тона относительно legacy (уехал не оттенок, а цвет) | light 44, dark 44 |
| 5. Пробелы foundation → эскалация в команду токенов | light 30, dark 30 |
| 6. Двухролевые переменные | light 8, dark 8 |
| 7. Точечные | light 19, dark 19 |

### Решение 1. Модель «цветная поверхность + статический content» в тёмном режиме

Записи журнала: button contained dark; w3 colored surfaces; gridBase текст на цветных поверхностях.

**dark**

| Место | fluent | fluent-next |
|---|---|---|
| `.dx-toast-warning \| background-color` | #fde300 | var(--dx-toast-warning-bg) |
| `.dx-toast-error \| background-color` | #e37d80 | var(--dx-toast-error-bg) |
| `.dx-toast-success \| background-color` | #54b054 | var(--dx-toast-success-bg) |
| `.dx-toast-warning \| color` | #000 | var(--dx-toast-warning-content) |
| `.dx-toast-error \| color` | #000 | var(--dx-toast-error-content) |
| `.dx-toast-success \| color` | #000 | var(--dx-toast-success-content) |
| `.dx-calendar-cell.dx-calendar-selected-date span \| color` | #000 | var(--dx-calendar-cell-content-selected) |
| `.dx-calendar-cell.dx-calendar-selected-date span \| background-color` | #479ef5 | var(--dx-calendar-cell-bg-selected) |
| `.dx-datagrid .dx-datagrid-drop-highlight>td \| background-color` | #479ef5 | var(--dx-grid-drop-highlight-bg) |
| `.dx-datagrid .dx-datagrid-drop-highlight>td \| color` | #000 | var(--dx-grid-drop-highlight-content) |
| `.dx-datagrid .dx-datagrid-drop-highlight>td .dx-header-filter \| color` | #000 | var(--dx-grid-drop-highlight-content) |
| `.dx-datagrid .dx-datagrid-drop-highlight>td .dx-checkbox .dx-checkbox-icon \| background-color` | #000 | var(--dx-grid-drop-highlight-content) |
| `.dx-datagrid .dx-datagrid-drop-highlight>td .dx-checkbox .dx-checkbox-icon \| color` | #479ef5 | var(--dx-grid-drop-highlight-bg) |
| `.dx-datagrid-search-text \| color` | #000 | var(--dx-grid-search-content) |
| `.dx-datagrid-search-text \| background-color` | #479ef5 | var(--dx-grid-search-bg) |

### Решение 2. Семейство для цветных и нейтральных тинтов (hover/active/selected/полосы)

Записи журнала: button ховер-тинты; filterBuilder/chat чипы; splitterBar; pivotGrid чипы и итог; informer/progressBar/slider; gridBase строка в фокусе; gridBase нейтральная глубина.

**light**

| Место | fluent | fluent-next |
|---|---|---|
| `.dx-button-mode-text.dx-button-default \| background-color` | transparent | var(--dx-button-default-text-bg) |
| `.dx-button-mode-text.dx-button-default.dx-state-selected \| background-color` | rgb(208.051995,229.0022375793,250.999005) | var(--dx-button-default-text-bg-selected) |
| `.dx-button-mode-text.dx-button-default.dx-state-hover \| background-color` | rgb(235.04565,243.0357317586,252.00435) | var(--dx-button-default-text-bg-hovered) |
| `.dx-button-mode-text.dx-button-default.dx-state-focused \| background-color` | rgb(235.04565,243.0357317586,252.00435) | var(--dx-button-default-text-bg-focused) |
| `.dx-button-mode-text.dx-button-default.dx-state-active \| background-color` | rgb(150.050232,198.8042971476,249.993768) | var(--dx-button-default-text-bg-active) |
| `.dx-button-mode-text.dx-button-danger \| background-color` | transparent | var(--dx-button-danger-text-bg) |
| `.dx-button-mode-text.dx-button-danger.dx-state-selected \| background-color` | rgb(247.0931401205,217.3968598795,218.4009220087) | var(--dx-button-danger-text-bg-selected) |
| `.dx-button-mode-text.dx-button-danger.dx-state-hover \| background-color` | rgb(253.0317671084,246.1382328916,246.1415259812) | var(--dx-button-danger-text-bg-hovered) |
| `.dx-button-mode-text.dx-button-danger.dx-state-focused \| background-color` | rgb(253.0317671084,246.1382328916,246.1415259812) | var(--dx-button-danger-text-bg-focused) |
| `.dx-button-mode-text.dx-button-danger.dx-state-active \| background-color` | rgb(241.0472125301,187.2327874699,188.2450927905) | var(--dx-button-danger-text-bg-active) |
| `.dx-button-mode-text.dx-button-success \| background-color` | transparent | var(--dx-button-success-text-bg) |
| `.dx-button-mode-text.dx-button-success.dx-state-selected \| background-color` | rgb(200.8151428571,232.9448571429,200.8151428571) | var(--dx-button-success-text-bg-selected) |
| `.dx-button-mode-text.dx-button-success.dx-state-hover \| background-color` | rgb(240.9140228571,249.9659771429,240.9140228571) | var(--dx-button-success-text-bg-hovered) |
| `.dx-button-mode-text.dx-button-success.dx-state-focused \| background-color` | rgb(240.9140228571,249.9659771429,240.9140228571) | var(--dx-button-success-text-bg-focused) |
| `.dx-button-mode-text.dx-button-success.dx-state-active \| background-color` | rgb(159.064305,216.045695,159.064305) | var(--dx-button-success-text-bg-active) |
| `.dx-button-mode-outlined.dx-button-default \| background-color` | transparent | var(--dx-button-default-outlined-bg) |
| `.dx-button-mode-outlined.dx-button-default.dx-state-selected \| background-color` | rgb(208.051995,229.0022375793,250.999005) | var(--dx-button-default-outlined-bg-selected) |
| `.dx-button-mode-outlined.dx-button-default.dx-state-hover \| background-color` | rgb(235.04565,243.0357317586,252.00435) | var(--dx-button-default-outlined-bg-hovered) |
| `.dx-button-mode-outlined.dx-button-default.dx-state-focused \| background-color` | rgb(235.04565,243.0357317586,252.00435) | var(--dx-button-default-outlined-bg-focused) |
| `.dx-button-mode-outlined.dx-button-default.dx-state-active \| background-color` | rgb(150.050232,198.8042971476,249.993768) | var(--dx-button-default-outlined-bg-active) |
| `.dx-button-mode-outlined.dx-button-danger \| background-color` | transparent | var(--dx-button-danger-outlined-bg) |
| `.dx-button-mode-outlined.dx-button-danger.dx-state-selected \| background-color` | rgb(247.0931401205,217.3968598795,218.4009220087) | var(--dx-button-danger-outlined-bg-selected) |
| `.dx-button-mode-outlined.dx-button-danger.dx-state-hover \| background-color` | rgb(253.0317671084,246.1382328916,246.1415259812) | var(--dx-button-danger-outlined-bg-hovered) |
| `.dx-button-mode-outlined.dx-button-danger.dx-state-focused \| background-color` | rgb(253.0317671084,246.1382328916,246.1415259812) | var(--dx-button-danger-outlined-bg-focused) |
| `.dx-button-mode-outlined.dx-button-danger.dx-state-active \| background-color` | rgb(241.0472125301,187.2327874699,188.2450927905) | var(--dx-button-danger-outlined-bg-active) |
| `.dx-button-mode-outlined.dx-button-success \| background-color` | transparent | var(--dx-button-success-outlined-bg) |
| `.dx-button-mode-outlined.dx-button-success.dx-state-selected \| background-color` | rgb(200.8151428571,232.9448571429,200.8151428571) | var(--dx-button-success-outlined-bg-selected) |
| `.dx-button-mode-outlined.dx-button-success.dx-state-hover \| background-color` | rgb(240.9140228571,249.9659771429,240.9140228571) | var(--dx-button-success-outlined-bg-hovered) |
| `.dx-button-mode-outlined.dx-button-success.dx-state-focused \| background-color` | rgb(240.9140228571,249.9659771429,240.9140228571) | var(--dx-button-success-outlined-bg-focused) |
| `.dx-button-mode-outlined.dx-button-success.dx-state-active \| background-color` | rgb(159.064305,216.045695,159.064305) | var(--dx-button-success-outlined-bg-active) |
| `.dx-chat-messagegroup-alignment-start .dx-chat-messagebubble \| background-color` | rgb(245.004,245.004,245.004) | var(--dx-chat-bubble-secondary-bg) |
| `.dx-chat-messagegroup-alignment-end .dx-chat-messagebubble \| background-color` | rgb(235.04565,243.0357317586,252.00435) | var(--dx-chat-bubble-primary-bg) |
| `.dx-filterbuilder .dx-filterbuilder-group .dx-filterbuilder-text.dx-filterbuilder-item-field \| background-color` | rgba(15,108,189,.3) | var(--dx-filter-builder-item-field-bg) |
| `.dx-filterbuilder .dx-filterbuilder-group .dx-filterbuilder-text.dx-filterbuilder-item-field:hover \| background-color` | rgba(15,108,189,.5) | var(--dx-filter-builder-item-field-bg-hovered) |
| `.dx-filterbuilder .dx-filterbuilder-group .dx-filterbuilder-text.dx-filterbuilder-item-field.dx-state-active \| background-color` | #0f6cbd | var(--dx-filter-builder-item-field-bg-focused) |
| `.dx-filterbuilder .dx-filterbuilder-group .dx-filterbuilder-text.dx-filterbuilder-item-field:focus \| background-color` | #0f6cbd | var(--dx-filter-builder-item-field-bg-focused) |
| `.dx-filterbuilder .dx-filterbuilder-group .dx-filterbuilder-text.dx-filterbuilder-item-operation \| background-color` | rgba(16,124,16,.3) | var(--dx-filter-builder-item-operator-bg) |
| `.dx-filterbuilder .dx-filterbuilder-group .dx-filterbuilder-text.dx-filterbuilder-item-operation:hover \| background-color` | rgba(16,124,16,.5) | var(--dx-filter-builder-item-operator-bg-hovered) |
| `.dx-filterbuilder .dx-filterbuilder-group .dx-filterbuilder-text.dx-filterbuilder-item-operation.dx-state-active \| background-color` | #107c10 | var(--dx-filter-builder-item-operator-bg-focused) |
| `.dx-filterbuilder .dx-filterbuilder-group .dx-filterbuilder-text.dx-filterbuilder-item-operation:focus \| background-color` | #107c10 | var(--dx-filter-builder-item-operator-bg-focused) |
| `.dx-filterbuilder .dx-filterbuilder-group .dx-filterbuilder-text .dx-filterbuilder-item-value-text \| background-color` | rgba(96.996,96.996,96.996,.24) | var(--dx-filter-builder-item-value-bg) |
| `.dx-filterbuilder .dx-filterbuilder-group .dx-filterbuilder-text .dx-filterbuilder-item-value-text:hover \| background-color` | rgba(96.996,96.996,96.996,.32) | var(--dx-filter-builder-item-value-bg-hovered) |
| `.dx-filterbuilder .dx-filterbuilder-group .dx-filterbuilder-text .dx-filterbuilder-item-value-text.dx-state-active \| background-color` | rgb(96.996,96.996,96.996) | var(--dx-filter-builder-item-value-bg-focused) |
| `.dx-filterbuilder .dx-filterbuilder-group .dx-filterbuilder-text .dx-filterbuilder-item-value-text:focus \| background-color` | rgb(96.996,96.996,96.996) | var(--dx-filter-builder-item-value-bg-focused) |
| `.dx-splitter .dx-resize-handle \| background-color` | #e0e0e0 | var(--dx-splitter-resize-handle-bg) |
| `.dx-splitter .dx-resize-handle.dx-state-hover \| background-color` | rgb(199.01,199.01,199.01) | var(--dx-splitter-resize-handle-bg-hovered) |
| `.dx-splitter .dx-resize-handle.dx-state-active \| background-color` | #0f6cbd | var(--dx-splitter-resize-handle-bg-focused) |
| `.dx-splitter .dx-resize-handle.dx-state-focused \| background-color` | #0f6cbd | var(--dx-splitter-resize-handle-bg-focused) |
| `.dx-pivotgrid-fields-container .dx-area-field.dx-area-box \| background-color` | rgb(240.006,240.006,240.006) | var(--dx-pivot-grid-field-area-box-bg) |
| `.dx-pivotgrid-fields-container.dx-drag .dx-area-field.dx-area-box \| background-color` | rgba(240.006,240.006,240.006,.9) | var(--dx-pivot-grid-area-field-bg) |
| `.dx-informer-error.dx-informer-bg \| background-color` | rgb(253.0028627482,246.0690380678,246.0141372518) | var(--dx-informer-error-bg) |
| `.dx-informer-info.dx-informer-bg \| background-color` | rgb(226.995,226.995,226.995) | var(--dx-informer-info-bg) |
| `.dx-progressbar-container \| background-color` | rgb(230.008,230.008,230.008) | var(--dx-progress-bar-bg) |
| `.dx-progressbar-range \| background-color` | #0f6cbd | var(--dx-progress-bar-range-bg) |
| `.dx-progressbar-animating-container \| background-color` | rgb(230.008,230.008,230.008) | var(--dx-progress-bar-bg) |
| `.dx-invalid .dx-progressbar-range \| background-color` | #d13438 | var(--dx-progress-bar-range-invalid-bg) |
| `.dx-state-disabled .dx-progressbar-container \| background-color` | rgb(240.057,240.057,240.057) | var(--dx-progress-bar-container-bg-disabled) |
| `.dx-state-disabled .dx-progressbar-range \| background-color` | #bdbdbd | var(--dx-progress-bar-range-bg-disabled) |
| `.dx-slider-handle \| background-color` | #fff | var(--dx-slider-element-bg) |
| `.dx-invalid .dx-slider-handle::after \| background-color` | #d13438 | var(--dx-slider-handle-invalid-bg) |
| `.dx-invalid .dx-slider-handle.dx-state-hover::after \| background-color` | rgb(187.9945952711,46.9954047289,50.5877407937) | var(--dx-slider-invalid-bg-hovered) |
| `.dx-invalid .dx-slider-handle.dx-state-focused::after \| background-color` | rgb(116.9947056446,29.0002943554,31.2421901844) | var(--dx-slider-invalid-content-focused) |
| `.dx-invalid .dx-slider-range-visible \| background-color` | #d13438 | var(--dx-slider-invalid-bg) |
| `.dx-datagrid .dx-row-alt>td \| background-color` | rgb(244.8,244.8,244.8) | var(--dx-grid-row-alternation-bg) |
| `.dx-datagrid-rowsview .dx-master-detail-row:not(.dx-datagrid-edit-form) .dx-master-detail-cell \| background-color` | rgb(249.9,249.9,249.9) | var(--dx-grid-master-detail-cell-bg) |
| `.dx-datagrid-headers.dx-datagrid-sticky-columns .dx-datagrid-filter-row>td.dx-datagrid-sticky-column \| background-color` | rgb(249.9,249.9,249.9) | var(--dx-grid-filter-row-bg) |
| `.dx-datagrid-headers.dx-datagrid-sticky-columns .dx-datagrid-filter-row>td.dx-datagrid-sticky-column-left \| background-color` | rgb(249.9,249.9,249.9) | var(--dx-grid-filter-row-bg) |
| `.dx-datagrid-headers.dx-datagrid-sticky-columns .dx-datagrid-filter-row>td.dx-datagrid-sticky-column-right \| background-color` | rgb(249.9,249.9,249.9) | var(--dx-grid-filter-row-bg) |
| `.dx-datagrid-rowsview .dx-row-focused.dx-data-row>td:not(.dx-focused):not(.dx-cell-modified):not(.dx-datagrid-invalid) \| background-color` | rgb(207.9999,228.8327555172,251.0001) | var(--dx-grid-row-bg-focused) |
| `.dx-datagrid-rowsview .dx-row-focused.dx-data-row.dx-edit-row>td.dx-editor-cell:not(.dx-command-select):not(.dx-datagrid-invalid) \| background-color` | #fff | var(--dx-grid-bg) |
| `.dx-datagrid-rowsview .dx-row-focused.dx-data-row.dx-edit-row>tr>td.dx-editor-cell:not(.dx-command-select):not(.dx-datagrid-invalid) \| background-color` | #fff | var(--dx-grid-bg) |
| `.dx-datagrid-filter-row \| background-color` | rgb(249.9,249.9,249.9) | var(--dx-grid-filter-row-bg) |
| `.dx-datagrid-filter-row .dx-filter-modified \| background-color` | rgb(240.9140228571,249.9659771429,240.9140228571) | var(--dx-grid-cell-modified-bg) |
| `.dx-datagrid-rowsview .dx-row-focused.dx-group-row \| background-color` | rgb(207.9999,228.8327555172,251.0001) | var(--dx-grid-row-bg-focused) |
| `.dx-treelist .dx-row-alt>td \| background-color` | rgb(244.8,244.8,244.8) | var(--dx-grid-row-alternation-bg) |
| `.dx-treelist-rowsview .dx-master-detail-row:not(.dx-treelist-edit-form) .dx-master-detail-cell \| background-color` | rgb(249.9,249.9,249.9) | var(--dx-grid-master-detail-cell-bg) |

**dark**

| Место | fluent | fluent-next |
|---|---|---|
| `.dx-button-mode-text.dx-button-default \| background-color` | transparent | var(--dx-button-default-text-bg) |
| `.dx-button-mode-text.dx-button-default.dx-state-selected \| background-color` | rgb(11.9967799907,58.4568960012,93.9852200093) | var(--dx-button-default-text-bg-selected) |
| `.dx-button-mode-text.dx-button-default.dx-state-hover \| background-color` | rgb(8.0104718557,34.9924084711,56.0495281443) | var(--dx-button-default-text-bg-hovered) |
| `.dx-button-mode-text.dx-button-default.dx-state-focused \| background-color` | rgb(8.0104718557,34.9924084711,56.0495281443) | var(--dx-button-default-text-bg-focused) |
| `.dx-button-mode-text.dx-button-default.dx-state-active \| background-color` | rgb(15.0027631469,83.7458736853,139.9902368531) | var(--dx-button-default-text-bg-active) |
| `.dx-button-mode-text.dx-button-danger \| background-color` | transparent | var(--dx-button-danger-text-bg) |
| `.dx-button-mode-text.dx-button-danger.dx-state-selected \| background-color` | rgb(116.9555308861,29.0044691139,31.5912650484) | var(--dx-button-danger-text-bg-selected) |
| `.dx-button-mode-text.dx-button-danger.dx-state-hover \| background-color` | rgb(63.1050927215,16.0449072785,17.4290303797) | var(--dx-button-danger-text-bg-hovered) |
| `.dx-button-mode-text.dx-button-danger.dx-state-focused \| background-color` | rgb(63.1050927215,16.0449072785,17.4290303797) | var(--dx-button-danger-text-bg-focused) |
| `.dx-button-mode-text.dx-button-danger.dx-state-active \| background-color` | rgb(188.1173851899,47.0926148101,51.2404021742) | var(--dx-button-danger-text-bg-active) |
| `.dx-button-mode-text.dx-button-success \| background-color` | transparent | var(--dx-button-success-text-bg) |
| `.dx-button-mode-text.dx-button-success.dx-state-selected \| background-color` | rgb(9.000915,68.929085,9.000915) | var(--dx-button-success-text-bg-selected) |
| `.dx-button-mode-text.dx-button-success.dx-state-hover \| background-color` | rgb(5.02537,37.20463,5.02537) | var(--dx-button-success-text-bg-hovered) |
| `.dx-button-mode-text.dx-button-success.dx-state-focused \| background-color` | rgb(5.02537,37.20463,5.02537) | var(--dx-button-success-text-bg-focused) |
| `.dx-button-mode-text.dx-button-success.dx-state-active \| background-color` | rgb(11.03399,80.15601,11.03399) | var(--dx-button-success-text-bg-active) |
| `.dx-button-mode-outlined.dx-button-default \| background-color` | transparent | var(--dx-button-default-outlined-bg) |
| `.dx-button-mode-outlined.dx-button-default.dx-state-selected \| background-color` | rgb(11.9967799907,58.4568960012,93.9852200093) | var(--dx-button-default-outlined-bg-selected) |
| `.dx-button-mode-outlined.dx-button-default.dx-state-hover \| background-color` | rgb(8.0104718557,34.9924084711,56.0495281443) | var(--dx-button-default-outlined-bg-hovered) |
| `.dx-button-mode-outlined.dx-button-default.dx-state-focused \| background-color` | rgb(8.0104718557,34.9924084711,56.0495281443) | var(--dx-button-default-outlined-bg-focused) |
| `.dx-button-mode-outlined.dx-button-default.dx-state-active \| background-color` | rgb(15.0027631469,83.7458736853,139.9902368531) | var(--dx-button-default-outlined-bg-active) |
| `.dx-button-mode-outlined.dx-button-danger \| background-color` | transparent | var(--dx-button-danger-outlined-bg) |
| `.dx-button-mode-outlined.dx-button-danger.dx-state-selected \| background-color` | rgb(116.9555308861,29.0044691139,31.5912650484) | var(--dx-button-danger-outlined-bg-selected) |
| `.dx-button-mode-outlined.dx-button-danger.dx-state-hover \| background-color` | rgb(63.1050927215,16.0449072785,17.4290303797) | var(--dx-button-danger-outlined-bg-hovered) |
| `.dx-button-mode-outlined.dx-button-danger.dx-state-focused \| background-color` | rgb(63.1050927215,16.0449072785,17.4290303797) | var(--dx-button-danger-outlined-bg-focused) |
| `.dx-button-mode-outlined.dx-button-danger.dx-state-active \| background-color` | rgb(188.1173851899,47.0926148101,51.2404021742) | var(--dx-button-danger-outlined-bg-active) |
| `.dx-button-mode-outlined.dx-button-success \| background-color` | transparent | var(--dx-button-success-outlined-bg) |
| `.dx-button-mode-outlined.dx-button-success.dx-state-selected \| background-color` | rgb(9.000915,68.929085,9.000915) | var(--dx-button-success-outlined-bg-selected) |
| `.dx-button-mode-outlined.dx-button-success.dx-state-hover \| background-color` | rgb(5.02537,37.20463,5.02537) | var(--dx-button-success-outlined-bg-hovered) |
| `.dx-button-mode-outlined.dx-button-success.dx-state-focused \| background-color` | rgb(5.02537,37.20463,5.02537) | var(--dx-button-success-outlined-bg-focused) |
| `.dx-button-mode-outlined.dx-button-success.dx-state-active \| background-color` | rgb(11.03399,80.15601,11.03399) | var(--dx-button-success-outlined-bg-active) |
| `.dx-chat-messagegroup-alignment-start .dx-chat-messagebubble \| background-color` | rgb(60.992,60.992,60.992) | var(--dx-chat-bubble-secondary-bg) |
| `.dx-chat-messagegroup-alignment-end .dx-chat-messagebubble \| background-color` | rgb(8.0104718557,34.9924084711,56.0495281443) | var(--dx-chat-bubble-primary-bg) |
| `.dx-filterbuilder .dx-filterbuilder-group .dx-filterbuilder-text.dx-filterbuilder-item-field \| background-color` | rgba(71,158,245,.3) | var(--dx-filter-builder-item-field-bg) |
| `.dx-filterbuilder .dx-filterbuilder-group .dx-filterbuilder-text.dx-filterbuilder-item-field:hover \| background-color` | rgba(71,158,245,.5) | var(--dx-filter-builder-item-field-bg-hovered) |
| `.dx-filterbuilder .dx-filterbuilder-group .dx-filterbuilder-text.dx-filterbuilder-item-field.dx-state-active \| background-color` | #479ef5 | var(--dx-filter-builder-item-field-bg-focused) |
| `.dx-filterbuilder .dx-filterbuilder-group .dx-filterbuilder-text.dx-filterbuilder-item-field:focus \| background-color` | #479ef5 | var(--dx-filter-builder-item-field-bg-focused) |
| `.dx-filterbuilder .dx-filterbuilder-group .dx-filterbuilder-text.dx-filterbuilder-item-operation \| background-color` | rgba(84,176,84,.3) | var(--dx-filter-builder-item-operator-bg) |
| `.dx-filterbuilder .dx-filterbuilder-group .dx-filterbuilder-text.dx-filterbuilder-item-operation:hover \| background-color` | rgba(84,176,84,.5) | var(--dx-filter-builder-item-operator-bg-hovered) |
| `.dx-filterbuilder .dx-filterbuilder-group .dx-filterbuilder-text.dx-filterbuilder-item-operation.dx-state-active \| background-color` | #54b054 | var(--dx-filter-builder-item-operator-bg-focused) |
| `.dx-filterbuilder .dx-filterbuilder-group .dx-filterbuilder-text.dx-filterbuilder-item-operation:focus \| background-color` | #54b054 | var(--dx-filter-builder-item-operator-bg-focused) |
| `.dx-filterbuilder .dx-filterbuilder-group .dx-filterbuilder-text .dx-filterbuilder-item-value-text \| background-color` | rgba(172.992,172.992,172.992,.24) | var(--dx-filter-builder-item-value-bg) |
| `.dx-filterbuilder .dx-filterbuilder-group .dx-filterbuilder-text .dx-filterbuilder-item-value-text:hover \| background-color` | rgba(172.992,172.992,172.992,.32) | var(--dx-filter-builder-item-value-bg-hovered) |
| `.dx-filterbuilder .dx-filterbuilder-group .dx-filterbuilder-text .dx-filterbuilder-item-value-text.dx-state-active \| background-color` | rgb(172.992,172.992,172.992) | var(--dx-filter-builder-item-value-bg-focused) |
| `.dx-filterbuilder .dx-filterbuilder-group .dx-filterbuilder-text .dx-filterbuilder-item-value-text:focus \| background-color` | rgb(172.992,172.992,172.992) | var(--dx-filter-builder-item-value-bg-focused) |
| `.dx-splitter .dx-resize-handle \| background-color` | #616161 | var(--dx-splitter-resize-handle-bg) |
| `.dx-splitter .dx-resize-handle.dx-state-hover \| background-color` | rgb(116.992,116.992,116.992) | var(--dx-splitter-resize-handle-bg-hovered) |
| `.dx-splitter .dx-resize-handle.dx-state-active \| background-color` | #479ef5 | var(--dx-splitter-resize-handle-bg-focused) |
| `.dx-splitter .dx-resize-handle.dx-state-focused \| background-color` | #479ef5 | var(--dx-splitter-resize-handle-bg-focused) |
| `.dx-pivotgrid-fields-container .dx-area-field.dx-area-box \| background-color` | rgb(9.992,9.992,9.992) | var(--dx-pivot-grid-field-area-box-bg) |
| `.dx-pivotgrid-fields-container.dx-drag .dx-area-field.dx-area-box \| background-color` | rgba(9.992,9.992,9.992,.9) | var(--dx-pivot-grid-area-field-bg) |
| `.dx-informer-error.dx-informer-bg \| background-color` | rgb(62.9989075456,15.9980924544,17.3804693689) | var(--dx-informer-error-bg) |
| `.dx-informer-info.dx-informer-bg \| background-color` | rgb(60.996,60.996,60.996) | var(--dx-informer-info-bg) |
| `.dx-progressbar-container \| background-color` | rgb(50.992,50.992,50.992) | var(--dx-progress-bar-bg) |
| `.dx-progressbar-range \| background-color` | #479ef5 | var(--dx-progress-bar-range-bg) |
| `.dx-progressbar-animating-container \| background-color` | rgb(50.992,50.992,50.992) | var(--dx-progress-bar-bg) |
| `.dx-invalid .dx-progressbar-range \| background-color` | #e37d80 | var(--dx-progress-bar-range-invalid-bg) |
| `.dx-state-disabled .dx-progressbar-container \| background-color` | rgb(20.09,20.09,20.09) | var(--dx-progress-bar-container-bg-disabled) |
| `.dx-state-disabled .dx-progressbar-range \| background-color` | rgb(92.055,92.055,92.055) | var(--dx-progress-bar-range-bg-disabled) |
| `.dx-slider-handle \| background-color` | #292929 | var(--dx-slider-element-bg) |
| `.dx-invalid .dx-slider-handle::after \| background-color` | #e37d80 | var(--dx-slider-handle-invalid-bg) |
| `.dx-invalid .dx-slider-handle.dx-state-hover::after \| background-color` | rgb(233.9973021392,155.9976978608,158.291803869) | var(--dx-slider-invalid-bg-hovered) |
| `.dx-invalid .dx-slider-handle.dx-state-focused::after \| background-color` | rgb(240.9996472785,186.9903527215,187.9487529485) | var(--dx-slider-invalid-content-focused) |
| `.dx-invalid .dx-slider-range-visible \| background-color` | #e37d80 | var(--dx-slider-invalid-bg) |
| `.dx-datagrid .dx-row-alt>td \| background-color` | rgb(51.2,51.2,51.2) | var(--dx-grid-row-alternation-bg) |
| `.dx-datagrid-rowsview .dx-master-detail-row:not(.dx-datagrid-edit-form) .dx-master-detail-cell \| background-color` | rgb(35.9,35.9,35.9) | var(--dx-grid-master-detail-cell-bg) |
| `.dx-datagrid-headers.dx-datagrid-sticky-columns .dx-datagrid-filter-row>td.dx-datagrid-sticky-column \| background-color` | rgb(46.1,46.1,46.1) | var(--dx-grid-filter-row-bg) |
| `.dx-datagrid-headers.dx-datagrid-sticky-columns .dx-datagrid-filter-row>td.dx-datagrid-sticky-column-left \| background-color` | rgb(46.1,46.1,46.1) | var(--dx-grid-filter-row-bg) |
| `.dx-datagrid-headers.dx-datagrid-sticky-columns .dx-datagrid-filter-row>td.dx-datagrid-sticky-column-right \| background-color` | rgb(46.1,46.1,46.1) | var(--dx-grid-filter-row-bg) |
| `.dx-datagrid-rowsview .dx-row-focused.dx-data-row>td:not(.dx-focused):not(.dx-cell-modified):not(.dx-datagrid-invalid) \| background-color` | #0c3b5e | var(--dx-grid-row-bg-focused) |
| `.dx-datagrid-rowsview .dx-row-focused.dx-data-row.dx-edit-row>td.dx-editor-cell:not(.dx-command-select):not(.dx-datagrid-invalid) \| background-color` | #292929 | var(--dx-grid-bg) |
| `.dx-datagrid-rowsview .dx-row-focused.dx-data-row.dx-edit-row>tr>td.dx-editor-cell:not(.dx-command-select):not(.dx-datagrid-invalid) \| background-color` | #292929 | var(--dx-grid-bg) |
| `.dx-datagrid-filter-row \| background-color` | rgb(46.1,46.1,46.1) | var(--dx-grid-filter-row-bg) |
| `.dx-datagrid-filter-row .dx-filter-modified \| background-color` | rgb(5.02537,37.20463,5.02537) | var(--dx-grid-cell-modified-bg) |
| `.dx-datagrid-rowsview .dx-row-focused.dx-group-row \| background-color` | #0c3b5e | var(--dx-grid-row-bg-focused) |
| `.dx-treelist .dx-row-alt>td \| background-color` | rgb(51.2,51.2,51.2) | var(--dx-grid-row-alternation-bg) |
| `.dx-treelist-rowsview .dx-master-detail-row:not(.dx-treelist-edit-form) .dx-master-detail-cell \| background-color` | rgb(35.9,35.9,35.9) | var(--dx-grid-master-detail-cell-bg) |

### Решение 3. Мосты ③ rgb(from … / a) там, где в foundation нет роли с альфой

Записи журнала: w3 границы/градиенты; htmlEditor накладки; switch тень кольца; fileManager оверлей; gridBase drag-header; часть base B1a.

- *без цветового доказательства:* градиенты затухания dateView (мост внутри linear-gradient, сравнивается как текст)

**light**

| Место | fluent | fluent-next |
|---|---|---|
| `.dx-tile \| background-color` | #fff | var(--dx-tile-view-bg) |
| `.dx-tile \| border-color` | rgba(224,224,224,.6) | var(--dx-tile-view-border) |
| `.dx-tile.dx-state-focused \| background-color` | #fff | var(--dx-tile-view-bg-hovered) |
| `.dx-tile.dx-state-focused \| border-color` | rgba(15,108,189,.4) | var(--dx-tile-view-border-hovered) |
| `.dx-tile.dx-state-hover \| background-color` | #fff | var(--dx-tile-view-bg-hovered) |
| `.dx-tile.dx-state-hover \| border-color` | rgba(15,108,189,.4) | var(--dx-tile-view-border-hovered) |
| `.dx-tile.dx-state-active \| background-color` | rgba(95.625,95.625,95.625,.2) | var(--dx-tile-view-bg-active) |
| `.dx-gallery-indicator-item \| border-color` | rgba(0,0,0,.2) | var(--dx-gallery-indicator-item-border) |
| `.dx-gallery-indicator-item-active \| border-color` | rgba(255,255,255,.8) | var(--dx-gallery-indicator-border-selected) |
| `.dx-gallery-indicator-item-selected \| border-color` | rgba(255,255,255,.8) | var(--dx-gallery-indicator-border-selected) |
| `.dx-htmleditor-content .ql-code-block-container \| background-color` | rgba(191,191,191,.15) | var(--dx-html-editor-code-block-bg) |
| `.dx-htmleditor-content .ql-code-block-container \| color` | rgba(36,36,36,.8) | var(--dx-html-editor-faded-content) |
| `.dx-htmleditor-content code \| background-color` | rgba(191,191,191,.15) | var(--dx-html-editor-code-block-bg) |
| `.dx-htmleditor-content code \| color` | rgba(36,36,36,.8) | var(--dx-html-editor-faded-content) |
| `.dx-htmleditor-content.ql-blank::before \| color` | #707070 | #444444 |
| `.dx-htmleditor.dx-state-disabled .dx-htmleditor-toolbar-wrapper::before \| background-color` | rgba(255,255,255,.4) | var(--dx-html-editor-cover-bg) |
| `.dx-htmleditor.dx-state-readonly .dx-htmleditor-toolbar-wrapper::before \| background-color` | rgba(255,255,255,.4) | var(--dx-html-editor-cover-bg) |
| `.dx-htmleditor.dx-htmleditor-outlined \| background-color` | #fff | var(--dx-text-editor-outlined-bg) |
| `.dx-htmleditor.dx-htmleditor-outlined.dx-state-hover \| background-color` | #fff | var(--dx-text-editor-outlined-bg-hovered) |
| `.dx-htmleditor.dx-htmleditor-outlined.dx-state-active \| background-color` | #fff | var(--dx-text-editor-outlined-bg-focused) |
| `.dx-htmleditor.dx-htmleditor-outlined.dx-state-focused \| background-color` | #fff | var(--dx-text-editor-outlined-bg-focused) |
| `.dx-htmleditor.dx-htmleditor-filled \| background-color` | rgb(245.055,245.055,245.055) | var(--dx-text-editor-filled-bg) |
| `.dx-htmleditor.dx-htmleditor-filled.dx-state-hover \| background-color` | rgb(245.055,245.055,245.055) | var(--dx-text-editor-filled-bg-hovered) |
| `.dx-htmleditor.dx-htmleditor-filled.dx-state-active \| background-color` | rgb(245.055,245.055,245.055) | var(--dx-text-editor-filled-bg-focused) |
| `.dx-htmleditor.dx-htmleditor-filled.dx-state-focused \| background-color` | rgb(245.055,245.055,245.055) | var(--dx-text-editor-filled-bg-focused) |
| `.dx-htmleditor.dx-htmleditor-underlined \| background-color` | transparent | var(--dx-text-editor-underlined-bg) |
| `.dx-htmleditor.dx-htmleditor-underlined.dx-state-hover \| background-color` | transparent | var(--dx-text-editor-underlined-bg-hovered) |
| `.dx-htmleditor.dx-htmleditor-underlined.dx-state-active \| background-color` | transparent | var(--dx-text-editor-underlined-bg-focused) |
| `.dx-htmleditor.dx-htmleditor-underlined.dx-state-focused \| background-color` | transparent | var(--dx-text-editor-underlined-bg-focused) |
| `.dx-htmleditor-content blockquote \| color` | rgba(36,36,36,.8) | var(--dx-html-editor-faded-content) |
| `.dx-htmleditor-add-image-popup>.dx-overlay-content>.dx-popup-content .dx-fileuploader-input-wrapper \| background-color` | #fafafa | var(--dx-html-editor-file-uploader-input-wrapper-bg) |
| `.dx-htmleditor-add-image-popup .dx-fileuploader-dragover .dx-fileuploader-content \| background-color` | rgba(224,224,224,.8) | var(--dx-html-editor-uploader-cover-bg) |
| `.dx-table-resize-frame>.dx-draggable-dragging+.dx-htmleditor-highlighted-column \| background-color` | rgba(15,108,189,.5) | var(--dx-html-editor-highlighted-row-bg) |
| `.dx-table-resize-frame>.dx-draggable-dragging+.dx-htmleditor-highlighted-row \| background-color` | rgba(15,108,189,.5) | var(--dx-html-editor-highlighted-row-bg) |
| `.dx-datagrid-drag-header \| border-color` | rgba(15,108,189,.5) | var(--dx-grid-drag-header-border) |
| `.dx-datagrid-drag-header \| box-shadow` | 0 0 1px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.2) | 0 0 1px rgba(0,0,0,0.12),0 1px 3px rgba(0,0,0,0.14) |

**dark**

| Место | fluent | fluent-next |
|---|---|---|
| `.dx-tile \| background-color` | #292929 | var(--dx-tile-view-bg) |
| `.dx-tile \| border-color` | rgba(97,97,97,.6) | var(--dx-tile-view-border) |
| `.dx-tile.dx-state-focused \| background-color` | #292929 | var(--dx-tile-view-bg-hovered) |
| `.dx-tile.dx-state-focused \| border-color` | rgba(71,158,245,.4) | var(--dx-tile-view-border-hovered) |
| `.dx-tile.dx-state-hover \| background-color` | #292929 | var(--dx-tile-view-bg-hovered) |
| `.dx-tile.dx-state-hover \| border-color` | rgba(71,158,245,.4) | var(--dx-tile-view-border-hovered) |
| `.dx-tile.dx-state-active \| background-color` | hsla(0,0%,-46.4215686275%,.2) | var(--dx-tile-view-bg-active) |
| `.dx-gallery-indicator-item \| border-color` | rgba(0,0,0,.2) | var(--dx-gallery-indicator-item-border) |
| `.dx-gallery-indicator-item-active \| border-color` | rgba(41,41,41,.8) | var(--dx-gallery-indicator-border-selected) |
| `.dx-gallery-indicator-item-selected \| border-color` | rgba(41,41,41,.8) | var(--dx-gallery-indicator-border-selected) |
| `.dx-htmleditor-content .ql-code-block-container \| background-color` | rgba(191,191,191,.15) | var(--dx-html-editor-code-block-bg) |
| `.dx-htmleditor-content .ql-code-block-container \| color` | rgba(255,255,255,.8) | var(--dx-html-editor-faded-content) |
| `.dx-htmleditor-content code \| background-color` | rgba(191,191,191,.15) | var(--dx-html-editor-code-block-bg) |
| `.dx-htmleditor-content code \| color` | rgba(255,255,255,.8) | var(--dx-html-editor-faded-content) |
| `.dx-htmleditor-content.ql-blank::before \| color` | #999999 | #cbcbcb |
| `.dx-htmleditor.dx-state-disabled .dx-htmleditor-toolbar-wrapper::before \| background-color` | rgba(41,41,41,.4) | var(--dx-html-editor-cover-bg) |
| `.dx-htmleditor.dx-state-readonly .dx-htmleditor-toolbar-wrapper::before \| background-color` | rgba(41,41,41,.4) | var(--dx-html-editor-cover-bg) |
| `.dx-htmleditor.dx-htmleditor-outlined \| background-color` | #292929 | var(--dx-text-editor-outlined-bg) |
| `.dx-htmleditor.dx-htmleditor-outlined.dx-state-hover \| background-color` | #292929 | var(--dx-text-editor-outlined-bg-hovered) |
| `.dx-htmleditor.dx-htmleditor-outlined.dx-state-active \| background-color` | #292929 | var(--dx-text-editor-outlined-bg-focused) |
| `.dx-htmleditor.dx-htmleditor-outlined.dx-state-focused \| background-color` | #292929 | var(--dx-text-editor-outlined-bg-focused) |
| `.dx-htmleditor.dx-htmleditor-filled \| background-color` | rgb(20.09,20.09,20.09) | var(--dx-text-editor-filled-bg) |
| `.dx-htmleditor.dx-htmleditor-filled.dx-state-hover \| background-color` | rgb(20.09,20.09,20.09) | var(--dx-text-editor-filled-bg-hovered) |
| `.dx-htmleditor.dx-htmleditor-filled.dx-state-active \| background-color` | rgb(20.09,20.09,20.09) | var(--dx-text-editor-filled-bg-focused) |
| `.dx-htmleditor.dx-htmleditor-filled.dx-state-focused \| background-color` | rgb(20.09,20.09,20.09) | var(--dx-text-editor-filled-bg-focused) |
| `.dx-htmleditor.dx-htmleditor-underlined \| background-color` | transparent | var(--dx-text-editor-underlined-bg) |
| `.dx-htmleditor.dx-htmleditor-underlined.dx-state-hover \| background-color` | transparent | var(--dx-text-editor-underlined-bg-hovered) |
| `.dx-htmleditor.dx-htmleditor-underlined.dx-state-active \| background-color` | transparent | var(--dx-text-editor-underlined-bg-focused) |
| `.dx-htmleditor.dx-htmleditor-underlined.dx-state-focused \| background-color` | transparent | var(--dx-text-editor-underlined-bg-focused) |
| `.dx-htmleditor-content blockquote \| color` | rgba(255,255,255,.8) | var(--dx-html-editor-faded-content) |
| `.dx-htmleditor-add-image-popup>.dx-overlay-content>.dx-popup-content .dx-fileuploader-input-wrapper \| background-color` | #1f1f1f | var(--dx-html-editor-file-uploader-input-wrapper-bg) |
| `.dx-htmleditor-add-image-popup .dx-fileuploader-dragover .dx-fileuploader-content \| background-color` | rgba(97,97,97,.8) | var(--dx-html-editor-uploader-cover-bg) |
| `.dx-table-resize-frame>.dx-draggable-dragging+.dx-htmleditor-highlighted-column \| background-color` | rgba(71,158,245,.5) | var(--dx-html-editor-highlighted-row-bg) |
| `.dx-table-resize-frame>.dx-draggable-dragging+.dx-htmleditor-highlighted-row \| background-color` | rgba(71,158,245,.5) | var(--dx-html-editor-highlighted-row-bg) |
| `.dx-datagrid-drag-header \| border-color` | rgba(71,158,245,.5) | var(--dx-grid-drag-header-border) |
| `.dx-datagrid-drag-header \| box-shadow` | 0 0 1px rgba(0,0,0,.3),0 1px 3px rgba(0,0,0,.4) | 0 0 1px rgba(0,0,0,0.24),0 1px 3px rgba(0,0,0,0.28) |

### Решение 4. Смена тона относительно legacy (уехал не оттенок, а цвет)

Записи журнала: gridBase подсветка поиска; scheduler индикатор текущего времени; diagram метки выделения.

**light**

| Место | fluent | fluent-next |
|---|---|---|
| `.dx-datagrid-search-text \| color` | #fff | var(--dx-grid-search-content) |
| `.dx-datagrid-search-text \| background-color` | #0f6cbd | var(--dx-grid-search-bg) |
| `.dx-scheduler-header-panel-cell.dx-scheduler-header-panel-current-time-cell \| color` | rgb(111.99,111.99,111.99) | var(--dx-scheduler-panel-content) |
| `.dx-scheduler-header-panel-cell.dx-scheduler-header-panel-current-time-cell::before \| background-color` | #eb5757 | var(--dx-scheduler-time-indicator-content) |
| `.dx-scheduler-date-time-indicator \| background-color` | #eb5757 | var(--dx-scheduler-time-indicator-content) |
| `.dx-scheduler-date-time-indicator::before \| color` | #eb5757 | var(--dx-scheduler-time-indicator-content) |
| `.dx-scheduler-timeline .dx-scheduler-header-panel-cell.dx-scheduler-header-panel-current-time-cell::after \| background-color` | #eb5757 | var(--dx-scheduler-time-indicator-content) |
| `.dx-scheduler-header-panel-cell.dx-scheduler-header-panel-current-time-cell .dx-scheduler-header-panel-cell-date:last-child \| color` | #fff | var(--dx-scheduler-inverted-content) |
| `.dx-scheduler-header-panel-cell.dx-scheduler-header-panel-current-time-cell .dx-scheduler-header-panel-cell-date:last-child \| background-color` | #0f6cbd | var(--dx-scheduler-current-time-cell-date-bg) |
| `.dx-scheduler-work-space.dx-scheduler-work-space-month .dx-scheduler-header-panel-current-time-cell .dx-scheduler-header-panel-cell-date343 \| color` | #0f6cbd | var(--dx-scheduler-current-time-cell-content) |
| `.dx-diagram .dxdi-control .dxdi-canvas .connector-multi-selection \| stroke` | rgb(15,108,189) | var(--dx-diagram-connector-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .connector-point-mark \| stroke` | rgb(15,108,189) | var(--dx-diagram-connector-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .connector-selection \| stroke` | rgb(15,108,189) | var(--dx-diagram-connector-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .connector-side-mark \| stroke` | rgb(15,108,189) | var(--dx-diagram-connector-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .extension-line path \| stroke` | rgb(15,108,189) | var(--dx-diagram-connector-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .item-multi-selection-rect \| stroke` | rgb(15,108,189) | var(--dx-diagram-connector-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .item-selection-rect \| stroke` | rgb(15,108,189) | var(--dx-diagram-connector-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .items-selection-rect \| stroke` | rgb(15,108,189) | var(--dx-diagram-connector-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .selection-mark \| stroke` | rgb(15,108,189) | var(--dx-diagram-connector-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .connector-side-mark \| fill` | rgb(15,108,189) | var(--dx-diagram-connector-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .extension-line text \| fill` | rgb(15,108,189) | var(--dx-diagram-connector-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .connection-mark:not(.selector) \| stroke` | rgb(16,124,16) | var(--dx-diagram-connection-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .connection-point:not(.selector) \| stroke` | rgb(16,124,16) | var(--dx-diagram-connection-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .connection-target \| stroke` | rgb(16,124,16) | var(--dx-diagram-connection-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .container-target \| stroke` | rgb(16,124,16) | var(--dx-diagram-connection-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .connection-mark:not(.selector).active \| fill` | rgb(16,124,16) | var(--dx-diagram-connection-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .connection-point:not(.selector).active \| fill` | rgb(16,124,16) | var(--dx-diagram-connection-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .geometry-mark \| stroke` | rgb(209,52,56) | var(--dx-diagram-geometry-mark-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .dxdi-main .dxdi-image .dxdi-spinner path \| stroke` | rgb(15,108,189) | var(--dx-diagram-image-icon-accent-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .dxdi-main .dxdi-image .dxdi-spinner ellipse \| stroke` | rgb(96.996,96.996,96.996) | var(--dx-diagram-image-icon-muted-content) |
| `.dx-diagram .dxdi-control .dxdi-canvas .dxdi-main .dxdi-image .dxdi-user .dxdi-background \| fill` | rgb(96.996,96.996,96.996) | var(--dx-diagram-image-icon-muted-content) |
| `.dx-diagram .dxdi-control .dxdi-canvas .dxdi-main .dxdi-image .dxdi-warning ellipse \| fill` | rgb(209,52,56) | var(--dx-diagram-danger-icon) |
| `.dx-diagram .dxdi-control:not(.focused) .dxdi-canvas .geometry-mark \| stroke` | #666 | var(--dx-diagram-selection-mark-content) |
| `.dx-diagram .dxdi-control:not(.focused) .dxdi-canvas .selection-mark \| stroke` | #666 | var(--dx-diagram-selection-mark-content) |
| `.dx-diagram .dxdi-control:not(.focused) .dxdi-canvas .item-selection-rect \| stroke` | #666 | var(--dx-diagram-selection-mark-content) |
| `.dx-diagram .dxdi-control:not(.focused) .dxdi-canvas .items-selection-rect \| fill` | rgba(144,144,144,0.02) | var(--dx-diagram-selection-bg) |
| `.dx-diagram .dxdi-control:not(.focused) .dxdi-canvas .items-selection-rect \| stroke` | #666 | var(--dx-diagram-selection-mark-content) |
| `.dx-diagram .dxdi-control:not(.focused) .dxdi-canvas .item-multi-selection-rect \| fill` | rgba(144,144,144,0.02) | var(--dx-diagram-selection-bg) |
| `.dx-diagram .dxdi-control:not(.focused) .dxdi-canvas .item-multi-selection-rect \| stroke` | #666 | var(--dx-diagram-selection-mark-content) |
| `.dx-diagram .dxdi-control:not(.focused) .dxdi-canvas .connector-multi-selection \| stroke` | #666 | var(--dx-diagram-selection-mark-content) |
| `.dx-diagram .dxdi-control:not(.focused) .dxdi-canvas .connector-point-mark \| stroke` | #666 | var(--dx-diagram-selection-mark-content) |
| `.dx-diagram .dxdi-control:not(.focused) .dxdi-canvas .connector-selection \| stroke` | #666 | var(--dx-diagram-selection-mark-content) |
| `.dx-diagram .dxdi-control:not(.focused) .dxdi-canvas .connector-side-mark \| stroke` | #666 | var(--dx-diagram-selection-mark-content) |
| `.dx-diagram .dxdi-control:not(.focused) .dxdi-canvas .connector-side-mark \| fill` | #666 | var(--dx-diagram-selection-mark-content) |

**dark**

| Место | fluent | fluent-next |
|---|---|---|
| `.dx-datagrid-search-text \| color` | #000 | var(--dx-grid-search-content) |
| `.dx-datagrid-search-text \| background-color` | #479ef5 | var(--dx-grid-search-bg) |
| `.dx-scheduler-header-panel-cell.dx-scheduler-header-panel-current-time-cell \| color` | #999 | var(--dx-scheduler-panel-content) |
| `.dx-scheduler-header-panel-cell.dx-scheduler-header-panel-current-time-cell::before \| background-color` | #eb5757 | var(--dx-scheduler-time-indicator-content) |
| `.dx-scheduler-date-time-indicator \| background-color` | #eb5757 | var(--dx-scheduler-time-indicator-content) |
| `.dx-scheduler-date-time-indicator::before \| color` | #eb5757 | var(--dx-scheduler-time-indicator-content) |
| `.dx-scheduler-timeline .dx-scheduler-header-panel-cell.dx-scheduler-header-panel-current-time-cell::after \| background-color` | #eb5757 | var(--dx-scheduler-time-indicator-content) |
| `.dx-scheduler-header-panel-cell.dx-scheduler-header-panel-current-time-cell .dx-scheduler-header-panel-cell-date:last-child \| color` | #000 | var(--dx-scheduler-inverted-content) |
| `.dx-scheduler-header-panel-cell.dx-scheduler-header-panel-current-time-cell .dx-scheduler-header-panel-cell-date:last-child \| background-color` | #479ef5 | var(--dx-scheduler-current-time-cell-date-bg) |
| `.dx-scheduler-work-space.dx-scheduler-work-space-month .dx-scheduler-header-panel-current-time-cell .dx-scheduler-header-panel-cell-date343 \| color` | #479ef5 | var(--dx-scheduler-current-time-cell-content) |
| `.dx-diagram .dxdi-control .dxdi-canvas .connector-multi-selection \| stroke` | rgb(71,158,245) | var(--dx-diagram-connector-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .connector-point-mark \| stroke` | rgb(71,158,245) | var(--dx-diagram-connector-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .connector-selection \| stroke` | rgb(71,158,245) | var(--dx-diagram-connector-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .connector-side-mark \| stroke` | rgb(71,158,245) | var(--dx-diagram-connector-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .extension-line path \| stroke` | rgb(71,158,245) | var(--dx-diagram-connector-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .item-multi-selection-rect \| stroke` | rgb(71,158,245) | var(--dx-diagram-connector-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .item-selection-rect \| stroke` | rgb(71,158,245) | var(--dx-diagram-connector-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .items-selection-rect \| stroke` | rgb(71,158,245) | var(--dx-diagram-connector-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .selection-mark \| stroke` | rgb(71,158,245) | var(--dx-diagram-connector-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .connector-side-mark \| fill` | rgb(71,158,245) | var(--dx-diagram-connector-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .extension-line text \| fill` | rgb(71,158,245) | var(--dx-diagram-connector-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .connection-mark:not(.selector) \| stroke` | #54B054 | var(--dx-diagram-connection-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .connection-point:not(.selector) \| stroke` | #54B054 | var(--dx-diagram-connection-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .connection-target \| stroke` | #54B054 | var(--dx-diagram-connection-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .container-target \| stroke` | #54B054 | var(--dx-diagram-connection-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .connection-mark:not(.selector).active \| fill` | #54B054 | var(--dx-diagram-connection-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .connection-point:not(.selector).active \| fill` | #54B054 | var(--dx-diagram-connection-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .geometry-mark \| stroke` | rgb(227,125,128) | var(--dx-diagram-geometry-mark-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .dxdi-main .dxdi-image .dxdi-spinner path \| stroke` | rgb(71,158,245) | var(--dx-diagram-image-icon-accent-border) |
| `.dx-diagram .dxdi-control .dxdi-canvas .dxdi-main .dxdi-image .dxdi-spinner ellipse \| stroke` | rgb(97,97,97) | var(--dx-diagram-image-icon-muted-content) |
| `.dx-diagram .dxdi-control .dxdi-canvas .dxdi-main .dxdi-image .dxdi-user .dxdi-background \| fill` | rgb(97,97,97) | var(--dx-diagram-image-icon-muted-content) |
| `.dx-diagram .dxdi-control .dxdi-canvas .dxdi-main .dxdi-image .dxdi-warning ellipse \| fill` | rgb(227,125,128) | var(--dx-diagram-danger-icon) |
| `.dx-diagram .dxdi-control:not(.focused) .dxdi-canvas .geometry-mark \| stroke` | #666 | var(--dx-diagram-selection-mark-content) |
| `.dx-diagram .dxdi-control:not(.focused) .dxdi-canvas .selection-mark \| stroke` | #666 | var(--dx-diagram-selection-mark-content) |
| `.dx-diagram .dxdi-control:not(.focused) .dxdi-canvas .item-selection-rect \| stroke` | #666 | var(--dx-diagram-selection-mark-content) |
| `.dx-diagram .dxdi-control:not(.focused) .dxdi-canvas .items-selection-rect \| fill` | rgba(144,144,144,0.02) | var(--dx-diagram-selection-bg) |
| `.dx-diagram .dxdi-control:not(.focused) .dxdi-canvas .items-selection-rect \| stroke` | #666 | var(--dx-diagram-selection-mark-content) |
| `.dx-diagram .dxdi-control:not(.focused) .dxdi-canvas .item-multi-selection-rect \| fill` | rgba(144,144,144,0.02) | var(--dx-diagram-selection-bg) |
| `.dx-diagram .dxdi-control:not(.focused) .dxdi-canvas .item-multi-selection-rect \| stroke` | #666 | var(--dx-diagram-selection-mark-content) |
| `.dx-diagram .dxdi-control:not(.focused) .dxdi-canvas .connector-multi-selection \| stroke` | #666 | var(--dx-diagram-selection-mark-content) |
| `.dx-diagram .dxdi-control:not(.focused) .dxdi-canvas .connector-point-mark \| stroke` | #666 | var(--dx-diagram-selection-mark-content) |
| `.dx-diagram .dxdi-control:not(.focused) .dxdi-canvas .connector-selection \| stroke` | #666 | var(--dx-diagram-selection-mark-content) |
| `.dx-diagram .dxdi-control:not(.focused) .dxdi-canvas .connector-side-mark \| stroke` | #666 | var(--dx-diagram-selection-mark-content) |
| `.dx-diagram .dxdi-control:not(.focused) .dxdi-canvas .connector-side-mark \| fill` | #666 | var(--dx-diagram-selection-mark-content) |

### Решение 5. Пробелы foundation → эскалация в команду токенов

Записи журнала: loadIndicator дорожка/sparkle; button content для selected; sizes сироты.

- *без цветового доказательства:* sizes сироты (55 px-значений — список в самой записи, не цвет)
- *без цветового доказательства:* FOUNDATION GAP размеры и data-uri (нет визуальной дельты по построению)

**light**

| Место | fluent | fluent-next |
|---|---|---|
| `.dx-loadindicator-segment-inner \| border-color` | #0f6cbd #0f6cbd transparent | var(--dx-load-indicator-segment-border) |
| `.dx-loadindicator-content-circle .dx-loadindicator-segment2 .dx-loadindicator-segment-inner \| border-color` | rgb(179.93673,213.9946766586,249.99327) | var(--dx-load-indicator-segment-inner-border) |
| `.dx-loadindicator-content-sparkle .dx-loadindicator-segment \| background-color` | rgb(149.99605365,198.4447620098,249.99694635) | var(--dx-load-indicator-sparkle-stop-3-bg) |
| `.dx-loadindicator-content-sparkle .dx-loadindicator-segment0 \| background-color` | rgb(149.99605365,198.4447620098,249.99694635) | var(--dx-load-indicator-sparkle-stop-3-bg) |
| `.dx-loadindicator-content-sparkle .dx-loadindicator-segment1 \| background-color` | rgb(149.99605365,198.4447620098,249.99694635) | var(--dx-load-indicator-sparkle-stop-3-bg) |
| `.dx-loadindicator-content-sparkle .dx-loadindicator-segment2 \| background-color` | rgb(149.99605365,198.4447620098,249.99694635) | var(--dx-load-indicator-sparkle-stop-3-bg) |
| `.dx-button-mode-text.dx-button-default.dx-state-selected \| color` | rgb(9.9981135,46.3387823069,73.9988865) | var(--dx-button-default-text-content-selected) |
| `.dx-button-mode-text.dx-button-default.dx-state-selected .dx-icon \| color` | rgb(9.9981135,46.3387823069,73.9988865) | var(--dx-button-default-text-content-selected) |
| `.dx-button-mode-text.dx-button-default.dx-state-hover \| color` | rgb(9.9981135,46.3387823069,73.9988865) | var(--dx-button-default-text-content-hovered) |
| `.dx-button-mode-text.dx-button-default.dx-state-hover .dx-icon \| color` | rgb(9.9981135,46.3387823069,73.9988865) | var(--dx-button-default-text-content-hovered) |
| `.dx-button-mode-text.dx-button-danger.dx-state-selected \| color` | rgb(116.9947056446,29.0002943554,31.2421901844) | var(--dx-button-danger-text-content-selected) |
| `.dx-button-mode-text.dx-button-danger.dx-state-selected .dx-icon \| color` | rgb(116.9947056446,29.0002943554,31.2421901844) | var(--dx-button-danger-text-content-selected) |
| `.dx-button-mode-text.dx-button-danger.dx-state-hover \| color` | rgb(116.9947056446,29.0002943554,31.2421901844) | var(--dx-button-danger-text-content-hovered) |
| `.dx-button-mode-text.dx-button-danger.dx-state-hover .dx-icon \| color` | rgb(116.9947056446,29.0002943554,31.2421901844) | var(--dx-button-danger-text-content-hovered) |
| `.dx-button-mode-text.dx-button-success.dx-state-selected \| color` | rgb(8.9982395429,68.9857604571,8.9982395429) | var(--dx-button-success-text-content-selected) |
| `.dx-button-mode-text.dx-button-success.dx-state-selected .dx-icon \| color` | rgb(8.9982395429,68.9857604571,8.9982395429) | var(--dx-button-success-text-content-selected) |
| `.dx-button-mode-text.dx-button-success.dx-state-hover \| color` | rgb(8.9982395429,68.9857604571,8.9982395429) | var(--dx-button-success-text-content-hovered) |
| `.dx-button-mode-text.dx-button-success.dx-state-hover .dx-icon \| color` | rgb(8.9982395429,68.9857604571,8.9982395429) | var(--dx-button-success-text-content-hovered) |
| `.dx-button-mode-outlined.dx-button-default.dx-state-selected \| color` | rgb(9.9981135,46.3387823069,73.9988865) | var(--dx-button-default-outlined-content-selected) |
| `.dx-button-mode-outlined.dx-button-default.dx-state-selected .dx-icon \| color` | rgb(9.9981135,46.3387823069,73.9988865) | var(--dx-button-default-outlined-content-selected) |
| `.dx-button-mode-outlined.dx-button-default.dx-state-hover \| color` | rgb(9.9981135,46.3387823069,73.9988865) | var(--dx-button-default-outlined-content-hovered) |
| `.dx-button-mode-outlined.dx-button-default.dx-state-hover .dx-icon \| color` | rgb(9.9981135,46.3387823069,73.9988865) | var(--dx-button-default-outlined-content-hovered) |
| `.dx-button-mode-outlined.dx-button-danger.dx-state-selected \| color` | rgb(116.9947056446,29.0002943554,31.2421901844) | var(--dx-button-danger-outlined-content-selected) |
| `.dx-button-mode-outlined.dx-button-danger.dx-state-selected .dx-icon \| color` | rgb(116.9947056446,29.0002943554,31.2421901844) | var(--dx-button-danger-outlined-content-selected) |
| `.dx-button-mode-outlined.dx-button-danger.dx-state-hover \| color` | rgb(116.9947056446,29.0002943554,31.2421901844) | var(--dx-button-danger-outlined-content-hovered) |
| `.dx-button-mode-outlined.dx-button-danger.dx-state-hover .dx-icon \| color` | rgb(116.9947056446,29.0002943554,31.2421901844) | var(--dx-button-danger-outlined-content-hovered) |
| `.dx-button-mode-outlined.dx-button-success.dx-state-selected \| color` | rgb(8.9982395429,68.9857604571,8.9982395429) | var(--dx-button-success-outlined-content-selected) |
| `.dx-button-mode-outlined.dx-button-success.dx-state-selected .dx-icon \| color` | rgb(8.9982395429,68.9857604571,8.9982395429) | var(--dx-button-success-outlined-content-selected) |
| `.dx-button-mode-outlined.dx-button-success.dx-state-hover \| color` | rgb(8.9982395429,68.9857604571,8.9982395429) | var(--dx-button-success-outlined-content-hovered) |
| `.dx-button-mode-outlined.dx-button-success.dx-state-hover .dx-icon \| color` | rgb(8.9982395429,68.9857604571,8.9982395429) | var(--dx-button-success-outlined-content-hovered) |

**dark**

| Место | fluent | fluent-next |
|---|---|---|
| `.dx-loadindicator-segment-inner \| border-color` | #479ef5 #479ef5 transparent | var(--dx-load-indicator-segment-border) |
| `.dx-loadindicator-content-circle .dx-loadindicator-segment2 .dx-loadindicator-segment-inner \| border-color` | rgb(15.0027631469,83.7458736853,139.9902368531) | var(--dx-load-indicator-segment-inner-border) |
| `.dx-loadindicator-content-sparkle .dx-loadindicator-segment \| background-color` | rgb(16.9987449268,94.8576836715,162.9842550732) | var(--dx-load-indicator-sparkle-stop-3-bg) |
| `.dx-loadindicator-content-sparkle .dx-loadindicator-segment0 \| background-color` | rgb(16.9987449268,94.8576836715,162.9842550732) | var(--dx-load-indicator-sparkle-stop-3-bg) |
| `.dx-loadindicator-content-sparkle .dx-loadindicator-segment1 \| background-color` | rgb(16.9987449268,94.8576836715,162.9842550732) | var(--dx-load-indicator-sparkle-stop-3-bg) |
| `.dx-loadindicator-content-sparkle .dx-loadindicator-segment2 \| background-color` | rgb(16.9987449268,94.8576836715,162.9842550732) | var(--dx-load-indicator-sparkle-stop-3-bg) |
| `.dx-button-mode-text.dx-button-default.dx-state-selected \| color` | rgb(180.2287002062,214.0732610062,250.0112997938) | var(--dx-button-default-text-content-selected) |
| `.dx-button-mode-text.dx-button-default.dx-state-selected .dx-icon \| color` | rgb(180.2287002062,214.0732610062,250.0112997938) | var(--dx-button-default-text-content-selected) |
| `.dx-button-mode-text.dx-button-default.dx-state-hover \| color` | rgb(180.2287002062,214.0732610062,250.0112997938) | var(--dx-button-default-text-content-hovered) |
| `.dx-button-mode-text.dx-button-default.dx-state-hover .dx-icon \| color` | rgb(180.2287002062,214.0732610062,250.0112997938) | var(--dx-button-default-text-content-hovered) |
| `.dx-button-mode-text.dx-button-danger.dx-state-selected \| color` | rgb(252.9793270886,245.9048368256,245.9006729114) | var(--dx-button-danger-text-content-selected) |
| `.dx-button-mode-text.dx-button-danger.dx-state-selected .dx-icon \| color` | rgb(252.9793270886,245.9048368256,245.9006729114) | var(--dx-button-danger-text-content-selected) |
| `.dx-button-mode-text.dx-button-danger.dx-state-hover \| color` | rgb(252.9793270886,245.9048368256,245.9006729114) | var(--dx-button-danger-text-content-hovered) |
| `.dx-button-mode-text.dx-button-danger.dx-state-hover .dx-icon \| color` | rgb(252.9793270886,245.9048368256,245.9006729114) | var(--dx-button-danger-text-content-hovered) |
| `.dx-button-mode-text.dx-button-success.dx-state-selected \| color` | rgb(241.01911,250.01089,241.01911) | var(--dx-button-success-text-content-selected) |
| `.dx-button-mode-text.dx-button-success.dx-state-selected .dx-icon \| color` | rgb(241.01911,250.01089,241.01911) | var(--dx-button-success-text-content-selected) |
| `.dx-button-mode-text.dx-button-success.dx-state-hover \| color` | rgb(241.01911,250.01089,241.01911) | var(--dx-button-success-text-content-hovered) |
| `.dx-button-mode-text.dx-button-success.dx-state-hover .dx-icon \| color` | rgb(241.01911,250.01089,241.01911) | var(--dx-button-success-text-content-hovered) |
| `.dx-button-mode-outlined.dx-button-default.dx-state-selected \| color` | rgb(180.2287002062,214.0732610062,250.0112997938) | var(--dx-button-default-outlined-content-selected) |
| `.dx-button-mode-outlined.dx-button-default.dx-state-selected .dx-icon \| color` | rgb(180.2287002062,214.0732610062,250.0112997938) | var(--dx-button-default-outlined-content-selected) |
| `.dx-button-mode-outlined.dx-button-default.dx-state-hover \| color` | rgb(180.2287002062,214.0732610062,250.0112997938) | var(--dx-button-default-outlined-content-hovered) |
| `.dx-button-mode-outlined.dx-button-default.dx-state-hover .dx-icon \| color` | rgb(180.2287002062,214.0732610062,250.0112997938) | var(--dx-button-default-outlined-content-hovered) |
| `.dx-button-mode-outlined.dx-button-danger.dx-state-selected \| color` | rgb(252.9793270886,245.9048368256,245.9006729114) | var(--dx-button-danger-outlined-content-selected) |
| `.dx-button-mode-outlined.dx-button-danger.dx-state-selected .dx-icon \| color` | rgb(252.9793270886,245.9048368256,245.9006729114) | var(--dx-button-danger-outlined-content-selected) |
| `.dx-button-mode-outlined.dx-button-danger.dx-state-hover \| color` | rgb(252.9793270886,245.9048368256,245.9006729114) | var(--dx-button-danger-outlined-content-hovered) |
| `.dx-button-mode-outlined.dx-button-danger.dx-state-hover .dx-icon \| color` | rgb(252.9793270886,245.9048368256,245.9006729114) | var(--dx-button-danger-outlined-content-hovered) |
| `.dx-button-mode-outlined.dx-button-success.dx-state-selected \| color` | rgb(241.01911,250.01089,241.01911) | var(--dx-button-success-outlined-content-selected) |
| `.dx-button-mode-outlined.dx-button-success.dx-state-selected .dx-icon \| color` | rgb(241.01911,250.01089,241.01911) | var(--dx-button-success-outlined-content-selected) |
| `.dx-button-mode-outlined.dx-button-success.dx-state-hover \| color` | rgb(241.01911,250.01089,241.01911) | var(--dx-button-success-outlined-content-hovered) |
| `.dx-button-mode-outlined.dx-button-success.dx-state-hover .dx-icon \| color` | rgb(241.01911,250.01089,241.01911) | var(--dx-button-success-outlined-content-hovered) |

### Решение 6. Двухролевые переменные

Записи журнала: scheduler ячейка текущего времени.

**light**

| Место | fluent | fluent-next |
|---|---|---|
| `.dx-scheduler-header-panel-cell.dx-scheduler-header-panel-current-time-cell \| color` | rgb(111.99,111.99,111.99) | var(--dx-scheduler-panel-content) |
| `.dx-scheduler-header-panel-cell.dx-scheduler-header-panel-current-time-cell::before \| background-color` | #eb5757 | var(--dx-scheduler-time-indicator-content) |
| `.dx-scheduler-time-panel-cell.dx-scheduler-time-panel-current-time-cell \| color` | #0f6cbd | var(--dx-scheduler-current-time-cell-content) |
| `.dx-scheduler-time-panel-cell.dx-scheduler-time-panel-current-time-cell::before \| background-color` | #eb5757 | var(--dx-scheduler-time-indicator-content) |
| `.dx-scheduler-timeline .dx-scheduler-header-panel-cell.dx-scheduler-header-panel-current-time-cell::after \| background-color` | #eb5757 | var(--dx-scheduler-time-indicator-content) |
| `.dx-scheduler-header-panel-cell.dx-scheduler-header-panel-current-time-cell .dx-scheduler-header-panel-cell-date:last-child \| color` | #fff | var(--dx-scheduler-inverted-content) |
| `.dx-scheduler-header-panel-cell.dx-scheduler-header-panel-current-time-cell .dx-scheduler-header-panel-cell-date:last-child \| background-color` | #0f6cbd | var(--dx-scheduler-current-time-cell-date-bg) |
| `.dx-scheduler-work-space.dx-scheduler-work-space-month .dx-scheduler-header-panel-current-time-cell .dx-scheduler-header-panel-cell-date343 \| color` | #0f6cbd | var(--dx-scheduler-current-time-cell-content) |

**dark**

| Место | fluent | fluent-next |
|---|---|---|
| `.dx-scheduler-header-panel-cell.dx-scheduler-header-panel-current-time-cell \| color` | #999 | var(--dx-scheduler-panel-content) |
| `.dx-scheduler-header-panel-cell.dx-scheduler-header-panel-current-time-cell::before \| background-color` | #eb5757 | var(--dx-scheduler-time-indicator-content) |
| `.dx-scheduler-time-panel-cell.dx-scheduler-time-panel-current-time-cell \| color` | #479ef5 | var(--dx-scheduler-current-time-cell-content) |
| `.dx-scheduler-time-panel-cell.dx-scheduler-time-panel-current-time-cell::before \| background-color` | #eb5757 | var(--dx-scheduler-time-indicator-content) |
| `.dx-scheduler-timeline .dx-scheduler-header-panel-cell.dx-scheduler-header-panel-current-time-cell::after \| background-color` | #eb5757 | var(--dx-scheduler-time-indicator-content) |
| `.dx-scheduler-header-panel-cell.dx-scheduler-header-panel-current-time-cell .dx-scheduler-header-panel-cell-date:last-child \| color` | #000 | var(--dx-scheduler-inverted-content) |
| `.dx-scheduler-header-panel-cell.dx-scheduler-header-panel-current-time-cell .dx-scheduler-header-panel-cell-date:last-child \| background-color` | #479ef5 | var(--dx-scheduler-current-time-cell-date-bg) |
| `.dx-scheduler-work-space.dx-scheduler-work-space-month .dx-scheduler-header-panel-current-time-cell .dx-scheduler-header-panel-cell-date343 \| color` | #479ef5 | var(--dx-scheduler-current-time-cell-content) |

### Решение 7. Точечные

Записи журнала: button нейтральная кнопка на альфе; diagram канва/тени/format-active; gantt inverted/primary; gantt accent.

**light**

| Место | fluent | fluent-next |
|---|---|---|
| `.dx-diagram .dxdi-control .dxdi-canvas \| background-color` | rgb(216.75,216.75,216.75) | var(--dx-diagram-canvas-bg) |
| `.dx-diagram-toolbar .dx-format-active:not(.dx-color-format):not(.dx-background-format) \| background-color` | rgb(229.5,229.5,229.5) | var(--dx-diagram-normal-format-bg-active) |
| `.dx-diagram-toolbar .dx-format-active:not(.dx-color-format):not(.dx-background-format).dx-button-success \| background-color` | rgb(10.1714285714,78.8285714286,10.1714285714) | var(--dx-diagram-success-format-bg-active) |
| `.dx-diagram-toolbar .dx-format-active:not(.dx-color-format):not(.dx-background-format).dx-button-default \| background-color` | rgb(11.25,81,141.75) | var(--dx-diagram-default-format-bg-active) |
| `.dx-diagram-toolbar .dx-format-active:not(.dx-color-format):not(.dx-background-format).dx-button-danger \| background-color` | rgb(171.2048192771,38.7951807229,42.1686746988) | var(--dx-diagram-danger-format-bg-active) |
| `.dx-gantt .dx-gantt-taskWrapper .dx-gantt-task \| background-color` | #0f6cbd | var(--dx-gantt-task-bg) |
| `.dx-gantt .dx-gantt-taskWrapper .dx-gantt-task .dx-gantt-tPrg \| background-color` | rgba(0,0,0,.2) | var(--dx-gantt-task-progress-bg) |
| `.dx-gantt .dx-gantt-taskWrapper .dx-gantt-task.dx-gantt-parent \| background-color` | #107c10 | var(--dx-gantt-parent-task-bg) |
| `.dx-gantt .dx-gantt-taskWrapper .dx-gantt-task.dx-gantt-parent \| border-left-color` | #107c10 | var(--dx-gantt-parent-task-bg) |
| `.dx-gantt .dx-gantt-taskWrapper .dx-gantt-task.dx-gantt-parent \| border-right-color` | #107c10 | var(--dx-gantt-parent-task-bg) |
| `.dx-gantt .dx-gantt-taskWrapper .dx-gantt-task.dx-gantt-parent:not(.dx-gantt-noPrg) .dx-gantt-tPrg \| background-color` | rgba(0,0,0,.2) | var(--dx-gantt-task-progress-bg) |
| `.dx-gantt .dx-gantt-taskWrapper .dx-gantt-task.dx-gantt-parent:not(.dx-gantt-noPrg) .dx-gantt-tPrg::before \| border-left-color` | rgba(0,0,0,.2) | var(--dx-gantt-task-progress-bg) |
| `.dx-gantt .dx-gantt-taskWrapper .dx-gantt-task.dx-gantt-parent.dx-gantt-cmpl::after \| border-right-color` | rgba(0,0,0,.2) | var(--dx-gantt-task-progress-bg) |
| `.dx-gantt .dx-gantt-taskWrapper .dx-gantt-task.dx-gantt-parent.dx-gantt-cmpl .dx-gantt-tPrg::after \| border-right-color` | #107c10 | var(--dx-gantt-parent-task-bg) |
| `.dx-gantt .dx-gantt-taskWrapper .dx-gantt-titleIn \| color` | #fff | var(--dx-gantt-task-res-content) |
| `.dx-gantt .dx-gantt-tm \| border-left-color` | #0f6cbd | var(--dx-gantt-task-bg) |
| `.dx-gantt .dx-gantt-ti \| border-left-color` | #0f6cbd | var(--dx-gantt-task-bg) |
| `.dx-gantt .dx-gantt-ti \| border-right-color` | #0f6cbd | var(--dx-gantt-task-bg) |
| `.dx-gantt .dx-gantt-ti \| background-color` | rgba(15,108,189,.15) | var(--dx-gantt-ti-bg) |

**dark**

| Место | fluent | fluent-next |
|---|---|---|
| `.dx-diagram .dxdi-control .dxdi-canvas \| background-color` | rgb(2.75,2.75,2.75) | var(--dx-diagram-canvas-bg) |
| `.dx-diagram-toolbar .dx-format-active:not(.dx-color-format):not(.dx-background-format) \| background-color` | rgb(15.5,15.5,15.5) | var(--dx-diagram-normal-format-bg-active) |
| `.dx-diagram-toolbar .dx-format-active:not(.dx-color-format):not(.dx-background-format).dx-button-success \| background-color` | rgb(66.044,142.956,66.044) | var(--dx-diagram-success-format-bg-active) |
| `.dx-diagram-toolbar .dx-format-active:not(.dx-color-format):not(.dx-background-format).dx-button-default \| background-color` | rgb(22.6288659794,132.5,242.3711340206) | var(--dx-diagram-default-format-bg-active) |
| `.dx-diagram-toolbar .dx-format-active:not(.dx-color-format):not(.dx-background-format).dx-button-danger \| background-color` | rgb(217.9620253165,83.0379746835,87.0063291139) | var(--dx-diagram-danger-format-bg-active) |
| `.dx-gantt .dx-gantt-taskWrapper .dx-gantt-task \| background-color` | #479ef5 | var(--dx-gantt-task-bg) |
| `.dx-gantt .dx-gantt-taskWrapper .dx-gantt-task .dx-gantt-tPrg \| background-color` | rgba(255,255,255,.2) | var(--dx-gantt-task-progress-bg) |
| `.dx-gantt .dx-gantt-taskWrapper .dx-gantt-task.dx-gantt-parent \| background-color` | #54b054 | var(--dx-gantt-parent-task-bg) |
| `.dx-gantt .dx-gantt-taskWrapper .dx-gantt-task.dx-gantt-parent \| border-left-color` | #54b054 | var(--dx-gantt-parent-task-bg) |
| `.dx-gantt .dx-gantt-taskWrapper .dx-gantt-task.dx-gantt-parent \| border-right-color` | #54b054 | var(--dx-gantt-parent-task-bg) |
| `.dx-gantt .dx-gantt-taskWrapper .dx-gantt-task.dx-gantt-parent:not(.dx-gantt-noPrg) .dx-gantt-tPrg \| background-color` | rgba(255,255,255,.2) | var(--dx-gantt-task-progress-bg) |
| `.dx-gantt .dx-gantt-taskWrapper .dx-gantt-task.dx-gantt-parent:not(.dx-gantt-noPrg) .dx-gantt-tPrg::before \| border-left-color` | rgba(255,255,255,.2) | var(--dx-gantt-task-progress-bg) |
| `.dx-gantt .dx-gantt-taskWrapper .dx-gantt-task.dx-gantt-parent.dx-gantt-cmpl::after \| border-right-color` | rgba(255,255,255,.2) | var(--dx-gantt-task-progress-bg) |
| `.dx-gantt .dx-gantt-taskWrapper .dx-gantt-task.dx-gantt-parent.dx-gantt-cmpl .dx-gantt-tPrg::after \| border-right-color` | #54b054 | var(--dx-gantt-parent-task-bg) |
| `.dx-gantt .dx-gantt-taskWrapper .dx-gantt-titleIn \| color` | #000 | var(--dx-gantt-task-res-content) |
| `.dx-gantt .dx-gantt-tm \| border-left-color` | #479ef5 | var(--dx-gantt-task-bg) |
| `.dx-gantt .dx-gantt-ti \| border-left-color` | #479ef5 | var(--dx-gantt-task-bg) |
| `.dx-gantt .dx-gantt-ti \| border-right-color` | #479ef5 | var(--dx-gantt-task-bg) |
| `.dx-gantt .dx-gantt-ti \| background-color` | rgba(71,158,245,.15) | var(--dx-gantt-ti-bg) |

