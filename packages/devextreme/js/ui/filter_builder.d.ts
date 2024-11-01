import DataSource, { DataSourceLike } from '../data/data_source';
import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
    DataType,
} from '../common';

import {
    Cancelable,
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import Widget, {
    WidgetOptions,
} from './widget/ui.widget';

import {
    Format,
} from '../localization';

export {
    DataType,
};

export {
    FilterOperation,
} from '../common/grids';

export type FilterBuilderOperation = '=' | '<>' | '<' | '<=' | '>' | '>=' | 'contains' | 'endswith' | 'isblank' | 'isnotblank' | 'notcontains' | 'startswith' | 'between';
/** @public */
export type GroupOperation = 'and' | 'or' | 'notAnd' | 'notOr';

/**
 * @docid _ui_filter_builder_ContentReadyEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ContentReadyEvent = EventInfo<dxFilterBuilder>;

/**
 * @docid _ui_filter_builder_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxFilterBuilder>;

/**
 * @docid _ui_filter_builder_EditorPreparedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type EditorPreparedEvent = EventInfo<dxFilterBuilder> & {
    /** @docid _ui_filter_builder_EditorPreparedEvent.value */
    readonly value?: any;
    /** @docid _ui_filter_builder_EditorPreparedEvent.setValue */
    readonly setValue: any;
    /** @docid _ui_filter_builder_EditorPreparedEvent.editorElement */
    readonly editorElement: DxElement;
    /** @docid _ui_filter_builder_EditorPreparedEvent.editorName */
    readonly editorName: string;
    /** @docid _ui_filter_builder_EditorPreparedEvent.dataField */
    readonly dataField?: string;
    /** @docid _ui_filter_builder_EditorPreparedEvent.filterOperation */
    readonly filterOperation?: string;
    /** @docid _ui_filter_builder_EditorPreparedEvent.updateValueTimeout */
    readonly updateValueTimeout?: number;
    /** @docid _ui_filter_builder_EditorPreparedEvent.width */
    readonly width?: number;
    /** @docid _ui_filter_builder_EditorPreparedEvent.readOnly */
    readonly readOnly: boolean;
    /** @docid _ui_filter_builder_EditorPreparedEvent.disabled */
    readonly disabled: boolean;
    /** @docid _ui_filter_builder_EditorPreparedEvent.rtlEnabled */
    readonly rtlEnabled: boolean;
};

/**
 * @docid _ui_filter_builder_EditorPreparingEvent
 * @public
 * @type object
 * @inherits Cancelable,EventInfo
 */
export type EditorPreparingEvent = Cancelable & EventInfo<dxFilterBuilder> & {
    /** @docid _ui_filter_builder_EditorPreparingEvent.value */
    readonly value?: any;
    /** @docid _ui_filter_builder_EditorPreparingEvent.setValue */
    readonly setValue: any;
    /** @docid _ui_filter_builder_EditorPreparingEvent.editorElement */
    readonly editorElement?: DxElement;
    /** @docid _ui_filter_builder_EditorPreparingEvent.editorName */
    editorName: string;
    /**
     * @docid _ui_filter_builder_EditorPreparingEvent.editorOptions
     * @type object
     */
    editorOptions?: any;
    /** @docid _ui_filter_builder_EditorPreparingEvent.dataField */
    readonly dataField?: string;
    /** @docid _ui_filter_builder_EditorPreparingEvent.filterOperation */
    readonly filterOperation?: string;
    /** @docid _ui_filter_builder_EditorPreparingEvent.updateValueTimeout */
    updateValueTimeout?: number;
    /** @docid _ui_filter_builder_EditorPreparingEvent.width */
    readonly width?: number;
    /** @docid _ui_filter_builder_EditorPreparingEvent.readOnly */
    readonly readOnly: boolean;
    /** @docid _ui_filter_builder_EditorPreparingEvent.disabled */
    readonly disabled: boolean;
    /** @docid _ui_filter_builder_EditorPreparingEvent.rtlEnabled */
    readonly rtlEnabled: boolean;
};

/**
 * @docid _ui_filter_builder_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxFilterBuilder>;

/**
 * @docid _ui_filter_builder_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxFilterBuilder> & ChangedOptionInfo;

/**
 * @docid _ui_filter_builder_ValueChangedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ValueChangedEvent = EventInfo<dxFilterBuilder> & {
    /**
     * @docid _ui_filter_builder_ValueChangedEvent.value
     * @type object
     */
    readonly value?: any;
    /**
     * @docid _ui_filter_builder_ValueChangedEvent.previousValue
     * @type object
     */
    readonly previousValue?: any;
};

/** @public */
export type CustomOperationEditorTemplate = {
    readonly value?: string | number | Date;
    readonly field: Field;
    readonly setValue: Function;
};

/** @public */
export type FieldEditorTemplate = {
    readonly value?: string | number | Date;
    readonly filterOperation?: string;
    readonly field: Field;
    readonly setValue: Function;
};

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
 */
export interface dxFilterBuilderOptions extends WidgetOptions<dxFilterBuilder> {
    /**
     * @docid
     * @default false
     * @public
     */
    allowHierarchicalFields?: boolean;
    /**
     * @docid
     * @default []
     * @public
     * @type Array<dxFilterBuilderCustomOperation>
     */
    customOperations?: Array<CustomOperation>;
    /**
     * @docid
     * @default []
     * @public
     * @type Array<dxFilterBuilderField>
     */
    fields?: Array<Field>;
    /**
     * @docid
     * @public
     */
    filterOperationDescriptions?: {
      /**
       * @docid
       * @default "Between"
       */
      between?: string;
      /**
       * @docid
       * @default "Contains"
       */
      contains?: string;
      /**
       * @docid
       * @default "Ends with"
       */
      endsWith?: string;
      /**
       * @docid
       * @default "Equals"
       */
      equal?: string;
      /**
       * @docid
       * @default "Greater than"
       */
      greaterThan?: string;
      /**
       * @docid
       * @default "Greater than or equal to"
       */
      greaterThanOrEqual?: string;
      /**
       * @docid
       * @default "Is blank"
       */
      isBlank?: string;
      /**
       * @docid
       * @default "Is not blank"
       */
      isNotBlank?: string;
      /**
       * @docid
       * @default "Less than"
       */
      lessThan?: string;
      /**
       * @docid
       * @default "Less than or equal to"
       */
      lessThanOrEqual?: string;
      /**
       * @docid
       * @default "Does not contain"
       */
      notContains?: string;
      /**
       * @docid
       * @default "Does not equal"
       */
      notEqual?: string;
      /**
       * @docid
       * @default "Starts with"
       */
      startsWith?: string;
    };
    /**
     * @docid
     * @public
     */
    groupOperationDescriptions?: {
      /**
       * @docid
       * @default "And"
       */
      and?: string;
      /**
       * @docid
       * @default "Not And"
       */
      notAnd?: string;
      /**
       * @docid
       * @default "Not Or"
       */
      notOr?: string;
      /**
       * @docid
       * @default "Or"
       */
      or?: string;
    };
    /**
     * @docid
     * @default ['and', 'or', 'notAnd', 'notOr']
     * @public
     */
    groupOperations?: Array<GroupOperation>;
    /**
     * @docid
     * @default undefined
     * @public
     */
    maxGroupLevel?: number | undefined;
    /**
     * @docid
     * @type_function_param1 e:{ui/filter_builder:EditorPreparedEvent}
     * @default null
     * @action
     * @public
     */
    onEditorPrepared?: ((e: EditorPreparedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:{ui/filter_builder:EditorPreparingEvent}
     * @default null
     * @action
     * @public
     */
    onEditorPreparing?: ((e: EditorPreparingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/filter_builder:ValueChangedEvent}
     * @action
     * @public
     */
    onValueChanged?: ((e: ValueChangedEvent) => void);
    /**
     * @docid
     * @type Filter expression
     * @default null
     * @fires dxFilterBuilderOptions.onValueChanged
     * @public
     */
    value?: string | Array<any> | Function;
}
/**
 * @docid
 * @inherits Widget
 * @namespace DevExpress.ui
 * @public
 */
export default class dxFilterBuilder extends Widget<dxFilterBuilderOptions> {
    /**
     * @docid
     * @publicName getFilterExpression()
     * @return Filter expression
     * @public
     */
    getFilterExpression(): string | Array<any> | Function;
}

/**
 * @public
 */
export type CustomOperation = dxFilterBuilderCustomOperation;

/**
 * @namespace DevExpress.ui
 * @deprecated Use the CustomOperation type instead
 */
export interface dxFilterBuilderCustomOperation {
    /**
     * @docid
     * @type_function_param2 field:dxFilterBuilderField
     * @type_function_return Filter expression
     * @public
     */
    calculateFilterExpression?: ((filterValue: any, field: Field) => string | Array<any> | Function);
    /**
     * @docid
     * @default undefined
     * @public
     */
    caption?: string | undefined;
    /**
     * @docid
     * @type_function_param1_field field:dxFilterBuilderField:optional
     * @public
     */
    customizeText?: ((fieldInfo: { value?: string | number | Date; valueText?: string; field?: Field }) => string);
    /**
     * @docid
     * @default undefined
     * @public
     */
    dataTypes?: Array<DataType> | undefined;
    /**
     * @docid
     * @type_function_param1 conditionInfo:object
     * @type_function_param1_field field:dxFilterBuilderField
     * @type_function_return string|Element|jQuery
     * @public
     */
    editorTemplate?: template | ((conditionInfo: CustomOperationEditorTemplate, container: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default true
     * @public
     */
    hasValue?: boolean;
    /**
     * @docid
     * @default undefined
     * @public
     */
    icon?: string | undefined;
    /**
     * @docid
     * @default undefined
     * @public
     */
    name?: string | undefined;
}

export type FilterLookupDataSource<T> = Exclude<DataSourceLike<T>, string | DataSource>;

/**
 * @public
 * @docid dxFilterBuilderField
 * @namespace DevExpress.ui
 * @type object
 */
export type Field = dxFilterBuilderField;

/**
 * @namespace DevExpress.ui
 * @deprecated Use the Field type instead
 */
export interface dxFilterBuilderField {
    /**
     * @docid
     * @type_function_return Filter expression
     * @public
     */
    calculateFilterExpression?: ((filterValue: any, selectedFilterOperation: string) => string | Array<any> | Function);
    /**
     * @docid
     * @default undefined
     * @public
     */
    caption?: string | undefined;
    /**
     * @docid
     * @public
     */
    customizeText?: ((fieldInfo: { value?: string | number | Date; valueText?: string }) => string);
    /**
     * @docid
     * @default undefined
     * @public
     */
    dataField?: string | undefined;
    /**
     * @docid
     * @default "string"
     * @public
     */
    dataType?: DataType;
    /**
     * @docid
     * @public
     */
    editorOptions?: any;
    /**
     * @docid
     * @type_function_param1 conditionInfo:object
     * @type_function_param1_field field:dxFilterBuilderField
     * @type_function_return string|Element|jQuery
     * @public
     */
    editorTemplate?: template | ((conditionInfo: FieldEditorTemplate, container: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default "false"
     * @public
     */
    falseText?: string;
    /**
     * @docid
     * @default undefined
     * @public
     */
    filterOperations?: Array<FilterBuilderOperation | string>;
    /**
     * @docid
     * @default ""
     * @public
     */
    format?: Format;
    /**
     * @docid
     * @default undefined
     * @public
     */
    lookup?: {
      /**
       * @docid
       * @default false
       */
      allowClearing?: boolean;
      /**
       * @docid
       * @default undefined
       * @type Array<any> | Store | DataSourceOptions | undefined
       */
      dataSource?: FilterLookupDataSource<any> | null | undefined;
      /**
       * @docid
       * @default undefined
       * @type_function_param1 data:object
       */
      displayExpr?: string | ((data: any) => string) | undefined;
      /**
       * @docid
       * @default undefined
       * @type_function_param1 data:object
       */
      valueExpr?: string | ((data: any) => string | number | boolean) | undefined;
    };
    /**
     * @docid
     * @default undefined
     * @public
     */
    name?: string | undefined;
    /**
     * @docid
     * @default "true"
     * @public
     */
    trueText?: string;
}

/** @public */
export type Properties = dxFilterBuilderOptions;

/** @deprecated use Properties instead */
export type Options = dxFilterBuilderOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onEditorPrepared' | 'onEditorPreparing' | 'onValueChanged'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxFilterBuilderOptions.onContentReady
 * @type_function_param1 e:{ui/filter_builder:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxFilterBuilderOptions.onDisposing
 * @type_function_param1 e:{ui/filter_builder:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxFilterBuilderOptions.onInitialized
 * @type_function_param1 e:{ui/filter_builder:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxFilterBuilderOptions.onOptionChanged
 * @type_function_param1 e:{ui/filter_builder:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
