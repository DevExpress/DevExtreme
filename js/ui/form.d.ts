import '../jquery_augmentation';

import {
    dxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import dxButton, {
    dxButtonOptions
} from './button';

import Editor from './editor/editor';

import {
    dxTabPanelOptions
} from './tab_panel';

import {
    AsyncRule,
    CompareRule,
    CustomRule,
    EmailRule,
    NumericRule,
    PatternRule,
    RangeRule,
    RequiredRule,
    StringLengthRule
} from './validation_engine';

import {
    dxValidationGroupResult
} from './validation_group';

import Widget, {
    WidgetOptions
} from './widget/ui.widget';

export interface dxFormOptions extends WidgetOptions<dxForm> {
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    alignItemLabels?: boolean;
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    alignItemLabelsInAllGroups?: boolean;
    /**
     * @docid
     * @type number|Enums.Mode
     * @default 1
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    colCount?: number | 'auto';
    /**
     * @docid
     * @extends ColCountResponsibleType
     * @inherits ColCountResponsible
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    colCountByScreen?: any;
    /**
     * @docid
     * @type function
     * @type_function_param1 item:dxFormSimpleItem|dxFormGroupItem|dxFormTabbedItem|dxFormEmptyItem|dxFormButtonItem
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    customizeItem?: ((item: dxFormSimpleItem | dxFormGroupItem | dxFormTabbedItem | dxFormEmptyItem | dxFormButtonItem) => any);
    /**
     * @docid
     * @type object
     * @default {}
     * @fires dxFormOptions.onFieldDataChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    formData?: any;
    /**
     * @docid
     * @type Array<dxFormSimpleItem,dxFormGroupItem,dxFormTabbedItem,dxFormEmptyItem,dxFormButtonItem>
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<dxFormSimpleItem | dxFormGroupItem | dxFormTabbedItem | dxFormEmptyItem | dxFormButtonItem>;
    /**
     * @docid
     * @type Enums.FormLabelLocation
     * @default "left"
     * @default "top" [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    labelLocation?: 'left' | 'right' | 'top';
    /**
     * @docid
     * @type number
     * @default 200
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    minColWidth?: number;
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 dataField:string
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onEditorEnterKey?: ((e: { component?: dxForm, element?: dxElement, model?: any, dataField?: string }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 dataField:string
     * @type_function_param1_field5 value:object
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onFieldDataChanged?: ((e: { component?: dxForm, element?: dxElement, model?: any, dataField?: string, value?: any }) => any);
    /**
     * @docid
     * @type string
     * @default "optional"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    optionalMark?: string;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    readOnly?: boolean;
    /**
     * @docid
     * @type string
     * @default "*"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    requiredMark?: string;
    /**
     * @docid
     * @type string
     * @default "{0} is required"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    requiredMessage?: string;
    /**
     * @docid
     * @type function
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    screenByWidth?: Function;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollingEnabled?: boolean;
    /**
     * @docid
     * @type boolean
     * @default true
     * @default false [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showColonAfterLabel?: boolean;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showOptionalMark?: boolean;
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showRequiredMark?: boolean;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showValidationSummary?: boolean;
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validationGroup?: string;
}
/**
 * @docid
 * @inherits Widget
 * @module ui/form
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxForm extends Widget {
    constructor(element: Element, options?: dxFormOptions)
    constructor(element: JQuery, options?: dxFormOptions)
    /**
     * @docid
     * @publicName getButton(name)
     * @param1 name:string
     * @return dxButton | undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getButton(name: string): dxButton | undefined;
    /**
     * @docid
     * @publicName getEditor(dataField)
     * @param1 dataField:string
     * @return Editor | undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getEditor(dataField: string): Editor | undefined;
    /**
     * @docid
     * @publicName itemOption(id)
     * @param1 id:string
     * @return any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemOption(id: string): any;
    /**
     * @docid
     * @publicName itemOption(id, option, value)
     * @param1 id:string
     * @param2 option:string
     * @param3 value:any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemOption(id: string, option: string, value: any): void;
    /**
     * @docid
     * @publicName itemOption(id, options)
     * @param1 id:string
     * @param2 options:object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemOption(id: string, options: any): void;
    /**
     * @docid
     * @publicName resetValues()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    resetValues(): void;
    /**
     * @docid
     * @publicName updateData(data)
     * @param1 data:object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    updateData(data: any): void;
    /**
     * @docid
     * @publicName updateData(dataField, value)
     * @param1 dataField:string
     * @param2 value:object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    updateData(dataField: string, value: any): void;
    /**
     * @docid
     * @publicName updateDimensions()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    updateDimensions(): Promise<void> & JQueryPromise<void>;
    /**
     * @docid
     * @publicName validate()
     * @return dxValidationGroupResult
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validate(): dxValidationGroupResult;
}

/**
 * @docid
 * @publicName ButtonItem
 * @section FormItems
 * @type object
 */
export interface dxFormButtonItem {
    /**
     * @docid
     * @type dxButtonOptions
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    buttonOptions?: dxButtonOptions;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    colSpan?: number;
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cssClass?: string;
    /**
     * @docid
     * @type Enums.HorizontalAlignment
     * @default "right"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    horizontalAlignment?: 'center' | 'left' | 'right';
    /**
     * @docid
     * @type Enums.FormItemType
     * @default "simple"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
    /**
     * @docid
     * @type Enums.VerticalAlignment
     * @default "top"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    verticalAlignment?: 'bottom' | 'center' | 'top';
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visibleIndex?: number;
}

/**
 * @docid
 * @publicName EmptyItem
 * @section FormItems
 * @type object
 */
export interface dxFormEmptyItem {
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    colSpan?: number;
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cssClass?: string;
    /**
     * @docid
     * @type Enums.FormItemType
     * @default "simple"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visibleIndex?: number;
}

/**
 * @docid
 * @publicName GroupItem
 * @section FormItems
 * @type object
 */
export interface dxFormGroupItem {
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    alignItemLabels?: boolean;
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    caption?: string;
    /**
     * @docid
     * @type number
     * @default 1
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    colCount?: number;
    /**
     * @docid
     * @extends ColCountResponsibleType
     * @inherits ColCountResponsible
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    colCountByScreen?: any;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    colSpan?: number;
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cssClass?: string;
    /**
     * @docid
     * @type Enums.FormItemType
     * @default "simple"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';
    /**
     * @docid
     * @type Array<dxFormSimpleItem,dxFormGroupItem,dxFormTabbedItem,dxFormEmptyItem,dxFormButtonItem>
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<dxFormSimpleItem | dxFormGroupItem | dxFormTabbedItem | dxFormEmptyItem | dxFormButtonItem>;
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
    /**
     * @docid
     * @type template|function
     * @type_function_param1 data:object
     * @type_function_param1_field1 component:dxForm
     * @type_function_param1_field2 formData:object
     * @type_function_param2 itemElement:dxElement
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    template?: template | ((data: { component?: dxForm, formData?: any }, itemElement: dxElement) => string | Element | JQuery);
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visibleIndex?: number;
}

/**
 * @docid
 * @publicName SimpleItem
 * @section FormItems
 * @type object
 */
export interface dxFormSimpleItem {
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    colSpan?: number;
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cssClass?: string;
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataField?: string;
    /**
     * @docid
     * @type object
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    editorOptions?: any;
    /**
     * @docid
     * @type Enums.FormItemEditorType
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    editorType?: 'dxAutocomplete' | 'dxCalendar' | 'dxCheckBox' | 'dxColorBox' | 'dxDateBox' | 'dxDropDownBox' | 'dxHtmlEditor' | 'dxLookup' | 'dxNumberBox' | 'dxRadioGroup' | 'dxRangeSlider' | 'dxSelectBox' | 'dxSlider' | 'dxSwitch' | 'dxTagBox' | 'dxTextArea' | 'dxTextBox';
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    helpText?: string;
    /**
     * @docid
     * @type boolean
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    isRequired?: boolean;
    /**
     * @docid
     * @type Enums.FormItemType
     * @default "simple"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';
    /**
     * @docid
     * @type object
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    label?: {
      /**
       * @docid
       * @type Enums.HorizontalAlignment
       * @default "left"
       */
      alignment?: 'center' | 'left' | 'right',
      /**
       * @docid
       * @type Enums.FormLabelLocation
       * @default "left"
       */
      location?: 'left' | 'right' | 'top',
      /**
       * @docid
       * @default from showColonAfterLabel
       */
      showColon?: boolean,
      /**
       * @docid
       * @default undefined
       */
      text?: string,
      /**
       * @docid
       * @default true
       */
      visible?: boolean
    };
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
    /**
     * @docid
     * @type template|function
     * @type_function_param1 data:object
     * @type_function_param1_field1 component:dxForm
     * @type_function_param1_field2 dataField:string
     * @type_function_param1_field3 editorOptions:object
     * @type_function_param1_field4 editorType:string
     * @type_function_param1_field5 name:string
     * @type_function_param2 itemElement:dxElement
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    template?: template | ((data: { component?: dxForm, dataField?: string, editorOptions?: any, editorType?: string, name?: string }, itemElement: dxElement) => string | Element | JQuery);
    /**
     * @docid
     * @type Array<RequiredRule,NumericRule,RangeRule,StringLengthRule,CustomRule,CompareRule,PatternRule,EmailRule,AsyncRule>
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validationRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visibleIndex?: number;
}

/**
 * @docid
 * @publicName TabbedItem
 * @section FormItems
 * @type object
 */
export interface dxFormTabbedItem {
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    colSpan?: number;
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cssClass?: string;
    /**
     * @docid
     * @type Enums.FormItemType
     * @default "simple"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
    /**
     * @docid
     * @type dxTabPanelOptions
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    tabPanelOptions?: dxTabPanelOptions;
    /**
     * @docid
     * @type Array<Object>
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    tabs?: Array<{
      /**
       * @docid
       * @default true
       */
      alignItemLabels?: boolean,
      /**
       * @docid
       * @default undefined
       */
      badge?: string,
      /**
       * @docid
       * @default 1
       */
      colCount?: number,
      /**
       * @docid
       * @extends ColCountResponsibleType
       * @inherits ColCountResponsible
       * @default undefined
      */
      colCountByScreen?: any,
      /**
       * @docid
       * @default false
       */
      disabled?: boolean,
      /**
       * @docid
       * @default undefined
       */
      icon?: string,
      /**
       * @docid
       * @type Array<dxFormSimpleItem,dxFormGroupItem,dxFormTabbedItem,dxFormEmptyItem,dxFormButtonItem>
       * @default undefined
       */
      items?: Array<dxFormSimpleItem | dxFormGroupItem | dxFormTabbedItem | dxFormEmptyItem | dxFormButtonItem>,
      /**
       * @docid
       * @type template|function
       * @type_function_param1 tabData:object
       * @type_function_param2 tabIndex:number
       * @type_function_param3 tabElement:dxElement
       * @default undefined
       */
      tabTemplate?: template | ((tabData: any, tabIndex: number, tabElement: dxElement) => any),
      /**
       * @docid
       * @type template|function
       * @type_function_param1 tabData:object
       * @type_function_param2 tabIndex:number
       * @type_function_param3 tabElement:dxElement
       * @default undefined
       */
      template?: template | ((tabData: any, tabIndex: number, tabElement: dxElement) => any),
      /**
       * @docid
       * @default undefined
       */
      title?: string
    }>;
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visibleIndex?: number;
}

declare global {
interface JQuery {
    dxForm(): JQuery;
    dxForm(options: "instance"): dxForm;
    dxForm(options: string): any;
    dxForm(options: string, ...params: any[]): any;
    dxForm(options: dxFormOptions): JQuery;
}
}
export type Options = dxFormOptions;

/** @deprecated use Options instead */
export type IOptions = dxFormOptions;
