export const widgetIds = [
    'accordion', 'actionSheet', 'autocomplete', 'barGauge', 'box',
    'bullet', 'button', 'buttonGroup', 'calendar', 'cardView', 'chat', 'checkBox',
    'chart', 'circularGauge', 'colorBox', 'contextMenu', 'dataGrid',
    'dateBox', 'dateRangeBox', 'diagram', 'draggable', 'drawer',
    'dropDownBox', 'dropDownButton', 'fileManager', 'fileUploader',
    'filterBuilder', 'form', 'funnel', 'gallery', 'gantt',
    'htmlEditor', 'linearGauge', 'list', 'loadIndicator', 'loadPanel',
    'lookup', 'map', 'menu', 'multiView', 'numberBox', 'pagination',
    'pieChart', 'pivotGrid', 'pivotGridFieldChooser', 'polarChart',
    'popover', 'popup', 'progressBar', 'radioGroup', 'rangeSelector',
    'rangeSlider', 'recurrenceEditor', 'resizable', 'responsiveBox',
    'sankey', 'scheduler', 'scrollView', 'selectBox', 'slider',
    'sortable', 'sparkline', 'speedDialAction', 'splitter', 'stepper',
    'switch', 'tabPanel', 'tabs', 'tagBox', 'textArea', 'textBox',
    'tileView', 'toast', 'toolbar', 'tooltip', 'treeList', 'treeMap',
    'treeView', 'validationGroup', 'validationSummary', 'validator',
    'vectorMap',
] as const;

export type WidgetId = typeof widgetIds[number];
