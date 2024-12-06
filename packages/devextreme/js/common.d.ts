import { PositionConfig } from './common/core/animation';
import type {
  OmitInternal,
} from './core';

import {
  Device,
} from './common/core/environment';

import {
  DeepPartial,
} from './core';

import type dxDraggable from './ui/draggable';
import type dxScrollable from './ui/scroll_view/ui.scrollable';
import type dxSortable from './ui/sortable';
import type { Properties as ButtonProperties } from './ui/button';
import { UserDefinedElement } from './core/element';

/**
 * @public
 * @namespace DevExpress.common
 */
export type ApplyValueMode = 'instantly' | 'useButtons';

/**
 * @docid
 * @public
 * @namespace DevExpress.common
 * @type object
 */
export type AsyncRule = {
  /**
  * @docid
  * @default false
  * @public
  */
  ignoreEmptyValue?: boolean;
  /**
  * @docid
  * @default 'Value is invalid'
  * @public
  */
  message?: string;
  /**
  * @docid
  * @default true
  * @public
  */
  reevaluate?: boolean;
  /**
  * @docid
  * @type Enums.ValidationRuleType
  * @public
  */
  type: 'async';
  /**
  * @docid
  * @type_function_return Promise<any>
  * @type_function_param1 options:object
  * @type_function_param1_field value:string|number
  * @type_function_param1_field rule:object
  * @type_function_param1_field validator:object
  * @type_function_param1_field data:object
  * @type_function_param1_field column:object
  * @type_function_param1_field formItem:object
  * @public
  */
  validationCallback?: ((options: ValidationCallbackData) => PromiseLike<any>);
};

/**
 * @public
 * @namespace DevExpress.common
 */
export type ButtonStyle = 'text' | 'outlined' | 'contained';

/**
 * @public
 * @namespace DevExpress.common
 */
export type ButtonType = 'danger' | 'default' | 'normal' | 'success';

/**
 * @docid
 * @public
 * @namespace DevExpress.common
 * @type object
 */
export type CompareRule = {
  /**
  * @docid
  * @type_function_return any
  * @public
  */
  comparisonTarget?: (() => any);
  /**
  * @docid
  * @default '=='
  * @public
  */
  comparisonType?: ComparisonOperator;
  /**
  * @docid
  * @default false
  * @public
  */
  ignoreEmptyValue?: boolean;
  /**
  * @docid
  * @default 'Values do not match'
  * @public
  */
  message?: string;
  /**
  * @docid
  * @type Enums.ValidationRuleType
  * @public
  */
  type: 'compare';
};

/**
 * @public
 * @namespace DevExpress.common
 */
export type ComparisonOperator = '!=' | '!==' | '<' | '<=' | '==' | '===' | '>' | '>=';

/**
 * @docid
 * @public
 * @type object
 * @namespace DevExpress.common
 */
export type CustomRule = {
  /**
  * @docid
  * @default false
  * @public
  */
  ignoreEmptyValue?: boolean;
  /**
  * @docid
  * @default 'Value is invalid'
  * @public
  */
  message?: string;
  /**
  * @docid
  * @default false
  * @public
  */
  reevaluate?: boolean;
  /**
  * @docid
  * @type Enums.ValidationRuleType
  * @public
  */
  type: 'custom';
  /**
  * @docid
  * @type_function_param1 options:object
  * @type_function_param1_field value:string|number
  * @type_function_param1_field rule:object
  * @type_function_param1_field validator:object
  * @type_function_param1_field data:object
  * @type_function_param1_field column:object
  * @type_function_param1_field formItem:object
  * @public
  */
  validationCallback?: ((options: ValidationCallbackData) => boolean);
};

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
export type Draggable = OmitInternal<dxDraggable>;

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
 * @docid
 * @public
 * @type object
 * @namespace DevExpress.common
 */
export type EmailRule = {
  /**
  * @docid
  * @default true
  * @public
  */
  ignoreEmptyValue?: boolean;
  /**
  * @docid
  * @default 'Email is invalid'
  * @public
  */
  message?: string;
  /**
  * @docid
  * @type Enums.ValidationRuleType
  * @public
  */
  type: 'email';
};

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
 * @docid
 * @section commonObjectStructures
 * @namespace DevExpress.common
 * @public
 * @type object
 */
export type GlobalConfig = {
  /**
   * @docid
   * @default "."
   * @deprecated
   * @public
   */
  decimalSeparator?: string;
  /**
   * @docid
   * @default "USD"
   * @public
   */
  defaultCurrency?: string;
  /**
   * @docid
   * @type boolean
   * @default true
   * @public
   */
  defaultUseCurrencyAccountingStyle?: boolean;
  /**
   * @docid
   * @default undefined
   * @public
   */
  editorStylingMode?: EditorStyle | undefined;
  /**
   * @docid
   * @public
   */
  floatingActionButtonConfig?: {
    /**
     * @docid
     * @default "close"
     */
    closeIcon?: string;
    /**
     * @docid
     * @default "auto"
     */
    direction?: FloatingActionButtonDirection;
    /**
     * @docid
     * @default "add"
     */
    icon?: string;
    /**
     * @docid
     * @default ""
     */
    label?: string;
    /**
     * @docid
     * @default 5
     */
    maxSpeedDialActionCount?: number;
    /**
     * @docid
     * @default "{ at: 'right bottom', my: 'right bottom', offset: '-16 -16' }"
     */
    position?: PositionAlignment | PositionConfig | Function;
    /**
     * @docid
     * @default false
     */
    shading?: boolean;
  };
  /**
   * @docid
   * @default true
   * @public
   */
  forceIsoDateParsing?: boolean;
  /**
   * @docid
   * @default true
   * @public
   */
  oDataFilterToLower?: boolean;
  /**
   * @deprecated Attention! This field is not documented and should only be specified in a limited number of use cases. For more information, please submit a ticket to our Support Center.
   */
  pointerEventStrategy?: 'mouse-and-touch' | 'mouse' | 'touch';
  /**
   * @deprecated Attention! This field is not documented and should only be specified in a limited number of use cases. For more information, please submit a ticket to our Support Center.
   */
  timezones?: unknown[];
  /**
   * @docid
   * @default false
   * @public
   */
  rtlEnabled?: boolean;
  /**
   * @docid
   * @default "."
   * @public
   */
  serverDecimalSeparator?: string;
  /**
   * @docid
   * @default ","
   * @deprecated
   * @public
   */
  thousandsSeparator?: string;
  /**
   * @docid
   * @default false
   * @public
   */
  useLegacyStoreResult?: boolean;
  /**
   * @docid
   * @default false
   * @public
   */
  useLegacyVisibleIndex?: boolean;
  /**
   * @docid
   * @public
   */
  licenseKey?: string;
  buyNowLink?: string;
  licensingDocLink?: string;
};

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
export type LabelMode = 'static' | 'floating' | 'hidden' | 'outside';

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
 * @docid
 * @public
 * @type object
 * @namespace DevExpress.common
 */
export type NumericRule = {
  /**
  * @docid
  * @default true
  * @public
  */
  ignoreEmptyValue?: boolean;
  /**
  * @docid
  * @default 'Value should be a number'
  * @public
  */
  message?: string;
  /**
  * @docid
  * @type Enums.ValidationRuleType
  * @public
  */
  type: 'numeric';
};

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
 * @docid
 * @public
 * @type object
 * @namespace DevExpress.common
 */
export type PatternRule = {
  /**
  * @docid
  * @default true
  * @public
  */
  ignoreEmptyValue?: boolean;
  /**
  * @docid
  * @default 'Value does not match pattern'
  * @public
  */
  message?: string;
  /**
  * @docid
  * @public
  */
  pattern?: RegExp | string;
  /**
  * @docid
  * @type Enums.ValidationRuleType
  * @public
  */
  type: 'pattern';
};

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
 * @docid
 * @public
 * @type object
 * @namespace DevExpress.common
 */
export type RangeRule = {
  /**
  * @docid
  * @default true
  * @public
  */
  ignoreEmptyValue?: boolean;
  /**
  * @docid
  * @public
  */
  max?: Date | number | string;
  /**
  * @docid
  * @default 'Value is out of range'
  * @public
  */
  message?: string;
  /**
  * @docid
  * @public
  */
  min?: Date | number | string;
  /**
  * @docid
  * @default false
  * @public
  */
  reevaluate?: boolean;
  /**
  * @docid
  * @type Enums.ValidationRuleType
  * @public
  */
  type: 'range';
};

/**
 * @docid
 * @public
 * @type object
 * @namespace DevExpress.common
 */
export type RequiredRule = {
  /**
  * @docid
  * @default 'Required'
  * @public
  */
  message?: string;
  /**
  * @docid
  * @default true
  * @public
  */
  trim?: boolean;
  /**
  * @docid
  * @type Enums.ValidationRuleType
  * @public
  */
  type: 'required';
};

/**
 * @public
 * @namespace DevExpress.common
 */
export type Scrollable = OmitInternal<dxScrollable>;

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
export type SliderValueChangeMode = 'onHandleMove' | 'onHandleRelease';

/**
 * @public
 * @namespace DevExpress.common
 */
export type Sortable = OmitInternal<dxSortable>;

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
 * @docid
 * @public
 * @type object
 * @namespace DevExpress.common
 */
export type StringLengthRule = {
  /**
  * @docid
  * @default false
  * @public
  */
  ignoreEmptyValue?: boolean;
  /**
  * @docid
  * @public
  */
  max?: number;
  /**
  * @docid
  * @default 'The length of the value is not correct'
  * @public
  */
  message?: string;
  /**
  * @docid
  * @public
  */
  min?: number;
  /**
  * @docid
  * @default true
  * @public
  */
  trim?: boolean;
  /**
  * @docid
  * @type Enums.ValidationRuleType
  * @public
  */
  type: 'stringLength';
};

/**
 * @public
 * @namespace DevExpress.common
 */
export type SubmenuShowMode = 'onClick' | 'onHover';

/**
 * @public
 * @namespace DevExpress.common
 */
export type TabsIconPosition = 'top' | 'end' | 'bottom' | 'start';

/**
 * @public
 * @namespace DevExpress.common
 */
export type TabsStyle = 'primary' | 'secondary';

/**
 * @public
 * @namespace DevExpress.common
 */
export type TextBoxPredefinedButton = 'clear'; // eslint-disable-line @typescript-eslint/no-type-alias

/**
 * @public
 * @docid
 * @type object
 * @namespace DevExpress.common
 */
export type TextEditorButton = {
  /**
   * @public
   * @docid
   * @default "after"
   */
  location?: TextEditorButtonLocation;
  /**
   * @public
   * @docid
   * @default undefined
   */
  name?: string | undefined;
  /**
   * @public
   * @docid
   * @type dxButtonOptions | undefined
   * @default undefined
   */
  options?: ButtonProperties | undefined;
};

/**
 * @public
 * @namespace DevExpress.common
 */
export type TextEditorButtonLocation = 'after' | 'before';

/**
 * @public
 * @namespace DevExpress.common
 */
export type ToolbarItemComponent = 'dxAutocomplete' | 'dxButton' | 'dxButtonGroup' | 'dxCheckBox' | 'dxDateBox' | 'dxDropDownButton' | 'dxMenu' | 'dxSelectBox' | 'dxSwitch' | 'dxTabs' | 'dxTextBox';

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
export type ValidationCallbackData = {
  value?: any;
  rule: any;
  validator: any;
  data?: any;
  column?: any;
  formItem?: any;
};

/**
 * @public
 * @namespace DevExpress.common
 */
export type ValidationMessageMode = 'always' | 'auto';

/**
 * @docid
 * @public
 * @namespace DevExpress.common
 */
export type ValidationRule = AsyncRule | CompareRule | CustomRule | EmailRule | NumericRule | PatternRule | RangeRule | RequiredRule | StringLengthRule;

/**
 * @public
 * @namespace DevExpress.common
 */
export type ValidationRuleType = 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';

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

/**
 * @public
 * @namespace DevExpress.common
 */
export type DisplayMode = 'adaptive' | 'compact' | 'full';

/**
 * @docid
 * @namespace DevExpress.data
 * @public
 */
export class Guid {
  constructor();
  constructor(value: string);
  /**
   * @docid
   * @publicName toString()
   * @public
   */
  toString(): string;
  /**
   * @docid
   * @publicName valueOf()
   * @public
   */
  valueOf(): string;
}

/**
* @docid
* @public
*/
export type DefaultOptionsRule<T> = {
  device?: Device | Device[] | ((device: Device) => boolean);
  options: DeepPartial<T>;
};

/** @public */
export type FloatingActionButtonDirection = 'auto' | 'up' | 'down';

/**
 * @docid
 * @publicName config()
 * @namespace DevExpress
 * @public
 */
export function config(): GlobalConfig;

/**
 * @docid
 * @publicName config(config)
 * @namespace DevExpress
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-shadow
export function config(config: GlobalConfig): void;

/**
 * @docid
 * @section Common
 * @public
 */
export type template = string | Function | UserDefinedElement;

/**
 * @docid
 * @publicName setTemplateEngine(options)
 * @namespace DevExpress
 * @public
 */
export function setTemplateEngine(templateEngineOptions: { compile?: Function; render?: Function }): void;
