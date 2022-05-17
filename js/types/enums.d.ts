/** @namespace DevExpress */
export type ButtonType = 'back' | 'danger' | 'default' | 'normal' | 'success';

/** @namespace DevExpress */
export type ButtonStylingMode = 'text' | 'outlined' | 'contained';

/** @namespace DevExpress */
export type EventKeyModifier = 'alt' | 'ctrl' | 'meta' | 'shift';

/** @namespace DevExpress */
export type FirstDayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** @namespace DevExpress */
export type PivotGridFieldChooserLayout = 0 | 1 | 2;

/** @namespace DevExpress */
export type DropDownSearchMode = 'contains' | 'startswith';

/** @namespace DevExpress */
export type ValidationMessageMode = 'always' | 'auto';

/** @namespace DevExpress */
export type VizAnimationEasing = 'easeOutCubic' | 'linear';

/** @namespace DevExpress */
export type Format = 'billions' | 'currency' | 'day' | 'decimal' | 'exponential' | 'fixedPoint' | 'largeNumber' | 'longDate' | 'longTime' | 'millions' | 'millisecond' | 'month' | 'monthAndDay' | 'monthAndYear' | 'percent' | 'quarter' | 'quarterAndYear' | 'shortDate' | 'shortTime' | 'thousands' | 'trillions' | 'year' | 'dayOfWeek' | 'hour' | 'longDateLongTime' | 'minute' | 'second' | 'shortDateShortTime';

/** @namespace DevExpress */
export type VizTheme = 'generic.dark' | 'generic.light' | 'generic.contrast' | 'generic.carmine' | 'generic.darkmoon' | 'generic.darkviolet' | 'generic.greenmist' | 'generic.softblue' | 'material.blue.light' | 'material.lime.light' | 'material.orange.light' | 'material.purple.light' | 'material.teal.light';

/** @namespace DevExpress */
export type VizPalette = 'Bright' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';

/** @namespace DevExpress */
export type VizWordWrap = 'normal' | 'breakWord' | 'none';

/** @namespace DevExpress */
export type VizTextOverflow = 'ellipsis' | 'hide' | 'none';

/** @namespace DevExpress */
export type VizPaletteExtensionMode = 'alternate' | 'blend' | 'extrapolate';

/** @namespace DevExpress */
export type VizPaletteColorSet = 'simpleSet' | 'indicatingSet' | 'gradientSet';

/** @namespace DevExpress */
export type CircularGaugeElementOrientation = 'center' | 'inside' | 'outside';

/** @namespace DevExpress */
export type GaugeOverlappingBehavior = 'first' | 'last';

/** @namespace DevExpress */
export type ScaleLabelOverlappingBehavior = 'hide' | 'none';

/** @namespace DevExpress */
export type BarGaugeResolveLabelOverlapping = 'hide' | 'none';

/** @namespace DevExpress */
export type OverlappingBehavior = 'rotate' | 'stagger' | 'none' | 'hide';

/** @namespace DevExpress */
export type PolarChartOverlappingBehavior = 'none' | 'hide';

/** @namespace DevExpress */
export type Orientation = 'horizontal' | 'vertical';

/** @namespace DevExpress */
export type DropFeedbackMode = 'push' | 'indicate';

/** @namespace DevExpress */
export type VerticalAlignment = 'bottom' | 'center' | 'top';

/** @namespace DevExpress */
export type HorizontalAlignment = 'center' | 'left' | 'right';

/** @namespace DevExpress */
export type VerticalEdge = 'bottom' | 'top';

/** @namespace DevExpress */
export type DashStyle = 'dash' | 'dot' | 'longDash' | 'solid';

/** @namespace DevExpress */
export type ResizeHandle = 'bottom' | 'left' | 'right' | 'top' | 'all';

/** @namespace DevExpress */
export type BoxDirection = 'col' | 'row';

/** @namespace DevExpress */
export type BoxAlign = 'center' | 'end' | 'space-around' | 'space-between' | 'start';

/** @namespace DevExpress */
export type BoxCrossAlign = 'center' | 'end' | 'start' | 'stretch';

/** @namespace DevExpress */
export type ButtonGroupSelectionMode = 'multiple' | 'single' | 'none';

// eslint-disable-next-line @typescript-eslint/no-type-alias
/** @namespace DevExpress */
export type Mode = 'auto';

/** @namespace DevExpress */
export type SparklineType = 'area' | 'bar' | 'line' | 'spline' | 'splinearea' | 'steparea' | 'stepline' | 'winloss';

/** @namespace DevExpress */
export type VizPointSymbol = 'circle' | 'cross' | 'polygon' | 'square' | 'triangle';

/** @namespace DevExpress */
export type CalendarZoomLevel = 'century' | 'decade' | 'month' | 'year';

/** @namespace DevExpress */
export type ChartResolveLabelOverlapping = 'hide' | 'none' | 'stack';

/** @namespace DevExpress */
export type FunnelResolveLabelOverlapping = 'hide' | 'none' | 'shift';

/** @namespace DevExpress */
export type ChartElementSelectionMode = 'multiple' | 'single';

/** @namespace DevExpress */
export type SeriesType = 'area' | 'bar' | 'bubble' | 'candlestick' | 'fullstackedarea' | 'fullstackedbar' | 'fullstackedline' | 'fullstackedspline' | 'fullstackedsplinearea' | 'line' | 'rangearea' | 'rangebar' | 'scatter' | 'spline' | 'splinearea' | 'stackedarea' | 'stackedbar' | 'stackedline' | 'stackedspline' | 'stackedsplinearea' | 'steparea' | 'stepline' | 'stock';

/** @namespace DevExpress */
export type AnnotationType = 'text' | 'image' | 'custom';

/** @namespace DevExpress */
export type Position = 'bottom' | 'left' | 'right' | 'top';

/** @namespace DevExpress */
export type ChartZoomAndPanMode = 'both' | 'none' | 'pan' | 'zoom';

/** @namespace DevExpress */
export type ChartLegendHoverMode = 'excludePoints' | 'includePoints' | 'none';

/** @namespace DevExpress */
export type RelativePosition = 'inside' | 'outside';

/** @namespace DevExpress */
export type DiscreteAxisDivisionMode = 'betweenLabels' | 'crossLabels';

/** @namespace DevExpress */
export type AggregatedPointsPosition = 'betweenTicks' | 'crossTicks';

/** @namespace DevExpress */
export type ScaleBreakLineStyle = 'straight' | 'waved';

/** @namespace DevExpress */
export type ChartLabelDisplayMode = 'rotate' | 'stagger' | 'standard';

/** @namespace DevExpress */
export type VizTimeInterval = 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';

/** @namespace DevExpress */
export type VisualRangeUpdateMode = 'auto' | 'keep' | 'reset' | 'shift';

/** @namespace DevExpress */
export type ValueAxisVisualRangeUpdateMode = 'auto' | 'keep' | 'reset';

/** @namespace DevExpress */
export type ChartZoomPanAction = 'zoom' | 'pan';

/** @namespace DevExpress */
export type AxisScaleType = 'continuous' | 'discrete' | 'logarithmic';

/** @namespace DevExpress */
export type ChartDataType = 'datetime' | 'numeric' | 'string';

/** @namespace DevExpress */
export type ArgumentAxisHoverMode = 'allArgumentPoints' | 'none';

/** @namespace DevExpress */
export type ChartTooltipLocation = 'center' | 'edge';

/** @namespace DevExpress */
export type PieChartLegendHoverMode = 'none' | 'allArgumentPoints';

/** @namespace DevExpress */
export type PieChartResolveLabelOverlapping = 'hide' | 'none' | 'shift';

/** @namespace DevExpress */
export type PieChartType = 'donut' | 'doughnut' | 'pie';

/** @namespace DevExpress */
export type PieChartSegmentsDirection = 'anticlockwise' | 'clockwise';

/** @namespace DevExpress */
export type PieChartAnnotationLocation = 'center' | 'edge';

/** @namespace DevExpress */
export type PolarChartResolveLabelOverlapping = 'hide' | 'none';

/** @namespace DevExpress */
export type PolarChartSeriesType = 'area' | 'bar' | 'line' | 'scatter' | 'stackedbar';

/** @namespace DevExpress */
export type EditorApplyValueMode = 'instantly' | 'useButtons';

/** @namespace DevExpress */
export type ShowSubmenuMode = 'onClick' | 'onHover';

/** @namespace DevExpress */
export type MenuSelectionMode = 'none' | 'single';

/** @namespace DevExpress */
export type ContextMenuSubmenuDirection = 'auto' | 'left' | 'right';

/** @namespace DevExpress */
export type GridColumnChooserMode = 'dragAndDrop' | 'select';

/** @namespace DevExpress */
export type ColumnResizingMode = 'nextColumn' | 'widget';

/** @namespace DevExpress */
export type HorizontalEdge = 'left' | 'right';

/** @namespace DevExpress */
export type GridColumnDataType = 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime';

/** @namespace DevExpress */
export type SortOrder = 'asc' | 'desc';

/** @namespace DevExpress */
export type FilterBuilderFieldFilterOperations = '=' | '<>' | '<' | '<=' | '>' | '>=' | 'contains' | 'endswith' | 'isblank' | 'isnotblank' | 'notcontains' | 'startswith' | 'between';

/** @namespace DevExpress */
export type FilterBuilderGroupOperations = 'and' | 'or' | 'notAnd' | 'notOr';

/** @namespace DevExpress */
export type FilterOperations = '<' | '<=' | '<>' | '=' | '>' | '>=' | 'between' | 'contains' | 'endswith' | 'notcontains' | 'startswith';

/** @namespace DevExpress */
export type GridFilterOperations = '=' | '<>' | '<' | '<=' | '>' | '>=' | 'contains' | 'endswith' | 'isblank' | 'isnotblank' | 'notcontains' | 'startswith' | 'between' | 'anyof' | 'noneof';

/** @namespace DevExpress */
export type FilterType = 'exclude' | 'include';

/** @namespace DevExpress */
export type HeaderFilterGroupInterval = 'day' | 'hour' | 'minute' | 'month' | 'quarter' | 'second' | 'year';

/** @namespace DevExpress */
export type GridEditMode = 'batch' | 'cell' | 'row' | 'form' | 'popup';

/** @namespace DevExpress */
export type GridEnterKeyAction = 'startEdit' | 'moveFocus';

/** @namespace DevExpress */
export type GridEnterKeyDirection = 'none' | 'column' | 'row';

/** @namespace DevExpress */
export type GridEditRefreshMode = 'full' | 'reshape' | 'repaint';

/** @namespace DevExpress */
export type GridApplyFilterMode = 'auto' | 'onClick';

/** @namespace DevExpress */
export type GridGroupingExpandMode = 'buttonClick' | 'rowClick';

/** @namespace DevExpress */
export type GridScrollingMode = 'infinite' | 'standard' | 'virtual';

/** @namespace DevExpress */
export type ShowScrollbarMode = 'always' | 'never' | 'onHover' | 'onScroll';

/** @namespace DevExpress */
export type SelectionMode = 'multiple' | 'none' | 'single';

/** @namespace DevExpress */
export type GridSelectionShowCheckBoxesMode = 'always' | 'none' | 'onClick' | 'onLongTap';

/** @namespace DevExpress */
export type SelectAllMode = 'allPages' | 'page';

/** @namespace DevExpress */
export type SummaryType = 'avg' | 'count' | 'custom' | 'max' | 'min' | 'sum';

/** @namespace DevExpress */
export type GridSortingMode = 'multiple' | 'none' | 'single';

/** @namespace DevExpress */
export type StateStoringType = 'custom' | 'localStorage' | 'sessionStorage';

/** @namespace DevExpress */
export type DateBoxType = 'date' | 'datetime' | 'time';

/** @namespace DevExpress */
export type DateBoxPickerType = 'calendar' | 'list' | 'native' | 'rollers';

/** @namespace DevExpress */
export type FileUploadMode = 'instantly' | 'useButtons' | 'useForm';

/** @namespace DevExpress */
export type UploadHttpMethod = 'POST' | 'PUT';

/** @namespace DevExpress */
export type FormLabelLocation = 'left' | 'right' | 'top';

/** @namespace DevExpress */
export type FormItemEditorType = 'dxAutocomplete' | 'dxCalendar' | 'dxCheckBox' | 'dxColorBox' | 'dxDateBox' | 'dxDropDownBox' | 'dxHtmlEditor' | 'dxLookup' | 'dxNumberBox' | 'dxRadioGroup' | 'dxRangeSlider' | 'dxSelectBox' | 'dxSlider' | 'dxSwitch' | 'dxTagBox' | 'dxTextArea' | 'dxTextBox';

/** @namespace DevExpress */
export type FormItemType = 'empty' | 'group' | 'simple' | 'tabbed' | 'button';

/** @namespace DevExpress */
export type FunnelAlgorithm = 'dynamicHeight' | 'dynamicSlope';

/** @namespace DevExpress */
export type HatchingDirection = 'left' | 'none' | 'right';

/** @namespace DevExpress */
export type FunnelLabelPosition = 'columns' | 'inside' | 'outside';

/** @namespace DevExpress */
export type SankeyLabelOverlappingBehavior = 'ellipsis' | 'hide' | 'none';

/** @namespace DevExpress */
export type SankeyColorMode = 'none' | 'source' | 'target' | 'gradient';

/** @namespace DevExpress */
export type ListSelectionMode = 'all' | 'multiple' | 'none' | 'single';

/** @namespace DevExpress */
export type ListMenuMode = 'context' | 'slide';

/** @namespace DevExpress */
export type ListItemDeleteMode = 'context' | 'slideButton' | 'slideItem' | 'static' | 'swipe' | 'toggle';

/** @namespace DevExpress */
export type ListPageLoadMode = 'nextButton' | 'scrollBottom';

/** @namespace DevExpress */
export type CollectionSearchMode = 'contains' | 'startswith' | 'equals';

/** @namespace DevExpress */
export type GeoMapType = 'hybrid' | 'roadmap' | 'satellite';

/** @namespace DevExpress */
export type GeoMapProvider = 'bing' | 'google' | 'googleStatic';

/** @namespace DevExpress */
export type GeoMapRouteMode = 'driving' | 'walking';

/** @namespace DevExpress */
export type SubmenuDirection = 'auto' | 'leftOrTop' | 'rightOrBottom';

/** @namespace DevExpress */
export type NavSelectionMode = 'multiple' | 'single';

/** @namespace DevExpress */
export type NumberBoxMode = 'number' | 'text' | 'tel';

/** @namespace DevExpress */
export type PivotGridScrollingMode = 'standard' | 'virtual';

/** @namespace DevExpress */
export type PivotGridDataFieldArea = 'column' | 'row';

/** @namespace DevExpress */
export type PivotGridTotalsDisplayMode = 'both' | 'columns' | 'none' | 'rows';

/** @namespace DevExpress */
export type PivotGridRowHeadersLayout = 'standard' | 'tree';

/** @namespace DevExpress */
export type Toolbar = 'bottom' | 'top';

/** @namespace DevExpress */
export type ToolbarItemWidget = 'dxAutocomplete' | 'dxButton' | 'dxCheckBox' | 'dxDateBox' | 'dxMenu' | 'dxSelectBox' | 'dxTabs' | 'dxTextBox' | 'dxButtonGroup' | 'dxDropDownButton';

/** @namespace DevExpress */
export type ToolbarItemLocation = 'after' | 'before' | 'center';

/** @namespace DevExpress */
export type RangeSelectorAxisScaleType = 'continuous' | 'discrete' | 'logarithmic' | 'semidiscrete';

/** @namespace DevExpress */
export type ValueChangedCallMode = 'onMoving' | 'onMovingComplete';

/** @namespace DevExpress */
export type BackgroundImageLocation = 'center' | 'centerBottom' | 'centerTop' | 'full' | 'leftBottom' | 'leftCenter' | 'leftTop' | 'rightBottom' | 'rightCenter' | 'rightTop';

/** @namespace DevExpress */
export type RangeSelectorChartAxisScaleType = 'continuous' | 'logarithmic';

/** @namespace DevExpress */
export type SliderTooltipShowMode = 'always' | 'onHover';

/** @namespace DevExpress */
export type SchedulerViewType = 'agenda' | 'day' | 'month' | 'timelineDay' | 'timelineMonth' | 'timelineWeek' | 'timelineWorkWeek' | 'week' | 'workWeek';

/** @namespace DevExpress */
export type MaxAppointmentsPerCell = 'auto' | 'unlimited';

/** @namespace DevExpress */
export type SchedulerRecurrenceEditMode = 'dialog' | 'occurrence' | 'series';

/** @namespace DevExpress */
export type SchedulerScrollingMode = 'standard' | 'virtual';

/** @namespace DevExpress */
export type ScrollDirection = 'both' | 'horizontal' | 'vertical';

/** @namespace DevExpress */
export type DragDirection = 'both' | 'horizontal' | 'vertical';

/** @namespace DevExpress */
export type SlideOutMenuPosition = 'inverted' | 'normal';

/** @namespace DevExpress */
export type DrawerOpenedStateMode = 'overlap' | 'shrink' | 'push';

/** @namespace DevExpress */
export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom' | 'before' | 'after';

/** @namespace DevExpress */
export type DrawerRevealMode = 'slide' | 'expand';

/** @namespace DevExpress */
export type TextBoxMode = 'email' | 'password' | 'search' | 'tel' | 'text' | 'url';

/** @namespace DevExpress */
export type ShowMaskMode = 'always' | 'onFocus';

/** @namespace DevExpress */
export type ToastType = 'custom' | 'error' | 'info' | 'success' | 'warning';

/** @namespace DevExpress */
export type ToolbarItemLocateInMenuMode = 'always' | 'auto' | 'never';

/** @namespace DevExpress */
export type ToolbarItemShowTextMode = 'always' | 'inMenu';

/** @namespace DevExpress */
export type TreeListDataStructure = 'plain' | 'tree';

/** @namespace DevExpress */
export type TreeListScrollingMode = 'standard' | 'virtual';

/** @namespace DevExpress */
export type GridRowRenderingMode = 'standard' | 'virtual';

/** @namespace DevExpress */
export type GridColumnRenderingMode = 'standard' | 'virtual';

/** @namespace DevExpress */
export type TreeMapLayoutAlgorithm = 'sliceanddice' | 'squarified' | 'strip';

/** @namespace DevExpress */
export type TreeMapLayoutDirection = 'leftBottomRightTop' | 'leftTopRightBottom' | 'rightBottomLeftTop' | 'rightTopLeftBottom';

/** @namespace DevExpress */
export type TreeMapColorizerType = 'discrete' | 'gradient' | 'none' | 'range';

/** @namespace DevExpress */
export type TreeViewDataStructure = 'plain' | 'tree';

/** @namespace DevExpress */
export type TreeViewCheckBoxMode = 'none' | 'normal' | 'selectAll';

/** @namespace DevExpress */
export type TreeViewExpandEvent = 'dblclick' | 'click';

/** @namespace DevExpress */
export type VectorMapLayerType = 'area' | 'line' | 'marker';

/** @namespace DevExpress */
export type VectorMapMarkerType = 'bubble' | 'dot' | 'image' | 'pie';

/** @namespace DevExpress */
export type VectorMapMarkerShape = 'circle' | 'square';

/** @namespace DevExpress */
export type VectorMapProjection = 'equirectangular' | 'lambert' | 'mercator' | 'miller';

/** @namespace DevExpress */
export type AnimationType = 'css' | 'fade' | 'fadeIn' | 'fadeOut' | 'pop' | 'slide' | 'slideIn' | 'slideOut';

/** @namespace DevExpress */
export type Direction = 'bottom' | 'left' | 'right' | 'top';

/** @namespace DevExpress */
export type FinancialChartReductionLevel = 'close' | 'high' | 'low' | 'open';

/** @namespace DevExpress */
export type ChartSeriesHoverMode = 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'nearestPoint' | 'none' | 'onlyPoint';

/** @namespace DevExpress */
export type ChartSeriesSelectionMode = 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'none' | 'onlyPoint';

/** @namespace DevExpress */
export type ChartPointInteractionMode = 'allArgumentPoints' | 'allSeriesPoints' | 'none' | 'onlyPoint';

/** @namespace DevExpress */
export type PointSymbol = 'circle' | 'cross' | 'polygon' | 'square' | 'triangleDown' | 'triangleUp';

/** @namespace DevExpress */
export type ValueErrorBarDisplayMode = 'auto' | 'high' | 'low' | 'none';

/** @namespace DevExpress */
export type ValueErrorBarType = 'fixed' | 'percent' | 'stdDeviation' | 'stdError' | 'variance';

/** @namespace DevExpress */
export type ValidationRuleType = 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';

/** @namespace DevExpress */
export type ComparisonOperator = '!=' | '!==' | '<' | '<=' | '==' | '===' | '>' | '>=';

/** @namespace DevExpress */
export type FilterBuilderFieldDataType = 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime';

/** @namespace DevExpress */
export type TextEditorButtonLocation = 'after' | 'before';

// eslint-disable-next-line @typescript-eslint/no-type-alias
/** @namespace DevExpress */
export type TextBoxButtonName = 'clear';

/** @namespace DevExpress */
export type NumberBoxButtonName = 'clear' | 'spins';

/** @namespace DevExpress */
export type DropDownEditorButtonName = 'clear' | 'dropDown';

/** @namespace DevExpress */
export type SmallValuesGroupingMode = 'none' | 'smallValueThreshold' | 'topN';

/** @namespace DevExpress */
export type PieChartSeriesInteractionMode = 'none' | 'onlyPoint';

/** @namespace DevExpress */
export type PieChartLabelPosition = 'columns' | 'inside' | 'outside';

/** @namespace DevExpress */
export type PivotGridDataType = 'date' | 'number' | 'string';

/** @namespace DevExpress */
export type PivotGridGroupInterval = 'day' | 'dayOfWeek' | 'month' | 'quarter' | 'year';

/** @namespace DevExpress */
export type PivotGridArea = 'column' | 'data' | 'filter' | 'row';

/** @namespace DevExpress */
export type PivotGridSortBy = 'displayText' | 'value' | 'none';

/** @namespace DevExpress */
export type ApplyChangesMode = 'instantly' | 'onDemand';

/** @namespace DevExpress */
export type PivotGridSummaryDisplayMode = 'absoluteVariation' | 'percentOfColumnGrandTotal' | 'percentOfColumnTotal' | 'percentOfGrandTotal' | 'percentOfRowGrandTotal' | 'percentOfRowTotal' | 'percentVariation';

/** @namespace DevExpress */
export type PivotGridRunningTotalMode = 'column' | 'row';

/** @namespace DevExpress */
export type PositionAlignment = 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top';

/** @namespace DevExpress */
export type PositionResolveCollisionXY = 'fit' | 'fit flip' | 'fit flipfit' | 'fit none' | 'flip' | 'flip fit' | 'flip none' | 'flipfit' | 'flipfit fit' | 'flipfit none' | 'none' | 'none fit' | 'none flip' | 'none flipfit';

/** @namespace DevExpress */
export type PositionResolveCollision = 'fit' | 'flip' | 'flipfit' | 'none';

/** @namespace DevExpress */
export type ChartSeriesAggregationMethod = 'avg' | 'count' | 'max' | 'min' | 'ohlc' | 'range' | 'sum' | 'custom';

/** @namespace DevExpress */
export type ChartSingleValueSeriesAggregationMethod = 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';

/** @namespace DevExpress */
export type ChartFinancialSeriesAggregationMethod = 'ohlc' | 'custom';

/** @namespace DevExpress */
export type ChartRangeSeriesAggregationMethod = 'range' | 'custom';

/** @namespace DevExpress */
export type ChartBubbleSeriesAggregationMethod = 'avg' | 'custom';

/** @namespace DevExpress */
export type DataSourceStoreType = 'array' | 'local' | 'odata';

/** @namespace DevExpress */
export type PivotGridStoreType = 'array' | 'local' | 'odata' | 'xmla';

/** @namespace DevExpress */
export type ExportFormat = 'GIF' | 'JPEG' | 'PDF' | 'PNG' | 'SVG';

/** @namespace DevExpress */
export type ExcelFontUnderlineType = 'double' | 'doubleAccounting' | 'none' | 'single' | 'singleAccounting';

/** @namespace DevExpress */
export type ExcelCellHorizontalAlignment = 'center' | 'centerContinuous' | 'distributed' | 'fill' | 'general' | 'justify' | 'left' | 'right';

/** @namespace DevExpress */
export type ExcelCellVerticalAlignment = 'bottom' | 'center' | 'distributed' | 'justify' | 'top';

/** @namespace DevExpress */
export type ExcelCellPatternType = 'darkDown' | 'darkGray' | 'darkGrid' | 'darkHorizontal' | 'darkTrellis' | 'darkUp' | 'darkVertical' | 'gray0625' | 'gray125' | 'lightDown' | 'lightGray' | 'lightGrid' | 'lightHorizontal' | 'lightTrellis' | 'lightUp' | 'lightVertical' | 'mediumGray' | 'none' | 'solid';

/** @namespace DevExpress */
export type HtmlEditorValueType = 'html' | 'markdown';

/** @namespace DevExpress */
export type HtmlEditorToolbarItem = 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'image' | 'size' | 'strike' | 'subscript' | 'superscript' | 'underline' | 'blockquote' | 'header' | 'increaseIndent' | 'decreaseIndent' | 'orderedList' | 'bulletList' | 'alignLeft' | 'alignCenter' | 'alignRight' | 'alignJustify' | 'codeBlock' | 'variable' | 'separator' | 'undo' | 'redo' | 'clear' | 'cellProperties' | 'tableProperties' | 'insertTable' | 'insertHeaderRow' | 'insertRowAbove' | 'insertRowBelow' | 'insertColumnLeft' | 'insertColumnRight' | 'deleteColumn' | 'deleteRow' | 'deleteTable';

/** @namespace DevExpress */
export type HtmlEditorFormat = 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'size' | 'strike' | 'script' | 'underline' | 'blockquote' | 'header' | 'indent' | 'list' | 'align' | 'code-block';

/** @namespace DevExpress */
export type HtmlEditorContextMenuItem = 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'image' | 'strike' | 'subscript' | 'superscript' | 'underline' | 'blockquote' | 'increaseIndent' | 'decreaseIndent' | 'orderedList' | 'bulletList' | 'alignLeft' | 'alignCenter' | 'alignRight' | 'alignJustify' | 'codeBlock' | 'variable' | 'undo' | 'redo' | 'clear' | 'insertTable' | 'insertHeaderRow' | 'insertRowAbove' | 'insertRowBelow' | 'insertColumnLeft' | 'insertColumnRight' | 'deleteColumn' | 'deleteRow' | 'deleteTable' | 'cellProperties' | 'tableProperties';

/** @namespace DevExpress */
export type HtmlEditorImageUploadTab = 'url' | 'file';

/** @namespace DevExpress */
export type HtmlEditorImageUploadFileUploadMode = 'base64' | 'server' | 'both';

/** @namespace DevExpress */
export type EditorStylingMode = 'outlined' | 'underlined' | 'filled';

/** @namespace DevExpress */
export type EditorLabelMode = 'static' | 'floating' | 'hidden';

/** @namespace DevExpress */
export type FormLabelMode = 'static' | 'floating' | 'hidden' | 'outside';

/** @namespace DevExpress */
export type GridCommandColumnType = 'adaptive' | 'buttons' | 'detailExpand' | 'groupExpand' | 'selection' | 'drag';

/** @namespace DevExpress */
export type TreeListCommandColumnType = 'adaptive' | 'buttons' | 'drag';

/** @namespace DevExpress */
export type GridColumnButtonName = 'cancel' | 'delete' | 'edit' | 'save' | 'undelete';

/** @namespace DevExpress */
export type TreeListColumnButtonName = 'add' | 'cancel' | 'delete' | 'edit' | 'save' | 'undelete';

/** @namespace DevExpress */
export type TreeListFilterMode = 'fullBranch' | 'withAncestors' | 'matchOnly';

/** @namespace DevExpress */
export type GridStartEditAction = 'click' | 'dblClick';

/** @namespace DevExpress */
export type FileManagerSelectionMode = 'multiple' | 'single';

/** @namespace DevExpress */
export type FileManagerToolbarItem = 'showNavPane' | 'create' | 'upload' | 'refresh' | 'switchView' | 'download' | 'move' | 'copy' | 'rename' | 'delete' | 'clearSelection' | 'separator';

/** @namespace DevExpress */
export type FileManagerContextMenuItem = 'create' | 'upload' | 'refresh' | 'download' | 'move' | 'copy' | 'rename' | 'delete';

/** @namespace DevExpress */
export type FileManagerItemViewMode = 'details' | 'thumbnails';

/** @namespace DevExpress */
export type FileManagerViewArea = 'navPane' | 'itemView';

/** @namespace DevExpress */
export type DiagramDataLayoutType = 'auto' | 'off' | 'tree' | 'layered';

/** @namespace DevExpress */
export type DiagramDataLayoutOrientation = 'vertical' | 'horizontal';

/** @namespace DevExpress */
export type DiagramUnits = 'in' | 'cm' | 'px';

/** @namespace DevExpress */
export type DiagramPageOrientation = 'portrait' | 'landscape';

/** @namespace DevExpress */
export type DiagramShapeCategory = 'general' | 'flowchart' | 'orgChart' | 'containers' | 'custom';

/** @namespace DevExpress */
export type DiagramShapeType = 'text' | 'rectangle' | 'ellipse' | 'cross' | 'triangle' | 'diamond' | 'heart' | 'pentagon' | 'hexagon' | 'octagon' | 'star' | 'arrowLeft' | 'arrowTop' | 'arrowRight' | 'arrowBottom' | 'arrowNorthSouth' | 'arrowEastWest' | 'process' | 'decision' | 'terminator' | 'predefinedProcess' | 'document' | 'multipleDocuments' | 'manualInput' | 'preparation' | 'data' | 'database' | 'hardDisk' | 'internalStorage' | 'paperTape' | 'manualOperation' | 'delay' | 'storedData' | 'display' | 'merge' | 'connector' | 'or' | 'summingJunction' | 'verticalContainer' | 'horizontalContainer' | 'cardWithImageOnLeft' | 'cardWithImageOnTop' | 'cardWithImageOnRight';

/** @namespace DevExpress */
export type DiagramConnectorLineType = 'straight' | 'orthogonal';

/** @namespace DevExpress */
export type DiagramConnectorLineEnd = 'none' | 'arrow' | 'outlinedTriangle' | 'filledTriangle';

/** @namespace DevExpress */
export type DiagramToolboxDisplayMode = 'icons' | 'texts';

/** @namespace DevExpress */
export type DiagramCommand = 'separator' | 'exportSvg' | 'exportPng' | 'exportJpg' | 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll' | 'delete' | 'fontName' | 'fontSize' | 'bold' | 'italic' | 'underline' | 'fontColor' | 'lineStyle' | 'lineWidth' | 'lineColor' | 'fillColor' | 'textAlignLeft' | 'textAlignCenter' | 'textAlignRight' | 'lock' | 'unlock' | 'sendToBack' | 'bringToFront' | 'insertShapeImage' | 'editShapeImage' | 'deleteShapeImage' | 'connectorLineType' | 'connectorLineStart' | 'connectorLineEnd' | 'layoutTreeTopToBottom' | 'layoutTreeBottomToTop' | 'layoutTreeLeftToRight' | 'layoutTreeRightToLeft' | 'layoutLayeredTopToBottom' | 'layoutLayeredBottomToTop' | 'layoutLayeredLeftToRight' | 'layoutLayeredRightToLeft' | 'fullScreen' | 'zoomLevel' | 'showGrid' | 'snapToGrid' | 'gridSize' | 'units' | 'pageSize' | 'pageOrientation' | 'pageColor' | 'simpleView' | 'toolbox';

/** @namespace DevExpress */
export type DiagramPanelVisibility = 'auto' | 'visible' | 'collapsed' | 'disabled';

/** @namespace DevExpress */
export type DiagramAutoZoomMode = 'fitContent' | 'fitWidth' | 'disabled';

/** @namespace DevExpress */
export type DiagramItemType = 'shape' | 'connector';

/** @namespace DevExpress */
export type DiagramExportFormat = 'svg' | 'png' | 'jpg';

/** @namespace DevExpress */
export type DiagramModelOperation = 'addShape' | 'addShapeFromToolbox' | 'deleteShape' | 'deleteConnector' | 'changeConnection' | 'changeConnectorPoints' | 'beforeChangeShapeText' | 'changeShapeText' | 'beforeChangeConnectorText' | 'changeConnectorText' | 'resizeShape' | 'moveShape';

/** @namespace DevExpress */
export type DiagramRequestEditOperationReason = 'checkUIElementAvailability' | 'modelModification';

/** @namespace DevExpress */
export type DiagramConnectorPosition = 'start' | 'end';

/** @namespace DevExpress */
export type GanttTaskTitlePosition = 'inside' | 'outside' | 'none';

/** @namespace DevExpress */
export type GanttToolbarItem = 'separator' | 'undo' | 'redo' | 'expandAll' | 'collapseAll' | 'addTask' | 'deleteTask' | 'zoomIn' | 'zoomOut' | 'taskDetails' | 'fullScreen' | 'resourceManager' | 'showResources' | 'showDependencies';

/** @namespace DevExpress */
export type GanttContextMenuItem = 'undo' | 'redo' | 'expandAll' | 'collapseAll' | 'addTask' | 'deleteTask' | 'zoomIn' | 'zoomOut' | 'deleteDependency' | 'taskDetails';

/** @namespace DevExpress */
export type GanttScaleType = 'auto' | 'minutes' | 'hours' | 'sixHours' | 'days' | 'weeks' | 'months' | 'quarters' | 'years';

/** @namespace DevExpress */
export type GanttRenderScaleType = 'minutes' | 'hours' | 'sixHours' | 'days' | 'weeks' | 'months' | 'quarters' | 'years' | 'fiveYears';

/** @namespace DevExpress */
export type GanttSortingMode = 'multiple' | 'none' | 'single';

/** @namespace DevExpress */
export type LegendMarkerState = 'normal' | 'hovered' | 'selected';

/** @namespace DevExpress */
export type ValidationStatus = 'valid' | 'invalid' | 'pending';

/** @namespace DevExpress */
export type FloatingActionButtonDirection = 'auto' | 'up' | 'down';

/** @namespace DevExpress */
export type GridPagerDisplayMode = 'adaptive' | 'compact' | 'full';

// eslint-disable-next-line @typescript-eslint/no-type-alias
/** @namespace DevExpress */
export type GridPagerPageSize = 'all';

/** @namespace DevExpress */
export type GridDataChangeType = 'insert' | 'update' | 'remove';

/** @namespace DevExpress */
export type GridNewRowPosition = 'first' | 'last' | 'pageBottom' | 'pageTop' | 'viewportBottom' | 'viewportTop';

/** @namespace DevExpress */
export type DataGridToolbarItem = 'addRowButton' | 'applyFilterButton' | 'columnChooserButton' | 'exportButton' | 'groupPanel' | 'revertButton' | 'saveButton' | 'searchPanel';

/** @namespace DevExpress */
export type TreeListToolbarItem = 'addRowButton' | 'applyFilterButton' | 'columnChooserButton' | 'revertButton' | 'saveButton' | 'searchPanel';

/** @namespace DevExpress */
export type GanttPdfExportMode = 'all' | 'treeList' | 'chart';

/** @namespace DevExpress */
export type GanttPdfExportDateRange = 'all' | 'visible';

/** @namespace DevExpress */
export type DataGridExportFormat = 'pdf' | 'xlsx';
