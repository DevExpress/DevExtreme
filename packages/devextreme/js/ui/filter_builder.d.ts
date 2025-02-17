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

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type FilterBuilderOperation = '=' | '<>' | '<' | '<=' | '>' | '>=' | 'contains' | 'endswith' | 'isblank' | 'isnotblank' | 'notcontains' | 'startswith' | 'between';
export type GroupOperation = 'and' | 'or' | 'notAnd' | 'notOr';

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent = EventInfo<dxFilterBuilder>;

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxFilterBuilder>;

/**
 * The type of the editorPrepared event handler&apos;s argument.
 */
export type EditorPreparedEvent = EventInfo<dxFilterBuilder> & {
    /**
     * 
     */
    readonly value?: any;
    /**
     * 
     */
    readonly setValue: any;
    /**
     * 
     */
    readonly editorElement: DxElement;
    /**
     * 
     */
    readonly editorName: string;
    /**
     * 
     */
    readonly dataField?: string;
    /**
     * 
     */
    readonly filterOperation?: string;
    /**
     * 
     */
    readonly updateValueTimeout?: number;
    /**
     * 
     */
    readonly width?: number;
    /**
     * 
     */
    readonly readOnly: boolean;
    /**
     * 
     */
    readonly disabled: boolean;
    /**
     * 
     */
    readonly rtlEnabled: boolean;
};

/**
 * The type of the editorPreparing event handler&apos;s argument.
 */
export type EditorPreparingEvent = Cancelable & EventInfo<dxFilterBuilder> & {
    /**
     * 
     */
    readonly value?: any;
    /**
     * 
     */
    readonly setValue: any;
    /**
     * 
     */
    readonly editorElement?: DxElement;
    /**
     * 
     */
    editorName: string;
    /**
     * 
     */
    editorOptions?: any;
    /**
     * 
     */
    readonly dataField?: string;
    /**
     * 
     */
    readonly filterOperation?: string;
    /**
     * 
     */
    updateValueTimeout?: number;
    /**
     * 
     */
    readonly width?: number;
    /**
     * 
     */
    readonly readOnly: boolean;
    /**
     * 
     */
    readonly disabled: boolean;
    /**
     * 
     */
    readonly rtlEnabled: boolean;
};

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxFilterBuilder>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxFilterBuilder> & ChangedOptionInfo;

/**
 * The type of the valueChanged event handler&apos;s argument.
 */
export type ValueChangedEvent = EventInfo<dxFilterBuilder> & {
    /**
     * 
     */
    readonly value?: any;
    /**
     * 
     */
    readonly previousValue?: any;
};

export type CustomOperationEditorTemplate = {
    readonly value?: string | number | Date;
    readonly field: Field;
    readonly setValue: Function;
};

export type FieldEditorTemplate = {
    readonly value?: string | number | Date;
    readonly filterOperation?: string;
    readonly field: Field;
    readonly setValue: Function;
};

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxFilterBuilderOptions extends WidgetOptions<dxFilterBuilder> {
    /**
     * Specifies whether the UI component can display hierarchical data fields.
     */
    allowHierarchicalFields?: boolean;
    /**
     * Configures custom filter operations.
     */
    customOperations?: Array<CustomOperation>;
    /**
     * Configures fields.
     */
    fields?: Array<Field>;
    /**
     * Specifies filter operation descriptions.
     */
    filterOperationDescriptions?: {
      /**
       * The &apos;between&apos; operation&apos;s description.
       */
      between?: string;
      /**
       * The &apos;contains&apos; operation&apos;s description.
       */
      contains?: string;
      /**
       * The &apos;endswith&apos; operation&apos;s description.
       */
      endsWith?: string;
      /**
       * The &apos;=&apos; operation&apos;s description.
       */
      equal?: string;
      /**
       * The &apos;&gt;&apos; operation&apos;s description.
       */
      greaterThan?: string;
      /**
       * The &apos;&gt;=&apos; operation&apos;s description.
       */
      greaterThanOrEqual?: string;
      /**
       * The &apos;isblank&apos; operation&apos;s description.
       */
      isBlank?: string;
      /**
       * The &apos;isnotblank&apos; operation&apos;s description.
       */
      isNotBlank?: string;
      /**
       * The &apos;&lt;&apos; operation&apos;s description.
       */
      lessThan?: string;
      /**
       * The &apos;&lt;=&apos; operation&apos;s description.
       */
      lessThanOrEqual?: string;
      /**
       * The &apos;notcontains&apos; operation&apos;s description.
       */
      notContains?: string;
      /**
       * The &apos;&lt;&gt;&apos; operation&apos;s description.
       */
      notEqual?: string;
      /**
       * The &apos;startswith&apos; operation&apos;s description.
       */
      startsWith?: string;
    };
    /**
     * Specifies group operation descriptions.
     */
    groupOperationDescriptions?: {
      /**
       * The &apos;and&apos; operation&apos;s description.
       */
      and?: string;
      /**
       * The &apos;notand&apos; operation&apos;s description.
       */
      notAnd?: string;
      /**
       * The &apos;notor&apos; operation&apos;s description.
       */
      notOr?: string;
      /**
       * The &apos;or&apos; operation&apos;s description.
       */
      or?: string;
    };
    /**
     * Specifies a set of available group operations.
     */
    groupOperations?: Array<GroupOperation>;
    /**
     * Specifies groups&apos; maximum nesting level.
     */
    maxGroupLevel?: number | undefined;
    /**
     * A function that is executed after an editor is created.
     */
    onEditorPrepared?: ((e: EditorPreparedEvent) => void);
    /**
     * A function that is executed before an editor is created.
     */
    onEditorPreparing?: ((e: EditorPreparingEvent) => void);
    /**
     * A function that is executed after the UI component&apos;s value is changed.
     */
    onValueChanged?: ((e: ValueChangedEvent) => void);
    /**
     * Allows you to specify a filter.
     */
    value?: string | Array<any> | Function;
}
/**
 * The FilterBuilder UI component allows a user to build complex filter expressions with an unlimited number of filter conditions, combined by logical operations using the UI.
 */
export default class dxFilterBuilder extends Widget<dxFilterBuilderOptions> {
    /**
     * Gets a filter expression that contains only operations supported by the DataSource.
     */
    getFilterExpression(): string | Array<any> | Function;
}

export type CustomOperation = dxFilterBuilderCustomOperation;

/**
 * @deprecated Use the CustomOperation type instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxFilterBuilderCustomOperation {
    /**
     * Specifies a function that returns a filter expression for this custom operation.
     */
    calculateFilterExpression?: ((filterValue: any, field: Field) => string | Array<any> | Function);
    /**
     * Specifies the operation&apos;s caption.
     */
    caption?: string | undefined;
    /**
     * Customizes the field value&apos;s text representation.
     */
    customizeText?: ((fieldInfo: { value?: string | number | Date; valueText?: string; field?: Field }) => string);
    /**
     * Specifies for which data types the operation is available by default.
     */
    dataTypes?: Array<DataType> | undefined;
    /**
     * Specifies a custom template for the UI component used to edit the field value.
     */
    editorTemplate?: template | ((conditionInfo: CustomOperationEditorTemplate, container: DxElement) => string | UserDefinedElement);
    /**
     * Specifies whether the operation can have a value. If it can, the editor is displayed.
     */
    hasValue?: boolean;
    /**
     * Specifies the icon that should represent the filter operation.
     */
    icon?: string | undefined;
    /**
     * Specifies the operation&apos;s identifier.
     */
    name?: string | undefined;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type FilterLookupDataSource<T> = Exclude<DataSourceLike<T>, string | DataSource>;

/**
 * The FilterBuilder&apos;s field structure.
 */
export type Field = dxFilterBuilderField;

/**
 * @deprecated Use the Field type instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxFilterBuilderField {
    /**
     * Specifies the field&apos;s custom rules to filter data.
     */
    calculateFilterExpression?: ((filterValue: any, selectedFilterOperation: string) => string | Array<any> | Function);
    /**
     * Specifies the data field&apos;s caption.
     */
    caption?: string | undefined;
    /**
     * Customizes the input value&apos;s display text.
     */
    customizeText?: ((fieldInfo: { value?: string | number | Date; valueText?: string }) => string);
    /**
     * Specifies the name of a field to be filtered.
     */
    dataField?: string | undefined;
    /**
     * Casts field values to a specific data type.
     */
    dataType?: DataType;
    /**
     * Configures the UI component used to edit the field value.
     */
    editorOptions?: any;
    /**
     * Specifies the editor&apos;s custom template.
     */
    editorTemplate?: template | ((conditionInfo: FieldEditorTemplate, container: DxElement) => string | UserDefinedElement);
    /**
     * Specifies the false value text. Applies only if dataType is &apos;boolean&apos;.
     */
    falseText?: string;
    /**
     * Specifies a set of available filter operations.
     */
    filterOperations?: Array<FilterBuilderOperation | string>;
    /**
     * Formats a value before it is displayed.
     */
    format?: Format;
    /**
     * Configures the lookup field.
     */
    lookup?: {
      /**
       * Specifies whether to display the Clear button in the lookup field while it is being edited.
       */
      allowClearing?: boolean;
      /**
       * Specifies the lookup data source.
       */
      dataSource?: FilterLookupDataSource<any> | null | undefined;
      /**
       * Specifies the data field whose values should be displayed.
       */
      displayExpr?: string | ((data: any) => string) | undefined;
      /**
       * Specifies the data field whose values should be replaced with values from the displayExpr field.
       */
      valueExpr?: string | ((data: any) => string | number | boolean) | undefined;
    };
    /**
     * Specifies the field&apos;s name. Use it to distinguish the field from other fields when they have identical dataField values.
     */
    name?: string | undefined;
    /**
     * Specifies the true value text. Applies only if dataType is &apos;boolean&apos;.
     */
    trueText?: string;
}

export type Properties = dxFilterBuilderOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
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
