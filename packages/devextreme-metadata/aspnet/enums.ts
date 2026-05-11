export const enums = {
  AnimationEasing: {
    Items: [
      'ease',
      'ease-in',
      'ease-in-out',
      'ease-out',
      'linear',
      'step-end',
      'step-start',
      'swing',
    ],
  },
  EdmType: {
    Items: ['Guid', 'Int32', 'Int64', 'String', 'Boolean', 'Single', 'Decimal'],
  },
  FilterOperations: {
    Items: [
      '=',
      '<>',
      '<',
      '<=',
      '>',
      '>=',
      'between',
      'contains',
      'endswith',
      'notcontains',
      'startswith',
    ],
  },
  GaugeIndicatorType: {
    Items: [
      'circle',
      'rangeBar',
      'rectangle',
      'rectangleNeedle',
      'rhombus',
      'textCloud',
      'triangleMarker',
      'triangleNeedle',
      'twoColorNeedle',
    ],
    Options: ['GaugeIndicator.type'],
  },
  GeoMapProvider: {
    Items: ['bing', 'google', 'googleStatic', 'azure'],
  },
  SchedulerViewType: {
    Items: [
      'agenda',
      'day',
      'month',
      'timelineDay',
      'timelineMonth',
      'timelineWeek',
      'timelineWorkWeek',
      'week',
      'workWeek',
    ],
    Options: ['dxScheduler.views'],
  },
  ShowScrollbarMode: {
    Items: ['always', 'never', 'onHover', 'onScroll'],
    Options: ['dxScrollView.showScrollbar'],
  },
  TextEditorButtonWidget: {
    Items: ['dxButton'],
  },
  DiagramDataLayoutOrientation: {
    Items: ['vertical', 'horizontal'],
  },
  GanttSortingMode: {
    Items: ['multiple', 'none', 'single'],
  },
  GridSortingMode: {
    Items: ['multiple', 'none', 'single'],
  },
  PieChartLegendHoverMode: {
    Items: ['none', 'allArgumentPoints'],
  },
  PolarChartOverlappingBehavior: {
    Items: ['none', 'hide'],
  },
  SelectionMode: {
    Items: ['multiple', 'none', 'single'],
  },
  PolarChartResolveLabelOverlapping: {
    Items: ['hide', 'none'],
  },
  ButtonGroupSelectionMode: {
    Items: ['multiple', 'single', 'none'],
  },
  ChartElementSelectionMode: {
    Items: ['multiple', 'single'],
  },
  FileManagerSelectionMode: {
    Items: ['multiple', 'single'],
  },
  ListSelectionMode: {
    Items: ['all', 'multiple', 'none', 'single'],
  },
  MenuSelectionMode: {
    Items: ['none', 'single'],
  },
  NavSelectionMode: {
    Items: ['multiple', 'single'],
  },
};

export const enumAliases = {
  '(dxTabs|dxNavBar|dxTreeView)\\.(.*)': {
    'SingleOrMultiple': 'NavSelectionMode',
  },

  '(dxSlider|dxRangeSlider)(.*)': {
    'TooltipShowMode': 'SliderTooltipShowMode',
  },

  '(dxMenu|dxContextMenu)(.*)': {
    'SingleOrNone': 'MenuSelectionMode',
  },

  'dxMap(.*)': {
    'MapProvider': 'GeoMapProvider',
    'MapType': 'GeoMapType',
    'RouteMode': 'GeoMapRouteMode',
  },

  'dxScheduler(.*)': {
    'CellAppointmentsLimit': 'MaxAppointmentsPerCell',
    'RecurrenceEditMode': 'SchedulerRecurrenceEditMode',
    'ScrollMode': 'SchedulerScrollingMode',
    'ViewType': 'SchedulerViewType',
  },

  'dxContextMenu(.*)': {
    'ContextSubmenuDirection': 'ContextMenuSubmenuDirection',
  },

  'dxDateBox(.*)': {
    'DatePickerType': 'DateBoxPickerType',
    'DateType': 'DateBoxType',
  },

  'dxNumberBox(.*)': {
    'DateType': 'DateBoxType',
    'NumberBoxPredefinedButton': 'NumberBoxButtonName',
    'NumberBoxType': 'NumberBoxMode',
  },

  'dxTextBox(.*)': {
    'TextBoxType': 'TextBoxMode',
  },

  'dxHtmlEditor(.*)': {
    'HtmlEditorImageUploadMode': 'HtmlEditorImageUploadFileUploadMode',
    'HtmlEditorPredefinedContextMenuItem': 'HtmlEditorContextMenuItem',
    'HtmlEditorPredefinedToolbarItem': 'HtmlEditorToolbarItem',
    'MarkupType': 'HtmlEditorValueType',
  },

  'dxTreeView(.*)': {
    'DataStructure': 'TreeViewDataStructure',
  },

  'dxButtonGroup\\.(.*)': {
    'SingleMultipleOrNone': 'ButtonGroupSelectionMode',
  },

  'dxFileManager(.*)': {
    'DataType': 'GridColumnDataType',
    'FileManagerPredefinedContextMenuItem': 'FileManagerContextMenuItem',
    'FileManagerPredefinedToolbarItem': 'FileManagerToolbarItem',
    'SingleOrMultiple': 'FileManagerSelectionMode',
  },

  'dxDrawer(.*)': {
    'OpenedStateMode': 'DrawerOpenedStateMode',
    'PanelLocation': 'DrawerPosition',
    'RevealMode': 'DrawerRevealMode',
  },

  'dxList(.*)': {
    'ItemDeleteMode': 'ListItemDeleteMode',
    'SingleMultipleAllOrNone': 'ListSelectionMode',
  },

  'dxForm(.*)': {
    'FormItemComponent': 'FormItemEditorType',
    'LabelLocation': 'FormLabelLocation',
  },

  'dxBox(.*)': {
    'CrosswiseDistribution': 'BoxCrossAlign',
    'Distribution': 'BoxAlign',
  },

  'dxDiagram(.*)': {
    'Orientation': 'DiagramDataLayoutOrientation',
    'PageOrientation': 'DiagramPageOrientation',
    'AutoZoomMode': 'DiagramAutoZoomMode',
    'Command': 'DiagramCommand',
    'ConnectorLineEnd': 'DiagramConnectorLineEnd',
    'ConnectorLineType': 'DiagramConnectorLineType',
    'ConnectorPosition': 'DiagramConnectorPosition',
    'DataLayoutType': 'DiagramDataLayoutType',
    'ItemType': 'DiagramItemType',
    'ModelOperation': 'DiagramModelOperation',
    'PanelVisibility': 'DiagramPanelVisibility',
    'RequestEditOperationReason': 'DiagramRequestEditOperationReason',
    'ShapeCategory': 'DiagramShapeCategory',
    'ShapeType': 'DiagramShapeType',
    'ToolboxDisplayMode': 'DiagramToolboxDisplayMode',
    'Units': 'DiagramUnits',
  },

  'CustomCommand(.*)': {
    'Command': 'DiagramCommand',
  },

  'ColumnProperties.dataType': {
    'DataType': 'GridColumnDataType',
  },

  '(dxDataGrid|dxTreeList|dxGantt)(.*)': {
    'ApplyFilterMode': 'GridApplyFilterMode',
    'ColumnResizeMode': 'ColumnResizingMode',
    'DataType': 'GridColumnDataType',
    'EnterKeyAction': 'GridEnterKeyAction',
    'EnterKeyDirection': 'GridEnterKeyDirection',
    'FilterOperation': 'GridFilterOperations',
    'GridsEditMode': 'GridEditMode',
    'GridsEditRefreshMode': 'GridEditRefreshMode',
    'GroupExpandMode': 'GridGroupingExpandMode',
    'NewRowPosition': 'GridNewRowPosition',
    'PagerDisplayMode': 'GridPagerDisplayMode',
    'PagerPageSize': 'GridPagerPageSize',
    'SelectedFilterOperation': 'FilterOperations',
    'SelectionColumnDisplayMode': 'GridSelectionShowCheckBoxesMode',
    'StartEditAction': 'GridStartEditAction',
    'StateStoreType': 'StateStoringType',
  },

  'ColumnChooser.mode': {
    'ColumnChooserMode': 'GridColumnChooserMode',
  },

  'Sorting.mode': {
    'SingleMultipleOrNone': 'GridSortingMode',
  },

  '(dxDataGrid|dxTreeList)(.*)\\.columnRenderingMode': {
    'DataRenderMode': 'GridColumnRenderingMode',
  },

  '(dxDataGrid|dxTreeList)(.*)\\.rowRenderingMode': { 'DataRenderMode': 'GridRowRenderingMode' },

  '(dxDataGrid|dxTreeList)(.*)selection(.*)': { 'SingleMultipleOrNone': 'SelectionMode' },

  'dxDataGrid(.*)': {
    'DataGridCommandColumnType': 'GridCommandColumnType',
    'DataGridPredefinedColumnButton': 'GridColumnButtonName',
    'DataGridPredefinedToolbarItem': 'DataGridToolbarItem',
    'DataGridScrollMode': 'GridScrollingMode',
  },

  'dxTreeList(.*)': {
    'DataStructure': 'TreeListDataStructure',
    'ScrollMode': 'TreeListScrollingMode',
    'TreeListPredefinedColumnButton': 'TreeListColumnButtonName',
    'TreeListPredefinedToolbarItem': 'TreeListToolbarItem',
  },

  'dxGantt(.*)': {
    'GanttPredefinedContextMenuItem': 'GanttContextMenuItem',
    'GanttPredefinedToolbarItem': 'GanttToolbarItem',
    'SingleMultipleOrNone': 'GanttSortingMode',
  },

  'dxFilterBuilder(.*)': {
    'DataType': 'FilterBuilderFieldDataType',
    'FilterBuilderOperation': 'FilterBuilderFieldFilterOperations',
    'GroupOperation': 'FilterBuilderGroupOperations',
    'RouteMode': 'GeoMapRouteMode',
  },

  'dxPivotGrid(.*)': {
    'PivotGridRowHeaderLayout': 'PivotGridRowHeadersLayout',
    'PivotGridTotalDisplayMode': 'PivotGridTotalsDisplayMode',
    'ScrollMode': 'PivotGridScrollingMode',
    'StateStoreType': 'StateStoringType',
  },

  '(dxChart|dxPolarChart|dxPieChart)\\.(.*)': {
    'SingleOrMultiple': 'ChartElementSelectionMode',
  },

  'dxChart(.*)': {
    'ChartsAxisLabelOverlap': 'OverlappingBehavior',
    'ChartsLabelOverlap': 'ChartResolveLabelOverlapping',
  },

  'dxPieChart(.*)': {
    'PieChartLabelOverlap': 'PieChartResolveLabelOverlapping',
    'PieChartSegmentDirection': 'PieChartSegmentsDirection',
  },

  'dxCircularGauge(.*)': {
    'CircularGaugeLabelOverlap': 'GaugeOverlappingBehavior',
  },

  'dxFunnel(.*)': {
    'FunnelLabelOverlap': 'FunnelResolveLabelOverlapping',
    'LabelPosition': 'FunnelLabelPosition',
  },

  'dxSankey\\.(.*)\\.overlappingBehavior': {
    'TextOverflow': 'SankeyLabelOverlappingBehavior',
  },

  'dxBarGauge(.*)': {
    'LabelOverlap': 'BarGaugeResolveLabelOverlapping',
  },

  'dxPolarChart(.*)\\.overlappingBehavior': {
    'LabelOverlap': 'PolarChartOverlappingBehavior',
  },

  'dxPolarChart(.*)\\.resolveLabelOverlapping': {
    'LabelOverlap': 'PolarChartResolveLabelOverlapping',
  },

  '(dxCircularGauge|dxLinearGauge|dxRangeSelector)(.*)\\.overlappingBehavior': {
    'LabelOverlap': 'ScaleLabelOverlappingBehavior',
  },

  '(dxSparkline|PolarChart)(.*)\\.(pointSymbol|point\\.symbol)': {
    'PointSymbol': 'VizPointSymbol',
  },

  '(.*)\\.overlappingBehavior': {
    'PolarChartOverlapping': 'PolarChartOverlappingBehavior',
  },

  '(.*)\\.resolveLabelOverlapping': {
    'PolarChartOverlapping': 'PolarChartResolveLabelOverlapping',
  },

  '(.*)selection(.*)': { 'SingleMultipleOrNone': 'SelectionMode' },

  '.*': {
    'AnimationEaseMode': 'VizAnimationEasing',
    'ApplyValueMode': 'EditorApplyValueMode',
    'AxisScale': 'RangeSelectorAxisScaleType',
    'ButtonStyle': 'ButtonStylingMode',
    'ChartAxisScale': 'RangeSelectorChartAxisScaleType',
    'ChartsDataType': 'ChartDataType',
    'CollisionResolution': 'PositionResolveCollision',
    'CollisionResolutionCombination': 'PositionResolveCollisionXY',
    'DataChangeType': 'GridDataChangeType',
    'DisplayMode': 'GridPagerDisplayMode',
    'DragHighlight': 'DropFeedbackMode',
    'DropDownPredefinedButton': 'DropDownEditorButtonName',
    'EditorStyle': 'EditorStylingMode',
    'FieldChooserLayout': 'PivotGridFieldChooserLayout',
    'HatchDirection': 'HatchingDirection',
    'LabelMode': 'EditorLabelMode',
    'LabelPosition': 'PieChartLabelPosition',
    'LegendHoverMode': 'ChartLegendHoverMode',
    'LocateInMenuMode': 'ToolbarItemLocateInMenuMode',
    'MaskMode': 'ShowMaskMode',
    'PageLoadMode': 'ListPageLoadMode',
    'Palette': 'VizPalette',
    'PaletteColorSet': 'VizPaletteColorSet',
    'PaletteExtensionMode': 'VizPaletteExtensionMode',
    'PointInteractionMode': 'ChartPointInteractionMode',
    'ScrollbarMode': 'ShowScrollbarMode',
    'SearchMode': 'CollectionSearchMode',
    'SeriesHoverMode': 'ChartSeriesHoverMode',
    'SeriesSelectionMode': 'ChartSeriesSelectionMode',
    'ShowTextMode': 'ToolbarItemShowTextMode',
    'SimplifiedSearchMode': 'DropDownSearchMode',
    'SubmenuShowMode': 'ShowSubmenuMode',
    'TextBoxPredefinedButton': 'TextBoxButtonName',
    'TextOverflow': 'VizTextOverflow',
    'Theme': 'VizTheme',
    'TimeInterval': 'VizTimeInterval',
    'ToolbarItemComponent': 'ToolbarItemWidget',
    'ToolbarLocation': 'Toolbar',
    'WordWrap': 'VizWordWrap',
  },
};

export const enumItemRenamings = {
  '.*': {
    'dx(.*)': '$1',
  },

  '(.*FilterOperations|.*SearchMode|ComparisonOperator)': {
    '>=': 'greaterThanOrEqual',
    '<=': 'lessThanOrEqual',
    '<>': 'notEqual',
    '===': 'strictEqual',
    '!==': 'notStrictEqual',
    '==': 'equal',
    '!=': 'notEqual',
    '=': 'equal',
    '>': 'greaterThan',
    '<': 'lessThan',
    'startswith': 'startsWith',
    'endswith': 'endsWith',
    'isblank': 'isBlank',
    'isnotblank': 'isNotBlank',
    'anyof': 'anyOf',
    'noneof': 'noneOf',
    'notcontains': 'notContains',
  },

  '(.*Data|DateBox)Type': {
    'datetime': 'DateTime',
  },

  'GaugeOverlappingBehavior': {
    'first': 'HideFirstLabel',
    'last': 'HideLastLabel',
  },

  'PieChartSegmentsDirection': {
    'anticlockwise': 'AntiClockwise',
  },

  'PivotGridFieldChooserLayout': {
    '0': 'Layout0',
    '1': 'Layout1',
    '2': 'Layout2',
  },

  'PositionResolveCollision': {
    'flipfit': 'flipFit',
  },

  '(Series|Sparkline)Type': {
    'fullstackedarea': 'FullStackedArea',
    'fullstackedbar': 'FullStackedBar',
    'fullstackedline': 'FullStackedLine',
    'fullstackedspline': 'FullStackedSpline',
    'fullstackedsplinearea': 'FullStackedSplineArea',
    'rangearea': 'RangeArea',
    'rangebar': 'RangeBar',
    'splinearea': 'SplineArea',
    'stackedarea': 'StackedArea',
    'stackedbar': 'StackedBar',
    'stackedline': 'StackedLine',
    'stackedspline': 'StackedSpline',
    'stackedsplinearea': 'StackedSplineArea',
    'steparea': 'StepArea',
    'stepline': 'StepLine',
    'winloss': 'WinLoss',
  },

  'TextEditorButtonWidget': {
    'dxButton': 'Button',
  },

  'TreeMapLayoutAlgorithm': {
    'sliceanddice': 'SliceAndDice',
  },

  'TreeViewExpandEvent': {
    'dblclick': 'dblClick',
  },

  'VizTheme': {
    'ios7.default': 'iOS7Default',
    'generic.darkmoon': 'genericDarkMoon',
    'generic.darkviolet': 'genericDarkViolet',
    'generic.greenmist': 'genericGreenMist',
    'generic.softblue': 'genericSoftBlue',
  },

  'PointSymbol': {
    '^triangle$': null,
  },

  'VizPointSymbol': {
    '^triangleDown$': null,
    '^triangleUp$': null,
  },
};
