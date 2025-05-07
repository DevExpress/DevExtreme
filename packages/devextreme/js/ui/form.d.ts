import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    DxPromise,
} from '../core/utils/deferred';

import {
    template,
    AsyncRule,
    CompareRule,
    CustomRule,
    EmailRule,
    HorizontalAlignment,
    Mode,
    NumericRule,
    PatternRule,
    RangeRule,
    RequiredRule,
    StringLengthRule,
    VerticalAlignment,
} from '../common';

import {
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import dxButton, {
    dxButtonOptions,
} from './button';

import Editor from './editor/editor';

import {
    dxTabPanelOptions,
} from './tab_panel';

import {
    ValidationResult,
} from './validation_group';

import Widget, {
    WidgetOptions,
} from './widget/ui.widget';

export {
    HorizontalAlignment,
    Mode,
    VerticalAlignment,
};

/** @public */
export type FormItemComponent = 'dxAutocomplete' | 'dxCalendar' | 'dxCheckBox' | 'dxColorBox' | 'dxDateBox' | 'dxDateRangeBox' | 'dxDropDownBox' | 'dxHtmlEditor' | 'dxLookup' | 'dxNumberBox' | 'dxRadioGroup' | 'dxRangeSlider' | 'dxSelectBox' | 'dxSlider' | 'dxSwitch' | 'dxTagBox' | 'dxTextArea' | 'dxTextBox';
/** @public */
export type FormItemType = 'empty' | 'group' | 'simple' | 'tabbed' | 'button';
/** @public */
export type LabelLocation = 'left' | 'right' | 'top';
/** @public */
export type FormLabelMode = 'static' | 'floating' | 'hidden' | 'outside';

/**
 * @docid _ui_form_ContentReadyEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ContentReadyEvent = EventInfo<dxForm>;

/**
 * @docid _ui_form_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxForm>;

/**
 * @docid _ui_form_EditorEnterKeyEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type EditorEnterKeyEvent = EventInfo<dxForm> & {
    /** @docid _ui_form_EditorEnterKeyEvent.dataField */
    readonly dataField?: string;
};

/**
 * @docid _ui_form_FieldDataChangedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type FieldDataChangedEvent = EventInfo<dxForm> & {
    /** @docid _ui_form_FieldDataChangedEvent.dataField */
    readonly dataField?: string;
    /**
     * @docid _ui_form_FieldDataChangedEvent.value
     * @type object
     */
    readonly value?: any;
};

/**
 * @docid _ui_form_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxForm>;

/**
 * @docid _ui_form_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxForm> & ChangedOptionInfo;

/** @public */
export type GroupItemTemplateData = {
    readonly component: dxForm;
    readonly formData?: any;
};

/** @public */
export type GroupCaptionTemplateData = {
    readonly caption?: string;
    readonly component: dxForm;
    readonly name?: string;
};

/** @public */
export type SimpleItemTemplateData = {
    readonly component: dxForm;
    readonly dataField?: string;
    readonly editorOptions?: any;
    readonly editorType?: string;
    readonly name?: string;
};

/** @public */
export type SimpleItemLabelTemplateData = SimpleItemTemplateData & { text: string };

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
 */
export interface dxFormOptions extends WidgetOptions<dxForm> {
    /**
     * @docid
     * @default true
     * @public
     */
    alignItemLabels?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    alignItemLabelsInAllGroups?: boolean;
    /**
     * @docid
     * @default 1
     * @public
     */
    colCount?: number | Mode;
    /**
     * @docid
     * @type object
     * @inherits ColCountResponsible
     * @default undefined
     * @public
     */
    colCountByScreen?: any | undefined;
    /**
     * @docid
     * @type_function_param1 item:dxFormSimpleItem|dxFormGroupItem|dxFormTabbedItem|dxFormEmptyItem|dxFormButtonItem
     * @type_function_param1_field colSpan::hidden
     * @type_function_param1_field cssClass::hidden
     * @type_function_param1_field itemType::hidden
     * @type_function_param1_field name::hidden
     * @type_function_param1_field visible::hidden
     * @type_function_param1_field visibleIndex::hidden
     * @public
     */
    customizeItem?: ((item: Item) => void);
    /**
     * @docid
     * @default {}
     * @fires dxFormOptions.onFieldDataChanged
     * @public
     */
    formData?: any;
    /**
     * @docid
     * @type Array<dxFormSimpleItem | dxFormGroupItem | dxFormTabbedItem | dxFormEmptyItem | dxFormButtonItem>
     * @default undefined
     * @public
     */
    items?: Array<Item> | undefined;
    /**
     * @docid
     * @default "left"
     * @default "top" &for(Material)
     * @default "top" &for(Fluent)
     * @public
     */
    labelLocation?: LabelLocation;
    /**
     * @docid
     * @default "outside"
     * @public
     */
     labelMode?: FormLabelMode;
    /**
     * @docid
     * @default 200
     * @public
     */
    minColWidth?: number;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/form:EditorEnterKeyEvent}
     * @action
     * @public
     */
    onEditorEnterKey?: ((e: EditorEnterKeyEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/form:FieldDataChangedEvent}
     * @action
     * @public
     */
    onFieldDataChanged?: ((e: FieldDataChangedEvent) => void);
    /**
     * @docid
     * @default "optional"
     * @public
     */
    optionalMark?: string;
    /**
     * @docid
     * @default false
     * @public
     */
    readOnly?: boolean;
    /**
     * @docid
     * @default "*"
     * @public
     */
    requiredMark?: string;
    /**
     * @docid
     * @default "{0} is required"
     * @public
     */
    requiredMessage?: string;
    /**
     * @docid
     * @default null
     * @public
     */
    screenByWidth?: Function;
    /**
     * @docid
     * @default false
     * @public
     */
    scrollingEnabled?: boolean;
    /**
     * @docid
     * @default true
     * @default false &for(Material)
     * @public
     */
    showColonAfterLabel?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    showOptionalMark?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    showRequiredMark?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    showValidationSummary?: boolean;
    /**
     * @docid
     * @default undefined
     * @public
     */
    validationGroup?: string | undefined;
    /**
     * @docid
     * @default false
     * @public
     */
    readonly isDirty?: boolean;
}
/**
 * @docid
 * @inherits Widget
 * @namespace DevExpress.ui
 * @public
 */
export default class dxForm extends Widget<dxFormOptions> {
    /**
     * @docid
     * @publicName getButton(name)
     * @public
     */
    getButton(name: string): dxButton | undefined;
    /**
     * @docid
     * @publicName getEditor(dataField)
     * @public
     */
    getEditor(dataField: string): Editor | undefined;
    /**
     * @docid
     * @publicName itemOption(id)
     * @public
     */
    itemOption(id: string): any;
    /**
     * @docid
     * @publicName itemOption(id, option, value)
     * @public
     */
    itemOption(id: string, option: string, value: any): void;
    /**
     * @docid
     * @publicName itemOption(id, options)
     * @param2 options:object
     * @public
     */
    itemOption(id: string, options: any): void;
    /**
     * @docid
     * @publicName clear()
     * @public
     */
    clear(): void;
    /**
     * @docid
     * @publicName resetValues()
     * @public
     * @deprecated dxForm.clear
     */
    resetValues(): void;
    /**
     * @docid
     * @publicName reset(editorsData)
     * @param1 editorsData:object
     * @public
     */
    reset(editorsData?: Record<string, any>): void;
    /**
     * @docid
     * @publicName updateData(data)
     * @param1 data:object
     * @public
     */
    updateData(data: any): void;
    /**
     * @docid
     * @publicName updateData(dataField, value)
     * @param2 value:object
     * @public
     */
    updateData(dataField: string, value: any): void;
    /**
     * @docid
     * @publicName updateDimensions()
     * @return Promise<void>
     * @public
     */
    updateDimensions(): DxPromise<void>;
    /**
     * @docid
     * @publicName validate()
     * @public
     * @return dxValidationGroupResult
     */
    validate(): ValidationResult;
}

/**
 * @public
 * @namespace DevExpress.ui.dxForm
 */
export type Item = SimpleItem | GroupItem | TabbedItem | EmptyItem | ButtonItem;

/**
 * @public
 * @namespace DevExpress.ui.dxForm
 */
export type ButtonItem = dxFormButtonItem;

/**
 * @deprecated Use ButtonItem instead
 * @namespace DevExpress.ui
 */
export interface dxFormButtonItem {
    /**
     * @docid
     * @default undefined
     * @public
     */
    buttonOptions?: dxButtonOptions | undefined;
    /**
     * @docid
     * @default undefined
     * @public
     */
    colSpan?: number | undefined;
    /**
     * @docid
     * @default undefined
     * @public
     */
    cssClass?: string | undefined;
    /**
     * @docid
     * @default "right"
     * @public
     */
    horizontalAlignment?: HorizontalAlignment;
    /**
     * @docid
     * @default "simple"
     * @public
     */
    itemType?: FormItemType;
    /**
     * @docid
     * @default undefined
     * @public
     */
    name?: string | undefined;
    /**
     * @docid
     * @default "top"
     * @public
     */
    verticalAlignment?: VerticalAlignment;
    /**
     * @docid
     * @default true
     * @public
     */
    visible?: boolean;
    /**
     * @docid
     * @default undefined
     * @public
     */
    visibleIndex?: number | undefined;
}

/**
 * @public
 * @namespace DevExpress.ui.dxForm
 */
export type EmptyItem = dxFormEmptyItem;

/**
 * @deprecated Use EmptyItem instead
 * @namespace DevExpress.ui
 */
export interface dxFormEmptyItem {
    /**
     * @docid
     * @default undefined
     * @public
     */
    colSpan?: number | undefined;
    /**
     * @docid
     * @default undefined
     * @public
     */
    cssClass?: string | undefined;
    /**
     * @docid
     * @default "simple"
     * @public
     */
    itemType?: FormItemType;
    /**
     * @docid
     * @default undefined
     * @public
     */
    name?: string | undefined;
    /**
     * @docid
     * @default true
     * @public
     */
    visible?: boolean;
    /**
     * @docid
     * @default undefined
     * @public
     */
    visibleIndex?: number | undefined;
}

/**
 * @public
 * @namespace DevExpress.ui.dxForm
 */
export type GroupItem = dxFormGroupItem;

/**
 * @deprecated Use GroupItem instead
 * @namespace DevExpress.ui
 */
export interface dxFormGroupItem {
    /**
     * @docid
     * @default true
     * @public
     */
    alignItemLabels?: boolean;
    /**
     * @docid
     * @default undefined
     * @public
     */
    caption?: string | undefined;
    /**
     * @docid
     * @type_function_return string|Element|jQuery
     * @public
     */
    captionTemplate?: template | ((data: GroupCaptionTemplateData, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default 1
     * @public
     */
    colCount?: number;
    /**
     * @docid
     * @type object
     * @inherits ColCountResponsible
     * @default undefined
     * @public
     */
    colCountByScreen?: any | undefined;
    /**
     * @docid
     * @default undefined
     * @public
     */
    colSpan?: number | undefined;
    /**
     * @docid
     * @default undefined
     * @public
     */
    cssClass?: string | undefined;
    /**
     * @docid
     * @default "simple"
     * @public
     */
    itemType?: FormItemType;
    /**
     * @docid
     * @type Array<dxFormSimpleItem | dxFormGroupItem | dxFormTabbedItem | dxFormEmptyItem | dxFormButtonItem>
     * @default undefined
     * @public
     */
    items?: Array<Item> | undefined;
    /**
     * @docid
     * @default undefined
     * @public
     */
    name?: string | undefined;
    /**
     * @docid
     * @type_function_param1 data:object
     * @type_function_param1_field formData:object
     * @type_function_return string|Element|jQuery
     * @public
     */
    template?: template | ((data: GroupItemTemplateData, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default true
     * @public
     */
    visible?: boolean;
    /**
     * @docid
     * @default undefined
     * @public
     */
    visibleIndex?: number | undefined;
}

/**
 * @public
 * @namespace DevExpress.ui.dxForm
 */
export type SimpleItem = dxFormSimpleItem;

/**
 * @deprecated Use SimpleItem instead
 * @namespace DevExpress.ui
 */
export interface dxFormSimpleItem {
    /**
     * @docid
     * @default undefined
     * @public
     */
    colSpan?: number | undefined;
    /**
     * @docid
     * @default undefined
     * @public
     */
    cssClass?: string | undefined;
    /**
     * @docid
     * @default undefined
     * @public
     */
    dataField?: string | undefined;
    /**
     * @docid
     * @default undefined
     * @public
     */
    editorOptions?: any | undefined;
    /**
     * @docid
     * @public
     */
    editorType?: FormItemComponent;
    /**
     * @docid
     * @default undefined
     * @public
     */
    helpText?: string | undefined;
    /**
     * @docid
     * @default undefined
     * @public
     */
    isRequired?: boolean | undefined;
    /**
     * @docid
     * @default "simple"
     * @public
     */
    itemType?: FormItemType;
    /**
     * @docid
     * @default undefined
     * @public
     */
    label?: {
      /**
       * @docid
       * @default "left"
       */
      alignment?: HorizontalAlignment;
      /**
       * @docid
       * @default "left"
       */
      location?: LabelLocation;
      /**
       * @docid
       * @default from showColonAfterLabel
       */
      showColon?: boolean;
      /**
       * @docid
       * @type_function_return string|Element|jQuery
       * @public
       */
      template?: template | ((itemData: SimpleItemLabelTemplateData, itemElement: DxElement) => string | UserDefinedElement);
      /**
       * @docid
       * @default undefined
       */
      text?: string | undefined;
      /**
       * @docid
       * @default true
       */
      visible?: boolean;
    };
    /**
     * @docid
     * @default undefined
     * @public
     */
    name?: string | undefined;
    /**
     * @docid
     * @type_function_param1 data:object
     * @type_function_param1_field editorOptions:object
     * @type_function_return string|Element|jQuery
     * @public
     */
    template?: template | ((data: SimpleItemTemplateData, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default undefined
     * @public
     */
    validationRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
    /**
     * @docid
     * @default true
     * @public
     */
    visible?: boolean;
    /**
     * @docid
     * @default undefined
     * @public
     */
    visibleIndex?: number | undefined;
}

/**
 * @public
 * @namespace DevExpress.ui.dxForm
 */
export type TabbedItem = dxFormTabbedItem;

/**
 * @deprecated Use TabbedItem instead
 * @namespace DevExpress.ui
 */
export interface dxFormTabbedItem {
    /**
     * @docid
     * @default undefined
     * @public
     */
    colSpan?: number | undefined;
    /**
     * @docid
     * @default undefined
     * @public
     */
    cssClass?: string | undefined;
    /**
     * @docid
     * @default "simple"
     * @public
     */
    itemType?: FormItemType;
    /**
     * @docid
     * @default undefined
     * @public
     */
    name?: string | undefined;
    /**
     * @docid
     * @default undefined
     * @public
     */
    tabPanelOptions?: dxTabPanelOptions | undefined;
    /**
     * @docid
     * @default undefined
     * @public
     */
    tabs?: Array<{
      /**
       * @docid
       * @default true
       */
      alignItemLabels?: boolean;
      /**
       * @docid
       * @default undefined
       */
      badge?: string | undefined;
      /**
       * @docid
       * @default 1
       */
      colCount?: number;
      /**
       * @docid
       * @type object
       * @inherits ColCountResponsible
       * @default undefined
       */
      colCountByScreen?: any | undefined;
      /**
       * @docid
       * @default false
       */
      disabled?: boolean;
      /**
       * @docid
       * @default undefined
       */
      icon?: string | undefined;
      /**
       * @docid
       * @type Array<dxFormSimpleItem | dxFormGroupItem | dxFormTabbedItem | dxFormEmptyItem | dxFormButtonItem>
       * @default undefined
       */
      items?: Array<Item> | undefined;
      /**
       * @docid
       * @type_function_param1 tabData:object
       * @default undefined
       */
      tabTemplate?: template | ((tabData: any, tabIndex: number, tabElement: DxElement) => any) | undefined;
      /**
       * @docid
       * @type_function_param1 tabData:object
       * @default undefined
       */
      template?: template | ((tabData: any, tabIndex: number, tabElement: DxElement) => any) | undefined;
      /**
       * @docid
       * @default undefined
       */
      title?: string | undefined;
    }>;
    /**
     * @docid
     * @default true
     * @public
     */
    visible?: boolean;
    /**
     * @docid
     * @default undefined
     * @public
     */
    visibleIndex?: number | undefined;
}

/** @public */
export type Properties = dxFormOptions;

/** @deprecated use Properties instead */
export type Options = dxFormOptions;

// TODO: temporary commented out to fix jquery generation error in R1

// ///#DEBUG
// eslint-disable-next-line import/first
// import { CheckedEvents } from '../core';

// type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut'>;

// type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onEditorEnterKey' | 'onFieldDataChanged'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxFormOptions.onContentReady
 * @type_function_param1 e:{ui/form:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxFormOptions.onDisposing
 * @type_function_param1 e:{ui/form:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxFormOptions.onInitialized
 * @type_function_param1 e:{ui/form:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxFormOptions.onOptionChanged
 * @type_function_param1 e:{ui/form:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
