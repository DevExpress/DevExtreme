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

export type ApplyValueMode = 'instantly' | 'useButtons';

/**
 * A custom validation rule that is checked asynchronously. Use async rules for server-side validation.
 */
export type AsyncRule = {
  /**
   * If true, the validationCallback is not executed for null, undefined, false, and empty strings.
   */
  ignoreEmptyValue?: boolean;
  /**
   * Specifies the message that is shown if the rule is broken.
   */
  message?: string;
  /**
   * Indicates whether the rule should always be checked for the target value or only when the value changes.
   */
  reevaluate?: boolean;
  /**
   * Specifies the rule type. Set it to &apos;async&apos; to use the AsyncRule.
   */
  type: 'async';
  /**
   * A function that validates the target value.
   */
  validationCallback?: ((options: ValidationCallbackData) => PromiseLike<any>);
};

export type ButtonStyle = 'text' | 'outlined' | 'contained';

export type ButtonType = 'danger' | 'default' | 'normal' | 'success';

/**
 * A validation rule that demands that a validated editor has a value that is equal to a specified expression.
 */
export type CompareRule = {
  /**
   * Specifies the function whose return value is used for comparison with the validated value.
   */
  comparisonTarget?: (() => any);
  /**
   * Specifies the operator to be used for comparing the validated value with the target.
   */
  comparisonType?: ComparisonOperator;
  /**
   * If set to true, empty values are valid.
   */
  ignoreEmptyValue?: boolean;
  /**
   * Specifies the message that is shown if the rule is broken.
   */
  message?: string;
  /**
   * Specifies the rule type. Set it to &apos;compare&apos; to use the CompareRule.
   */
  type: 'compare';
};

export type ComparisonOperator = '!=' | '!==' | '<' | '<=' | '==' | '===' | '>' | '>=';

/**
 * A rule with custom validation logic.
 */
export type CustomRule = {
  /**
   * If true, the validationCallback is not executed for null, undefined, false, and empty strings.
   */
  ignoreEmptyValue?: boolean;
  /**
   * Specifies the message that is shown if the rule is broken.
   */
  message?: string;
  /**
   * Indicates whether the rule should be always checked for the target value or only when the target value changes.
   */
  reevaluate?: boolean;
  /**
   * Specifies the rule type. Set it to &apos;custom&apos; to use the CustomRule.
   */
  type: 'custom';
  /**
   * A function that validates the target value.
   */
  validationCallback?: ((options: ValidationCallbackData) => boolean);
};

export type DataStructure = 'plain' | 'tree';

export type DataType = 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime';

export type Direction = 'bottom' | 'left' | 'right' | 'top';

export type Draggable = OmitInternal<dxDraggable>;

export type DragDirection = 'both' | 'horizontal' | 'vertical';

export type DragHighlight = 'push' | 'indicate';

export type EditorStyle = 'outlined' | 'underlined' | 'filled';

/**
 * A validation rule that requires that the validated field match the Email pattern.
 */
export type EmailRule = {
  /**
   * If set to true, empty values are valid.
   */
  ignoreEmptyValue?: boolean;
  /**
   * Specifies the message that is shown if the rule is broken.
   */
  message?: string;
  /**
   * Specifies the rule type. Set it to &apos;email&apos; to use the EmailRule.
   */
  type: 'email';
};

export type ExportFormat = 'GIF' | 'JPEG' | 'PDF' | 'PNG' | 'SVG';

export type FieldChooserLayout = 0 | 1 | 2;

export type FirstDayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Format = 'billions' | 'currency' | 'day' | 'decimal' | 'exponential' | 'fixedPoint' | 'largeNumber' | 'longDate' | 'longTime' | 'millions' | 'millisecond' | 'month' | 'monthAndDay' | 'monthAndYear' | 'percent' | 'quarter' | 'quarterAndYear' | 'shortDate' | 'shortTime' | 'thousands' | 'trillions' | 'year' | 'dayOfWeek' | 'hour' | 'longDateLongTime' | 'minute' | 'second' | 'shortDateShortTime';

/**
 * Specifies settings that affect all DevExtreme UI components.
 */
export type GlobalConfig = {
  /**
   * A decimal separator. No longer applies.
   * @deprecated 
   */
  decimalSeparator?: string;
  /**
   * The default currency. Accepts a 3-letter ISO 4217 code.
   */
  defaultCurrency?: string;
  /**
   * Specifies whether to apply the accounting style to formatted numbers of the `currency` type.
   */
  defaultUseCurrencyAccountingStyle?: boolean;
  /**
   * Specifies how editors&apos; text fields are styled in your application.
   */
  editorStylingMode?: EditorStyle | undefined;
  /**
   * Configures a Floating Action Button (FAB) that emits a stack of related actions (speed dial).
   */
  floatingActionButtonConfig?: {
    /**
     * Specifies the icon the FAB displays when the speed dial is opened.
     */
    closeIcon?: string;
    /**
     * Specifies the direction in which to open the speed dial menu.
     */
    direction?: FloatingActionButtonDirection;
    /**
     * Specifies the icon the FAB displays when the speed dial is closed.
     */
    icon?: string;
    /**
     * Specifies the text label displayed inside the FAB.
     */
    label?: string;
    /**
     * Limits the number of speed dial actions.
     */
    maxSpeedDialActionCount?: number;
    /**
     * Positions the FAB on the screen.
     */
    position?: PositionAlignment | PositionConfig | Function;
    /**
     * If true, the background should be shaded when the speed dial menu is open.
     */
    shading?: boolean;
  };
  /**
   * Specifies whether dates are parsed and serialized according to the ISO 8601 standard in all browsers.
   */
  forceIsoDateParsing?: boolean;
  /**
   * Specifies whether to convert string values to lowercase in filter and search requests to OData services. Applies to the following operations: &apos;startswith&apos;, &apos;endswith&apos;, &apos;contains&apos;, and &apos;notcontains&apos;.
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
   * Specifies whether the UI components support a right-to-left representation. Available for individual UI components as well.
   */
  rtlEnabled?: boolean;
  /**
   * The decimal separator that is used when submitting a value to the server.
   */
  serverDecimalSeparator?: string;
  /**
   * A group separator. No longer applies.
   * @deprecated 
   */
  thousandsSeparator?: string;
  /**
   * 
   */
  useLegacyStoreResult?: boolean;
  /**
   * 
   */
  useLegacyVisibleIndex?: boolean;
  /**
   * A license key.
   */
  licenseKey?: string;
  buyNowLink?: string;
  licensingDocLink?: string;
};

export type HorizontalAlignment = 'center' | 'left' | 'right';

export type HorizontalEdge = 'left' | 'right';

export type LabelMode = 'static' | 'floating' | 'hidden' | 'outside';

export type MaskMode = 'always' | 'onFocus';

export type Mode = 'auto'; // eslint-disable-line @typescript-eslint/no-type-alias

/**
 * A validation rule that demands that the validated field has a numeric value.
 */
export type NumericRule = {
  /**
   * If set to true, empty values are valid.
   */
  ignoreEmptyValue?: boolean;
  /**
   * Specifies the message that is shown if the rule is broken.
   */
  message?: string;
  /**
   * Specifies the rule type. Set it to &apos;numeric&apos; to use the NumericRule.
   */
  type: 'numeric';
};

export type Orientation = 'horizontal' | 'vertical';

export type PageLoadMode = 'nextButton' | 'scrollBottom';

export type PageOrientation = 'portrait' | 'landscape';

/**
 * A validation rule that requires that the validated field match a specified pattern.
 */
export type PatternRule = {
  /**
   * If set to true, empty values are valid.
   */
  ignoreEmptyValue?: boolean;
  /**
   * Specifies the message that is shown if the rule is broken.
   */
  message?: string;
  /**
   * Specifies the regular expression that the validated value must match.
   */
  pattern?: RegExp | string;
  /**
   * Specifies the rule type. Set it to &apos;pattern&apos; to use the PatternRule.
   */
  type: 'pattern';
};

export type Position = 'bottom' | 'left' | 'right' | 'top';

export type PositionAlignment = 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top';

/**
 * A validation rule that demands the target value be within the specified value range (including the range&apos;s end points).
 */
export type RangeRule = {
  /**
   * If set to true, empty values are valid.
   */
  ignoreEmptyValue?: boolean;
  /**
   * Specifies the maximum value allowed for the validated value.
   */
  max?: Date | number | string;
  /**
   * Specifies the message that is shown if the rule is broken.
   */
  message?: string;
  /**
   * Specifies the minimum value allowed for the validated value.
   */
  min?: Date | number | string;
  /**
   * Indicates whether the rule should be always checked for the target value or only when the target value changes.
   */
  reevaluate?: boolean;
  /**
   * Specifies the rule type. Set it to &apos;range&apos; to use the RangeRule.
   */
  type: 'range';
};

/**
 * A validation rule that demands that a validated field has a value.
 */
export type RequiredRule = {
  /**
   * Specifies the message that is shown if the rule is broken.
   */
  message?: string;
  /**
   * Indicates whether to remove the Space characters from the validated value.
   */
  trim?: boolean;
  /**
   * Specifies the rule type. Set it to &apos;required&apos; to use the RequiredRule.
   */
  type: 'required';
};

export type Scrollable = OmitInternal<dxScrollable>;

export type ScrollbarMode = 'always' | 'never' | 'onHover' | 'onScroll';

export type ScrollDirection = 'both' | 'horizontal' | 'vertical';

export type ScrollMode = 'standard' | 'virtual';

export type SearchMode = 'contains' | 'startswith' | 'equals';

export type SelectAllMode = 'allPages' | 'page';

export type SimplifiedSearchMode = 'contains' | 'startswith';

export type SingleMultipleAllOrNone = 'single' | 'multiple' | 'all' | 'none';

export type SingleMultipleOrNone = 'single' | 'multiple' | 'none';

export type SingleOrMultiple = 'single' | 'multiple';

export type SingleOrNone = 'single' | 'none';

export type SliderValueChangeMode = 'onHandleMove' | 'onHandleRelease';

export type Sortable = OmitInternal<dxSortable>;

export type SortOrder = 'asc' | 'desc';

export type StoreType = 'array' | 'local' | 'odata';

/**
 * A validation rule that demands the target value length be within the specified value range (including the range&apos;s end points).
 */
export type StringLengthRule = {
  /**
   * If set to true, empty values are valid.
   */
  ignoreEmptyValue?: boolean;
  /**
   * Specifies the maximum length allowed for the validated value.
   */
  max?: number;
  /**
   * Specifies the message that is shown if the rule is broken.
   */
  message?: string;
  /**
   * Specifies the minimum length allowed for the validated value.
   */
  min?: number;
  /**
   * Indicates whether or not to remove the Space characters from the validated value.
   */
  trim?: boolean;
  /**
   * Specifies the rule type. Set it to &apos;stringLength&apos; to use the StringLengthRule.
   */
  type: 'stringLength';
};

export type SubmenuShowMode = 'onClick' | 'onHover';

export type TabsIconPosition = 'top' | 'end' | 'bottom' | 'start';

export type TabsStyle = 'primary' | 'secondary';

export type TextBoxPredefinedButton = 'clear'; // eslint-disable-line @typescript-eslint/no-type-alias

/**
 * 
 */
export type TextEditorButton = {
  /**
   * Specifies whether to place the button before or after the input text field.
   */
  location?: TextEditorButtonLocation;
  /**
   * Specifies the button&apos;s name.
   */
  name?: string | undefined;
  /**
   * Configures the Button UI component used as the action button.
   */
  options?: ButtonProperties | undefined;
};

export type TextEditorButtonLocation = 'after' | 'before';

export type ToolbarItemComponent = 'dxAutocomplete' | 'dxButton' | 'dxButtonGroup' | 'dxCheckBox' | 'dxDateBox' | 'dxDropDownButton' | 'dxMenu' | 'dxSelectBox' | 'dxSwitch' | 'dxTabs' | 'dxTextBox';

export type ToolbarItemLocation = 'after' | 'before' | 'center';

export type TooltipShowMode = 'always' | 'onHover';

export type ValidationCallbackData = {
  value?: any;
  rule: any;
  validator: any;
  data?: any;
  column?: any;
  formItem?: any;
};

export type ValidationMessageMode = 'always' | 'auto';

/**
 * Specifies a validation rule.
 */
export type ValidationRule = AsyncRule | CompareRule | CustomRule | EmailRule | NumericRule | PatternRule | RangeRule | RequiredRule | StringLengthRule;

export type ValidationRuleType = 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';

export type ValidationStatus = 'valid' | 'invalid' | 'pending';

export type VerticalAlignment = 'bottom' | 'center' | 'top';

export type VerticalEdge = 'bottom' | 'top';

export type DisplayMode = 'adaptive' | 'compact' | 'full';

/**
 * The Guid is an object used to generate and contain a GUID.
 */
export class Guid {
  constructor();
  constructor(value: string);
  /**
   * Gets the GUID. Works identically to the valueOf() method.
   */
  toString(): string;
  /**
   * Gets the GUID. Works identically to the toString() method.
   */
  valueOf(): string;
}

/**
 * Specifies the device-dependent default configuration properties for a component.
 */
export type DefaultOptionsRule<T> = {
  device?: Device | Device[] | ((device: Device) => boolean);
  options: DeepPartial<T>;
};

export type FloatingActionButtonDirection = 'auto' | 'up' | 'down';

/**
 * Gets the current global configuration.
 */
export function config(): GlobalConfig;

/**
                                                          * Configures your application before its launch.
                                                          */
                                                         export function config(config: GlobalConfig): void;

/**
 * A template notation used to specify templates for UI component elements.
 */
export type template = string | Function | UserDefinedElement;

/**
 * Sets custom functions that compile and render templates.
 */
export function setTemplateEngine(templateEngineOptions: { compile?: Function; render?: Function }): void;
