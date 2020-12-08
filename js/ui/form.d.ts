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
} from './validation_rules';

import {
    dxValidationGroupResult
} from './validation_group';

import Widget, {
    WidgetOptions
} from './widget/ui.widget';

export interface dxFormOptions extends WidgetOptions<dxForm> {
    /**
     * @docid dxFormOptions.alignItemLabels
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    alignItemLabels?: boolean;
    /**
     * @docid dxFormOptions.alignItemLabelsInAllGroups
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    alignItemLabelsInAllGroups?: boolean;
    /**
     * @docid dxFormOptions.colCount
     * @type number|Enums.Mode
     * @default 1
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    colCount?: number | 'auto';
    /**
     * @docid dxFormOptions.colCountByScreen
     * @extends ColCountResponsibleType
     * @inherits ColCountResponsible
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    colCountByScreen?: any;
    /**
     * @docid dxFormOptions.customizeItem
     * @type function
     * @type_function_param1 item:dxFormSimpleItem|dxFormGroupItem|dxFormTabbedItem|dxFormEmptyItem|dxFormButtonItem
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    customizeItem?: ((item: dxFormSimpleItem | dxFormGroupItem | dxFormTabbedItem | dxFormEmptyItem | dxFormButtonItem) => any);
    /**
     * @docid dxFormOptions.formData
     * @type object
     * @default {}
     * @fires dxFormOptions.onFieldDataChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    formData?: any;
    /**
     * @docid dxFormOptions.items
     * @type Array<dxFormSimpleItem,dxFormGroupItem,dxFormTabbedItem,dxFormEmptyItem,dxFormButtonItem>
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<dxFormSimpleItem | dxFormGroupItem | dxFormTabbedItem | dxFormEmptyItem | dxFormButtonItem>;
    /**
     * @docid dxFormOptions.labelLocation
     * @type Enums.FormLabelLocation
     * @default "left"
     * @default "top" [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    labelLocation?: 'left' | 'right' | 'top';
    /**
     * @docid dxFormOptions.minColWidth
     * @type number
     * @default 200
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    minColWidth?: number;
    /**
     * @docid dxFormOptions.onEditorEnterKey
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
     * @docid dxFormOptions.onFieldDataChanged
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
     * @docid dxFormOptions.optionalMark
     * @type string
     * @default "optional"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    optionalMark?: string;
    /**
     * @docid dxFormOptions.readOnly
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    readOnly?: boolean;
    /**
     * @docid dxFormOptions.requiredMark
     * @type string
     * @default "*"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    requiredMark?: string;
    /**
     * @docid dxFormOptions.requiredMessage
     * @type string
     * @default "{0} is required"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    requiredMessage?: string;
    /**
     * @docid dxFormOptions.screenByWidth
     * @type function
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    screenByWidth?: Function;
    /**
     * @docid dxFormOptions.scrollingEnabled
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollingEnabled?: boolean;
    /**
     * @docid dxFormOptions.showColonAfterLabel
     * @type boolean
     * @default true
     * @default false [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showColonAfterLabel?: boolean;
    /**
     * @docid dxFormOptions.showOptionalMark
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showOptionalMark?: boolean;
    /**
     * @docid dxFormOptions.showRequiredMark
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showRequiredMark?: boolean;
    /**
     * @docid dxFormOptions.showValidationSummary
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showValidationSummary?: boolean;
    /**
     * @docid dxFormOptions.validationGroup
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validationGroup?: string;
}
/**
 * @docid dxForm
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
     * @docid dxFormMethods.getButton
     * @publicName getButton(name)
     * @param1 name:string
     * @return dxButton | undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getButton(name: string): dxButton | undefined;
    /**
     * @docid dxFormMethods.getEditor
     * @publicName getEditor(dataField)
     * @param1 dataField:string
     * @return Editor | undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getEditor(dataField: string): Editor | undefined;
    /**
     * @docid dxFormMethods.itemOption
     * @publicName itemOption(id)
     * @param1 id:string
     * @return any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemOption(id: string): any;
    /**
     * @docid dxFormMethods.itemOption
     * @publicName itemOption(id, option, value)
     * @param1 id:string
     * @param2 option:string
     * @param3 value:any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemOption(id: string, option: string, value: any): void;
    /**
     * @docid dxFormMethods.itemOption
     * @publicName itemOption(id, options)
     * @param1 id:string
     * @param2 options:object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemOption(id: string, options: any): void;
    /**
     * @docid dxFormMethods.resetValues
     * @publicName resetValues()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    resetValues(): void;
    /**
     * @docid dxFormMethods.updateData
     * @publicName updateData(data)
     * @param1 data:object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    updateData(data: any): void;
    /**
     * @docid dxFormMethods.updateData
     * @publicName updateData(dataField, value)
     * @param1 dataField:string
     * @param2 value:object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    updateData(dataField: string, value: any): void;
    /**
     * @docid dxFormMethods.updateDimensions
     * @publicName updateDimensions()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    updateDimensions(): Promise<void> & JQueryPromise<void>;
    /**
     * @docid dxFormMethods.validate
     * @publicName validate()
     * @return dxValidationGroupResult
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validate(): dxValidationGroupResult;
}

export interface dxFormButtonItem {
    /**
     * @docid dxFormButtonItem.buttonOptions
     * @type dxButtonOptions
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    buttonOptions?: dxButtonOptions;
    /**
     * @docid dxFormButtonItem.colSpan
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    colSpan?: number;
    /**
     * @docid dxFormButtonItem.cssClass
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cssClass?: string;
    /**
     * @docid dxFormButtonItem.horizontalAlignment
     * @type Enums.HorizontalAlignment
     * @default "right"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    horizontalAlignment?: 'center' | 'left' | 'right';
    /**
     * @docid dxFormButtonItem.itemType
     * @type Enums.FormItemType
     * @default "simple"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';
    /**
     * @docid dxFormButtonItem.name
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
    /**
     * @docid dxFormButtonItem.verticalAlignment
     * @type Enums.VerticalAlignment
     * @default "top"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    verticalAlignment?: 'bottom' | 'center' | 'top';
    /**
     * @docid dxFormButtonItem.visible
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxFormButtonItem.visibleIndex
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visibleIndex?: number;
}

export interface dxFormEmptyItem {
    /**
     * @docid dxFormEmptyItem.colSpan
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    colSpan?: number;
    /**
     * @docid dxFormEmptyItem.cssClass
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cssClass?: string;
    /**
     * @docid dxFormEmptyItem.itemType
     * @type Enums.FormItemType
     * @default "simple"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';
    /**
     * @docid dxFormEmptyItem.name
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
    /**
     * @docid dxFormEmptyItem.visible
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxFormEmptyItem.visibleIndex
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visibleIndex?: number;
}

export interface dxFormGroupItem {
    /**
     * @docid dxFormGroupItem.alignItemLabels
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    alignItemLabels?: boolean;
    /**
     * @docid dxFormGroupItem.caption
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    caption?: string;
    /**
     * @docid dxFormGroupItem.colCount
     * @type number
     * @default 1
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    colCount?: number;
    /**
     * @docid dxFormGroupItem.colCountByScreen
     * @extends ColCountResponsibleType
     * @inherits ColCountResponsible
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    colCountByScreen?: any;
    /**
     * @docid dxFormGroupItem.colSpan
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    colSpan?: number;
    /**
     * @docid dxFormGroupItem.cssClass
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cssClass?: string;
    /**
     * @docid dxFormGroupItem.itemType
     * @type Enums.FormItemType
     * @default "simple"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';
    /**
     * @docid dxFormGroupItem.items
     * @type Array<dxFormSimpleItem,dxFormGroupItem,dxFormTabbedItem,dxFormEmptyItem,dxFormButtonItem>
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<dxFormSimpleItem | dxFormGroupItem | dxFormTabbedItem | dxFormEmptyItem | dxFormButtonItem>;
    /**
     * @docid dxFormGroupItem.name
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
    /**
     * @docid dxFormGroupItem.template
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
     * @docid dxFormGroupItem.visible
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxFormGroupItem.visibleIndex
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visibleIndex?: number;
}

export interface dxFormSimpleItem {
    /**
     * @docid dxFormSimpleItem.colSpan
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    colSpan?: number;
    /**
     * @docid dxFormSimpleItem.cssClass
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cssClass?: string;
    /**
     * @docid dxFormSimpleItem.dataField
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataField?: string;
    /**
     * @docid dxFormSimpleItem.editorOptions
     * @type object
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    editorOptions?: any;
    /**
     * @docid dxFormSimpleItem.editorType
     * @type Enums.FormItemEditorType
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    editorType?: 'dxAutocomplete' | 'dxCalendar' | 'dxCheckBox' | 'dxColorBox' | 'dxDateBox' | 'dxDropDownBox' | 'dxHtmlEditor' | 'dxLookup' | 'dxNumberBox' | 'dxRadioGroup' | 'dxRangeSlider' | 'dxSelectBox' | 'dxSlider' | 'dxSwitch' | 'dxTagBox' | 'dxTextArea' | 'dxTextBox';
    /**
     * @docid dxFormSimpleItem.helpText
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    helpText?: string;
    /**
     * @docid dxFormSimpleItem.isRequired
     * @type boolean
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    isRequired?: boolean;
    /**
     * @docid dxFormSimpleItem.itemType
     * @type Enums.FormItemType
     * @default "simple"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';
    /**
     * @docid dxFormSimpleItem.label
     * @type object
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    label?: { alignment?: 'center' | 'left' | 'right', location?: 'left' | 'right' | 'top', showColon?: boolean, text?: string, visible?: boolean };
    /**
     * @docid dxFormSimpleItem.name
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
    /**
     * @docid dxFormSimpleItem.template
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
     * @docid dxFormSimpleItem.validationRules
     * @type Array<RequiredRule,NumericRule,RangeRule,StringLengthRule,CustomRule,CompareRule,PatternRule,EmailRule,AsyncRule>
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validationRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
    /**
     * @docid dxFormSimpleItem.visible
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxFormSimpleItem.visibleIndex
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visibleIndex?: number;
}

export interface dxFormTabbedItem {
    /**
     * @docid dxFormTabbedItem.colSpan
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    colSpan?: number;
    /**
     * @docid dxFormTabbedItem.cssClass
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cssClass?: string;
    /**
     * @docid dxFormTabbedItem.itemType
     * @type Enums.FormItemType
     * @default "simple"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';
    /**
     * @docid dxFormTabbedItem.name
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
    /**
     * @docid dxFormTabbedItem.tabPanelOptions
     * @type dxTabPanelOptions
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    tabPanelOptions?: dxTabPanelOptions;
    /**
     * @docid dxFormTabbedItem.tabs
     * @type Array<Object>
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    tabs?: Array<{ alignItemLabels?: boolean, badge?: string, colCount?: number, colCountByScreen?: any, disabled?: boolean, icon?: string, items?: Array<dxFormSimpleItem | dxFormGroupItem | dxFormTabbedItem | dxFormEmptyItem | dxFormButtonItem>, tabTemplate?: template | ((tabData: any, tabIndex: number, tabElement: dxElement) => any), template?: template | ((tabData: any, tabIndex: number, tabElement: dxElement) => any), title?: string }>;
    /**
     * @docid dxFormTabbedItem.visible
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxFormTabbedItem.visibleIndex
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