/** @namespace DevExpress.utils */
export type DropDownSearchMode = 'contains' | 'startswith';

/** @namespace DevExpress.utils */
export type ValidationMessageMode = 'always' | 'auto';

/** @namespace DevExpress.utils */
export type Format = 'billions' | 'currency' | 'day' | 'decimal' | 'exponential' | 'fixedPoint' | 'largeNumber' | 'longDate' | 'longTime' | 'millions' | 'millisecond' | 'month' | 'monthAndDay' | 'monthAndYear' | 'percent' | 'quarter' | 'quarterAndYear' | 'shortDate' | 'shortTime' | 'thousands' | 'trillions' | 'year' | 'dayOfWeek' | 'hour' | 'longDateLongTime' | 'minute' | 'second' | 'shortDateShortTime';

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
export type SparklineType = 'area' | 'bar' | 'line' | 'spline' | 'splinearea' | 'steparea' | 'stepline' | 'winloss';

/** @namespace DevExpress.utils */
export type CalendarZoomLevel = 'century' | 'decade' | 'month' | 'year';

/** @namespace DevExpress.utils */
export type SeriesType = 'area' | 'bar' | 'bubble' | 'candlestick' | 'fullstackedarea' | 'fullstackedbar' | 'fullstackedline' | 'fullstackedspline' | 'fullstackedsplinearea' | 'line' | 'rangearea' | 'rangebar' | 'scatter' | 'spline' | 'splinearea' | 'stackedarea' | 'stackedbar' | 'stackedline' | 'stackedspline' | 'stackedsplinearea' | 'steparea' | 'stepline' | 'stock';

/** @namespace DevExpress.utils */
export type AnnotationType = 'text' | 'image' | 'custom';

/** @namespace DevExpress.utils */
export type Position = 'bottom' | 'left' | 'right' | 'top';

/** @namespace DevExpress.utils */
export type RelativePosition = 'inside' | 'outside';

/** @namespace DevExpress.utils */
export type ScaleBreakLineStyle = 'straight' | 'waved';

/** @namespace DevExpress.utils */
export type VisualRangeUpdateMode = 'auto' | 'keep' | 'reset' | 'shift';

/** @namespace DevExpress.utils */
export type EditorApplyValueMode = 'instantly' | 'useButtons';

/** @namespace DevExpress.utils */
export type ShowSubmenuMode = 'onClick' | 'onHover';

/** @namespace DevExpress.utils */
export type ContextMenuSubmenuDirection = 'auto' | 'left' | 'right';

/** @namespace DevExpress.utils */
export type HorizontalEdge = 'left' | 'right';

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
export type CollectionSearchMode = 'contains' | 'startswith' | 'equals';

/** @namespace DevExpress.utils */
export type SubmenuDirection = 'auto' | 'leftOrTop' | 'rightOrBottom';

/** @namespace DevExpress.utils */
export type NumberBoxMode = 'number' | 'text' | 'tel';

/** @namespace DevExpress.utils */
export type ValueChangedCallMode = 'onMoving' | 'onMovingComplete';

/** @namespace DevExpress.utils */
export type BackgroundImageLocation = 'center' | 'centerBottom' | 'centerTop' | 'full' | 'leftBottom' | 'leftCenter' | 'leftTop' | 'rightBottom' | 'rightCenter' | 'rightTop';

/** @namespace DevExpress.utils */
export type SliderTooltipShowMode = 'always' | 'onHover';

/** @namespace DevExpress.utils */
export type MaxAppointmentsPerCell = 'auto' | 'unlimited';

/** @namespace DevExpress.utils */
export type ScrollDirection = 'both' | 'horizontal' | 'vertical';

/** @namespace DevExpress.utils */
export type DragDirection = 'both' | 'horizontal' | 'vertical';

/** @namespace DevExpress.utils */
export type SlideOutMenuPosition = 'inverted' | 'normal';

/** @namespace DevExpress.utils */
export type TextBoxMode = 'email' | 'password' | 'search' | 'tel' | 'text' | 'url';

/** @namespace DevExpress.utils */
export type ShowMaskMode = 'always' | 'onFocus';

/** @namespace DevExpress.utils */
export type ToastType = 'custom' | 'error' | 'info' | 'success' | 'warning';

/** @namespace DevExpress.utils */
export type AnimationType = 'css' | 'fade' | 'fadeIn' | 'fadeOut' | 'pop' | 'slide' | 'slideIn' | 'slideOut';

/** @namespace DevExpress.utils */
export type Direction = 'bottom' | 'left' | 'right' | 'top';

/** @namespace DevExpress.utils */
export type ValueErrorBarDisplayMode = 'auto' | 'high' | 'low' | 'none';

/** @namespace DevExpress.utils */
export type ValueErrorBarType = 'fixed' | 'percent' | 'stdDeviation' | 'stdError' | 'variance';

/** @namespace DevExpress.utils */
export type ComparisonOperator = '!=' | '!==' | '<' | '<=' | '==' | '===' | '>' | '>=';

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
export type EditorStylingMode = 'outlined' | 'underlined' | 'filled';

/** @namespace DevExpress.utils */
export type EditorLabelMode = 'static' | 'floating' | 'hidden';

/** @namespace DevExpress.utils */
export type FloatingActionButtonDirection = 'auto' | 'up' | 'down';

/** @namespace DevExpress.utils */
export type AllDayPanelMode = 'all' | 'allDay' | 'hidden';
