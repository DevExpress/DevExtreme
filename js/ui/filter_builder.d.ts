import DataSource, { DataSourceLike } from '../data/data_source';
import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
} from '../core/templates/template';

import {
    Cancelable,
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import Widget, {
    WidgetOptions,
} from './widget/ui.widget';

import {
    Format,
} from '../localization';

import {
    DataType,
} from '../common';

export {
    DataType,
};

export {
    FilterOperation,
} from '../common/grids';

export type FilterBuilderOperation = '=' | '<>' | '<' | '<=' | '>' | '>=' | 'contains' | 'endswith' | 'isblank' | 'isnotblank' | 'notcontains' | 'startswith' | 'between';
/** @public */
export type GroupOperation = 'and' | 'or' | 'notAnd' | 'notOr';

/** @public */
export type ContentReadyEvent = EventInfo<dxFilterBuilder>;

/** @public */
export type DisposingEvent = EventInfo<dxFilterBuilder>;

/** @public */
export type EditorPreparedEvent = EventInfo<dxFilterBuilder> & {
    readonly value?: any;
    readonly setValue: any;
    readonly editorElement: DxElement;
    readonly editorName: string;
    readonly dataField?: string;
    readonly filterOperation?: string;
    readonly updateValueTimeout?: number;
    readonly width?: number;
    readonly readOnly: boolean;
    readonly disabled: boolean;
    readonly rtlEnabled: boolean;
};

/** @public */
export type EditorPreparingEvent = Cancelable & EventInfo<dxFilterBuilder> & {
    readonly value?: any;
    readonly setValue: any;
    readonly editorElement?: DxElement;
    editorName: string;
    editorOptions?: any;
    readonly dataField?: string;
    readonly filterOperation?: string;
    updateValueTimeout?: number;
    readonly width?: number;
    readonly readOnly: boolean;
    readonly disabled: boolean;
    readonly rtlEnabled: boolean;
};

/** @public */
export type InitializedEvent = InitializedEventInfo<dxFilterBuilder>;

/** @public */
export type OptionChangedEvent = EventInfo<dxFilterBuilder> & ChangedOptionInfo;

/** @public */
export type ValueChangedEvent = EventInfo<dxFilterBuilder> & {
    readonly value?: any;
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
    maxGroupLevel?: number;
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
    caption?: string;
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
    dataTypes?: Array<DataType>;
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
    icon?: string;
    /**
     * @docid
     * @default undefined
     * @public
     */
    name?: string;
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
    caption?: string;
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
    dataField?: string;
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
       * @type Array<any> | Store | DataSourceOptions
       */
      dataSource?: FilterLookupDataSource<any> | null;
      /**
       * @docid
       * @default undefined
       * @type_function_param1 data:object
       */
      displayExpr?: string | ((data: any) => string);
      /**
       * @docid
       * @default undefined
       * @type_function_param1 data:object
       */
      valueExpr?: string | ((data: any) => string | number | boolean);
    };
    /**
     * @docid
     * @default undefined
     * @public
     */
    name?: string;
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

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onEditorPrepared', 'onEditorPreparing', 'onValueChanged'>;

/**
* @hidden
*/
type Events = {
/**
 * @skip
 * @docid dxFilterBuilderOptions.onContentReady
 * @type_function_param1 e:{ui/filter_builder:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxFilterBuilderOptions.onDisposing
 * @type_function_param1 e:{ui/filter_builder:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxFilterBuilderOptions.onInitialized
 * @type_function_param1 e:{ui/filter_builder:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxFilterBuilderOptions.onOptionChanged
 * @type_function_param1 e:{ui/filter_builder:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
