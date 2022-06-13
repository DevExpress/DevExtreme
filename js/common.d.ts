/**
 * @public
 * @namespace DevExpress.common
 */
export type ApplyValueMode = 'instantly' | 'useButtons';

/**
 * @public
 * @namespace DevExpress.common
 */
export type ButtonStyle = 'text' | 'outlined' | 'contained';

/**
 * @public
 * @namespace DevExpress.common
 */
export type ButtonType = 'back' | 'danger' | 'default' | 'normal' | 'success';

/**
 * @public
 * @namespace DevExpress.common
 */
export type DataStructure = 'plain' | 'tree';

/**
 * @public
 * @namespace DevExpress.common
 */
export type DataType = 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime';

/**
 * @public
 * @namespace DevExpress.common
 */
export type Direction = 'bottom' | 'left' | 'right' | 'top';

/**
 * @public
 * @namespace DevExpress.common
 */
export type DragDirection = 'both' | 'horizontal' | 'vertical';

/**
 * @public
 * @namespace DevExpress.common
 */
export type DragHighlight = 'push' | 'indicate';

/**
 * @public
 * @namespace DevExpress.common
 */
export type EditorStyle = 'outlined' | 'underlined' | 'filled';

/**
 * @public
 * @namespace DevExpress.common
 */
export type ExportFormat = 'GIF' | 'JPEG' | 'PDF' | 'PNG' | 'SVG';

/**
 * @public
 * @namespace DevExpress.common
 */
export type FieldChooserLayout = 0 | 1 | 2;

/**
 * @public
 * @namespace DevExpress.common
 */
export type FirstDayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * @public
 * @namespace DevExpress.common
 */
export type Format = 'billions' | 'currency' | 'day' | 'decimal' | 'exponential' | 'fixedPoint' | 'largeNumber' | 'longDate' | 'longTime' | 'millions' | 'millisecond' | 'month' | 'monthAndDay' | 'monthAndYear' | 'percent' | 'quarter' | 'quarterAndYear' | 'shortDate' | 'shortTime' | 'thousands' | 'trillions' | 'year' | 'dayOfWeek' | 'hour' | 'longDateLongTime' | 'minute' | 'second' | 'shortDateShortTime';

/**
 * @public
 * @namespace DevExpress.common
 */
export type HorizontalAlignment = 'center' | 'left' | 'right';

/**
 * @public
 * @namespace DevExpress.common
 */
export type HorizontalEdge = 'left' | 'right';

/**
 * @public
 * @namespace DevExpress.common
 */
export type LabelMode = 'static' | 'floating' | 'hidden';

/**
 * @public
 * @namespace DevExpress.common
 */
export type MaskMode = 'always' | 'onFocus';

/**
 * @public
 * @namespace DevExpress.common
 */
export type Mode = 'auto'; // eslint-disable-line @typescript-eslint/no-type-alias

/**
 * @public
 * @namespace DevExpress.common
 */
export type Orientation = 'horizontal' | 'vertical';

/**
 * @public
 * @namespace DevExpress.common
 */
export type PageLoadMode = 'nextButton' | 'scrollBottom';

/**
 * @public
 * @namespace DevExpress.common
 */
export type PageOrientation = 'portrait' | 'landscape';

/**
 * @public
 * @namespace DevExpress.common
 */
export type Position = 'bottom' | 'left' | 'right' | 'top';

/**
 * @public
 * @namespace DevExpress.common
 */
export type PositionAlignment = 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top';

/**
 * @public
 * @namespace DevExpress.common
 */
export type ScrollbarMode = 'always' | 'never' | 'onHover' | 'onScroll';

/**
 * @public
 * @namespace DevExpress.common
 */
export type ScrollDirection = 'both' | 'horizontal' | 'vertical';

/**
 * @public
 * @namespace DevExpress.common
 */
export type ScrollMode = 'standard' | 'virtual';

/**
 * @public
 * @namespace DevExpress.common
 */
export type SearchMode = 'contains' | 'startswith' | 'equals';

/**
 * @public
 * @namespace DevExpress.common
 */
export type SelectAllMode = 'allPages' | 'page';

/**
 * @public
 * @namespace DevExpress.common
 */
export type SimplifiedSearchMode = 'contains' | 'startswith';

/**
 * @public
 * @namespace DevExpress.common
 */
export type SingleMultipleAllOrNone = 'single' | 'multiple' | 'all' | 'none';

/**
 * @public
 * @namespace DevExpress.common
 */
export type SingleMultipleOrNone = 'single' | 'multiple' | 'none';

/**
 * @public
 * @namespace DevExpress.common
 */
export type SingleOrMultiple = 'single' | 'multiple';

/**
 * @public
 * @namespace DevExpress.common
 */
export type SingleOrNone = 'single' | 'none';

/**
 * @public
 * @namespace DevExpress.common
 */
export type SlideOutMenuPosition = 'inverted' | 'normal';

/**
 * @public
 * @namespace DevExpress.common
 */
export type SortOrder = 'asc' | 'desc';

/**
 * @public
 * @namespace DevExpress.common
 */
export type StoreType = 'array' | 'local' | 'odata';

/**
 * @public
 * @namespace DevExpress.common
 */
export type SubmenuShowMode = 'onClick' | 'onHover';

/**
 * @public
 * @namespace DevExpress.common
 */
export type TextBoxPredefinedButton = 'clear'; // eslint-disable-line @typescript-eslint/no-type-alias

/**
 * @public
 * @namespace DevExpress.common
 */
export type TextEditorButtonLocation = 'after' | 'before';

/**
 * @public
 * @namespace DevExpress.common
 */
 export type ToolbarItemComponent = 'dxAutocomplete' | 'dxButton' | 'dxCheckBox' | 'dxDateBox' | 'dxMenu' | 'dxSelectBox' | 'dxTabs' | 'dxTextBox' | 'dxButtonGroup' | 'dxDropDownButton';

/**
 * @public
 * @namespace DevExpress.common
 */
export type ToolbarItemLocation = 'after' | 'before' | 'center';

/**
 * @public
 * @namespace DevExpress.common
 */
export type TooltipShowMode = 'always' | 'onHover';

/**
 * @public
 * @namespace DevExpress.common
 */
export type ValidationMessageMode = 'always' | 'auto';

/**
 * @public
 * @namespace DevExpress.common
 */
export type ValidationStatus = 'valid' | 'invalid' | 'pending';

/**
 * @public
 * @namespace DevExpress.common
 */
export type VerticalAlignment = 'bottom' | 'center' | 'top';

/**
 * @public
 * @namespace DevExpress.common
 */
export type VerticalEdge = 'bottom' | 'top';
