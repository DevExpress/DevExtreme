
/**
 * @name Enums
 * @type Object
 */

/**
 * @typedef {string} Enums.ButtonType
 * @enum {'back'|'danger'|'default'|'normal'|'success'}
 */

/**
 * @typedef {string} Enums.ButtonStylingMode
 * @enum {'text'|'outlined'|'contained'}
 */

/**
 * @typedef {string} Enums.EventKeyModifier
 * @enum {'alt'|'ctrl'|'meta'|'shift'}
 */

/**
 * @typedef {number} Enums.FirstDayOfWeek
 * @enum {0|1|2|3|4|5|6}
 */

/**
 * @typedef {number} Enums.PivotGridFieldChooserLayout
* @enum {0|1|2}
*/

/**
 * @typedef {string} Enums.DropDownSearchMode
 * @enum {'contains'|'startswith'}
 */

/**
 * @typedef {string} Enums.ValidationMessageMode
 * @enum {'always'|'auto'}
 */

/**
 * @typedef {string} Enums.GaugeTitlePosition
 * @enum {'bottom-center'|'bottom-left'|'bottom-right'|'top-center'|'top-left'|'top-right'}
 */

/**
 * @typedef {string} Enums.VizAnimationEasing
 * @enum {'easeOutCubic'|'linear'}
 */

/**
 * @typedef {string} Enums.Format
 * @enum {'billions'|'currency'|'day'|'decimal'|'exponential'|'fixedPoint'|'largeNumber'|'longDate'|'longTime'|'millions'|'millisecond'|'month'|'monthAndDay'|'monthAndYear'|'percent'|'quarter'|'quarterAndYear'|'shortDate'|'shortTime'|'thousands'|'trillions'|'year'|'dayOfWeek'|'hour'|'longDateLongTime'|'minute'|'second'|'shortDateShortTime'}
 */

/**
 * @typedef {string} Enums.VizTheme
 * @enum {'generic.dark'|'generic.light'|'generic.contrast'|'generic.carmine'|'generic.darkmoon'|'generic.darkviolet'|'generic.greenmist'|'generic.softblue'|'material.blue.light'|'material.lime.light'|'material.orange.light'|'material.purple.light'|'material.teal.light'}
 */

/**
 * @typedef {string} Enums.VizPalette
 * @enum {'Bright'|'Harmony Light'|'Ocean'|'Pastel'|'Soft'|'Soft Pastel'|'Vintage'|'Violet'|'Carmine'|'Dark Moon'|'Dark Violet'|'Green Mist'|'Soft Blue'|'Material'|'Office'}
 */

/**
 * @typedef {string} Enums.VizWordWrap
 * @enum {'normal'|'breakWord'|'none'}
 */

/**
  * @typedef {string} Enums.VizTextOverflow
  * @enum {'ellipsis'|'hide'|'none'}
  */

/**
 * @typedef {string} Enums.VizPaletteExtensionMode
 * @enum {'alternate'|'blend'|'extrapolate'}
 */

/**
 * @typedef {string} Enums.VizPaletteColorSet
 * @enum {'simpleSet'|'indicatingSet'|'gradientSet'}
 */

/**
 * @typedef {string} Enums.CircularGaugeElementOrientation
 * @enum {'center'|'inside'|'outside'}
 */

/**
 * @typedef {string} Enums.GaugeOverlappingBehavior
 * @enum {'first'|'last'}
 */

/**
 * @typedef {string} Enums.ScaleLabelOverlappingBehavior
 * @enum {'hide'|'none'}
 */

/**
 * @typedef {string} Enums.BarGaugeResolveLabelOverlapping
 * @enum {'hide'|'none'}
 */

/**
 * @typedef {string} Enums.OverlappingBehavior
 * @enum {'rotate'|'stagger'|'none'|'hide'}
 */

/**
 * @typedef {string} Enums.PolarChartOverlappingBehavior
 * @enum {'none'|'hide'}
 */

/**
 * @typedef {string} Enums.Orientation
 * @enum {'horizontal'|'vertical'}
 */

/**
 * @typedef {string} Enums.DropFeedbackMode
 * @enum {'push'|'indicate'}
 */

/**
 * @typedef {string} Enums.VerticalAlignment
 * @enum {'bottom'|'center'|'top'}
 */

/**
 * @typedef {string} Enums.HorizontalAlignment
 * @enum {'center'|'left'|'right'}
 */

/**
 * @typedef {string} Enums.VerticalEdge
 * @enum {'bottom'|'top'}
 */

/**
 * @typedef {string} Enums.DashStyle
 * @enum {'dash'|'dot'|'longDash'|'solid'}
 */

/**
 * @typedef {string} Enums.ResizeHandle
 * @enum {'bottom'|'left'|'right'|'top'|'all'}
 */

/**
 * @typedef {string} Enums.BoxDirection
 * @enum {'col'|'row'}
 */

/**
 * @typedef {string} Enums.BoxAlign
 * @enum {'center'|'end'|'space-around'|'space-between'|'start'}
 */

/**
 * @typedef {string} Enums.BoxCrossAlign
 * @enum {'center'|'end'|'start'|'stretch'}
 */

/**
 * @typedef {string} Enums.ButtonGroupSelectionMode
 * @enum {'multiple'|'single'}
 */

/**
 * @typedef {string} Enums.Mode
 * @enum {'auto'}
 */

/**
 * @typedef {string} Enums.SparklineType
 * @enum {'area'|'bar'|'line'|'spline'|'splinearea'|'steparea'|'stepline'|'winloss'}
 */

/**
 * @typedef {string} Enums.VizPointSymbol
 * @enum {'circle'|'cross'|'polygon'|'square'|'triangle'}
 */

/**
 * @typedef {string} Enums.CalendarZoomLevel
 * @enum {'century'|'decade'|'month'|'year'}
 */

/**
 * @typedef {string} Enums.ChartResolveLabelOverlapping
 * @enum {'hide'|'none'|'stack'}
 */

/**
 * @typedef {string} Enums.FunnelResolveLabelOverlapping
 * @enum {'hide'|'none'|'shift'}
 */

/**
 * @typedef {string} Enums.ChartElementSelectionMode
 * @enum {'multiple'|'single'}
 */

/**
 * @typedef {string} Enums.SeriesType
 * @enum {'area'|'bar'|'bubble'|'candlestick'|'fullstackedarea'|'fullstackedbar'|'fullstackedline'|'fullstackedspline'|'fullstackedsplinearea'|'line'|'rangearea'|'rangebar'|'scatter'|'spline'|'splinearea'|'stackedarea'|'stackedbar'|'stackedline'|'stackedspline'|'stackedsplinearea'|'steparea'|'stepline'|'stock'}
 */

/**
 * @typedef {string} Enums.AnnotationType
 * @enum {'text'|'image'|'custom'}
 */

/**
 * @typedef {string} Enums.Position
 * @enum {'bottom'|'left'|'right'|'top'}
 */

/**
 * @typedef {string} Enums.ChartPointerType
 * @enum {'all'|'mouse'|'none'|'touch'}
 */

/**
 * @typedef {string} Enums.ChartZoomAndPanMode
 * @enum {'both'|'none'|'pan'|'zoom'}
 */

/**
 * @typedef {string} Enums.ChartLegendHoverMode
 * @enum {'excludePoints'|'includePoints'|'none'}
 */

/**
 * @typedef {string} Enums.RelativePosition
 * @enum {'inside'|'outside'}
 */

/**
 * @typedef {string} Enums.DiscreteAxisDivisionMode
 * @enum {'betweenLabels'|'crossLabels'}
 */

/**
 * @typedef {string} Enums.ScaleBreakLineStyle
 * @enum {'straight'|'waved'}
 */

/**
 * @typedef {string} Enums.ChartLabelDisplayMode
 * @enum {'rotate'|'stagger'|'standard'}
 */

/**
 * @typedef {string} Enums.VizTimeInterval
 * @enum {'day'|'hour'|'millisecond'|'minute'|'month'|'quarter'|'second'|'week'|'year'}
 */

/**
 * @typedef {string} Enums.VisualRangeUpdateMode
 * @enum {'auto'|'keep'|'reset'|'shift'}
 */

/**
 * @typedef {string} Enums.ValueAxisVisualRangeUpdateMode
 * @enum {'auto'|'keep'|'reset'}
 */

/**
 * @typedef {string} Enums.ChartZoomPanActionType
 * @enum {'zoom'|'pan'}
 */

/**
 * @typedef {string} Enums.AxisScaleType
 * @enum {'continuous'|'discrete'|'logarithmic'}
 */

/**
 * @typedef {string} Enums.ChartDataType
 * @enum {'datetime'|'numeric'|'string'}
 */

/**
 * @typedef {string} Enums.ArgumentAxisHoverMode
 * @enum {'allArgumentPoints'|'none'}
 */

/**
 * @typedef {string} Enums.ChartTooltipLocation
 * @enum {'center'|'edge'}
 */

/**
 * @typedef {string} Enums.PieChartLegendHoverMode
 * @enum {'none'|'allArgumentPoints'}
 */

/**
 * @typedef {string} Enums.PieChartResolveLabelOverlapping
 * @enum {'hide'|'none'|'shift'}
 */

/**
 * @typedef {string} Enums.PieChartType
 * @enum {'donut'|'doughnut'|'pie'}
 */

/**
 * @typedef {string} Enums.PieChartSegmentsDirection
 * @enum {'anticlockwise'|'clockwise'}
 */

/**
  * @typedef {string} Enums.PieChartAnnotationLocation
  * @enum {'center'|'edge'}
  */

/**
 * @typedef {string} Enums.PolarChartResolveLabelOverlapping
 * @enum {'hide'|'none'}
 */

/**
 * @typedef {string} Enums.PolarChartSeriesType
 * @enum {'area'|'bar'|'line'|'scatter'|'stackedbar'}
 */

/**
 * @typedef {string} Enums.EditorApplyValueMode
 * @enum {'instantly'|'useButtons'}
 */

/**
 * @typedef {string} Enums.ShowSubmenuMode
 * @enum {'onClick'|'onHover'}
 */

/**
 * @typedef {string} Enums.MenuSelectionMode
 * @enum {'none'|'single'}
 */

/**
 * @typedef {string} Enums.ContextMenuSubmenuDirection
 * @enum {'auto'|'left'|'right'}
 */

/**
 * @typedef {string} Enums.GridColumnChooserMode
 * @enum {'dragAndDrop'|'select'}
 */

/**
 * @typedef {string} Enums.ColumnResizingMode
 * @enum {'nextColumn'|'widget'}
 */

/**
 * @typedef {string} Enums.HorizontalEdge
 * @enum {'left'|'right'}
 */

/**
 * @typedef {string} Enums.GridColumnDataType
 * @enum {'string'|'number'|'date'|'boolean'|'object'|'datetime'}
 */

/**
 * @typedef {string} Enums.SortOrder
 * @enum {'asc'|'desc'}
 */

/**
 * @typedef {string} Enums.FilterBuilderFieldFilterOperations
 * @enum {'='|'<>'|'<'|'<='|'>'|'>='|'contains'|'endswith'|'isblank'|'isnotblank'|'notcontains'|'startswith'|'between'}
 */

/**
 * @typedef {string} Enums.FilterBuilderGroupOperations
 * @enum {'and'|'or'|'notAnd'|'notOr'}
 */

/**
 * @typedef {string} Enums.FilterOperations
 * @enum {'<'|'<='|'<>'|'='|'>'|'>='|'between'|'contains'|'endswith'|'notcontains'|'startswith'}
 */

/**
 * @typedef {string} Enums.GridFilterOperations
 * @enum {'='|'<>'|'<'|'<='|'>'|'>='|'contains'|'endswith'|'isblank'|'isnotblank'|'notcontains'|'startswith'|'between'|'anyof'|'noneof'}
 */

/**
 * @typedef {string} Enums.FilterType
 * @enum {'exclude'|'include'}
 */

/**
 * @typedef {string} Enums.HeaderFilterGroupInterval
 * @enum {'day'|'hour'|'minute'|'month'|'quarter'|'second'|'year'}
 */

/**
 * @typedef {string} Enums.GridEditMode
 * @enum {'batch'|'cell'|'row'|'form'|'popup'}
 */

/**
 * @typedef {string} Enums.GridEnterKeyAction
 * @enum {'startEdit'|'moveFocus'}
 */

/**
 * @typedef {string} Enums.GridEnterKeyDirection
 * @enum {'none'|'column'|'row'}
 */

/**
 * @typedef {string} Enums.GridEditRefreshMode
 * @enum {'full'|'reshape'|'repaint'}
 */

/**
 * @typedef {string} Enums.GridApplyFilterMode
 * @enum {'auto'|'onClick'}
 */

/**
 * @typedef {string} Enums.GridGroupingExpandMode
 * @enum {'buttonClick'|'rowClick'}
 */

/**
 * @typedef {string} Enums.GridScrollingMode
 * @enum {'infinite'|'standard'|'virtual'}
 */

/**
 * @typedef {string} Enums.ShowScrollbarMode
 * @enum {'always'|'never'|'onHover'|'onScroll'}
 */

/**
 * @typedef {string} Enums.SelectionMode
 * @enum {'multiple'|'none'|'single'}
 */

/**
 * @typedef {string} Enums.GridSelectionShowCheckBoxesMode
 * @enum {'always'|'none'|'onClick'|'onLongTap'}
 */

/**
 * @typedef {string} Enums.SelectAllMode
 * @enum {'allPages'|'page'}
 */

/**
 * @typedef {string} Enums.SummaryType
 * @enum {'avg'|'count'|'custom'|'max'|'min'|'sum'}
 */

/**
 * @typedef {string} Enums.GridSortingMode
 * @enum {'multiple'|'none'|'single'}
 */

/**
 * @typedef {string} Enums.StateStoringType
 * @enum {'custom'|'localStorage'|'sessionStorage'}
 */

/**
 * @typedef {string} Enums.DateBoxType
 * @enum {'date'|'datetime'|'time'}
 */

/**
 * @typedef {string} Enums.DateBoxPickerType
 * @enum {'calendar'|'list'|'native'|'rollers'}
 */

/**
 * @typedef {string} Enums.FileUploadMode
 * @enum {'instantly'|'useButtons'|'useForm'}
 */

/**
 * @typedef {string} Enums.UploadHttpMethod
 * @enum {'POST'|'PUT'}
 */

/**
 * @typedef {string} Enums.FormLabelLocation
 * @enum {'left'|'right'|'top'}
 */

/**
 * @typedef {string} Enums.FormItemEditorType
 * @enum {'dxAutocomplete'|'dxCalendar'|'dxCheckBox'|'dxColorBox'|'dxDateBox'|'dxDropDownBox'|'dxHtmlEditor'|'dxLookup'|'dxNumberBox'|'dxRadioGroup'|'dxRangeSlider'|'dxSelectBox'|'dxSlider'|'dxSwitch'|'dxTagBox'|'dxTextArea'|'dxTextBox'}
 */

/**
 * @typedef {string} Enums.FormItemType
 * @enum {'empty'|'group'|'simple'|'tabbed'|'button'}
 */

/**
 * @typedef {string} Enums.FunnelAlgorithm
 * @enum {'dynamicHeight'|'dynamicSlope'}
 */

/**
 * @typedef {string} Enums.HatchingDirection
 * @enum {'left'|'none'|'right'}
 */

/**
 * @typedef {string} Enums.FunnelLabelPosition
 * @enum {'columns'|'inside'|'outside'}
 */

/**
 * @typedef {string} Enums.SankeyLabelOverlappingBehavior
 * @enum {'ellipsis'|'hide'|'none'}
 */

/**
 * @typedef {string} Enums.SankeyColorMode
 * @enum {'none'|'source'|'target'|'gradient'}
 */

/**
 * @typedef {string} Enums.ListSelectionMode
 * @enum {'all'|'multiple'|'none'|'single'}
 */

/**
 * @typedef {string} Enums.ListMenuMode
 * @enum {'context'|'slide'}
 */

/**
 * @typedef {string} Enums.ListItemDeleteMode
 * @enum {'context'|'slideButton'|'slideItem'|'static'|'swipe'|'toggle'}
 */

/**
 * @typedef {string} Enums.ListPageLoadMode
 * @enum {'nextButton'|'scrollBottom'}
 */

/**
 * @typedef {string} Enums.CollectionSearchMode
 * @enum {'contains'|'startswith'|'equals'}
 */

/**
 * @typedef {string} Enums.GeoMapType
 * @enum {'hybrid'|'roadmap'|'satellite'}
 */

/**
 * @typedef {string} Enums.GeoMapProvider
 * @enum {'bing'|'google'|'googleStatic'}
 */

/**
 * @typedef {string} Enums.GeoMapRouteMode
 * @enum {'driving'|'walking'}
 */

/**
 * @typedef {string} Enums.SubmenuDirection
 * @enum {'auto'|'leftOrTop'|'rightOrBottom'}
 */

/**
 * @typedef {string} Enums.NavSelectionMode
 * @enum {'multiple'|'single'}
 */

/**
 * @typedef {string} Enums.NumberBoxMode
 * @enum {'number'|'text'|'tel'}
 */

/**
 * @typedef {string} Enums.PivotGridScrollingMode
 * @enum {'standard'|'virtual'}
 */

/**
 * @typedef {string} Enums.PivotGridDataFieldArea
 * @enum {'column'|'row'}
 */

/**
 * @typedef {string} Enums.PivotGridTotalsDisplayMode
 * @enum {'both'|'columns'|'none'|'rows'}
 */

/**
 * @typedef {string} Enums.PivotGridRowHeadersLayout
 * @enum {'standard'|'tree'}
 */

/**
 * @typedef {string} Enums.Toolbar
 * @enum {'bottom'|'top'}
 */

/**
 * @typedef {string} Enums.ToolbarItemWidget
 * @enum {'dxAutocomplete'|'dxButton'|'dxCheckBox'|'dxDateBox'|'dxMenu'|'dxSelectBox'|'dxTabs'|'dxTextBox'|'dxButtonGroup'|'dxDropDownButton'}
 */

/**
 * @typedef {string} Enums.ToolbarItemLocation
 * @enum {'after'|'before'|'center'}
 */

/**
 * @typedef {string} Enums.RangeSelectorAxisScaleType
 * @enum {'continuous'|'discrete'|'logarithmic'|'semidiscrete'}
 */

/**
 * @typedef {string} Enums.ValueChangedCallMode
 * @enum {'onMoving'|'onMovingComplete'}
 */

/**
 * @typedef {string} Enums.BackgroundImageLocation
 * @enum {'center'|'centerBottom'|'centerTop'|'full'|'leftBottom'|'leftCenter'|'leftTop'|'rightBottom'|'rightCenter'|'rightTop'}
 */

/**
 * @typedef {string} Enums.RangeSelectorChartAxisScaleType
 * @enum {'continuous'|'logarithmic'}
 */

/**
 * @typedef {string} Enums.SliderTooltipShowMode
 * @enum {'always'|'onHover'}
 */

/**
 * @typedef {string} Enums.SchedulerViewType
 * @enum {'agenda'|'day'|'month'|'timelineDay'|'timelineMonth'|'timelineWeek'|'timelineWorkWeek'|'week'|'workWeek'}
 */

/**
 * @typedef {string} Enums.MaxAppointmentsPerCell
 * @enum {'auto'|'unlimited'}
 */

/**
 * @typedef {string} Enums.SchedulerRecurrenceEditMode
 * @enum {'dialog'|'occurrence'|'series'}
 */

/**
 * @typedef {string} Enums.SchedulerScrollingMode
 * @enum {'standard'|'virtual'}
 */

/**
 * @typedef {string} Enums.ScrollDirection
 * @enum {'both'|'horizontal'|'vertical'}
 */

/**
 * @typedef {string} Enums.DragDirection
 * @enum {'both'|'horizontal'|'vertical'}
 */

/**
 * @typedef {string} Enums.SlideOutMenuPosition
 * @enum {'inverted'|'normal'}
 */

/**
 * @typedef {string} Enums.DrawerOpenedStateMode
 * @enum {'overlap'|'shrink'|'push'}
 */

/**
 * @typedef {string} Enums.DrawerPosition
 * @enum {'left'|'right'|'top'|'bottom'|'before'|'after'}
 */

/**
 * @typedef {string} Enums.DrawerRevealMode
 * @enum {'slide'|'expand'}
 */

/**
 * @typedef {string} Enums.TextBoxMode
 * @enum {'email'|'password'|'search'|'tel'|'text'|'url'}
 */

/**
 * @typedef {string} Enums.ShowMaskMode
 * @enum {'always'|'onFocus'}
 */

/**
 * @typedef {string} Enums.ToastType
 * @enum {'custom'|'error'|'info'|'success'|'warning'}
 */

/**
 * @typedef {string} Enums.ToolbarItemLocateInMenuMode
 * @enum {'always'|'auto'|'never'}
 */

/**
 * @typedef {string} Enums.ToolbarItemShowTextMode
 * @enum {'always'|'inMenu'}
 */

/**
 * @typedef {string} Enums.ToolbarRenderMode
 * @enum {'bottomToolbar'|'topToolbar'}
 */

/**
 * @typedef {string} Enums.TreeListDataStructure
 * @enum {'plain'|'tree'}
 */

/**
 * @typedef {string} Enums.TreeListScrollingMode
 * @enum {'standard'|'virtual'}
 */

/**
 * @typedef {string} Enums.GridRowRenderingMode
 * @enum {'standard'|'virtual'}
 */

/**
 * @typedef {string} Enums.GridColumnRenderingMode
 * @enum {'standard'|'virtual'}
 */

/**
 * @typedef {string} Enums.TreeMapLayoutAlgorithm
 * @enum {'sliceanddice'|'squarified'|'strip'}
 */

/**
 * @typedef {string} Enums.TreeMapLayoutDirection
 * @enum {'leftBottomRightTop'|'leftTopRightBottom'|'rightBottomLeftTop'|'rightTopLeftBottom'}
 */

/**
 * @typedef {string} Enums.TreeMapColorizerType
 * @enum {'discrete'|'gradient'|'none'|'range'}
 */

/**
 * @typedef {string} Enums.TreeViewDataStructure
 * @enum {'plain'|'tree'}
 */

/**
 * @typedef {string} Enums.TreeViewCheckBoxMode
 * @enum {'none'|'normal'|'selectAll'}
 */

/**
 * @typedef {string} Enums.TreeViewExpandEvent
 * @enum {'dblclick'|'click'}
 */

/**
 * @typedef {string} Enums.VectorMapLayerType
 * @enum {'area'|'line'|'marker'}
 */

/**
 * @typedef {string} Enums.VectorMapMarkerType
 * @enum {'bubble'|'dot'|'image'|'pie'}
 */

/**
 * @typedef {string} Enums.VectorMapMarkerShape
 * @enum {'circle'|'square'}
 */

/**
 * @typedef {string} Enums.VectorMapProjection
 * @enum {'equirectangular'|'lambert'|'mercator'|'miller'}
 */

/**
 * @typedef {string} Enums.AnimationType
 * @enum {'css'|'fade'|'fadeIn'|'fadeOut'|'pop'|'slide'|'slideIn'|'slideOut'}
 */

/**
 * @typedef {string} Enums.Direction
 * @enum {'bottom'|'left'|'right'|'top'}
 */

/**
 * @typedef {string} Enums.FinancialChartReductionLevel
 * @enum {'close'|'high'|'low'|'open'}
 */

/**
 * @typedef {string} Enums.ChartSeriesHoverMode
 * @enum {'allArgumentPoints'|'allSeriesPoints'|'excludePoints'|'includePoints'|'nearestPoint'|'none'|'onlyPoint'}
 */

/**
 * @typedef {string} Enums.ChartSeriesSelectionMode
 * @enum {'allArgumentPoints'|'allSeriesPoints'|'excludePoints'|'includePoints'|'none'|'onlyPoint'}
 */

/**
 * @typedef {string} Enums.ChartPointInteractionMode
 * @enum {'allArgumentPoints'|'allSeriesPoints'|'none'|'onlyPoint'}
 */

/**
 * @typedef {string} Enums.PointSymbol
 * @enum {'circle'|'cross'|'polygon'|'square'|'triangleDown'|'triangleUp'}
 */

/**
 * @typedef {string} Enums.ValueErrorBarDisplayMode
 * @enum {'auto'|'high'|'low'|'none'}
 */

/**
 * @typedef {string} Enums.ValueErrorBarType
 * @enum {'fixed'|'percent'|'stdDeviation'|'stdError'|'variance'}
 */

/**
 * @typedef {string} Enums.ValidationRuleType
 * @enum {'required'|'numeric'|'range'|'stringLength'|'custom'|'compare'|'pattern'|'email'|'async'}
 */

/**
 * @typedef {string} Enums.ComparisonOperator
 * @enum {'!='|'!=='|'<'|'<='|'=='|'==='|'>'|'>='}
 */

/**
 * @typedef {string} Enums.FilterBuilderFieldDataType
 * @enum {'string'|'number'|'date'|'boolean'|'object'|'datetime'}
 */

/**
 * @typedef {string} Enums.TextEditorButtonLocation
 * @enum {'after'|'before'}
 */

/**
 * @typedef {string} Enums.TextBoxButtonName
 * @enum {'clear'}
 */

/**
 * @typedef {string} Enums.NumberBoxButtonName
 * @enum {'clear'|'spins'}
 */

/**
 * @typedef {string} Enums.DropDownEditorButtonName
 * @enum {'clear'|'dropDown'}
 */

/**
 * @typedef {string} Enums.SmallValuesGroupingMode
 * @enum {'none'|'smallValueThreshold'|'topN'}
 */

/**
 * @typedef {string} Enums.PieChartSeriesInteractionMode
 * @enum {'none'|'onlyPoint'}
 */

/**
 * @typedef {string} Enums.PieChartLabelPosition
 * @enum {'columns'|'inside'|'outside'}
 */

/**
 * @typedef {string} Enums.PivotGridDataType
 * @enum {'date'|'number'|'string'}
 */

/**
 * @typedef {string} Enums.PivotGridGroupInterval
 * @enum {'day'|'dayOfWeek'|'month'|'quarter'|'year'}
 */

/**
 * @typedef {string} Enums.PivotGridArea
 * @enum {'column'|'data'|'filter'|'row'}
 */

/**
 * @typedef {string} Enums.PivotGridSortBy
 * @enum {'displayText'|'value'|'none'}
 */

/**
 * @typedef {string} Enums.ApplyChangesMode
 * @enum {'instantly'|'onDemand'}
 */

/**
 * @typedef {string} Enums.PivotGridSummaryDisplayMode
 * @enum {'absoluteVariation'|'percentOfColumnGrandTotal'|'percentOfColumnTotal'|'percentOfGrandTotal'|'percentOfRowGrandTotal'|'percentOfRowTotal'|'percentVariation'}
 */

/**
 * @typedef {string} Enums.PivotGridRunningTotalMode
 * @enum {'column'|'row'}
 */

/**
 * @typedef {string} Enums.PositionAlignment
 * @enum {'bottom'|'center'|'left'|'left bottom'|'left top'|'right'|'right bottom'|'right top'|'top'}
 */

/**
 * @typedef {string} Enums.PositionResolveCollisionXY
 * @enum {'fit'|'fit flip'|'fit flipfit'|'fit none'|'flip'|'flip fit'|'flip none'|'flipfit'|'flipfit fit'|'flipfit none'|'none'|'none fit'|'none flip'|'none flipfit'}
 */

/**
 * @typedef {string} Enums.PositionResolveCollision
 * @enum {'fit'|'flip'|'flipfit'|'none'}
 */

/**
 * @typedef {string} Enums.ChartSeriesAggregationMethod
 * @enum {'avg'|'count'|'max'|'min'|'ohlc'|'range'|'sum'|'custom'}
 */

/**
 * @typedef {string} Enums.ChartSingleValueSeriesAggregationMethod
 * @enum {'avg'|'count'|'max'|'min'|'sum'|'custom'}
 */

/**
 * @typedef {string} Enums.ChartFinancialSeriesAggregationMethod
 * @enum {'ohlc'|'custom'}
 */

/**
 * @typedef {string} Enums.ChartRangeSeriesAggregationMethod
 * @enum {'range'|'custom'}
 */

/**
 * @typedef {string} Enums.ChartBubbleSeriesAggregationMethod
 * @enum {'avg'|'custom'}
 */

/**
 * @typedef {string} Enums.DataSourceStoreType
 * @enum {'array'|'local'|'odata'}
 */

/**
 * @typedef {string} Enums.PivotGridStoreType
 * @enum {'array'|'local'|'odata'|'xmla'}
 */

/**
 * @typedef {string} Enums.ExportFormat
 * @enum {'GIF'|'JPEG'|'PDF'|'PNG'|'SVG'}
 */

/**
 * @typedef {string} Enums.ExcelFontUnderlineType
 * @enum {'double'|'doubleAccounting'|'none'|'single'|'singleAccounting'}
 */

/**
 * @typedef {string} Enums.ExcelCellHorizontalAlignment
 * @enum {'center'|'centerContinuous'|'distributed'|'fill'|'general'|'justify'|'left'|'right'}
 */

/**
 * @typedef {string} Enums.ExcelCellVerticalAlignment
 * @enum {'bottom'|'center'|'distributed'|'justify'|'top'}
 */

/**
 * @typedef {string} Enums.ExcelCellPatternType
 * @enum {'darkDown'|'darkGray'|'darkGrid'|'darkHorizontal'|'darkTrellis'|'darkUp'|'darkVertical'|'gray0625'|'gray125'|'lightDown'|'lightGray'|'lightGrid'|'lightHorizontal'|'lightTrellis'|'lightUp'|'lightVertical'|'mediumGray'|'none'|'solid'}
 */

/**
 * @typedef {string} Enums.HtmlEditorValueType
 * @enum {'html'|'markdown'}
 */

/**
 * @typedef {string} Enums.HtmlEditorToolbarItem
 * @enum {'background'|'bold'|'color'|'font'|'italic'|'link'|'image'|'size'|'strike'|'subscript'|'superscript'|'underline'|'blockquote'|'header'|'increaseIndent'|'decreaseIndent'|'orderedList'|'bulletList'|'alignLeft'|'alignCenter'|'alignRight'|'alignJustify'|'codeBlock'|'variable'|'separator'|'undo'|'redo'|'clear'|'insertTable'|'insertRowAbove'|'insertRowBelow'|'insertColumnLeft'|'insertColumnRight'|'deleteColumn'|'deleteRow'|'deleteTable'}
 */

/**
 * @typedef {string} Enums.HtmlEditorFormat
 * @enum {'background'|'bold'|'color'|'font'|'italic'|'link'|'size'|'strike'|'script'|'underline'|'blockquote'|'header'|'indent'|'list'|'align'|'code-block'}
 */

/**
 * @typedef {string} Enums.EditorStylingMode
 * @enum {'outlined'|'underlined'|'filled'}
 */

/**
 * @typedef {string} Enums.GridCommandColumnType
 * @enum {'adaptive'|'buttons'|'detailExpand'|'groupExpand'|'selection'|'drag'}
 */

/**
 * @typedef {string} Enums.TreeListCommandColumnType
 * @enum {'adaptive'|'buttons'|'drag'}
 */

/**
 * @typedef {string} Enums.GridColumnButtonName
 * @enum {'cancel'|'delete'|'edit'|'save'|'undelete'}
 */

/**
 * @typedef {string} Enums.TreeListColumnButtonName
 * @enum {'add'|'cancel'|'delete'|'edit'|'save'|'undelete'}
 */

/**
 * @typedef {string} Enums.TreeListFilterMode
 * @enum {'fullBranch'|'withAncestors'|'matchOnly'}
 */

/**
 * @typedef {string} Enums.GridStartEditAction
 * @enum {'click'|'dblClick'}
 */

/**
 * @typedef {string} Enums.FileManagerSelectionMode
 * @enum {'multiple'|'single'}
 */

/**
 * @typedef {string} Enums.FileManagerToolbarItem
 * @enum {'showNavPane'|'create'|'upload'|'refresh'|'switchView'|'download'|'move'|'copy'|'rename'|'delete'|'clearSelection'|'separator'}
 */

/**
 * @typedef {string} Enums.FileManagerContextMenuItem
 * @enum {'create'|'upload'|'refresh'|'download'|'move'|'copy'|'rename'|'delete'}
 */

/**
 * @typedef {string} Enums.FileManagerItemViewMode
 * @enum {'details'|'thumbnails'}
 */

/**
 * @typedef {string} Enums.FileManagerViewArea
 * @enum {'navPane'|'itemView'}
 */

/**
 * @typedef {string} Enums.DiagramDataLayoutType
 * @enum {'auto'|'off'|'tree'|'layered'}
 */
/**
 * @typedef {string} Enums.DiagramDataLayoutOrientation
 * @enum {'vertical'|'horizontal'}
 */

/**
 * @typedef {string} Enums.DiagramUnits
 * @enum {'in'|'cm'|'px'}
 */

/**
 * @typedef {string} Enums.DiagramPageOrientation
 * @enum {'portrait'|'landscape'}
 */

/**
 * @typedef {string} Enums.DiagramShapeCategory
 * @enum {'general'|'flowchart'|'orgChart'|'containers'|'custom'}
 */

/**
 * @typedef {string} Enums.DiagramShapeType
 * @enum {'text'|'rectangle'|'ellipse'|'cross'|'triangle'|'diamond'|'heart'|'pentagon'|'hexagon'|'octagon'|'star'|'arrowLeft'|'arrowTop'|'arrowRight'|'arrowBottom'|'arrowNorthSouth'|'arrowEastWest'|'process'|'decision'|'terminator'|'predefinedProcess'|'document'|'multipleDocuments'|'manualInput'|'preparation'|'data'|'database'|'hardDisk'|'internalStorage'|'paperTape'|'manualOperation'|'delay'|'storedData'|'display'|'merge'|'connector'|'or'|'summingJunction'|'verticalContainer'|'horizontalContainer'|'cardWithImageOnLeft'|'cardWithImageOnTop'|'cardWithImageOnRight'}
 */

/**
 * @typedef {string} Enums.DiagramConnectorLineType
 * @enum {'straight'|'orthogonal'}
 */

/**
 * @typedef {string} Enums.DiagramConnectorLineEnd
 * @enum {'none'|'arrow'|'outlinedTriangle'|'filledTriangle'}
 */

/**
 * @typedef {string} Enums.DiagramToolboxDisplayMode
 * @enum {'icons'|'texts'}
 */

/**
 * @typedef {string} Enums.DiagramCommand
 * @enum {'separator'|'exportSvg'|'exportPng'|'exportJpg'|'undo'|'redo'|'cut'|'copy'|'paste'|'selectAll'|'delete'|'fontName'|'fontSize'|'bold'|'italic'|'underline'|'fontColor'|'lineColor'|'fillColor'|'textAlignLeft'|'textAlignCenter'|'textAlignRight'|'lock'|'unlock'|'sendToBack'|'bringToFront'|'insertShapeImage'|'editShapeImage'|'deleteShapeImage'|'connectorLineType'|'connectorLineStart'|'connectorLineEnd'|'layoutTreeTopToBottom'|'layoutTreeBottomToTop'|'layoutTreeLeftToRight'|'layoutTreeRightToLeft'|'layoutLayeredTopToBottom'|'layoutLayeredBottomToTop'|'layoutLayeredLeftToRight'|'layoutLayeredRightToLeft'|'fullScreen'|'zoomLevel'|'showGrid'|'snapToGrid'|'gridSize'|'units'|'pageSize'|'pageOrientation'|'pageColor'}
 */

/**
 * @typedef {string} Enums.DiagramPanelVisibility
 * @enum {'auto'|'visible'|'collapsed'|'disabled'}
 */

/**
 * @typedef {string} Enums.DiagramAutoZoomMode
 * @enum {'fitContent'|'fitWidth'|'disabled'}
 */

/**
 * @typedef {string} Enums.DiagramItemType
 * @enum {'shape'|'connector'}
 */

/**
 * @typedef {string} Enums.DiagramExportFormat
 * @enum {'svg'|'png'|'jpg'}
 */

/**
 * @typedef {string} Enums.DiagramModelOperation
 * @enum {'addShape'|'addShapeFromToolbox'|'deleteShape'|'deleteConnector'|'changeConnection'|'changeConnectorPoints'|'beforeChangeShapeText'|'changeShapeText'|'beforeChangeConnectorText'|'changeConnectorText'|'resizeShape'|'moveShape'}
 */

/**
 * @typedef {string} Enums.DiagramConnectorPosition
 * @enum {'start'|'end'}
 */

/**
 * @typedef {string} Enums.GanttTaskTitlePosition
 * @enum {'inside'|'outside'|'none'}
 */

/**
 * @typedef {string} Enums.GanttToolbarItem
 * @enum {'separator'|'undo'|'redo'|'expandAll'|'collapseAll'|'addTask'|'deleteTask'|'zoomIn'|'zoomOut'}
 */

/**
 * @typedef {string} Enums.GanttContextMenuItem
 * @enum {'undo'|'redo'|'expandAll'|'collapseAll'|'addTask'|'deleteTask'|'zoomIn'|'zoomOut'|'deleteDependency'|'taskDetails'}
 */

/**
 * @typedef {string} Enums.GanttScaleType
 * @enum {'auto'|'minutes'|'hours'|'days'|'weeks'|'months'|'quarters'|'years'}
 */

/**
 * @typedef {string} Enums.LegendMarkerState
 * @enum {'normal'|'hovered'|'selected'}
 */

/**
 * @typedef {string} Enums.ValidationStatus
 * @enum {'valid'|'invalid'|'pending'}
 */

/**
 * @typedef {string} Enums.floatingActionButtonDirection
 * @enum {'auto'|'up'|'down'}
 */

/**
 * @typedef {string} Enums.GridPagerDisplayMode
 * @enum {'adaptive'|'compact'|'full'}
 */

/**
 * @typedef {string} Enums.GridPagerPageSize
 * @enum {'all'}
 */
