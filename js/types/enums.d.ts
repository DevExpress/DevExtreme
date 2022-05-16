export type ButtonType = 'back' | 'danger' | 'default' | 'normal' | 'success';

export type ButtonStylingMode = 'text' | 'outlined' | 'contained';

export type EventKeyModifier = 'alt' | 'ctrl' | 'meta' | 'shift';

export type FirstDayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type PivotGridFieldChooserLayout = 0 | 1 | 2;

export type DropDownSearchMode = 'contains' | 'startswith';

export type ValidationMessageMode = 'always' | 'auto';

export type VizAnimationEasing = 'easeOutCubic' | 'linear';

export type Format = 'billions' | 'currency' | 'day' | 'decimal' | 'exponential' | 'fixedPoint' | 'largeNumber' | 'longDate' | 'longTime' | 'millions' | 'millisecond' | 'month' | 'monthAndDay' | 'monthAndYear' | 'percent' | 'quarter' | 'quarterAndYear' | 'shortDate' | 'shortTime' | 'thousands' | 'trillions' | 'year' | 'dayOfWeek' | 'hour' | 'longDateLongTime' | 'minute' | 'second' | 'shortDateShortTime';

export type VizTheme = 'generic.dark' | 'generic.light' | 'generic.contrast' | 'generic.carmine' | 'generic.darkmoon' | 'generic.darkviolet' | 'generic.greenmist' | 'generic.softblue' | 'material.blue.light' | 'material.lime.light' | 'material.orange.light' | 'material.purple.light' | 'material.teal.light';

export type VizPalette = 'Bright' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';

export type VizWordWrap = 'normal' | 'breakWord' | 'none';

export type VizTextOverflow = 'ellipsis' | 'hide' | 'none';

export type VizPaletteExtensionMode = 'alternate' | 'blend' | 'extrapolate';

export type VizPaletteColorSet = 'simpleSet' | 'indicatingSet' | 'gradientSet';

export type CircularGaugeElementOrientation = 'center' | 'inside' | 'outside';

export type GaugeOverlappingBehavior = 'first' | 'last';

export type ScaleLabelOverlappingBehavior = 'hide' | 'none';

export type BarGaugeResolveLabelOverlapping = 'hide' | 'none';

export type OverlappingBehavior = 'rotate' | 'stagger' | 'none' | 'hide';

export type PolarChartOverlappingBehavior = 'none' | 'hide';

export type Orientation = 'horizontal' | 'vertical';

export type DropFeedbackMode = 'push' | 'indicate';

export type VerticalAlignment = 'bottom' | 'center' | 'top';

export type HorizontalAlignment = 'center' | 'left' | 'right';

export type VerticalEdge = 'bottom' | 'top';

export type DashStyle = 'dash' | 'dot' | 'longDash' | 'solid';

export type ResizeHandle = 'bottom' | 'left' | 'right' | 'top' | 'all';

export type BoxDirection = 'col' | 'row';

export type BoxAlign = 'center' | 'end' | 'space-around' | 'space-between' | 'start';

export type BoxCrossAlign = 'center' | 'end' | 'start' | 'stretch';

export type ButtonGroupSelectionMode = 'multiple' | 'single' | 'none';

// eslint-disable-next-line @typescript-eslint/no-type-alias
export type Mode = 'auto';

export type SparklineType = 'area' | 'bar' | 'line' | 'spline' | 'splinearea' | 'steparea' | 'stepline' | 'winloss';

export type VizPointSymbol = 'circle' | 'cross' | 'polygon' | 'square' | 'triangle';

export type CalendarZoomLevel = 'century' | 'decade' | 'month' | 'year';

export type ChartResolveLabelOverlapping = 'hide' | 'none' | 'stack';

export type FunnelResolveLabelOverlapping = 'hide' | 'none' | 'shift';

export type ChartElementSelectionMode = 'multiple' | 'single';

export type SeriesType = 'area' | 'bar' | 'bubble' | 'candlestick' | 'fullstackedarea' | 'fullstackedbar' | 'fullstackedline' | 'fullstackedspline' | 'fullstackedsplinearea' | 'line' | 'rangearea' | 'rangebar' | 'scatter' | 'spline' | 'splinearea' | 'stackedarea' | 'stackedbar' | 'stackedline' | 'stackedspline' | 'stackedsplinearea' | 'steparea' | 'stepline' | 'stock';

export type AnnotationType = 'text' | 'image' | 'custom';

export type Position = 'bottom' | 'left' | 'right' | 'top';

export type ChartZoomAndPanMode = 'both' | 'none' | 'pan' | 'zoom';

export type ChartLegendHoverMode = 'excludePoints' | 'includePoints' | 'none';

export type RelativePosition = 'inside' | 'outside';

export type DiscreteAxisDivisionMode = 'betweenLabels' | 'crossLabels';

export type AggregatedPointsPosition = 'betweenTicks' | 'crossTicks';

export type ScaleBreakLineStyle = 'straight' | 'waved';

export type ChartLabelDisplayMode = 'rotate' | 'stagger' | 'standard';

export type VizTimeInterval = 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';

export type VisualRangeUpdateMode = 'auto' | 'keep' | 'reset' | 'shift';

export type ValueAxisVisualRangeUpdateMode = 'auto' | 'keep' | 'reset';

export type ChartZoomPanAction = 'zoom' | 'pan';

export type AxisScaleType = 'continuous' | 'discrete' | 'logarithmic';

export type ChartDataType = 'datetime' | 'numeric' | 'string';

export type ArgumentAxisHoverMode = 'allArgumentPoints' | 'none';

export type ChartTooltipLocation = 'center' | 'edge';

export type PieChartLegendHoverMode = 'none' | 'allArgumentPoints';

export type PieChartResolveLabelOverlapping = 'hide' | 'none' | 'shift';

export type PieChartType = 'donut' | 'doughnut' | 'pie';

export type PieChartSegmentsDirection = 'anticlockwise' | 'clockwise';

export type PieChartAnnotationLocation = 'center' | 'edge';

export type PolarChartResolveLabelOverlapping = 'hide' | 'none';

export type PolarChartSeriesType = 'area' | 'bar' | 'line' | 'scatter' | 'stackedbar';

export type EditorApplyValueMode = 'instantly' | 'useButtons';

export type ShowSubmenuMode = 'onClick' | 'onHover';

export type MenuSelectionMode = 'none' | 'single';

export type ContextMenuSubmenuDirection = 'auto' | 'left' | 'right';

export type GridColumnChooserMode = 'dragAndDrop' | 'select';

export type ColumnResizingMode = 'nextColumn' | 'widget';

export type HorizontalEdge = 'left' | 'right';

export type GridColumnDataType = 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime';

export type SortOrder = 'asc' | 'desc';

export type FilterBuilderFieldFilterOperations = '=' | '<>' | '<' | '<=' | '>' | '>=' | 'contains' | 'endswith' | 'isblank' | 'isnotblank' | 'notcontains' | 'startswith' | 'between';

export type FilterBuilderGroupOperations = 'and' | 'or' | 'notAnd' | 'notOr';

export type FilterOperations = '<' | '<=' | '<>' | '=' | '>' | '>=' | 'between' | 'contains' | 'endswith' | 'notcontains' | 'startswith';

export type GridFilterOperations = '=' | '<>' | '<' | '<=' | '>' | '>=' | 'contains' | 'endswith' | 'isblank' | 'isnotblank' | 'notcontains' | 'startswith' | 'between' | 'anyof' | 'noneof';

export type FilterType = 'exclude' | 'include';

export type HeaderFilterGroupInterval = 'day' | 'hour' | 'minute' | 'month' | 'quarter' | 'second' | 'year';

export type GridEditMode = 'batch' | 'cell' | 'row' | 'form' | 'popup';

export type GridEnterKeyAction = 'startEdit' | 'moveFocus';

export type GridEnterKeyDirection = 'none' | 'column' | 'row';

export type GridEditRefreshMode = 'full' | 'reshape' | 'repaint';

export type GridApplyFilterMode = 'auto' | 'onClick';

export type GridGroupingExpandMode = 'buttonClick' | 'rowClick';

export type GridScrollingMode = 'infinite' | 'standard' | 'virtual';

export type ShowScrollbarMode = 'always' | 'never' | 'onHover' | 'onScroll';

export type SelectionMode = 'multiple' | 'none' | 'single';

export type GridSelectionShowCheckBoxesMode = 'always' | 'none' | 'onClick' | 'onLongTap';

export type SelectAllMode = 'allPages' | 'page';

export type SummaryType = 'avg' | 'count' | 'custom' | 'max' | 'min' | 'sum';

export type GridSortingMode = 'multiple' | 'none' | 'single';

export type StateStoringType = 'custom' | 'localStorage' | 'sessionStorage';

export type DateBoxType = 'date' | 'datetime' | 'time';

export type DateBoxPickerType = 'calendar' | 'list' | 'native' | 'rollers';

export type FileUploadMode = 'instantly' | 'useButtons' | 'useForm';

export type UploadHttpMethod = 'POST' | 'PUT';

export type FormLabelLocation = 'left' | 'right' | 'top';

export type FormItemEditorType = 'dxAutocomplete' | 'dxCalendar' | 'dxCheckBox' | 'dxColorBox' | 'dxDateBox' | 'dxDropDownBox' | 'dxHtmlEditor' | 'dxLookup' | 'dxNumberBox' | 'dxRadioGroup' | 'dxRangeSlider' | 'dxSelectBox' | 'dxSlider' | 'dxSwitch' | 'dxTagBox' | 'dxTextArea' | 'dxTextBox';

export type FormItemType = 'empty' | 'group' | 'simple' | 'tabbed' | 'button';

export type FunnelAlgorithm = 'dynamicHeight' | 'dynamicSlope';

export type HatchingDirection = 'left' | 'none' | 'right';

export type FunnelLabelPosition = 'columns' | 'inside' | 'outside';

export type SankeyLabelOverlappingBehavior = 'ellipsis' | 'hide' | 'none';

export type SankeyColorMode = 'none' | 'source' | 'target' | 'gradient';

export type ListSelectionMode = 'all' | 'multiple' | 'none' | 'single';

export type ListMenuMode = 'context' | 'slide';

export type ListItemDeleteMode = 'context' | 'slideButton' | 'slideItem' | 'static' | 'swipe' | 'toggle';

export type ListPageLoadMode = 'nextButton' | 'scrollBottom';

export type CollectionSearchMode = 'contains' | 'startswith' | 'equals';

export type GeoMapType = 'hybrid' | 'roadmap' | 'satellite';

export type GeoMapProvider = 'bing' | 'google' | 'googleStatic';

export type GeoMapRouteMode = 'driving' | 'walking';

export type SubmenuDirection = 'auto' | 'leftOrTop' | 'rightOrBottom';

export type NavSelectionMode = 'multiple' | 'single';

export type NumberBoxMode = 'number' | 'text' | 'tel';

export type PivotGridScrollingMode = 'standard' | 'virtual';

export type PivotGridDataFieldArea = 'column' | 'row';

export type PivotGridTotalsDisplayMode = 'both' | 'columns' | 'none' | 'rows';

export type PivotGridRowHeadersLayout = 'standard' | 'tree';

export type ToolbarLocation = 'bottom' | 'top';

export type ToolbarItemWidget = 'dxAutocomplete' | 'dxButton' | 'dxCheckBox' | 'dxDateBox' | 'dxMenu' | 'dxSelectBox' | 'dxTabs' | 'dxTextBox' | 'dxButtonGroup' | 'dxDropDownButton';

export type ToolbarItemLocation = 'after' | 'before' | 'center';

export type RangeSelectorAxisScaleType = 'continuous' | 'discrete' | 'logarithmic' | 'semidiscrete';

export type ValueChangedCallMode = 'onMoving' | 'onMovingComplete';

export type BackgroundImageLocation = 'center' | 'centerBottom' | 'centerTop' | 'full' | 'leftBottom' | 'leftCenter' | 'leftTop' | 'rightBottom' | 'rightCenter' | 'rightTop';

export type RangeSelectorChartAxisScaleType = 'continuous' | 'logarithmic';

export type SliderTooltipShowMode = 'always' | 'onHover';

export type SchedulerViewType = 'agenda' | 'day' | 'month' | 'timelineDay' | 'timelineMonth' | 'timelineWeek' | 'timelineWorkWeek' | 'week' | 'workWeek';

export type MaxAppointmentsPerCell = 'auto' | 'unlimited';

export type SchedulerRecurrenceEditMode = 'dialog' | 'occurrence' | 'series';

export type SchedulerScrollingMode = 'standard' | 'virtual';

export type ScrollDirection = 'both' | 'horizontal' | 'vertical';

export type DragDirection = 'both' | 'horizontal' | 'vertical';

export type SlideOutMenuPosition = 'inverted' | 'normal';

export type DrawerOpenedStateMode = 'overlap' | 'shrink' | 'push';

export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom' | 'before' | 'after';

export type DrawerRevealMode = 'slide' | 'expand';

export type TextBoxMode = 'email' | 'password' | 'search' | 'tel' | 'text' | 'url';

export type ShowMaskMode = 'always' | 'onFocus';

export type ToastType = 'custom' | 'error' | 'info' | 'success' | 'warning';

export type ToolbarItemLocateInMenuMode = 'always' | 'auto' | 'never';

export type ToolbarItemShowTextMode = 'always' | 'inMenu';

export type TreeListDataStructure = 'plain' | 'tree';

export type TreeListScrollingMode = 'standard' | 'virtual';

export type GridRowRenderingMode = 'standard' | 'virtual';

export type GridColumnRenderingMode = 'standard' | 'virtual';

export type TreeMapLayoutAlgorithm = 'sliceanddice' | 'squarified' | 'strip';

export type TreeMapLayoutDirection = 'leftBottomRightTop' | 'leftTopRightBottom' | 'rightBottomLeftTop' | 'rightTopLeftBottom';

export type TreeMapColorizerType = 'discrete' | 'gradient' | 'none' | 'range';

export type TreeViewDataStructure = 'plain' | 'tree';

export type TreeViewCheckBoxMode = 'none' | 'normal' | 'selectAll';

export type TreeViewExpandEvent = 'dblclick' | 'click';

export type VectorMapLayerType = 'area' | 'line' | 'marker';

export type VectorMapMarkerType = 'bubble' | 'dot' | 'image' | 'pie';

export type VectorMapMarkerShape = 'circle' | 'square';

export type VectorMapProjection = 'equirectangular' | 'lambert' | 'mercator' | 'miller';

export type AnimationType = 'css' | 'fade' | 'fadeIn' | 'fadeOut' | 'pop' | 'slide' | 'slideIn' | 'slideOut';

export type Direction = 'bottom' | 'left' | 'right' | 'top';

export type FinancialChartReductionLevel = 'close' | 'high' | 'low' | 'open';

export type ChartSeriesHoverMode = 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'nearestPoint' | 'none' | 'onlyPoint';

export type ChartSeriesSelectionMode = 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'none' | 'onlyPoint';

export type ChartPointInteractionMode = 'allArgumentPoints' | 'allSeriesPoints' | 'none' | 'onlyPoint';

export type PointSymbol = 'circle' | 'cross' | 'polygon' | 'square' | 'triangleDown' | 'triangleUp';

export type ValueErrorBarDisplayMode = 'auto' | 'high' | 'low' | 'none';

export type ValueErrorBarType = 'fixed' | 'percent' | 'stdDeviation' | 'stdError' | 'variance';

export type ValidationRuleType = 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';

export type ComparisonOperator = '!=' | '!==' | '<' | '<=' | '==' | '===' | '>' | '>=';

export type FilterBuilderFieldDataType = 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime';

export type TextEditorButtonLocation = 'after' | 'before';

// eslint-disable-next-line @typescript-eslint/no-type-alias
export type TextBoxButtonName = 'clear';

export type NumberBoxButtonName = 'clear' | 'spins';

export type DropDownEditorButtonName = 'clear' | 'dropDown';

export type SmallValuesGroupingMode = 'none' | 'smallValueThreshold' | 'topN';

export type PieChartSeriesInteractionMode = 'none' | 'onlyPoint';

export type PieChartLabelPosition = 'columns' | 'inside' | 'outside';

export type PivotGridDataType = 'date' | 'number' | 'string';

export type PivotGridGroupInterval = 'day' | 'dayOfWeek' | 'month' | 'quarter' | 'year';

export type PivotGridArea = 'column' | 'data' | 'filter' | 'row';

export type PivotGridSortBy = 'displayText' | 'value' | 'none';

export type ApplyChangesMode = 'instantly' | 'onDemand';

export type PivotGridSummaryDisplayMode = 'absoluteVariation' | 'percentOfColumnGrandTotal' | 'percentOfColumnTotal' | 'percentOfGrandTotal' | 'percentOfRowGrandTotal' | 'percentOfRowTotal' | 'percentVariation';

export type PivotGridRunningTotalMode = 'column' | 'row';

export type PositionAlignment = 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top';

export type PositionResolveCollisionXY = 'fit' | 'fit flip' | 'fit flipfit' | 'fit none' | 'flip' | 'flip fit' | 'flip none' | 'flipfit' | 'flipfit fit' | 'flipfit none' | 'none' | 'none fit' | 'none flip' | 'none flipfit';

export type PositionResolveCollision = 'fit' | 'flip' | 'flipfit' | 'none';

export type ChartSeriesAggregationMethod = 'avg' | 'count' | 'max' | 'min' | 'ohlc' | 'range' | 'sum' | 'custom';

export type ChartSingleValueSeriesAggregationMethod = 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';

export type ChartFinancialSeriesAggregationMethod = 'ohlc' | 'custom';

export type ChartRangeSeriesAggregationMethod = 'range' | 'custom';

export type ChartBubbleSeriesAggregationMethod = 'avg' | 'custom';

export type DataSourceStoreType = 'array' | 'local' | 'odata';

export type PivotGridStoreType = 'array' | 'local' | 'odata' | 'xmla';

export type ExportFormat = 'GIF' | 'JPEG' | 'PDF' | 'PNG' | 'SVG';

export type ExcelFontUnderlineType = 'double' | 'doubleAccounting' | 'none' | 'single' | 'singleAccounting';

export type ExcelCellHorizontalAlignment = 'center' | 'centerContinuous' | 'distributed' | 'fill' | 'general' | 'justify' | 'left' | 'right';

export type ExcelCellVerticalAlignment = 'bottom' | 'center' | 'distributed' | 'justify' | 'top';

export type ExcelCellPatternType = 'darkDown' | 'darkGray' | 'darkGrid' | 'darkHorizontal' | 'darkTrellis' | 'darkUp' | 'darkVertical' | 'gray0625' | 'gray125' | 'lightDown' | 'lightGray' | 'lightGrid' | 'lightHorizontal' | 'lightTrellis' | 'lightUp' | 'lightVertical' | 'mediumGray' | 'none' | 'solid';

export type HtmlEditorValueType = 'html' | 'markdown';

export type HtmlEditorToolbarItem = 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'image' | 'size' | 'strike' | 'subscript' | 'superscript' | 'underline' | 'blockquote' | 'header' | 'increaseIndent' | 'decreaseIndent' | 'orderedList' | 'bulletList' | 'alignLeft' | 'alignCenter' | 'alignRight' | 'alignJustify' | 'codeBlock' | 'variable' | 'separator' | 'undo' | 'redo' | 'clear' | 'cellProperties' | 'tableProperties' | 'insertTable' | 'insertHeaderRow' | 'insertRowAbove' | 'insertRowBelow' | 'insertColumnLeft' | 'insertColumnRight' | 'deleteColumn' | 'deleteRow' | 'deleteTable';

export type HtmlEditorFormat = 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'size' | 'strike' | 'script' | 'underline' | 'blockquote' | 'header' | 'indent' | 'list' | 'align' | 'code-block';

export type HtmlEditorContextMenuItem = 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'image' | 'strike' | 'subscript' | 'superscript' | 'underline' | 'blockquote' | 'increaseIndent' | 'decreaseIndent' | 'orderedList' | 'bulletList' | 'alignLeft' | 'alignCenter' | 'alignRight' | 'alignJustify' | 'codeBlock' | 'variable' | 'undo' | 'redo' | 'clear' | 'insertTable' | 'insertHeaderRow' | 'insertRowAbove' | 'insertRowBelow' | 'insertColumnLeft' | 'insertColumnRight' | 'deleteColumn' | 'deleteRow' | 'deleteTable' | 'cellProperties' | 'tableProperties';

export type HtmlEditorImageUploadTab = 'url' | 'file';

export type HtmlEditorImageUploadFileUploadMode = 'base64' | 'server' | 'both';

export type EditorStylingMode = 'outlined' | 'underlined' | 'filled';

export type EditorLabelMode = 'static' | 'floating' | 'hidden';

export type FormLabelMode = 'static' | 'floating' | 'hidden' | 'outside';

export type GridCommandColumnType = 'adaptive' | 'buttons' | 'detailExpand' | 'groupExpand' | 'selection' | 'drag';

export type TreeListCommandColumnType = 'adaptive' | 'buttons' | 'drag';

export type GridColumnButtonName = 'cancel' | 'delete' | 'edit' | 'save' | 'undelete';

export type TreeListColumnButtonName = 'add' | 'cancel' | 'delete' | 'edit' | 'save' | 'undelete';

export type TreeListFilterMode = 'fullBranch' | 'withAncestors' | 'matchOnly';

export type GridStartEditAction = 'click' | 'dblClick';

export type FileManagerSelectionMode = 'multiple' | 'single';

export type FileManagerToolbarItem = 'showNavPane' | 'create' | 'upload' | 'refresh' | 'switchView' | 'download' | 'move' | 'copy' | 'rename' | 'delete' | 'clearSelection' | 'separator';

export type FileManagerContextMenuItem = 'create' | 'upload' | 'refresh' | 'download' | 'move' | 'copy' | 'rename' | 'delete';

export type FileManagerItemViewMode = 'details' | 'thumbnails';

export type FileManagerViewArea = 'navPane' | 'itemView';

export type DiagramDataLayoutType = 'auto' | 'off' | 'tree' | 'layered';

export type DiagramDataLayoutOrientation = 'vertical' | 'horizontal';

export type DiagramUnits = 'in' | 'cm' | 'px';

export type DiagramPageOrientation = 'portrait' | 'landscape';

export type DiagramShapeCategory = 'general' | 'flowchart' | 'orgChart' | 'containers' | 'custom';

export type DiagramShapeType = 'text' | 'rectangle' | 'ellipse' | 'cross' | 'triangle' | 'diamond' | 'heart' | 'pentagon' | 'hexagon' | 'octagon' | 'star' | 'arrowLeft' | 'arrowTop' | 'arrowRight' | 'arrowBottom' | 'arrowNorthSouth' | 'arrowEastWest' | 'process' | 'decision' | 'terminator' | 'predefinedProcess' | 'document' | 'multipleDocuments' | 'manualInput' | 'preparation' | 'data' | 'database' | 'hardDisk' | 'internalStorage' | 'paperTape' | 'manualOperation' | 'delay' | 'storedData' | 'display' | 'merge' | 'connector' | 'or' | 'summingJunction' | 'verticalContainer' | 'horizontalContainer' | 'cardWithImageOnLeft' | 'cardWithImageOnTop' | 'cardWithImageOnRight';

export type DiagramConnectorLineType = 'straight' | 'orthogonal';

export type DiagramConnectorLineEnd = 'none' | 'arrow' | 'outlinedTriangle' | 'filledTriangle';

export type DiagramToolboxDisplayMode = 'icons' | 'texts';

export type DiagramCommand = 'separator' | 'exportSvg' | 'exportPng' | 'exportJpg' | 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll' | 'delete' | 'fontName' | 'fontSize' | 'bold' | 'italic' | 'underline' | 'fontColor' | 'lineStyle' | 'lineWidth' | 'lineColor' | 'fillColor' | 'textAlignLeft' | 'textAlignCenter' | 'textAlignRight' | 'lock' | 'unlock' | 'sendToBack' | 'bringToFront' | 'insertShapeImage' | 'editShapeImage' | 'deleteShapeImage' | 'connectorLineType' | 'connectorLineStart' | 'connectorLineEnd' | 'layoutTreeTopToBottom' | 'layoutTreeBottomToTop' | 'layoutTreeLeftToRight' | 'layoutTreeRightToLeft' | 'layoutLayeredTopToBottom' | 'layoutLayeredBottomToTop' | 'layoutLayeredLeftToRight' | 'layoutLayeredRightToLeft' | 'fullScreen' | 'zoomLevel' | 'showGrid' | 'snapToGrid' | 'gridSize' | 'units' | 'pageSize' | 'pageOrientation' | 'pageColor' | 'simpleView' | 'toolbox';

export type DiagramPanelVisibility = 'auto' | 'visible' | 'collapsed' | 'disabled';

export type DiagramAutoZoomMode = 'fitContent' | 'fitWidth' | 'disabled';

export type DiagramItemType = 'shape' | 'connector';

export type DiagramExportFormat = 'svg' | 'png' | 'jpg';

export type DiagramModelOperation = 'addShape' | 'addShapeFromToolbox' | 'deleteShape' | 'deleteConnector' | 'changeConnection' | 'changeConnectorPoints' | 'beforeChangeShapeText' | 'changeShapeText' | 'beforeChangeConnectorText' | 'changeConnectorText' | 'resizeShape' | 'moveShape';

export type DiagramRequestEditOperationReason = 'checkUIElementAvailability' | 'modelModification';

export type DiagramConnectorPosition = 'start' | 'end';

export type GanttTaskTitlePosition = 'inside' | 'outside' | 'none';

export type GanttToolbarItem = 'separator' | 'undo' | 'redo' | 'expandAll' | 'collapseAll' | 'addTask' | 'deleteTask' | 'zoomIn' | 'zoomOut' | 'taskDetails' | 'fullScreen' | 'resourceManager' | 'showResources' | 'showDependencies';

export type GanttContextMenuItem = 'undo' | 'redo' | 'expandAll' | 'collapseAll' | 'addTask' | 'deleteTask' | 'zoomIn' | 'zoomOut' | 'deleteDependency' | 'taskDetails';

export type GanttScaleType = 'auto' | 'minutes' | 'hours' | 'sixHours' | 'days' | 'weeks' | 'months' | 'quarters' | 'years';

export type GanttRenderScaleType = 'minutes' | 'hours' | 'sixHours' | 'days' | 'weeks' | 'months' | 'quarters' | 'years' | 'fiveYears';

export type GanttSortingMode = 'multiple' | 'none' | 'single';

export type LegendMarkerState = 'normal' | 'hovered' | 'selected';

export type ValidationStatus = 'valid' | 'invalid' | 'pending';

export type FloatingActionButtonDirection = 'auto' | 'up' | 'down';

export type GridPagerDisplayMode = 'adaptive' | 'compact' | 'full';

// eslint-disable-next-line @typescript-eslint/no-type-alias
export type GridPagerPageSize = 'all';

export type GridDataChangeType = 'insert' | 'update' | 'remove';

export type GridNewRowPosition = 'first' | 'last' | 'pageBottom' | 'pageTop' | 'viewportBottom' | 'viewportTop';

export type DataGridToolbarItem = 'addRowButton' | 'applyFilterButton' | 'columnChooserButton' | 'exportButton' | 'groupPanel' | 'revertButton' | 'saveButton' | 'searchPanel';

export type TreeListToolbarItem = 'addRowButton' | 'applyFilterButton' | 'columnChooserButton' | 'revertButton' | 'saveButton' | 'searchPanel';

export type GanttPdfExportMode = 'all' | 'treeList' | 'chart';

export type GanttPdfExportDateRange = 'all' | 'visible';

export type DataGridExportFormat = 'pdf' | 'xlsx';
