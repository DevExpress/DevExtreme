/** @namespace DevExpress.utils */
export type DropDownSearchMode = 'contains' | 'startswith';

/** @namespace DevExpress.utils */
export type ValidationMessageMode = 'always' | 'auto';

/** @namespace DevExpress.utils */
export type VizAnimationEasing = 'easeOutCubic' | 'linear';

/** @namespace DevExpress.utils */
export type Format = 'billions' | 'currency' | 'day' | 'decimal' | 'exponential' | 'fixedPoint' | 'largeNumber' | 'longDate' | 'longTime' | 'millions' | 'millisecond' | 'month' | 'monthAndDay' | 'monthAndYear' | 'percent' | 'quarter' | 'quarterAndYear' | 'shortDate' | 'shortTime' | 'thousands' | 'trillions' | 'year' | 'dayOfWeek' | 'hour' | 'longDateLongTime' | 'minute' | 'second' | 'shortDateShortTime';

/** @namespace DevExpress.utils */
export type VizTheme = 'generic.dark' | 'generic.light' | 'generic.contrast' | 'generic.carmine' | 'generic.darkmoon' | 'generic.darkviolet' | 'generic.greenmist' | 'generic.softblue' | 'material.blue.light' | 'material.lime.light' | 'material.orange.light' | 'material.purple.light' | 'material.teal.light';

/** @namespace DevExpress.utils */
export type VizPalette = 'Bright' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';

/** @namespace DevExpress.utils */
export type VizWordWrap = 'normal' | 'breakWord' | 'none';

/** @namespace DevExpress.utils */
export type VizTextOverflow = 'ellipsis' | 'hide' | 'none';

/** @namespace DevExpress.utils */
export type VizPaletteExtensionMode = 'alternate' | 'blend' | 'extrapolate';

/** @namespace DevExpress.utils */
export type VizPaletteColorSet = 'simpleSet' | 'indicatingSet' | 'gradientSet';

/** @namespace DevExpress.utils */
export type CircularGaugeElementOrientation = 'center' | 'inside' | 'outside';

/** @namespace DevExpress.utils */
export type GaugeOverlappingBehavior = 'first' | 'last';

/** @namespace DevExpress.utils */
export type ScaleLabelOverlappingBehavior = 'hide' | 'none';

/** @namespace DevExpress.utils */
export type BarGaugeResolveLabelOverlapping = 'hide' | 'none';

/** @namespace DevExpress.utils */
export type OverlappingBehavior = 'rotate' | 'stagger' | 'none' | 'hide';

/** @namespace DevExpress.utils */
export type Orientation = 'horizontal' | 'vertical';

/** @namespace DevExpress.utils */
export type DropFeedbackMode = 'push' | 'indicate';

/** @namespace DevExpress.utils */
export type VerticalAlignment = 'bottom' | 'center' | 'top';

/** @namespace DevExpress.utils */
export type HorizontalAlignment = 'center' | 'left' | 'right';

/** @namespace DevExpress.utils */
export type VerticalEdge = 'bottom' | 'top';

/** @namespace DevExpress.utils */
export type DashStyle = 'dash' | 'dot' | 'longDash' | 'solid';

/** @namespace DevExpress.utils */
export type ResizeHandle = 'bottom' | 'left' | 'right' | 'top' | 'all';

/** @namespace DevExpress.utils */
export type BoxDirection = 'col' | 'row';

/** @namespace DevExpress.utils */
export type BoxAlign = 'center' | 'end' | 'space-around' | 'space-between' | 'start';

/** @namespace DevExpress.utils */
export type BoxCrossAlign = 'center' | 'end' | 'start' | 'stretch';

// eslint-disable-next-line @typescript-eslint/no-type-alias
/** @namespace DevExpress.utils */
export type Mode = 'auto';

/** @namespace DevExpress.utils */
export type SparklineType = 'area' | 'bar' | 'line' | 'spline' | 'splinearea' | 'steparea' | 'stepline' | 'winloss';

/** @namespace DevExpress.utils */
export type VizPointSymbol = 'circle' | 'cross' | 'polygon' | 'square' | 'triangle';

/** @namespace DevExpress.utils */
export type CalendarZoomLevel = 'century' | 'decade' | 'month' | 'year';

/** @namespace DevExpress.utils */
export type ChartResolveLabelOverlapping = 'hide' | 'none' | 'stack';

/** @namespace DevExpress.utils */
export type FunnelResolveLabelOverlapping = 'hide' | 'none' | 'shift';

/** @namespace DevExpress.utils */
export type SeriesType = 'area' | 'bar' | 'bubble' | 'candlestick' | 'fullstackedarea' | 'fullstackedbar' | 'fullstackedline' | 'fullstackedspline' | 'fullstackedsplinearea' | 'line' | 'rangearea' | 'rangebar' | 'scatter' | 'spline' | 'splinearea' | 'stackedarea' | 'stackedbar' | 'stackedline' | 'stackedspline' | 'stackedsplinearea' | 'steparea' | 'stepline' | 'stock';

/** @namespace DevExpress.utils */
export type AnnotationType = 'text' | 'image' | 'custom';

/** @namespace DevExpress.utils */
export type Position = 'bottom' | 'left' | 'right' | 'top';

/** @namespace DevExpress.utils */
export type ChartLegendHoverMode = 'excludePoints' | 'includePoints' | 'none';

/** @namespace DevExpress.utils */
export type RelativePosition = 'inside' | 'outside';

/** @namespace DevExpress.utils */
export type DiscreteAxisDivisionMode = 'betweenLabels' | 'crossLabels';

/** @namespace DevExpress.utils */
export type ScaleBreakLineStyle = 'straight' | 'waved';

/** @namespace DevExpress.utils */
export type VizTimeInterval = 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';

/** @namespace DevExpress.utils */
export type VisualRangeUpdateMode = 'auto' | 'keep' | 'reset' | 'shift';

/** @namespace DevExpress.utils */
export type ChartZoomPanAction = 'zoom' | 'pan';

/** @namespace DevExpress.utils */
export type AxisScaleType = 'continuous' | 'discrete' | 'logarithmic';

/** @namespace DevExpress.utils */
export type ChartDataType = 'datetime' | 'numeric' | 'string';

/** @namespace DevExpress.utils */
export type ArgumentAxisHoverMode = 'allArgumentPoints' | 'none';

/** @namespace DevExpress.utils */
export type EditorApplyValueMode = 'instantly' | 'useButtons';

/** @namespace DevExpress.utils */
export type ShowSubmenuMode = 'onClick' | 'onHover';

/** @namespace DevExpress.utils */
export type ContextMenuSubmenuDirection = 'auto' | 'left' | 'right';

/** @namespace DevExpress.utils */
export type HorizontalEdge = 'left' | 'right';

/** @namespace DevExpress.utils */
export type SortOrder = 'asc' | 'desc';

/** @namespace DevExpress.utils */
export type FilterBuilderFieldFilterOperations = '=' | '<>' | '<' | '<=' | '>' | '>=' | 'contains' | 'endswith' | 'isblank' | 'isnotblank' | 'notcontains' | 'startswith' | 'between';

/** @namespace DevExpress.utils */
export type FilterBuilderGroupOperations = 'and' | 'or' | 'notAnd' | 'notOr';

/** @namespace DevExpress.utils */
export type FilterType = 'exclude' | 'include';

/** @namespace DevExpress.utils */
export type ShowScrollbarMode = 'always' | 'never' | 'onHover' | 'onScroll';

/** @namespace DevExpress.utils */
export type SelectAllMode = 'allPages' | 'page';

/** @namespace DevExpress.utils */
export type StateStoringType = 'custom' | 'localStorage' | 'sessionStorage';

/** @namespace DevExpress.utils */
export type DateBoxType = 'date' | 'datetime' | 'time';

/** @namespace DevExpress.utils */
export type DateBoxPickerType = 'calendar' | 'list' | 'native' | 'rollers';

/** @namespace DevExpress.utils */
export type FileUploadMode = 'instantly' | 'useButtons' | 'useForm';

/** @namespace DevExpress.utils */
export type UploadHttpMethod = 'POST' | 'PUT';

/** @namespace DevExpress.utils */
export type FormLabelLocation = 'left' | 'right' | 'top';

/** @namespace DevExpress.utils */
export type FormItemEditorType = 'dxAutocomplete' | 'dxCalendar' | 'dxCheckBox' | 'dxColorBox' | 'dxDateBox' | 'dxDropDownBox' | 'dxHtmlEditor' | 'dxLookup' | 'dxNumberBox' | 'dxRadioGroup' | 'dxRangeSlider' | 'dxSelectBox' | 'dxSlider' | 'dxSwitch' | 'dxTagBox' | 'dxTextArea' | 'dxTextBox';

/** @namespace DevExpress.utils */
export type FormItemType = 'empty' | 'group' | 'simple' | 'tabbed' | 'button';

/** @namespace DevExpress.utils */
export type FunnelAlgorithm = 'dynamicHeight' | 'dynamicSlope';

/** @namespace DevExpress.utils */
export type HatchingDirection = 'left' | 'none' | 'right';

/** @namespace DevExpress.utils */
export type FunnelLabelPosition = 'columns' | 'inside' | 'outside';

/** @namespace DevExpress.utils */
export type SankeyLabelOverlappingBehavior = 'ellipsis' | 'hide' | 'none';

/** @namespace DevExpress.utils */
export type SankeyColorMode = 'none' | 'source' | 'target' | 'gradient';

/** @namespace DevExpress.utils */
export type ListMenuMode = 'context' | 'slide';

/** @namespace DevExpress.utils */
export type ListItemDeleteMode = 'context' | 'slideButton' | 'slideItem' | 'static' | 'swipe' | 'toggle';

/** @namespace DevExpress.utils */
export type ListPageLoadMode = 'nextButton' | 'scrollBottom';

/** @namespace DevExpress.utils */
export type CollectionSearchMode = 'contains' | 'startswith' | 'equals';

/** @namespace DevExpress.utils */
export type GeoMapType = 'hybrid' | 'roadmap' | 'satellite';

/** @namespace DevExpress.utils */
export type GeoMapProvider = 'bing' | 'google' | 'googleStatic';

/** @namespace DevExpress.utils */
export type GeoMapRouteMode = 'driving' | 'walking';

/** @namespace DevExpress.utils */
export type SubmenuDirection = 'auto' | 'leftOrTop' | 'rightOrBottom';

/** @namespace DevExpress.utils */
export type NumberBoxMode = 'number' | 'text' | 'tel';

/** @namespace DevExpress.utils */
export type Toolbar = 'bottom' | 'top';

/** @namespace DevExpress.utils */
export type ToolbarItemWidget = 'dxAutocomplete' | 'dxButton' | 'dxCheckBox' | 'dxDateBox' | 'dxMenu' | 'dxSelectBox' | 'dxTabs' | 'dxTextBox' | 'dxButtonGroup' | 'dxDropDownButton';

/** @namespace DevExpress.utils */
export type ToolbarItemLocation = 'after' | 'before' | 'center';

/** @namespace DevExpress.utils */
export type RangeSelectorAxisScaleType = 'continuous' | 'discrete' | 'logarithmic' | 'semidiscrete';

/** @namespace DevExpress.utils */
export type ValueChangedCallMode = 'onMoving' | 'onMovingComplete';

/** @namespace DevExpress.utils */
export type BackgroundImageLocation = 'center' | 'centerBottom' | 'centerTop' | 'full' | 'leftBottom' | 'leftCenter' | 'leftTop' | 'rightBottom' | 'rightCenter' | 'rightTop';

/** @namespace DevExpress.utils */
export type RangeSelectorChartAxisScaleType = 'continuous' | 'logarithmic';

/** @namespace DevExpress.utils */
export type SliderTooltipShowMode = 'always' | 'onHover';

/** @namespace DevExpress.utils */
export type SchedulerViewType = 'agenda' | 'day' | 'month' | 'timelineDay' | 'timelineMonth' | 'timelineWeek' | 'timelineWorkWeek' | 'week' | 'workWeek';

/** @namespace DevExpress.utils */
export type MaxAppointmentsPerCell = 'auto' | 'unlimited';

/** @namespace DevExpress.utils */
export type SchedulerRecurrenceEditMode = 'dialog' | 'occurrence' | 'series';

/** @namespace DevExpress.utils */
export type SchedulerScrollingMode = 'standard' | 'virtual';

/** @namespace DevExpress.utils */
export type ScrollDirection = 'both' | 'horizontal' | 'vertical';

/** @namespace DevExpress.utils */
export type DragDirection = 'both' | 'horizontal' | 'vertical';

/** @namespace DevExpress.utils */
export type SlideOutMenuPosition = 'inverted' | 'normal';

/** @namespace DevExpress.utils */
export type DrawerOpenedStateMode = 'overlap' | 'shrink' | 'push';

/** @namespace DevExpress.utils */
export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom' | 'before' | 'after';

/** @namespace DevExpress.utils */
export type DrawerRevealMode = 'slide' | 'expand';

/** @namespace DevExpress.utils */
export type TextBoxMode = 'email' | 'password' | 'search' | 'tel' | 'text' | 'url';

/** @namespace DevExpress.utils */
export type ShowMaskMode = 'always' | 'onFocus';

/** @namespace DevExpress.utils */
export type ToastType = 'custom' | 'error' | 'info' | 'success' | 'warning';

/** @namespace DevExpress.utils */
export type ToolbarItemLocateInMenuMode = 'always' | 'auto' | 'never';

/** @namespace DevExpress.utils */
export type ToolbarItemShowTextMode = 'always' | 'inMenu';

/** @namespace DevExpress.utils */
export type TreeMapLayoutAlgorithm = 'sliceanddice' | 'squarified' | 'strip';

/** @namespace DevExpress.utils */
export type TreeMapLayoutDirection = 'leftBottomRightTop' | 'leftTopRightBottom' | 'rightBottomLeftTop' | 'rightTopLeftBottom';

/** @namespace DevExpress.utils */
export type TreeMapColorizerType = 'discrete' | 'gradient' | 'none' | 'range';

/** @namespace DevExpress.utils */
export type TreeViewDataStructure = 'plain' | 'tree';

/** @namespace DevExpress.utils */
export type TreeViewCheckBoxMode = 'none' | 'normal' | 'selectAll';

/** @namespace DevExpress.utils */
export type TreeViewExpandEvent = 'dblclick' | 'click';

/** @namespace DevExpress.utils */
export type VectorMapLayerType = 'area' | 'line' | 'marker';

/** @namespace DevExpress.utils */
export type VectorMapMarkerType = 'bubble' | 'dot' | 'image' | 'pie';

/** @namespace DevExpress.utils */
export type VectorMapMarkerShape = 'circle' | 'square';

/** @namespace DevExpress.utils */
export type VectorMapProjection = 'equirectangular' | 'lambert' | 'mercator' | 'miller';

/** @namespace DevExpress.utils */
export type AnimationType = 'css' | 'fade' | 'fadeIn' | 'fadeOut' | 'pop' | 'slide' | 'slideIn' | 'slideOut';

/** @namespace DevExpress.utils */
export type Direction = 'bottom' | 'left' | 'right' | 'top';

/** @namespace DevExpress.utils */
export type ChartSeriesHoverMode = 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'nearestPoint' | 'none' | 'onlyPoint';

/** @namespace DevExpress.utils */
export type ChartSeriesSelectionMode = 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'none' | 'onlyPoint';

/** @namespace DevExpress.utils */
export type ChartPointInteractionMode = 'allArgumentPoints' | 'allSeriesPoints' | 'none' | 'onlyPoint';

/** @namespace DevExpress.utils */
export type PointSymbol = 'circle' | 'cross' | 'polygon' | 'square' | 'triangleDown' | 'triangleUp';

/** @namespace DevExpress.utils */
export type ValueErrorBarDisplayMode = 'auto' | 'high' | 'low' | 'none';

/** @namespace DevExpress.utils */
export type ValueErrorBarType = 'fixed' | 'percent' | 'stdDeviation' | 'stdError' | 'variance';

/** @namespace DevExpress.utils */
export type ValidationRuleType = 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';

/** @namespace DevExpress.utils */
export type ComparisonOperator = '!=' | '!==' | '<' | '<=' | '==' | '===' | '>' | '>=';

/** @namespace DevExpress.utils */
export type FilterBuilderFieldDataType = 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime';

/** @namespace DevExpress.utils */
export type TextEditorButtonLocation = 'after' | 'before';

// eslint-disable-next-line @typescript-eslint/no-type-alias
/** @namespace DevExpress.utils */
export type TextBoxButtonName = 'clear';

/** @namespace DevExpress.utils */
export type NumberBoxButtonName = 'clear' | 'spins';

/** @namespace DevExpress.utils */
export type DropDownEditorButtonName = 'clear' | 'dropDown';

/** @namespace DevExpress.utils */
export type ApplyChangesMode = 'instantly' | 'onDemand';

/** @namespace DevExpress.utils */
export type PositionAlignment = 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top';

/** @namespace DevExpress.utils */
export type PositionResolveCollisionXY = 'fit' | 'fit flip' | 'fit flipfit' | 'fit none' | 'flip' | 'flip fit' | 'flip none' | 'flipfit' | 'flipfit fit' | 'flipfit none' | 'none' | 'none fit' | 'none flip' | 'none flipfit';

/** @namespace DevExpress.utils */
export type PositionResolveCollision = 'fit' | 'flip' | 'flipfit' | 'none';

/** @namespace DevExpress.utils */
export type DataSourceStoreType = 'array' | 'local' | 'odata';

/** @namespace DevExpress.utils */
export type ExportFormat = 'GIF' | 'JPEG' | 'PDF' | 'PNG' | 'SVG';

/** @namespace DevExpress.utils */
export type ExcelFontUnderlineType = 'double' | 'doubleAccounting' | 'none' | 'single' | 'singleAccounting';

/** @namespace DevExpress.utils */
export type HtmlEditorValueType = 'html' | 'markdown';

/** @namespace DevExpress.utils */
export type HtmlEditorToolbarItem = 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'image' | 'size' | 'strike' | 'subscript' | 'superscript' | 'underline' | 'blockquote' | 'header' | 'increaseIndent' | 'decreaseIndent' | 'orderedList' | 'bulletList' | 'alignLeft' | 'alignCenter' | 'alignRight' | 'alignJustify' | 'codeBlock' | 'variable' | 'separator' | 'undo' | 'redo' | 'clear' | 'cellProperties' | 'tableProperties' | 'insertTable' | 'insertHeaderRow' | 'insertRowAbove' | 'insertRowBelow' | 'insertColumnLeft' | 'insertColumnRight' | 'deleteColumn' | 'deleteRow' | 'deleteTable';

/** @namespace DevExpress.utils */
export type HtmlEditorFormat = 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'size' | 'strike' | 'script' | 'underline' | 'blockquote' | 'header' | 'indent' | 'list' | 'align' | 'code-block';

/** @namespace DevExpress.utils */
export type HtmlEditorContextMenuItem = 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'image' | 'strike' | 'subscript' | 'superscript' | 'underline' | 'blockquote' | 'increaseIndent' | 'decreaseIndent' | 'orderedList' | 'bulletList' | 'alignLeft' | 'alignCenter' | 'alignRight' | 'alignJustify' | 'codeBlock' | 'variable' | 'undo' | 'redo' | 'clear' | 'insertTable' | 'insertHeaderRow' | 'insertRowAbove' | 'insertRowBelow' | 'insertColumnLeft' | 'insertColumnRight' | 'deleteColumn' | 'deleteRow' | 'deleteTable' | 'cellProperties' | 'tableProperties';

/** @namespace DevExpress.utils */
export type HtmlEditorImageUploadTab = 'url' | 'file';

/** @namespace DevExpress.utils */
export type HtmlEditorImageUploadFileUploadMode = 'base64' | 'server' | 'both';

/** @namespace DevExpress.utils */
export type EditorStylingMode = 'outlined' | 'underlined' | 'filled';

/** @namespace DevExpress.utils */
export type EditorLabelMode = 'static' | 'floating' | 'hidden';

/** @namespace DevExpress.utils */
export type FormLabelMode = 'static' | 'floating' | 'hidden' | 'outside';

/** @namespace DevExpress.utils */
export type FileManagerToolbarItem = 'showNavPane' | 'create' | 'upload' | 'refresh' | 'switchView' | 'download' | 'move' | 'copy' | 'rename' | 'delete' | 'clearSelection' | 'separator';

/** @namespace DevExpress.utils */
export type FileManagerContextMenuItem = 'create' | 'upload' | 'refresh' | 'download' | 'move' | 'copy' | 'rename' | 'delete';

/** @namespace DevExpress.utils */
export type FileManagerItemViewMode = 'details' | 'thumbnails';

/** @namespace DevExpress.utils */
export type FileManagerViewArea = 'navPane' | 'itemView';

/** @namespace DevExpress.utils */
export type LegendMarkerState = 'normal' | 'hovered' | 'selected';

/** @namespace DevExpress.utils */
export type ValidationStatus = 'valid' | 'invalid' | 'pending';

/** @namespace DevExpress.utils */
export type FloatingActionButtonDirection = 'auto' | 'up' | 'down';

/** @namespace DevExpress.utils */
export type AllDayPanelMode = 'all' | 'allDay' | 'hidden';
